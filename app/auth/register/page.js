'use client';
import { useState } from 'react';
import api from '@/app/api/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            await api.post('/users/register', {
                "username": username,
                "password": password
            });
            router.push('/auth/login');
            toast.success('User registered successfully!');
        } catch (error) {
            toast.error('Registration failed!');
        }
    };

    return (
        <main className="flex flex-grow items-center justify-center">
            <div className="bg-stone-100 p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mb-4 p-2 w-full border"
                        autoComplete="username"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4 p-2 w-full border"
                        autoComplete="current-password"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                        Register
                    </button>
                </form>
            </div>
        </main>
    );
}
