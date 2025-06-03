import { Navigate } from "react-router";
import { useAuth } from "@context/AuthContext";
import type { ReactNode } from "react";

const LoadingSpinner = () => <div>Loading...</div>;

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { token } = useAuth();

    if (token === undefined) {
        return <LoadingSpinner />;
    }
    if (token === null) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;