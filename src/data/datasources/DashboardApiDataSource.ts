// Dashboard API Datasource, Menangani semua panggilan API terkait dashboard

import api from "../core/api";
import type {
  DashboardStatsResponse,
  DashboardChartResponse,
  DashboardRegistrationResponse,
} from "../models/DashboardApiTypes";

// Kelas datasource untuk modul dashboard
export class DashboardApiDataSource {
  // Mengambil statistik dashboard (total peserta, kunjungan hari ini, kategori)
  async getStats(): Promise<DashboardStatsResponse> {
    const response = await api.get<DashboardStatsResponse>("/dashboard/stats");
    return response.data;
  }

  // Mengambil data chart kunjungan per bulan
  async getChartData(year?: number): Promise<DashboardChartResponse> {
    const params = year ? { year } : {};
    const response = await api.get<DashboardChartResponse>("/dashboard/chart", {
      params,
    });
    return response.data;
  }

  // Mengambil data chart pendaftaran peserta baru per bulan
  async getRegistrationChartData(
    year?: number,
  ): Promise<DashboardRegistrationResponse> {
    const params = year ? { year } : {};
    const response = await api.get<DashboardRegistrationResponse>(
      "/dashboard/registrations-chart",
      { params },
    );
    return response.data;
  }
}

// Instance singleton
export const dashboardApiDataSource = new DashboardApiDataSource();
