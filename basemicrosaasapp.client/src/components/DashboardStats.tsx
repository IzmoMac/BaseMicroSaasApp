interface DashboardStatsProps {
    distance: string
    economy: string
    cost: string
}

function DashboardStats({ distance, economy, cost }: DashboardStatsProps) {
    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-5 shadow-lg">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Distance</span>
                    <div className="steampunk-display">
                        <span className="text-2xl font-mono text-amber-500 font-bold tracking-wider">{distance}</span>
                        <span className="text-xs text-amber-500 ml-1">km</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Avg. Fuel Economy</span>
                    <div className="steampunk-display">
                        <span className="text-2xl font-mono text-amber-500 font-bold tracking-wider">{economy}</span>
                        <span className="text-xs text-amber-500 ml-1">L/100km</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Fuel Cost</span>
                    <div className="steampunk-display">
                        <span className="text-2xl font-mono text-amber-500 font-bold tracking-wider">{cost}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardStats;