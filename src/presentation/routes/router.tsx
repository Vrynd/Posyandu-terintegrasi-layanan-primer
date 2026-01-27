import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectedRoute, PublicRoute } from "./protected_route";

// Lazy loaded - Halaman Auth
const LoginPage = lazy(() =>
  import("../pages/login_page").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("../pages/register_page").then((m) => ({ default: m.RegisterPage })),
);

// Lazy loaded - Halaman Dashboard
const DashboardPage = lazy(() =>
  import("../pages/dashboard_page").then((m) => ({
    default: m.DashboardPage,
  })),
);
const ParticipantPage = lazy(() =>
  import("../pages/participant_page").then((m) => ({
    default: m.ParticipantPage,
  })),
);
const AddParticipantPage = lazy(() =>
  import("../pages/add_participant_page").then((m) => ({
    default: m.AddParticipantPage,
  })),
);
const DetailParticipantPage = lazy(() =>
  import("../pages/detail_participant_page").then((m) => ({
    default: m.DetailParticipantPage,
  })),
);
const ExaminationPage = lazy(() =>
  import("../pages/examination_page").then((m) => ({
    default: m.ExaminationPage,
  })),
);
const AddExaminationPage = lazy(() =>
  import("../pages/add_examination_page").then((m) => ({
    default: m.AddExaminationPage,
  })),
);
const ReportPage = lazy(() =>
  import("../pages/report_page").then((m) => ({
    default: m.ReportPage,
  })),
);
const ComplaintPage = lazy(() =>
  import("../pages/complaint_page").then((m) => ({
    default: m.ComplaintPage,
  })),
);
const AddComplaintPage = lazy(() =>
  import("../pages/add_complaint_page").then((m) => ({
    default: m.AddComplaintPage,
  })),
);
const DetailComplaintPage = lazy(() =>
  import("../pages/detail_complaint_page").then((m) => ({
    default: m.DetailComplaintPage,
  })),
);
const AccountSettingsPage = lazy(() =>
  import("../pages/account_settings_page").then((m) => ({
    default: m.AccountSettingsPage,
  })),
);

// Konfigurasi route aplikasi
export const router = createBrowserRouter([
  // Redirect root
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Route publik (login, register) dengan AuthLayout
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
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
            path: "/dashboard",
            element: <DashboardPage />,
          },

          // Manajemen Peserta
          {
            path: "/dashboard/participants",
            element: <ParticipantPage />,
          },
          {
            path: "/dashboard/participants/register/:category?",
            element: <AddParticipantPage />,
          },
          {
            path: "/dashboard/participants/:category/:id",
            element: <DetailParticipantPage />,
          },

          // Pemeriksaan
          {
            path: "/dashboard/examinations",
            element: <ExaminationPage />,
          },
          {
            path: "/dashboard/examinations/:category/:id",
            element: <AddExaminationPage />,
          },

          // Laporan
          {
            path: "/dashboard/reports",
            element: <ReportPage />,
          },

          // Pengaduan
          {
            path: "/dashboard/complaints",
            element: <ComplaintPage />,
          },
          {
            path: "/dashboard/complaints/new",
            element: <AddComplaintPage />,
          },
          {
            path: "/dashboard/complaints/:id",
            element: <DetailComplaintPage />,
          },

          // Pengaturan
          {
            path: "/dashboard/settings",
            element: <AccountSettingsPage />,
          },
        ],
      },
    ],
  },
]);
