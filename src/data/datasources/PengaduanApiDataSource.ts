/**
 * Pengaduan API Datasource
 * Handles API calls for pengaduan/complaints feature
 * Currently uses mock data - switch to real API when backend is ready
 */

import api from '../core/api';
import type { ApiResponse } from '../../domain/entities/User';
import type {
    Pengaduan,
    PengaduanDetail,
    PengaduanStats,
    PengaduanNotification,
    CreatePengaduanParams,
    CreateResponseParams,
    PengaduanFilterParams,
    PaginatedPengaduan,
    PengaduanStatus,
} from '../../domain/entities/Pengaduan';

// Flag to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true;

// Mock data for development
const MOCK_PENGADUAN: Pengaduan[] = [
    {
        id: 1,
        user_id: 2,
        user: { id: 2, name: 'Kader Siti', email: 'siti@posyandu.id' },
        kategori: 'error',
        prioritas: 'tinggi',
        judul: 'Tidak bisa menyimpan data kunjungan',
        deskripsi: 'Ketika saya mencoba menyimpan data kunjungan balita, muncul error dan data tidak tersimpan.',
        langkah_reproduksi: '1. Buka halaman pemeriksaan\n2. Pilih peserta\n3. Isi form\n4. Klik simpan\n5. Muncul error',
        browser_info: 'Mozilla/5.0 Chrome/120',
        status: 'pending',
        images: [],
        responses_count: 0,
        created_at: '2026-01-06T08:00:00Z',
        updated_at: '2026-01-06T08:00:00Z',
    },
    {
        id: 2,
        user_id: 3,
        user: { id: 3, name: 'Kader Rina', email: 'rina@posyandu.id' },
        kategori: 'tampilan',
        prioritas: 'sedang',
        judul: 'Tabel tidak responsive di HP',
        deskripsi: 'Tabel data peserta tidak bisa di-scroll horizontal di HP, sehingga kolom kanan tidak terlihat.',
        status: 'in_progress',
        images: [],
        responses_count: 1,
        created_at: '2026-01-05T14:30:00Z',
        updated_at: '2026-01-05T16:00:00Z',
    },
    {
        id: 3,
        user_id: 2,
        user: { id: 2, name: 'Kader Siti', email: 'siti@posyandu.id' },
        kategori: 'data',
        prioritas: 'rendah',
        judul: 'Typo di label form',
        deskripsi: 'Ada typo "Berat Bdaan" seharusnya "Berat Badan" di form pemeriksaan balita.',
        status: 'resolved',
        images: [],
        responses_count: 2,
        created_at: '2026-01-04T10:00:00Z',
        updated_at: '2026-01-05T09:00:00Z',
    },
];

const MOCK_RESPONSES = [
    {
        id: 1,
        pengaduan_id: 2,
        admin_id: 1,
        admin: { id: 1, name: 'Admin', email: 'admin@posyandu.id' },
        response: 'Terima kasih atas laporannya. Kami sedang memperbaiki masalah ini.',
        created_at: '2026-01-05T16:00:00Z',
    },
    {
        id: 2,
        pengaduan_id: 3,
        admin_id: 1,
        admin: { id: 1, name: 'Admin', email: 'admin@posyandu.id' },
        response: 'Kami telah menemukan typo tersebut.',
        created_at: '2026-01-05T08:00:00Z',
    },
    {
        id: 3,
        pengaduan_id: 3,
        admin_id: 1,
        admin: { id: 1, name: 'Admin', email: 'admin@posyandu.id' },
        response: 'Typo sudah diperbaiki. Terima kasih atas laporannya!',
        created_at: '2026-01-05T09:00:00Z',
    },
];

export class PengaduanApiDataSource {
    /**
     * Get list of pengaduan (filtered by role on backend)
     * Kader: only own complaints, Admin: all complaints
     */
    async getList(params?: PengaduanFilterParams): Promise<ApiResponse<PaginatedPengaduan>> {
        if (USE_MOCK_DATA) {
            let filtered = [...MOCK_PENGADUAN];
            
            // Apply filters
            if (params?.status) {
                filtered = filtered.filter(p => p.status === params.status);
            }
            if (params?.kategori) {
                filtered = filtered.filter(p => p.kategori === params.kategori);
            }
            if (params?.search) {
                const search = params.search.toLowerCase();
                filtered = filtered.filter(p => 
                    p.judul.toLowerCase().includes(search) || 
                    p.deskripsi.toLowerCase().includes(search)
                );
            }

            return {
                success: true,
                message: 'Success',
                data: {
                    data: filtered,
                    current_page: params?.page || 1,
                    last_page: 1,
                    per_page: params?.per_page || 10,
                    total: filtered.length,
                },
            };
        }

        const response = await api.get<ApiResponse<PaginatedPengaduan>>('/pengaduan', { params });
        return response.data;
    }

    /**
     * Get pengaduan detail with responses
     */
    async getDetail(id: number): Promise<ApiResponse<PengaduanDetail>> {
        if (USE_MOCK_DATA) {
            const pengaduan = MOCK_PENGADUAN.find(p => p.id === id);
            if (!pengaduan) {
                throw new Error('Pengaduan tidak ditemukan');
            }
            
            const responses = MOCK_RESPONSES.filter(r => r.pengaduan_id === id);
            
            return {
                success: true,
                message: 'Success',
                data: { ...pengaduan, responses },
            };
        }

        const response = await api.get<ApiResponse<PengaduanDetail>>(`/pengaduan/${id}`);
        return response.data;
    }

    /**
     * Create new pengaduan (Kader only)
     */
    async create(params: CreatePengaduanParams): Promise<ApiResponse<Pengaduan>> {
        if (USE_MOCK_DATA) {
            const newPengaduan: Pengaduan = {
                id: MOCK_PENGADUAN.length + 1,
                user_id: 2, // Mock user
                kategori: params.kategori,
                prioritas: params.prioritas,
                judul: params.judul,
                deskripsi: params.deskripsi,
                langkah_reproduksi: params.langkah_reproduksi,
                browser_info: params.browser_info,
                status: 'pending',
                images: [],
                responses_count: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            
            MOCK_PENGADUAN.unshift(newPengaduan);
            
            return {
                success: true,
                message: 'Pengaduan berhasil dikirim',
                data: newPengaduan,
            };
        }

        // Use FormData for file upload
        const formData = new FormData();
        formData.append('kategori', params.kategori);
        formData.append('prioritas', params.prioritas);
        formData.append('judul', params.judul);
        formData.append('deskripsi', params.deskripsi);
        if (params.langkah_reproduksi) {
            formData.append('langkah_reproduksi', params.langkah_reproduksi);
        }
        if (params.browser_info) {
            formData.append('browser_info', params.browser_info);
        }
        if (params.images) {
            params.images.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });
        }

        const response = await api.post<ApiResponse<Pengaduan>>('/pengaduan', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    /**
     * Update pengaduan status (Admin only)
     */
    async updateStatus(id: number, status: PengaduanStatus): Promise<ApiResponse<Pengaduan>> {
        if (USE_MOCK_DATA) {
            const pengaduan = MOCK_PENGADUAN.find(p => p.id === id);
            if (!pengaduan) {
                throw new Error('Pengaduan tidak ditemukan');
            }
            
            pengaduan.status = status;
            pengaduan.updated_at = new Date().toISOString();
            
            return {
                success: true,
                message: 'Status berhasil diperbarui',
                data: pengaduan,
            };
        }

        const response = await api.put<ApiResponse<Pengaduan>>(`/pengaduan/${id}/status`, { status });
        return response.data;
    }

    /**
     * Add response to pengaduan (Admin only)
     */
    async addResponse(params: CreateResponseParams): Promise<ApiResponse<{ message: string }>> {
        if (USE_MOCK_DATA) {
            const pengaduan = MOCK_PENGADUAN.find(p => p.id === params.pengaduan_id);
            if (!pengaduan) {
                throw new Error('Pengaduan tidak ditemukan');
            }
            
            MOCK_RESPONSES.push({
                id: MOCK_RESPONSES.length + 1,
                pengaduan_id: params.pengaduan_id,
                admin_id: 1,
                admin: { id: 1, name: 'Admin', email: 'admin@posyandu.id' },
                response: params.response,
                created_at: new Date().toISOString(),
            });
            
            pengaduan.responses_count += 1;
            
            return {
                success: true,
                message: 'Respon berhasil ditambahkan',
                data: { message: 'Respon berhasil ditambahkan' },
            };
        }

        const response = await api.post<ApiResponse<{ message: string }>>(
            `/pengaduan/${params.pengaduan_id}/response`,
            { response: params.response }
        );
        return response.data;
    }

    /**
     * Delete pengaduan (soft delete)
     */
    async delete(id: number): Promise<ApiResponse<{ message: string }>> {
        if (USE_MOCK_DATA) {
            const index = MOCK_PENGADUAN.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error('Pengaduan tidak ditemukan');
            }
            
            MOCK_PENGADUAN.splice(index, 1);
            
            return {
                success: true,
                message: 'Pengaduan berhasil dihapus',
                data: { message: 'Pengaduan berhasil dihapus' },
            };
        }

        const response = await api.delete<ApiResponse<{ message: string }>>(`/pengaduan/${id}`);
        return response.data;
    }

    /**
     * Get statistics (Admin only)
     */
    async getStats(): Promise<ApiResponse<PengaduanStats>> {
        if (USE_MOCK_DATA) {
            const stats: PengaduanStats = {
                pending: MOCK_PENGADUAN.filter(p => p.status === 'pending').length,
                in_progress: MOCK_PENGADUAN.filter(p => p.status === 'in_progress').length,
                resolved: MOCK_PENGADUAN.filter(p => p.status === 'resolved').length,
                rejected: MOCK_PENGADUAN.filter(p => p.status === 'rejected').length,
                total: MOCK_PENGADUAN.length,
            };
            
            return {
                success: true,
                message: 'Success',
                data: stats,
            };
        }

        const response = await api.get<ApiResponse<PengaduanStats>>('/pengaduan/stats');
        return response.data;
    }

    /**
     * Get notifications for banner
     */
    async getNotifications(role: 'admin' | 'kader', userId?: number): Promise<ApiResponse<PengaduanNotification>> {
        if (USE_MOCK_DATA) {
            if (role === 'admin') {
                const pendingCount = MOCK_PENGADUAN.filter(p => p.status === 'pending').length;
                return {
                    success: true,
                    message: 'Success',
                    data: {
                        new_count: pendingCount,
                        message: pendingCount > 0 
                            ? `Ada ${pendingCount} pengaduan baru menunggu review`
                            : undefined,
                    },
                };
            } else {
                // Kader: show recently resolved complaints
                const resolved = MOCK_PENGADUAN
                    .filter(p => p.status === 'resolved' && p.user_id === userId)
                    .map(p => ({
                        id: p.id,
                        judul: p.judul,
                        resolved_at: p.updated_at,
                    }));
                
                return {
                    success: true,
                    message: 'Success',
                    data: { resolved },
                };
            }
        }

        const response = await api.get<ApiResponse<PengaduanNotification>>('/pengaduan/notifications');
        return response.data;
    }
}

// Singleton instance
export const pengaduanApiDataSource = new PengaduanApiDataSource();
