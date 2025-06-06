import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../services/auth-service';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import userService from '../../services/auth-service';
import { CredentialResponse } from '@react-oauth/google';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    googleSignIn: (response: CredentialResponse) => void;
    updateUserSession: (updatedFields: Partial<User>) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedAccessToken = Cookies.get('accessToken');
        const storedRefreshToken = Cookies.get('refreshToken');
        const storedUser = Cookies.get('user');

        if (storedAccessToken && storedRefreshToken && storedUser) {
            const parsedUser = JSON.parse(decodeURIComponent(storedUser));
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUser(parsedUser);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            logout();
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { request } = userService.login({ email, password });
            const response = await request;
            const {
                accessToken,
                refreshToken,
                _id,
                firstPartner,
                secondPartner,
                avatar,
                weddingDate,
                weddingVenue,
                email: userEmail,
                bookedVendors
            } = response.data;

            const userData = {
                accessToken,
                refreshToken,
                _id,
                firstPartner,
                secondPartner,
                avatar,
                weddingDate,
                weddingVenue,
                email: userEmail,
                password: '',
                bookedVendors: bookedVendors || []
            };

            Cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('user', encodeURIComponent(JSON.stringify(userData)), {
                path: '/',
                secure: true,
                sameSite: 'Strict'
            });

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error: any) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message;
                throw new Error(errorMessage || 'An unexpected error occurred');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    };

    const googleSignIn = async (response: CredentialResponse) => {
        try {
            const { request: googleSignInRequest } = await userService.googleSignIn(response);
            const googleSignInResponse = await googleSignInRequest;

            const {
                accessToken,
                refreshToken,
                _id,
                firstPartner,
                secondPartner,
                avatar,
                weddingDate,
                weddingVenue,
                email,
                bookedVendors
            } = googleSignInResponse.data;

            const userData = {
                accessToken,
                refreshToken,
                _id,
                avatar,
                weddingDate,
                weddingVenue,
                email,
                firstPartner,
                secondPartner,
                password: '',
                bookedVendors: bookedVendors || []
            };

            Cookies.set('accessToken', accessToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('user', encodeURIComponent(JSON.stringify(userData)), {
                path: '/',
                secure: true,
                sameSite: 'Strict'
            });

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error: any) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message;
                throw new Error(errorMessage || 'An unexpected error occurred');
            } else {
                throw new Error('An unexpected error occurred');
            }
        }
    };

    const updateUserSession = (updatedFields: Partial<User>) => {
        if (!user) return;

        const updatedUser: User = {
            ...user,
            ...updatedFields,
        };

        setUser(updatedUser);
        Cookies.set('user', encodeURIComponent(JSON.stringify(updatedUser)), {
            path: '/',
            secure: true,
            sameSite: 'Strict'
        });
    };

    const logout = async () => {
        if (refreshToken) {
            try {
                const { request } = userService.logout(refreshToken);
                await request;
            } catch (error) {
                console.error("Logout failed", error);
            }
        }

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsAuthenticated(false);

        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');

        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ loading, isAuthenticated, user, accessToken, refreshToken, updateUserSession, login, logout, googleSignIn }}>
            {children}
        </AuthContext.Provider>
    );
};
