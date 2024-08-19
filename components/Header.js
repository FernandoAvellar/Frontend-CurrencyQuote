'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';
import api from '@/app/api/api';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (!user) return;

            try {
                const response = await api.get('/auth/me');
                const userRoles = response.data.userRole;
                const adminRole = userRoles.find(role => role.name === 'ROLE_ADMIN');
                setIsAdmin(!!adminRole);
            } catch (error) {
                console.error('Failed to fetch user role', error);
            }
        };
        fetchUserRole();
    }, [user]);

    const handleLoginClick = () => {
        router.push('/auth/login');
    }

    const handleRegisterClick = () => {
        router.push('/auth/register');
    }

    return (
        <header className="min-h-fit bg-gray-800 text-white p-4 flex justify-between items-center sm:p-6">
            <h1 className="text-xl hidden md:flex">Currency App</h1>
            {user && (
                <nav className="flex items-center">
                    <div className='hidden sm:flex'>
                        <Link className='p-2' href="/home">Home</Link>
                        <Link className='p-2' href="/settings">Settings</Link>
                        <Link className="p-2" href="/historical">Historical</Link>
                        {isAdmin && (
                            <Link className="p-2" href="/admin">Admin</Link>
                        )}
                    </div>
                    <div className='sm:hidden'>
                        <DropdownMenu className='hidden'>
                            <DropdownMenuTrigger>
                                <Image
                                    src="/burger-menu.svg"
                                    width={30}
                                    height={30}
                                    alt="Picture of the author"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild><Link href="/home">Home</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href="/historical">Historical</Link></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>
            )}
            <div>
                {user ? (
                    <div className="flex items-center p-2">
                        <span className="mr-4 capitalize text-center">Olá, {user.username}</span>
                        <button onClick={logout} className="bg-red-500 px-2 md:px-4 py-2 rounded">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex p-2">
                        <button onClick={handleLoginClick} className="bg-green-500 px-2 py-2 rounded mr-2">
                            Login
                        </button>
                        <button onClick={handleRegisterClick} className="bg-blue-500 px-2 py-2 rounded">
                            Register
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
