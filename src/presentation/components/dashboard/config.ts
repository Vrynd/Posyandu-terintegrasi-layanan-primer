import {
  Heart,
  Baby,
  GraduationCap,
  Briefcase,
  PersonStanding,
  Users,
  ClipboardPlus,
  FileText,
  Bug,
  Search,
  Stethoscope,
  Lightbulb,
  Save,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TargetService {
  id: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  chartColor: string;
}

export const TARGET_SERVICES: TargetService[] = [
  {
    id: "bumil",
    label: "Ibu Hamil",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    chartColor: "#ec4899",
  },
  {
    id: "balita",
    label: "Bayi & Balita",
    icon: Baby,
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    chartColor: "#3b82f6",
  },
  {
    id: "remaja",
    label: "Anak & Remaja",
    icon: GraduationCap,
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    chartColor: "#f97316",
  },
  {
    id: "produktif",
    label: "Usia Produktif",
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    chartColor: "#10b981",
  },
  {
    id: "lansia",
    label: "Lansia",
    icon: PersonStanding,
    gradient: "from-purple-500 to-violet-500",
    iconBg: "bg-white/20 backdrop-blur-sm",
    iconColor: "text-white",
    chartColor: "#8b5cf6",
  },
];

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export const DASHBOARD_YEAR = 2026;

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  bgGradient: string;
  route?: string;
  comingSoon?: boolean;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "pendaftaran",
    label: "Pendaftaran",
    description: "Daftarkan & kelola data peserta",
    icon: Users,
    bgGradient: "from-blue-500 to-indigo-600",
    route: "/dashboard/participants",
    comingSoon: false,
  },
  {
    id: "pemeriksaan",
    label: "Pemeriksaan",
    description: "Buat & kelola data pemeriksaan",
    icon: ClipboardPlus,
    bgGradient: "from-emerald-500 to-teal-600",
    route: "/dashboard/examinations",
    comingSoon: false,
  },
  {
    id: "laporan",
    label: "Laporan",
    description: "Lihat & unduh laporan kegiatan",
    icon: FileText,
    bgGradient: "from-rose-500 to-pink-600",
    route: "/dashboard/reports",
    comingSoon: false,
  },
  {
    id: "pengaduan",
    label: "Pengaduan",
    description: "Laporkan bug atau masalah sistem",
    icon: Bug,
    bgGradient: "from-amber-500 to-orange-600",
    route: "/dashboard/complaints",
    comingSoon: true,
  },
];

export interface FlowStep {
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const SYSTEM_FLOW_STEPS: FlowStep[] = [
  {
    title: "Pendaftaran",
    desc: "Cari NIK atau tambah data peserta baru di sistem.",
    icon: Search,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Pemeriksaan",
    desc: "Input data kesehatan sesuai kategori (Bumil, Balita, dll).",
    icon: Stethoscope,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Intervensi",
    desc: "Berikan edukasi atau rujukan berdasarkan hasil skrining.",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Selesai",
    desc: "Data tersimpan otomatis & siap disinkronkan ke pusat.",
    icon: Save,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];
