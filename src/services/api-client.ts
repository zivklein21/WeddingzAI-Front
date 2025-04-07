import axios, { CanceledError } from "axios";
import Cookies from "js-cookie";

export { CanceledError };

const backend_url = import.meta.env.VITE_BACKEND_URL

const apiClient = axios.create({
    baseURL: backend_url,
    headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    }, (error) => {
        return Promise.reject(error);
    });


// Handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle Token Expiration Error
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            console.log('Token expired. Attempting refresh...');
            originalRequest._retry = true;

            try {
                // Call the refresh token endpoint
                const refreshResponse = await axios.post(backend_url + '/auth/refresh', {
                    refreshToken: Cookies.get('refreshToken'),
                });
                const newAccessToken = refreshResponse.data.accessToken;
                const newRefreshToken = refreshResponse.data.refreshToken;

                Cookies.set('accessToken', newAccessToken, { secure: true, sameSite: 'Strict' });
                Cookies.set('refreshToken', newRefreshToken, { secure: true, sameSite: 'Strict' });

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                console.log('Retrying request with new access token...');

                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);

                // Clear Cookies Data
                Cookies.remove("refreshToken")
                Cookies.remove("accessToken");
                Cookies.remove("user");

                // Redirect to login if refresh fails
                window.location.href = '/ui/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;