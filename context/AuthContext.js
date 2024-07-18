'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            axios
                .get('http://localhost:8080/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => setUser(response.data))
                .catch((error) => console.error('Failed to fetch user', error));
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('accessToken', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
