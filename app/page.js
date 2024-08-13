'use client';
import Home from './home/page.js'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/auth/login');
    } else {
      router.push('/home');
    }
  }, [router]);

  return (
    <>
      <Home />
    </>
  );
}
