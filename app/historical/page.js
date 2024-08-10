'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import useDebounce from '@/hooks/useDebounce';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Historical() {
    const { user } = useAuth();
    const router = useRouter();
    const [currency, setCurrency] = useState('USDBRL');
    const [days, setDays] = useState(30);
    const [historicalData, setHistoricalData] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const debounce = useDebounce(days, 500);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        const token = localStorage.getItem('accessToken');
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/currency', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const sortedCurrencies = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setCurrencies(sortedCurrencies);
            } catch (error) {
                console.error('Failed to fetch currencies', error);
            }
        };
        fetchCurrencies();
    }, [user, router]);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            if (!debounce || debounce < 1 || debounce > 360) return;
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            try {
                const response = await axios.get(`http://localhost:8080/currency/historical/${currency}/${debounce}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setHistoricalData(response.data);
            } catch (error) {
                console.error('Failed to fetch historical data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistoricalData();
    }, [currency, debounce]);

    const handleDaysChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= 360) {
            setDays(value);
        } else if (e.target.value === '') {
            setDays('');
        }
    };

    const data = {
        labels: historicalData.map(entry => {
            const date = entry.create_date ? new Date(entry.create_date) : new Date(entry.timestamp * 1000);
            return date.toLocaleDateString();
        }),
        datasets: [
            {
                label: `${currency} Exchange Rate`,
                data: historicalData.map(entry => entry.bid),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="text-white min-h-[75vh] bg-sky-900 p-4">
            <h1 className="text-2xl font-bold mb-2">Historical Currency Rates</h1>
            <div className="mb-2">
                <label className="block mb-2">Select Currency:</label>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="border rounded p-2 text-black"
                >
                    {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                            {currency.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-2">
                <label className="block mb-2">Number of Days:</label>
                <input
                    type="number"
                    value={days}
                    onChange={handleDaysChange}
                    className="border rounded p-2 text-black mb-2"
                    min="1"
                    max="360"
                />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm" style={{ height: '360px' }}>
                <Line data={data} options={options} />
            </div>
        </main>
    );
}
