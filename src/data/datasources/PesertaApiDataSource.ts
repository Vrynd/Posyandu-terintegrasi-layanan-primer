// Peserta API Datasource, Menangani semua panggilan API terkait peserta

import api from "../core/api";
import type {
  ApiResponse,
  CreatePesertaRequest,
  PesertaDetail,
  PesertaListResponse,
  GetPesertaParams,
  PesertaSummaryResponse,
  GetPesertaSummaryParams,
  BulkDeleteRequest,
  BulkDeleteResponse,
} from "../models/PesertaApiTypes";
import type { PemeriksaanDetail } from "../models/PemeriksaanApiTypes";

// Kelas datasource untuk modul peserta
export class PesertaApiDataSource {
  // Mengambil daftar peserta dengan filter opsional
  async getPeserta(
    params?: GetPesertaParams,
  ): Promise<ApiResponse<PesertaListResponse>> {
    const response = await api.get<ApiResponse<PesertaListResponse>>(
      "/peserta",
      { params },
    );
    return response.data;
  }

  // Mengambil ringkasan peserta dengan dukungan ETag caching
  async getSummary(
    params?: GetPesertaSummaryParams,
    etag?: string,
  ): Promise<{
    data: ApiResponse<PesertaSummaryResponse>;
    etag?: string;
    notModified: boolean;
  }> {
    const headers: Record<string, string> = {};
    if (etag) {
      headers["If-None-Match"] = etag;
    }

    try {
      const response = await api.get<ApiResponse<PesertaSummaryResponse>>(
        "/peserta/summary",
        {
          params,
          headers,
          validateStatus: (status) => status === 200 || status === 304,
        },
      );

      if (response.status === 304) {
        return {
          data: { success: true },
          notModified: true,
        };
      }

      return {
        data: response.data,
        etag: response.headers["etag"] as string | undefined,
        notModified: false,
      };
    } catch {
      const response = await api.get<ApiResponse<PesertaSummaryResponse>>(
        "/peserta/summary",
        { params },
      );
      return { data: response.data, notModified: false };
    }
  }

  // Mengambil detail peserta berdasarkan ID
  async getPesertaById(id: number): Promise<ApiResponse<PesertaDetail>> {
    const response = await api.get<ApiResponse<PesertaDetail>>(
      `/peserta/${id}`,
    );
    return response.data;
  }

  // Membuat peserta baru
  async createPeserta(
    data: CreatePesertaRequest,
  ): Promise<ApiResponse<PesertaDetail>> {
    const response = await api.post<ApiResponse<PesertaDetail>>(
      "/peserta",
      data,
    );
    return response.data;
  }

  // Mengupdate peserta
  async updatePeserta(
    id: number,
    data: Partial<CreatePesertaRequest>,
  ): Promise<ApiResponse<PesertaDetail>> {
    const response = await api.put<ApiResponse<PesertaDetail>>(
      `/peserta/${id}`,
      data,
    );
    return response.data;
  }

  // Menghapus peserta
  async deletePeserta(
    id: number,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    const response = await api.delete<
      ApiResponse<{ success: boolean; message: string }>
    >(`/peserta/${id}`);
    return response.data;
  }

  // Menghapus banyak peserta sekaligus
  async bulkDelete(
    request: BulkDeleteRequest,
  ): Promise<ApiResponse<BulkDeleteResponse>> {
    const response = await api.delete<ApiResponse<BulkDeleteResponse>>(
      "/peserta/bulk",
      {
        data: request,
      },
    );
    return response.data;
  }

  // Mengambil kunjungan terakhir peserta
  async getLatestVisit(
    id: number,
  ): Promise<ApiResponse<PemeriksaanDetail | null>> {
    const response = await api.get<ApiResponse<PemeriksaanDetail | null>>(
      `/peserta/${id}/latest-visit`,
    );
    return response.data;
  }
}

// Instance singleton
export const pesertaApiDataSource = new PesertaApiDataSource();
