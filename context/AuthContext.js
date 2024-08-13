'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            validateTokenAndFetchUser();
        }
    }, []);

    const validateTokenAndFetchUser = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8080/auth/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setUser(response.data);
            router.push('/home');
        } catch (error) {
            console.error('Failed to fetch user data, attempting to refresh token', error);
            refreshToken();
        }
    };

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axios.post('http://localhost:8080/auth/refresh', { refreshToken });
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            validateTokenAndFetchUser(); // Re-fetch user data with the new accessToken
        } catch (error) {
            console.error('Failed to refresh token, user must login again', error);
            logout();
        }
    };

    const login = (accessToken, refreshToken, userData) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);