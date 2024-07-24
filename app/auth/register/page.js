'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:8080/users/register', {
                "username": username,
                "password": password
            });
            router.push('/auth/login');
            alert('User registered successfully!');
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <main className="min-h-[75vh] flex items-center justify-center">
            <div className="bg-stone-100 p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Register</h2>
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
                <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Register
                </button>
            </div>
        </main>
    );
}
