// Pengaduan API Datasource, Menangani semua panggilan API terkait pengaduan/keluhan

import api from "../core/api";
import type { ApiResponse } from "../../domain/entities/User";
import type {
  Pengaduan,
  PengaduanDetail,
  PengaduanStats,
  CreatePengaduanParams,
  CreateResponseParams,
  PengaduanFilterParams,
  PaginatedPengaduan,
  PengaduanStatus,
} from "../../domain/entities/Pengaduan";

// Struktur response API untuk endpoint list
interface ListApiResponse {
  data: Pengaduan[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
  };
}

// Kelas datasource untuk modul pengaduan
export class PengaduanApiDataSource {
    
  // Mengambil daftar pengaduan dengan pagination dan filter berdasarkan role
  async getList(
    params?: PengaduanFilterParams,
  ): Promise<ApiResponse<PaginatedPengaduan>> {
    const response = await api.get<ListApiResponse>("/pengaduan", { params });

    const { data, meta } = response.data;
    const lastPage = Math.ceil(meta.total / meta.per_page) || 1;

    return {
      success: true,
      message: "Success",
      data: {
        data: data,
        current_page: meta.current_page,
        last_page: lastPage,
        per_page: meta.per_page,
        total: meta.total,
      },
    };
  }

  // Mengambil detail pengaduan beserta respons
  async getDetail(id: number): Promise<ApiResponse<PengaduanDetail>> {
    const response = await api.get<{ data: PengaduanDetail }>(
      `/pengaduan/${id}`,
    );
    return {
      success: true,
      message: "Success",
      data: response.data.data,
    };
  }

  // Membuat pengaduan baru dengan dukungan upload file
  async create(
    params: CreatePengaduanParams,
  ): Promise<ApiResponse<{ id: number }>> {
    const formData = new FormData();
    formData.append("kategori", params.kategori);
    formData.append("prioritas", params.prioritas);
    formData.append("judul", params.judul);
    formData.append("deskripsi", params.deskripsi);
    if (params.langkah_reproduksi) {
      formData.append("langkah_reproduksi", params.langkah_reproduksi);
    }
    if (params.browser_info) {
      formData.append("browser_info", params.browser_info);
    }
    if (params.images) {
      params.images.forEach((file) => {
        formData.append("images[]", file);
      });
    }

    const response = await api.post<{ success: boolean; data: { id: number } }>(
      "/pengaduan",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return {
      success: response.data.success,
      message: "Pengaduan berhasil dikirim",
      data: response.data.data,
    };
  }

  // Mengupdate status pengaduan
  async updateStatus(
    id: number,
    status: PengaduanStatus,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.put<{ success: boolean; message: string }>(
        `/pengaduan/${id}/status`,
        { status },
      );
      return {
        success: response.data.success,
        message: response.data.message,
        data: { message: response.data.message },
      };
    } catch (error: unknown) {
      console.error("Update status API error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        throw new Error(
          axiosError.response?.data?.message || "Gagal mengubah status",
        );
      }
      throw error;
    }
  }

  // Menambahkan respons ke pengaduan
  async addResponse(
    params: CreateResponseParams,
  ): Promise<ApiResponse<{ id: number }>> {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: { id: number };
    }>(`/pengaduan/${params.pengaduan_id}/response`, {
      response: params.response,
    });
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  }

  // Menghapus pengaduan
  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/pengaduan/${id}`,
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: { message: response.data.message },
    };
  }

  // Mengambil statistik pengaduan
  async getStats(): Promise<ApiResponse<PengaduanStats>> {
    try {
      const response = await api.get<
        { success?: boolean; data?: PengaduanStats } | PengaduanStats
      >("/pengaduan/stats");
      let statsData: PengaduanStats;

      if (response.data && "data" in response.data && response.data.data) {
        statsData = response.data.data;
      } else if (response.data && "pending" in response.data) {
        statsData = response.data as PengaduanStats;
      } else {
        console.warn("Struktur response stats tidak sesuai:", response.data);
        statsData = {
          pending: 0,
          in_progress: 0,
          resolved: 0,
          rejected: 0,
          total: 0,
        };
      }

      return {
        success: true,
        message: "Success",
        data: statsData,
      };
    } catch (error) {
      console.error("Gagal fetch stats:", error);
      return {
        success: true,
        message: "Tidak ada stats tersedia",
        data: {
          pending: 0,
          in_progress: 0,
          resolved: 0,
          rejected: 0,
          total: 0,
        },
      };
    }
  }
}

// Instance singleton
export const pengaduanApiDataSource = new PengaduanApiDataSource();
