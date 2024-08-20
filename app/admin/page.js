'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import api from '@/app/api/api';

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
            try {
                const response = await api.get('/users');
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
                console.error('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user]);

    const handleDelete = async (username) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete user!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/users/${username}`);
                    setUsers(users.filter(user => user.username !== username));
                    Swal.fire({
                        title: "Deleted!",
                        text: "The user has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Failed to delete user');
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete user.",
                        icon: "error"
                    });
                }
            }
        });
    };

    const handleChangePassword = async (username) => {
        const { value: newPassword } = await Swal.fire({
            title: "Enter new password",
            input: "password",
            inputLabel: "New Password",
            inputPlaceholder: "Enter new password",
            inputAttributes: {
                maxlength: "25",
                autocapitalize: "off",
                autocorrect: "off"
            }
        });
        if (!newPassword) return;
        try {
            await api.put(`/users/${username}/password/change`, { newPassword: newPassword });
            toast.success('Password changed successfully');
        } catch (error) {
            toast.error('Failed to change password');
            console.error('Failed to change password');
        }
    };

    const handleUpdateRoles = async (username) => {
        const selectedRoles = Object.keys(roleSelections[username])
            .filter(role => roleSelections[username][role]);

        if (selectedRoles.length === 0) {
            toast.info('Select at least one role');
            return;
        }
        try {
            await api.put(`/users/updateuserroles`, {
                username: username,
                roles: selectedRoles
            });
            toast.success('Roles updated successfully');
        } catch (error) {
            toast.error('Failed to update roles');
            console.log('Failed to update roles');
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

    if (!user) {
        return <div>Redirecting...</div>;
    }

    return (
        <main className="flex flex-grow flex-col bg-gray-100 p-4">
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
                    {users.map(u => (
                        <tr key={u.id}>
                            <td className="py-2 px-4 border-b uppercase">{u.username}</td>
                            <td className="py-2 px-4 border-b">
                                <div className="flex justify-center">
                                    <label className="mr-4">
                                        <input
                                            className='m-1'
                                            type="checkbox"
                                            checked={roleSelections[u.username]?.ROLE_BASIC || false}
                                            onChange={() => handleRoleChange(u.username, 'ROLE_BASIC')}
                                        />
                                        ROLE_BASIC
                                    </label>
                                    <label>
                                        <input
                                            className='m-1'
                                            type="checkbox"
                                            checked={roleSelections[u.username]?.ROLE_ADMIN || false}
                                            onChange={() => handleRoleChange(u.username, 'ROLE_ADMIN')}
                                        />
                                        ROLE_ADMIN
                                    </label>
                                </div>
                            </td>
                            <td className="flex flex-col lg:flex-row justify-center py-2 px-4 border-b">
                                <button
                                    onClick={() => handleChangePassword(u.username)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded m-1"
                                >
                                    Change Password
                                </button>
                                <button
                                    onClick={() => handleUpdateRoles(u.username)}
                                    className="bg-green-500 text-white px-2 py-1 rounded m-1"
                                >
                                    Update Roles
                                </button>
                                <button
                                    onClick={() => handleDelete(u.username)}
                                    className="bg-red-500 text-white px-2 py-1 rounded m-1 disabled:opacity-55"
                                    disabled={u.username === user.username}
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
