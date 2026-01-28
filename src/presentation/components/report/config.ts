import {
  type LucideIcon,
  Users,
  Activity,
  MapPin,
  TrendingUp,
} from "lucide-react";

export const MONTH_NAMES_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export interface StatConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const STAT_ITEMS_CONFIG: StatConfig[] = [
  {
    id: "totalPeserta",
    label: "Total Peserta",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "totalKunjungan",
    label: "Pemeriksaan Tercatat",
    icon: Activity,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: "location",
    label: "Lokasi Pemeriksaan",
    icon: MapPin,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "topKategori",
    label: "Kategori Terbanyak",
    icon: TrendingUp,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];
