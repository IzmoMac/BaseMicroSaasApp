import DashboardStats from "./components/dashboard-stats"
import "./dashboard.css"
function Dashboard() {
    return (
        <div className="flex flex-col gap-6 m-3">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            <DashboardStats distance="12,345" economy="8.7" cost="&euro;1,234.56" />

            {/*dummy data*/}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Trip</h3>
                    <p className="text-lg font-semibold">87 km</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">May 3, 2025</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Fill-up</h3>
                    <p className="text-lg font-semibold">45 L</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">May 1, 2025</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Monthly Distance</h3>
                    <p className="text-lg font-semibold">543 km</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">May 2025</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Monthly Cost</h3>
                    <p className="text-lg font-semibold">$87.65</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">May 2025</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
