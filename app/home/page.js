'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/auth/login');
        }
    }, [router, user]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl">Hello World</h1>
        </div>
    );
}
