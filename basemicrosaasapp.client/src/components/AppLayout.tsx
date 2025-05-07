import React from 'react';
import ResponsiveNav from './ResponsiveNav'; // Adjust the import path and extension
import ForecastApp from '../Forecast';

// Define the props for AppLayout
interface AppLayoutProps {
    children?: React.ReactNode; // children can be any valid React node
}

const AppLayout: React.FC<AppLayoutProps> = () => {
    // State to track the active tab, lifted up to the parent
    const [activeTab, setActiveTab] = useState('Dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <ForecastApp />;
            case 'Settings':
                //return <SettingsLayout />;
            case 'Profile':
            //return <ProfileLayout />;
                return <div>Profile Content</div>;
            default:
                //return <DashboardLayout />; // Default to Dashboard or a fallback
        }
    };

    return (
        <main className="flex h-screen">
            {/* Responsive Navigation Component */}
            <ResponsiveNav activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <main className="flex-1 ml-0 sm:ml-64 pb-16 sm:pb-0"> {/* Adjust padding/margin based on sidebar */}
                {/* Conditionally render content based on activeTab */}
                {renderContent()}
            </main>
        </div>
    );
};

export default AppLayout;
