import { CredentialResponse } from "@react-oauth/google";
import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

export interface User {
    _id?: string;
    firstPartner: string;
    secondPartner: string;
    email: string;
    password: string;
    avatar?: string;
    weddingDate?: string;
    weddingVenue?: string;
    accessToken?: string;
    refreshToken?: string;
    bookedVendors: any[];
}

export interface UpdatedUser {
    firstPartner?: string;
    secondPartner?: string;
    avatar?: string;
    weddingDate?: string;
    weddingVenue?: string;
}

// Register User Service
const register = (user: User) => {
    const abortController = new AbortController();
    const request = apiClient.post<User>('/auth/register', user, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Register User Service
const googleSignIn = (credentialsResponse: CredentialResponse) => {
    const abortController = new AbortController();
    const payload = { credential: credentialsResponse.credential };
    const request = apiClient.post<{
        refreshToken: string;
        accessToken: string;
        _id: string;
        firstPartner: string;
        secondPartner: string;
        email: string;
        avatar: string;
        weddingDate: string;
        weddingVenue: string;
        bookedVendors: any[];
    }>(
        '/auth/google',
        payload,
        { signal: abortController.signal }
    )
    return { request, abort: () => abortController.abort() };
};

// Logout User Service
const logout = (refreshToken: string) => {
    const abortController = new AbortController();
    const request = apiClient.post('/auth/logout', { refreshToken }, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Login User Service
const login = (credentials: { email: string; password: string }) => {
    const abortController = new AbortController();
    const request = apiClient.post<{
        refreshToken: string;
        accessToken: string;
        _id: string;
        firstPartner: string;
        secondPartner: string;
        email: string;
        avatar: string;
        weddingDate: string;
        weddingVenue: string;
        bookedVendors: any[];
    }>('/auth/login', credentials, { signal: abortController.signal });

    request
        .then(response => {
            console.log('Login successful' + response);
        })
        .catch(error => {
            console.log('Error during login:', error.response?.data || error.message);
        });

    return { request, abort: () => abortController.abort() };
};

// Update User Service
const updateUser = (updatedUser: UpdatedUser) => {
    const abortController = new AbortController();
    const request = apiClient.put<{
        email: string;
        firstPartner: string;
        secondPartner: string;
        avatar: string;
        weddingDate: string;
        weddingVenue: string;
    }>("/auth/user", updatedUser, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};


// Rest Password Service
const resetPassword = (newPassword: string) => {
    const abortController = new AbortController();
    const request = apiClient.put<{
        message: string;
    }>("/auth/resetpass", { newPassword }, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

// Get User Premium Status Service
const getUserPremiumStatus = () => {
    const abortController = new AbortController();
    const request = apiClient.get<{
        is_premium: boolean;
        message: string;
    }>("/auth/prem", {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

export default { register, login, googleSignIn, updateUser, logout, resetPassword, getUserPremiumStatus };