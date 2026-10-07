import axios from "axios";

const API_BASE_URL =
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("jit_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login") &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("jit_token");
      localStorage.removeItem("jit_user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;