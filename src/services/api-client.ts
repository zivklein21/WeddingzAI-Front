import axios from "axios";
import Cookies from "js-cookie";

// Export CanceledError for use in other services
export class CanceledError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "CanceledError";
  }
}

const backend_url = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
  baseURL: backend_url,
  headers: { "Content-Type": "application/json" },
});


// Set Up processQueue to avoid race conditions
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// Attach access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          backend_url + "/auth/refresh",
          { refreshToken: Cookies.get("refreshToken") }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        const newRefreshToken = refreshResponse.data.refreshToken;

        Cookies.set("accessToken", newAccessToken, {
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("refreshToken", newRefreshToken, {
          secure: true,
          sameSite: "Strict",
        });

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
