'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Admin() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        const fetchUsers = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await axios.get('http://localhost:8080/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user]);

    const handleDelete = async (username) => {
        const token = localStorage.getItem('accessToken');
        try {
            await axios.delete(`http://localhost:8080/users/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Refresh the user list after deletion
            setUsers(users.filter(user => user.username !== username));
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    const handleChangePassword = async (username) => {
        const token = localStorage.getItem('accessToken');
        const newPassword = prompt("Enter new password:");
        if (!newPassword) return;

        try {
            await axios.put(`http://localhost:8080/users/${username}/password/change`,
                { newPassword: newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            alert('Password changed successfully');
        } catch (error) {
            console.error('Failed to change password', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="min-h-[75vh] bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">User Administration</h1>
            <table className="min-w-full bg-white text-center">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">User Role</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border-b uppercase">{user.username}</td>
                            <td className="py-2 px-4 border-b">
                                {user.roles.map(role => role.name).join(', ')}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleDelete(user.username)}
                                    className="bg-red-500 text-white px-2 py-1 rounded m-2"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleChangePassword(user.username)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Change Password
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}