export default function Card({ currency, rate }) {
    return (
        <div className="border rounded-lg shadow-lg text-white bg-sky-800">
            <div className="rounded-lg h-16 p-1 mb-2 bg-gray-800 text-center place-content-center">
                <h2 className="text font-semibold">{currency} - {rate ? rate.currency.name : 'Loading...'}</h2>
            </div>
            <div>
                <p className="text-xl mb-2 text-center place-content-center">
                    {rate ? rate.bid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Loading...'}
                </p>
                {rate && (
                    <div className="flex flex-row itens-center justify-center mb-2">
                        <p className="p-2">High: {rate.high.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="p-2">Low: {rate.low.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                )}
            </div>
            <div className="rounded-lg h-10 bg-gray-800 text-center place-content-center">
                <p>Last update: {rate ? new Date(rate.createDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }) : 'Loading...'}</p>
            </div>
        </div>
    );
}