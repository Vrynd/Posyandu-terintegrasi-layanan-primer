/**
 * Application Router Configuration
 * Uses AppLayout as shared layout for all authenticated pages
 * Implements code splitting with React.lazy for better initial load performance
 * 
 * Route structure:
 * - / → Redirect to login
 * - /login → Login page (public)
 * - /register → Register page (public)
 * - /auth/callback → OAuth callback handler
 * 
 * DASHBOARD & QUICK ACTIONS:
 * - /dashboard → Main dashboard
 * - /dashboard/participants → Manage Participants (Daftar Peserta)
 * - /dashboard/participants/register → Register new participant
 * - /dashboard/participants/:id → Participant detail, edit, delete
 * - /dashboard/examinations → Search & start health examination
 * - /dashboard/examinations/:category/:id → Record health data (wizard)
 * - /dashboard/reports → View & download Excel reports
 * - /dashboard/complaints → Submit bug reports/complaints
 * - /dashboard/settings → Account profile & security settings
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ClipLoader } from 'react-spinners';

// ============================================
// EAGER LOADED (Critical for initial render)
// ============================================
import { AppLayout } from '../components/layouts/AppLayout';

// ============================================
// LAZY LOADED - Auth Pages
// ============================================
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AuthCallbackPage = lazy(() => import('../pages/auth/AuthCallbackPage').then(m => ({ default: m.AuthCallbackPage })));

// ============================================
// LAZY LOADED - Dashboard Pages
// ============================================
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PesertaPage = lazy(() => import('../pages/dashboard/PesertaPage').then(m => ({ default: m.PesertaPage })));
const PesertaAddPage = lazy(() => import('../pages/dashboard/PesertaAddPage').then(m => ({ default: m.PesertaAddPage })));
const PesertaDetailPage = lazy(() => import('../pages/dashboard/PesertaDetailPage').then(m => ({ default: m.PesertaDetailPage })));
const PemeriksaanPage = lazy(() => import('../pages/dashboard/PemeriksaanPage').then(m => ({ default: m.PemeriksaanPage })));
const PemeriksaanAddPage = lazy(() => import('../pages/dashboard/PemeriksaanAddPage').then(m => ({ default: m.PemeriksaanAddPage })));
const LaporanPage = lazy(() => import('../pages/dashboard/LaporanPage').then(m => ({ default: m.LaporanPage })));
const PengaduanPage = lazy(() => import('../pages/dashboard/PengaduanPage').then(m => ({ default: m.PengaduanPage })));
const PengaduanAddPage = lazy(() => import('../pages/dashboard/PengaduanAddPage').then(m => ({ default: m.PengaduanAddPage })));
const PengaduanDetailPage = lazy(() => import('../pages/dashboard/PengaduanDetailPage').then(m => ({ default: m.PengaduanDetailPage })));
const AccountSettingsPage = lazy(() => import('../pages/dashboard/AccountSettingsPage').then(m => ({ default: m.AccountSettingsPage })));

/**
 * AuthLoader - Full screen loader for auth checks
 */
function AuthLoader() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
            <ClipLoader color="#ffffff" size={50} speedMultiplier={0.8} />
            <p className="mt-4 text-white font-medium">Memuat...</p>
        </div>
    );
}

/**
 * SuspenseWrapper - Wraps lazy components with Suspense (for routes without AppLayout)
 */
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<AuthLoader />}>
            {children}
        </Suspense>
    );
}

/**
 * LoginSuspenseWrapper - Minimal suspense wrapper for login/register pages
 * Uses null fallback to prevent "Memuat..." overlay after logout redirect
 * Login pages are typically already prefetched, so fallback rarely shows
 */
function LoginSuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            {children}
        </Suspense>
    );
}

/**
 * ProtectedRoute - Guards routes that require authentication
 */
function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <AuthLoader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

/**
 * PublicRoute - Redirects to dashboard if already authenticated
 */
function PublicRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <AuthLoader />;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

/**
 * Application routes configuration
 */
export const router = createBrowserRouter([
    // Root redirect
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },

    // Public routes (login, register)
    {
        element: <PublicRoute />,
        children: [
            {
                path: '/login',
                element: <LoginSuspenseWrapper><LoginPage /></LoginSuspenseWrapper>,
            },
            {
                path: '/register',
                element: <LoginSuspenseWrapper><RegisterPage /></LoginSuspenseWrapper>,
            },
        ],
    },

    // OAuth callback (no auth check needed)
    {
        path: '/auth/callback',
        element: <SuspenseWrapper><AuthCallbackPage /></SuspenseWrapper>,
    },
    // Protected routes (require authentication)
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    // ========================================
                    // DASHBOARD & QUICK ACTIONS
                    // ========================================
                    {
                        path: '/dashboard',
                        element: <DashboardPage />,
                    },

                    // Participants Management (formerly Pendaftaran)
                    {
                        path: '/dashboard/participants',
                        element: <PesertaPage />,
                    },
                    {
                        path: '/dashboard/participants/register/:category?',
                        element: <PesertaAddPage />,
                    },
                    {
                        path: '/dashboard/participants/:category/:id',
                        element: <PesertaDetailPage />,
                    },

                    // Pemeriksaan (formerly Posyandu/Kunjungan)
                    {
                        path: '/dashboard/examinations',
                        element: <PemeriksaanPage />,
                    },
                    {
                        path: '/dashboard/examinations/:category/:id',
                        element: <PemeriksaanAddPage />,
                    },

                    // Reports (formerly Laporan)
                    {
                        path: '/dashboard/reports',
                        element: <LaporanPage />,
                    },

                    // Complaints (formerly Pengaduan)
                    {
                        path: '/dashboard/complaints',
                        element: <PengaduanPage />,
                    },
                    {
                        path: '/dashboard/complaints/new',
                        element: <PengaduanAddPage />,
                    },
                    {
                        path: '/dashboard/complaints/:id',
                        element: <PengaduanDetailPage />,
                    },

                    // ========================================
                    // LEGACY REDIRECTS
                    // ========================================
                    {
                        path: '/dashboard/peserta',
                        element: <Navigate to="/dashboard/participants" replace />,
                    },
                    {
                        path: '/dashboard/peserta/:id',
                        element: <Navigate to="/dashboard/participants" replace />,
                    },
                    {
                        path: '/dashboard/pendaftaran',
                        element: <Navigate to="/dashboard/participants" replace />,
                    },
                    {
                        path: '/dashboard/kunjungan',
                        element: <Navigate to="/dashboard/examinations" replace />,
                    },
                    {
                        path: '/dashboard/kunjungan/baru',
                        element: <Navigate to="/dashboard/participants/register" replace />,
                    },
                    {
                        path: '/dashboard/kunjungan/:nik',
                        element: <Navigate to="/dashboard/examinations" replace />,
                    },
                    {
                        path: '/dashboard/posyandu',
                        element: <Navigate to="/dashboard/examinations" replace />,
                    },
                    {
                        path: '/dashboard/posyandu/:id',
                        element: <Navigate to="/dashboard/examinations" replace />,
                    },
                    {
                        path: '/dashboard/posyandu/baru',
                        element: <Navigate to="/dashboard/participants/register" replace />,
                    },
                    {
                        path: '/dashboard/pemeriksaan',
                        element: <Navigate to="/dashboard/examinations" replace />,
                    },
                    {
                        path: '/dashboard/laporan',
                        element: <Navigate to="/dashboard/reports" replace />,
                    },

                    // ========================================
                    // TOP-LEVEL PAGES (Navbar items)
                    // ========================================

                    // Settings (formerly Pengaturan Akun)
                    {
                        path: '/dashboard/settings',
                        element: <AccountSettingsPage />,
                    },

                    // ========================================
                    // LEGACY REDIRECTS (Indonesian paths)
                    // ========================================
                    {
                        path: '/dashboard/pengaduan',
                        element: <Navigate to="/dashboard/complaints" replace />,
                    },
                    {
                        path: '/dashboard/pengaduan/baru',
                        element: <Navigate to="/dashboard/complaints/new" replace />,
                    },
                    {
                        path: '/dashboard/pengaduan/:id',
                        element: <Navigate to="/dashboard/complaints" replace />,
                    },
                    {
                        path: '/dashboard/pengaturan',
                        element: <Navigate to="/dashboard/settings" replace />,
                    },
                    {
                        path: '/dashboard/profile',
                        element: <Navigate to="/dashboard/settings" replace />,
                    },
                    {
                        path: '/dashboard/password',
                        element: <Navigate to="/dashboard/settings" replace />,
                    },
                    {
                        path: '/dashboard/hapus-akun',
                        element: <Navigate to="/dashboard/settings" replace />,
                    },
                ],
            },
        ],
    },
]);
