import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLoader } from './auth_loader';

// ProtectedRoute - Menjaga route yang memerlukan autentikasi
export function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <AuthLoader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

// PublicRoute - Redirect ke dashboard jika sudah terautentikasi
export function PublicRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <AuthLoader />;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
