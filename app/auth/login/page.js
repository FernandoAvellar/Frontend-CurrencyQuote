'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                "username": username,
                "password": password
            });
            login(response.data.accessToken, { username });
            router.push('/home');
        } catch (error) {
            alert('Login failed!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4 p-2 w-full border"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 p-2 w-full border"
                />
                <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">
                    Login
                </button>
            </div>
        </div>
    );
}
