'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import api from '@/app/api/api';

export default function Settings() {
    const { user } = useAuth();
    const router = useRouter();
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrencies, setSelectedCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        const fetchCurrencies = async () => {
            try {
                const response = await api.get('/currency');
                setCurrencies(response.data);

                const favoritesResponse = await api.get('/users/favorites');
                const favorites = favoritesResponse.data.map(currency => currency.code);
                setSelectedCurrencies(favorites);
            } catch (error) {
                console.error('Failed to fetch currencies');
            } finally {
                setLoading(false);
            }
        };
        fetchCurrencies();
    }, [user, router]);

    const handleSelectionChange = (code) => {
        const updatedSelection = selectedCurrencies.includes(code)
            ? selectedCurrencies.filter((currency) => currency !== code)
            : [...selectedCurrencies, code];
        setSelectedCurrencies(updatedSelection);
    };

    const handleUpdateClick = async () => {
        setIsUpdating(true);
        try {
            await api.post('/users/favorites', selectedCurrencies);
        } catch (error) {
            console.error('Failed to update favorite currencies');
            toast.error('Failure at update user settings');
        }
        setIsUpdating(false);
        toast.success('User settings updated');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="text-white min-h-[75vh] p-4">
            <h1 className="text-gray-800 text-xl font-bold mb-4">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currencies.map((currency) => (
                    <div key={currency.code} className="p-4 border rounded-lg shadow-lg bg-sky-800">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedCurrencies.includes(currency.code)}
                                onChange={() => handleSelectionChange(currency.code)}
                            />
                            <span className="ml-2">{currency.name}</span>
                        </label>
                    </div>
                ))}
            </div>
            <button
                onClick={handleUpdateClick}
                disabled={isUpdating}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50 min-w-full"
            >
                {isUpdating ? 'Updating...' : 'Update'}
            </button>
        </main>
    );
}
