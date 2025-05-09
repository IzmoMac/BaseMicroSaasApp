import { Outlet } from 'react-router';
import ResponsiveNav  from './ResponsiveNav';

const AppLayout = () => {
    return (
        <div className="flex h-screen">
            <ResponsiveNav />
            <main className="flex-1 ml-0 sm:ml-64 pb-16 sm:pb-0">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
