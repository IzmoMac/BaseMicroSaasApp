import React from 'react';
import { Outlet } from 'react-router';
import { useAuth } from "../context/AuthContext";

const DebugLayout: React.FC = () => {
    const { token } = useAuth();

    React.useEffect(() => {
        const toggleDebugDiv = () => {
            const debugDiv = document.getElementById('debug-token-div');
            if (debugDiv) {
                if (debugDiv.style.display === 'none') {

                    debugDiv.style.display = 'block';
                } else {
                    debugDiv.style.display = 'none';
                }
            }
        };

        // Attach the function to the window object
        // Use a more descriptive name to avoid potential conflicts
        window.toggleDebugToken = toggleDebugDiv;

        // Clean up the global variable when the component unmounts
        return () => {
            delete window.toggleDebugToken;
        };
    }, []);

    return (
        <>
            <Outlet />
            <div
                id="debug-token-div"
                className="fixed bottom-0 right-0 m-4 p-2 bg-green-800 text-white text-xs rounded opacity-75 pointer-events-none z-50 hidden"
            >
                {token}
            </div>
        </>
    );
};

export default DebugLayout;

// Extend the Window interface to include our new function for TypeScript
declare global {
    interface Window {
        toggleDebugToken: () => void;
    }
}