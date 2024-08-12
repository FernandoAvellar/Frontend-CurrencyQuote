'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
    const [username, setUsername] = useState('');
    const [actualPassword, setActualPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const router = useRouter();

    const handleChangePassword = async () => {
        try {
            await axios.put('http://localhost:8080/users/changepassword', {
                "username": username,
                "actualPassword": actualPassword,
                "newPassword": newPassword
            });
            router.push('/auth/login');
            toast.success('Password changed successfully!');
        } catch (error) {
            toast.error('Password change failed!');
        }
    };

    return (
        <main className="min-h-[75vh] flex items-center justify-center">
            <div className="bg-stone-100 p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Change password</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4 p-2 w-full border"
                />
                <input
                    type="password"
                    placeholder="Actual password"
                    value={actualPassword}
                    onChange={(e) => setActualPassword(e.target.value)}
                    className="mb-4 p-2 w-full border"
                />
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mb-4 p-2 w-full border"
                />
                <button onClick={handleChangePassword} className="bg-purple-500 text-white px-4 py-2 rounded w-full">
                    Change password
                </button>
            </div>
        </main>
    );
}
