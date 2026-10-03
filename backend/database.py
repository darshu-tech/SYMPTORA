import hashlib
import json
import os
import secrets
import sqlite3

from datetime import datetime, timedelta, timezone


# ============================================================
# DATABASE PATH
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATABASE_DIR = os.path.join(
    BASE_DIR,
    "database"
)

DATABASE_PATH = os.path.join(
    DATABASE_DIR,
    "symptora.db"
)


# ============================================================
# CONNECTION
# ============================================================

def get_connection():
    os.makedirs(
        DATABASE_DIR,
        exist_ok=True
    )

    connection = sqlite3.connect(
        DATABASE_PATH
    )

    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


# ============================================================
# DATABASE INITIALIZATION + SAFE MIGRATION
# ============================================================

def initialize_database():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token_hash TEXT NOT NULL UNIQUE,
            expires_at TEXT NOT NULL,
            used INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
        )
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_reset_tokens_hash
        ON password_reset_tokens(token_hash)
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            symptoms TEXT NOT NULL,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            predictions TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
        )
    """)

    # Existing SYMPTORA databases were created before authentication.
    # Add user_id without deleting any existing assessment records.
    columns = [
        row["name"]
        for row in cursor.execute(
            "PRAGMA table_info(assessments)"
        ).fetchall()
    ]

    if "user_id" not in columns:
        cursor.execute(
            "ALTER TABLE assessments ADD COLUMN user_id INTEGER"
        )

    # Existing versions may also lack the predictions column.
    if "predictions" not in columns:
        cursor.execute(
            "ALTER TABLE assessments ADD COLUMN predictions TEXT"
        )

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_assessments_user
        ON assessments(user_id)
    """)

    connection.commit()
    connection.close()


# ============================================================
# USER HELPERS
# ============================================================

def create_user(name, email, password_hash):

    connection = get_connection()
    cursor = connection.cursor()

    created_at = datetime.now().isoformat(
        timespec="seconds"
    )

    cursor.execute(
        """
        INSERT INTO users
        (
            name,
            email,
            password_hash,
            created_at
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            name,
            email,
            password_hash,
            created_at,
        )
    )

    user_id = cursor.lastrowid

    connection.commit()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    row = cursor.fetchone()

    connection.close()

    return dict(row)


def get_user_by_email(email):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = ?
        """,
        (email,)
    )

    row = cursor.fetchone()

    connection.close()

    return dict(row) if row else None


def get_user_by_id(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    row = cursor.fetchone()

    connection.close()

    return dict(row) if row else None


def update_user_password(user_id, password_hash):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
        """,
        (
            password_hash,
            user_id,
        )
    )

    updated = cursor.rowcount > 0

    connection.commit()
    connection.close()

    return updated


def claim_legacy_assessments(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE assessments
        SET user_id = ?
        WHERE user_id IS NULL
        """,
        (user_id,)
    )

    claimed = cursor.rowcount

    connection.commit()
    connection.close()

    return claimed


# ============================================================
# PASSWORD RESET HELPERS
# ============================================================

def create_password_reset_token(user_id, minutes=15):

    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=minutes)

    connection = get_connection()
    cursor = connection.cursor()

    # Invalidate older unused tokens for this user.
    cursor.execute(
        """
        UPDATE password_reset_tokens
        SET used = 1
        WHERE user_id = ?
          AND used = 0
        """,
        (user_id,)
    )

    cursor.execute(
        """
        INSERT INTO password_reset_tokens
        (
            user_id,
            token_hash,
            expires_at,
            used,
            created_at
        )
        VALUES (?, ?, ?, 0, ?)
        """,
        (
            user_id,
            token_hash,
            expires_at.isoformat(),
            now.isoformat(timespec="seconds"),
        )
    )

    connection.commit()
    connection.close()

    return raw_token, expires_at.isoformat()


def get_password_reset_token(raw_token):

    if not raw_token:
        return None

    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM password_reset_tokens
        WHERE token_hash = ?
          AND used = 0
        """,
        (token_hash,)
    )

    row = cursor.fetchone()

    connection.close()

    if not row:
        return None

    expires_at = datetime.fromisoformat(
        row["expires_at"]
    )

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if expires_at <= datetime.now(timezone.utc):
        return None

    return dict(row)


def mark_password_reset_token_used(token_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE password_reset_tokens
        SET used = 1
        WHERE id = ?
        """,
        (token_id,)
    )

    connection.commit()
    connection.close()


# ============================================================
# ASSESSMENT HELPERS
# ============================================================

def create_assessment(
    user_id,
    symptoms,
    prediction,
    confidence,
    predictions
):

    connection = get_connection()
    cursor = connection.cursor()

    created_at = datetime.now().isoformat(
        timespec="seconds"
    )

    cursor.execute(
        """
        INSERT INTO assessments
        (
            user_id,
            symptoms,
            prediction,
            confidence,
            predictions,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            json.dumps(symptoms),
            prediction,
            confidence,
            json.dumps(predictions),
            created_at
        )
    )

    assessment_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return assessment_id


def get_assessments(user_id):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM assessments
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    connection.close()

    assessments = []

    for row in rows:

        assessments.append({
            "id": row["id"],
            "symptoms": json.loads(row["symptoms"]),
            "prediction": row["prediction"],
            "confidence": row["confidence"],
            "predictions": (
                json.loads(row["predictions"])
                if row["predictions"]
                else []
            ),
            "created_at": row["created_at"]
        })

    return assessments


def update_assessment(
    user_id,
    assessment_id,
    symptoms,
    prediction,
    confidence,
    predictions
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE assessments
        SET
            symptoms = ?,
            prediction = ?,
            confidence = ?,
            predictions = ?,
            created_at = ?
        WHERE id = ?
          AND user_id = ?
        """,
        (
            json.dumps(symptoms),
            prediction,
            confidence,
            json.dumps(predictions),
            datetime.now().isoformat(
                timespec="seconds"
            ),
            assessment_id,
            user_id,
        )
    )

    updated = cursor.rowcount > 0

    connection.commit()
    connection.close()

    return updated


def delete_assessment(
    user_id,
    assessment_id
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM assessments
        WHERE id = ?
          AND user_id = ?
        """,
        (
            assessment_id,
            user_id,
        )
    )

    deleted = cursor.rowcount > 0

    connection.commit()
    connection.close()

    return deleted
