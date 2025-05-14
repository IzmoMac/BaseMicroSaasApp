import React from 'react';
import { Outlet } from 'react-router';
import { useAuth } from "../context/AuthContext";


const DebugLayout: React.FC = () => {
    const { token } = useAuth();
    return (
        <>
            <Outlet /> {/* This will render the nested routes' components */}

            {/* Debug Div */}
            <div className="fixed bottom-0 right-0 m-4 p-2 bg-green-800 text-white text-xs rounded opacity-75 pointer-events-none z-50">
                {token}
            </div>
        </>
    );
};

export default DebugLayout;