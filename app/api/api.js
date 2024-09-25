"use client";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

function setupInterceptors(logout) {
  const nonAuthPaths = [
    "/users/register",
    "/users/changepassword",
    "/auth/login",
  ];

  api.interceptors.request.use(
    (config) => {
      const isEndPointRequiresAuth = !nonAuthPaths.some((path) =>
        config.url.includes(path)
      );

      if (isEndPointRequiresAuth) {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isEndPointRequiresAuth = !nonAuthPaths.some((path) =>
        originalRequest.url.includes(path)
      );
      // If there is originalRequest._retry flag, the refreshToken has expired
      if (
        isEndPointRequiresAuth &&
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );
          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          // Update old token before repeat the request
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.log("RefreshError: " + refreshError);
          console.error("Refresh token invalid");
          logout();
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
export { setupInterceptors };
