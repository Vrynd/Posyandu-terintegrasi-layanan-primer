// Pemeriksaan API Datasource, Menangani semua panggilan API terkait pemeriksaan/kunjungan

import api from "../core/api";
import type {
  PemeriksaanListResponse,
  CreatePemeriksaanRequest,
  PemeriksaanDetail,
  GetPemeriksaanParams,
} from "../models/PemeriksaanApiTypes";
import type { ApiResponse } from "../models/PesertaApiTypes";

// Kelas datasource untuk modul pemeriksaan/kunjungan
export class PemeriksaanApiDataSource {
  // Mengambil daftar pemeriksaan dengan filter opsional
  async getPemeriksaan(
    params?: GetPemeriksaanParams,
  ): Promise<ApiResponse<PemeriksaanListResponse>> {
    const response = await api.get<ApiResponse<PemeriksaanListResponse>>(
      "/kunjungan",
      { params },
    );
    return response.data;
  }

  // Mengambil detail pemeriksaan berdasarkan ID
  async getPemeriksaanDetail(
    id: number | string,
  ): Promise<ApiResponse<PemeriksaanDetail>> {
    const response = await api.get<ApiResponse<PemeriksaanDetail>>(
      `/kunjungan/${id}`,
    );
    return response.data;
  }

  // Membuat record pemeriksaan baru
  async createPemeriksaan(
    request: CreatePemeriksaanRequest,
  ): Promise<ApiResponse<PemeriksaanDetail>> {
    const response = await api.post<ApiResponse<PemeriksaanDetail>>(
      "/kunjungan",
      request,
    );
    return response.data;
  }

  // Menghapus record pemeriksaan
  async deletePemeriksaan(id: number | string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/kunjungan/${id}`);
    return response.data;
  }
}

// Instance singleton
export const pemeriksaanApiDataSource = new PemeriksaanApiDataSource();

// Alias untuk backward compatibility
export const kunjunganApiDataSource = pemeriksaanApiDataSource;
