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

interface FailedQueueItem {
  resolve: (token?: string | null) => void;
  reject: (error: unknown) => void;
}

// Set Up processQueue to avoid race conditions
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  console.log("[API] Processing queue", { error, token });
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
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
      console.log("[API] Attached access token to request");
    }

    return config;
  },
  (error) => {
    console.log("[API] Request error", error);
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
      console.warn("[API] 401 received. Attempting to refresh token...");
      originalRequest._retry = true;

      if (isRefreshing) {
        console.log("[API] Token refresh already in progress. Queuing request.");
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              const latestAccessToken = Cookies.get("accessToken");
              console.log("[API] Resuming queued request with new token");
              resolve(
                apiClient({
                  ...originalRequest,
                  headers: {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${latestAccessToken}`,
                  },
                })
              );
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      console.log("[API] Refreshing token now...");

      try {
        interface RefreshResponse {
          accessToken: string;
          refreshToken: string;
        }

        const refreshResponse = await axios.post<RefreshResponse>(
          backend_url + "/auth/refresh",
          { refreshToken: Cookies.get("refreshToken") }
        );

        const newAccessToken = refreshResponse?.data?.accessToken;
        const newRefreshToken = refreshResponse?.data?.refreshToken;

        console.log("[API] Token refreshed successfully", {
          newAccessToken,
          newRefreshToken,
        });

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
        console.error("[API] Token refresh failed", refreshError);

        processQueue(refreshError, null);

        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        console.log("[API] Token refresh cycle complete");
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
