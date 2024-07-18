'use client';
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
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl">My Currency App</h1>
            <div>
                {user ? (
                    <div className="flex items-center p-4">
                        <span className="mr-4">Olá, {user.username}</span>
                        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex p-4">
                        <button onClick={handleLoginClick} className="bg-green-500 px-4 py-2 rounded mr-2">
                            Login
                        </button>
                        <button onClick={handleRegisterClick} className="bg-blue-500 px-4 py-2 rounded">
                            Register
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
