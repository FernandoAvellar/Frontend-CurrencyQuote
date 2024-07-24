'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';

export default function Home() {
    const router = useRouter();
    const { user } = useAuth();
    const [rates, setRates] = useState({});
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        const token = localStorage.getItem('accessToken');
        const storedSelectedCurrencies = JSON.parse(localStorage.getItem('selectedCurrencies')) || [];
        setSelectedCurrencies(storedSelectedCurrencies);

        const fetchRates = async () => {
            const newRates = {};
            try {
                for (const pair of storedSelectedCurrencies) {
                    const response = await axios.get(`http://localhost:8080/currency/rate/${pair}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    newRates[pair] = response.data;
                }
                setRates(newRates);
            } catch (error) {
                console.error('Failed to fetch rates', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
        const interval = setInterval(fetchRates, 30000); // Atualiza a cada 30 segundos
        return () => clearInterval(interval);
    }, [user, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="text-white min-h-[75vh] p-4">
            <h1 className="text-gray-800 text-xl font-bold mb-4">Currency Rates</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCurrencies.map(pair => (
                    <Card key={pair} currency={pair} rate={rates[pair]} />
                ))}
            </div>
        </main>
    );
}
