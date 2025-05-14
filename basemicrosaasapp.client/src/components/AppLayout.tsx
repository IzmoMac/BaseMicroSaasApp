import { Outlet } from 'react-router';
import ResponsiveNav from './ResponsiveNav';

const AppLayout = () => {


    return (
        <div className="flex">

            <ResponsiveNav />
            <main className="flex-1 ml-0 sm:ml-64 pb-16 sm:pb-0 sm:overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
