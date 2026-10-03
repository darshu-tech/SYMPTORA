import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  getCurrentUser,
  loginUser
} from "../services/authApi";


const AuthContext = createContext(null);

const TOKEN_KEY = "symptora_token";
const USER_KEY = "symptora_user";


export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const storedUser =
      localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }

  });

  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [isLoading, setIsLoading] =
    useState(Boolean(token));


  useEffect(() => {

    async function restoreSession() {

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {

        const data =
          await getCurrentUser(token);

        setUser(data.user);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(data.user)
        );

      } catch (error) {

        console.warn(
          "Session restore failed:",
          error
        );

        logout();

      } finally {

        setIsLoading(false);

      }

    }

    restoreSession();

    // This effect intentionally depends only on the token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);


  async function login(
    email,
    password
  ) {

    const data =
      await loginUser(
        email,
        password
      );

    saveSession(
      data.token,
      data.user
    );

    return data;

  }


  function saveSession(
    newToken,
    newUser
  ) {

    localStorage.setItem(
      TOKEN_KEY,
      newToken
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(newUser)
    );

    setToken(newToken);
    setUser(newUser);

  }


  function logout() {

    localStorage.removeItem(
      TOKEN_KEY
    );

    localStorage.removeItem(
      USER_KEY
    );

    setToken(null);
    setUser(null);

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        saveSession,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }

  return context;

}
