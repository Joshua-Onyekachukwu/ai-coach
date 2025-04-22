// components/ui/ProgressBar.jsx
export function ProgressBar({ value, color = 'indigo' }) {
    const colorClasses = {
        indigo: 'bg-indigo-600',
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        pink: 'bg-pink-600',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500'
    };

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className={`${colorClasses[color]} h-2.5 rounded-full`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
}