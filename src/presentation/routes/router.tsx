import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layouts/AppLayout';
import { LoginSuspenseWrapper } from './login_suspense';
import { ProtectedRoute, PublicRoute } from './protected_route';

// Lazy loaded - Halaman Auth
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));

// Lazy loaded - Halaman Dashboard
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

// Konfigurasi route aplikasi
export const router = createBrowserRouter([
    // Redirect root
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },

    // Route publik (login, register)
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

    // Route terproteksi (memerlukan autentikasi)
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    // Dashboard & Aksi Cepat
                    {
                        path: '/dashboard',
                        element: <DashboardPage />,
                    },

                    // Manajemen Peserta
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

                    // Pemeriksaan
                    {
                        path: '/dashboard/examinations',
                        element: <PemeriksaanPage />,
                    },
                    {
                        path: '/dashboard/examinations/:category/:id',
                        element: <PemeriksaanAddPage />,
                    },

                    // Laporan
                    {
                        path: '/dashboard/reports',
                        element: <LaporanPage />,
                    },

                    // Pengaduan
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

                    // Pengaturan
                    {
                        path: '/dashboard/settings',
                        element: <AccountSettingsPage />,
                    },
                ],
            },
        ],
    },
]);
