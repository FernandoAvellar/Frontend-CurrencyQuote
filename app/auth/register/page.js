'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:8080/users/register', {
                "username": username,
                "password": password
            });
            alert('User registered successfully!');
            router.push('/auth/login');
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-96">
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
                <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Register
                </button>
            </div>
        </div>
    );
}
