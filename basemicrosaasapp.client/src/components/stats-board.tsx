interface Stat {
    label: string
    value: string
    unit: string
}

interface StatsBoardProps {
    title: string
    stats: Stat[]
}

export function StatsBoard({ title, stats }: StatsBoardProps) {
    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-5 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-gray-200 border-b border-gray-700 pb-2">{title}</h2>
            <div className="flex flex-col gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">{stat.label}</span>
                        <div className="steampunk-display">
                            <span className="text-2xl font-mono text-amber-500 font-bold tracking-wider">{stat.value}</span>
                            {stat.unit && <span className="text-xs text-amber-500 ml-1">{stat.unit}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
