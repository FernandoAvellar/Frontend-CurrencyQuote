export default function Card({ currency, rate }) {
    return (
        <div className="p-4 border rounded-lg shadow-lg text-white bg-sky-800">
            <h2 className="text-lg font-semibold">{currency} - {rate ? rate.currency.name : 'Loading...'}</h2>
            <p className="text-xl">{rate ? 'R$ ' + rate.bid : 'Loading...'}</p>
            {rate && (
                <>
                    <p>High: {rate.high}</p>
                    <p>Low: {rate.low}</p>
                    <p>Last update: {rate.createDate}</p>
                </>
            )}
        </div>
    );
}