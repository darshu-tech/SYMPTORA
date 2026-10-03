import os
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import request, g
from werkzeug.security import generate_password_hash, check_password_hash

from database import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    claim_legacy_assessments,
    create_password_reset_token,
    get_password_reset_token,
    mark_password_reset_token_used,
    update_user_password,
)


JWT_SECRET = os.getenv(
    "SYMPTORA_JWT_SECRET",
    "symptora-local-development-secret-change-in-production",
)

JWT_ALGORITHM = "HS256"
JWT_EXPIRES_HOURS = 24
RESET_TOKEN_MINUTES = 15


def normalize_email(email):
    return str(email or "").strip().lower()


def validate_password(password):
    password = str(password or "")
    if len(password) < 8:
        return "Password must be at least 8 characters."
    return None


def create_user_account(name, email, password):
    name = str(name or "").strip()
    email = normalize_email(email)
    password = str(password or "")

    if len(name) < 2:
        return None, "Please enter your full name."

    if "@" not in email or "." not in email.split("@")[-1]:
        return None, "Please enter a valid email address."

    password_error = validate_password(password)
    if password_error:
        return None, password_error

    if get_user_by_email(email):
        return None, "An account with this email already exists."

    user = create_user(
        name,
        email,
        generate_password_hash(password),
    )

    # The original application allowed anonymous assessments.
    # If this is the first registered account, attach those legacy
    # records to that account so existing local history is preserved.
    claim_legacy_assessments(user["id"])

    return user, None


def authenticate_user(email, password):
    email = normalize_email(email)
    user = get_user_by_email(email)

    if not user:
        return None

    if not check_password_hash(
        user["password_hash"],
        str(password or ""),
    ):
        return None

    return user


def create_access_token(user_id):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(hours=JWT_EXPIRES_HOURS),
    }
    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def decode_access_token(token):
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
        return int(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        return None


def auth_required(route_function):
    @wraps(route_function)
    def wrapper(*args, **kwargs):
        authorization = request.headers.get("Authorization", "")
        if not authorization.startswith("Bearer "):
            return {
                "success": False,
                "error": "Authentication required.",
            }, 401

        token = authorization.split(" ", 1)[1].strip()
        user_id = decode_access_token(token)

        if not user_id:
            return {
                "success": False,
                "error": "Your session has expired. Please log in again.",
            }, 401

        user = get_user_by_id(user_id)
        if not user:
            return {
                "success": False,
                "error": "User account not found.",
            }, 401

        g.current_user_id = user_id
        g.current_user = user

        return route_function(*args, **kwargs)

    return wrapper


def public_user(user):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "created_at": user["created_at"],
    }


def create_reset_request(email):
    email = normalize_email(email)
    user = get_user_by_email(email)

    if not user:
        return None, None

    token, expires_at = create_password_reset_token(
        user["id"],
        RESET_TOKEN_MINUTES,
    )

    return token, expires_at


def reset_password(token, new_password):
    password_error = validate_password(new_password)
    if password_error:
        return False, password_error

    reset_record = get_password_reset_token(token)
    if not reset_record:
        return False, "This reset link is invalid or has expired."

    update_user_password(
        reset_record["user_id"],
        generate_password_hash(new_password),
    )
    mark_password_reset_token_used(reset_record["id"])

    return True, None
