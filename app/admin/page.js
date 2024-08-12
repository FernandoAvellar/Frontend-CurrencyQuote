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
    const [roleSelections, setRoleSelections] = useState({});

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
                const fetchedUsers = response.data;
                setUsers(fetchedUsers);

                const initialRoleSelections = {};
                fetchedUsers.forEach(u => {
                    initialRoleSelections[u.username] = {
                        ROLE_BASIC: u.roles.some(role => role.name === 'ROLE_BASIC'),
                        ROLE_ADMIN: u.roles.some(role => role.name === 'ROLE_ADMIN')
                    };
                });
                setRoleSelections(initialRoleSelections);
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

    const handleUpdateRoles = async (username) => {
        const token = localStorage.getItem('accessToken');
        const selectedRoles = Object.keys(roleSelections[username])
            .filter(role => roleSelections[username][role]);

        if (selectedRoles.length === 0) {
            alert('User must have at least one role selected.');
            return;
        }
        try {
            await axios.put(`http://localhost:8080/users/updateuserroles`, {
                username: username,
                roles: selectedRoles
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Roles updated successfully');
        } catch (error) {
            console.error('Failed to update roles', error);
        }
    };

    const handleRoleChange = (username, role) => {
        setRoleSelections(prev => ({
            ...prev,
            [username]: {
                ...prev[username],
                [role]: !prev[username][role]
            }
        }));
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
                        <th className="py-2 px-4 border-b">User Role(s)</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border-b uppercase">{user.username}</td>
                            <td className="py-2 px-4 border-b">
                                <div className="flex justify-center">
                                    <label className="mr-4">
                                        <input
                                            className='m-1'
                                            type="checkbox"
                                            checked={roleSelections[user.username]?.ROLE_BASIC || false}
                                            onChange={() => handleRoleChange(user.username, 'ROLE_BASIC')}
                                        />
                                        ROLE_BASIC
                                    </label>
                                    <label>
                                        <input
                                            className='m-1'
                                            type="checkbox"
                                            checked={roleSelections[user.username]?.ROLE_ADMIN || false}
                                            onChange={() => handleRoleChange(user.username, 'ROLE_ADMIN')}
                                        />
                                        ROLE_ADMIN
                                    </label>
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleChangePassword(user.username)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded m-1"
                                >
                                    Change Password
                                </button>
                                <button
                                    onClick={() => handleUpdateRoles(user.username)}
                                    className="bg-green-500 text-white px-2 py-1 rounded m-1"
                                >
                                    Update Roles
                                </button>
                                <button
                                    onClick={() => handleDelete(user.username)}
                                    className="bg-red-500 text-white px-2 py-1 rounded m-1"
                                >
                                    Delete User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
