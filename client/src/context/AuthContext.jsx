import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const AuthContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    () =>
      localStorage.getItem("jit_token") || ""
  );

  const [loading, setLoading] = useState(true);

  // =========================================================
  // RESTORE SESSION
  // =========================================================

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken =
        localStorage.getItem("jit_token");

      if (!savedToken) {
        setUser(null);
        setToken("");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/profile`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${savedToken}`,
            },
          }
        );

        const result =
          await response.json();

        console.log(
          "SESSION RESPONSE:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Session expired. Please login again."
          );
        }

        const userData =
          result.user ||
          result.data?.user;

        if (!userData) {
          throw new Error(
            "Invalid user session."
          );
        }

        localStorage.setItem(
          "jit_user",
          JSON.stringify(userData)
        );

        setToken(savedToken);
        setUser(userData);

      } catch (error) {
        console.error(
          "SESSION RESTORE ERROR:",
          error
        );

        localStorage.removeItem(
          "jit_token"
        );

        localStorage.removeItem(
          "jit_user"
        );

        setToken("");
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // =========================================================
  // LOGIN
  // ONLY EMAIL + PASSWORD
  // =========================================================

  const login = async (
    email,
    password
  ) => {
    setLoading(true);

    try {
      const cleanEmail =
        String(email || "")
          .trim()
          .toLowerCase();

      const cleanPassword =
        String(password || "");

      // -------------------------------------------------------
      // VALIDATION
      // -------------------------------------------------------

      if (!cleanEmail) {
        throw new Error(
          "Please enter your college email."
        );
      }

      if (!cleanPassword) {
        throw new Error(
          "Please enter your password."
        );
      }

      // -------------------------------------------------------
      // LOGIN REQUEST
      // -------------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
            password: cleanPassword,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "LOGIN RESPONSE:",
        result
      );

      // -------------------------------------------------------
      // SERVER ERROR
      // -------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Invalid email or password."
        );
      }

      // -------------------------------------------------------
      // RESPONSE DATA
      // -------------------------------------------------------

      const receivedToken =
        result.token;

      const userData =
        result.user ||
        result.data?.user;

      if (!receivedToken) {
        throw new Error(
          "Server did not return an authentication token."
        );
      }

      if (!userData) {
        throw new Error(
          "Server did not return user information."
        );
      }

      // -------------------------------------------------------
      // ROLE
      // -------------------------------------------------------

      const actualRole =
        String(
          userData.role || ""
        )
          .trim()
          .toLowerCase();

      if (!actualRole) {
        throw new Error(
          "User role is missing from the server."
        );
      }

      // -------------------------------------------------------
      // SAVE SESSION
      // -------------------------------------------------------

      localStorage.setItem(
        "jit_token",
        receivedToken
      );

      localStorage.setItem(
        "jit_user",
        JSON.stringify(userData)
      );

      setToken(receivedToken);
      setUser(userData);

      console.log(
        "LOGIN SUCCESS:",
        {
          name: userData.name,
          email: userData.email,
          role: actualRole,
        }
      );

      return userData;

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      localStorage.removeItem(
        "jit_token"
      );

      localStorage.removeItem(
        "jit_user"
      );

      setToken("");
      setUser(null);

      throw error;

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem(
      "jit_token"
    );

    localStorage.removeItem(
      "jit_user"
    );

    setToken("");
    setUser(null);
  };

  // =========================================================
  // AUTHENTICATED FETCH
  // =========================================================

  const authFetch = async (
    endpoint,
    options = {}
  ) => {
    const currentToken =
      token ||
      localStorage.getItem(
        "jit_token"
      );

    const headers = {
      ...(options.body instanceof FormData
        ? {}
        : {
            "Content-Type":
              "application/json",
          }),

      ...(options.headers || {}),
    };

    if (currentToken) {
      headers.Authorization =
        `Bearer ${currentToken}`;
    }

    return fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  };

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = useMemo(
    () => ({
      user,
      token,

      login,
      logout,
      authFetch,

      isAuthenticated:
        Boolean(user && token),

      loading,
    }),
    [
      user,
      token,
      loading,
    ]
  );

  // =========================================================
  // PROVIDER
  // =========================================================

  return (
    <AuthContext.Provider
      value={value}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}