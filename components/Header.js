'use client';
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLoginClick = () => {
        router.push('/auth/login');
    }

    const handleRegisterClick = () => {
        router.push('/auth/register');
    }

    return (
        <header className="min-h-fit bg-gray-800 text-white p-2 flex justify-between items-center">
            <h1 className="text-xl hidden md:flex">Currency App</h1>
            <div className="flex items-center">
                <Link className='p-2' href="/home">Home</Link>
                <Link className='p-2' href="/settings">Settings</Link>
                <Link className="p-2" href="/historical">Historical</Link>
            </div>
            <div>
                {user ? (
                    <div className="flex items-center p-2">
                        <span className="mr-4">Olá, {user.username}</span>
                        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
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
