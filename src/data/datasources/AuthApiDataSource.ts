// Auth API Datasource, Menangani semua panggilan API terkait autentikasi
import api from "../core/api";
import type {
  ApiResponse,
  AuthData,
  LoginParams,
  RegisterParams,
  User,
  UpdateProfileParams,
} from "../../domain/entities/User";

// Datasource untuk modul autentikasi
export class AuthApiDataSource {
  // Login user dengan identifier (email/NIK) dan password
  async login(params: LoginParams): Promise<ApiResponse<AuthData>> {
    const response = await api.post<ApiResponse<AuthData>>("/login", params);
    return response.data;
  }

  // Registrasi user baru
  async register(params: RegisterParams): Promise<ApiResponse<AuthData>> {
    const response = await api.post<ApiResponse<AuthData>>("/register", params);
    return response.data;
  }

  // Logout user yang sedang aktif
  async logout(): Promise<void> {
    await api.post("/logout");
  }

  // Mengambil profil user yang sedang login
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get<ApiResponse<{ user: User }>>("/profile");
    return response.data;
  }

  // Memperbarui data profil user
  async updateProfile(
    params: UpdateProfileParams,
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put<ApiResponse<{ user: User }>>(
      "/profile",
      params,
    );
    return response.data;
  }

  // Mengubah password user yang sedang login
  async changePassword(
    params: UpdateProfileParams,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    const response = await api.put<
      ApiResponse<{ success: boolean; message: string }>
    >("/profile/password", params);
    return response.data;
  }

  // Menghapus akun user yang sedang login
  async deleteAccount(
    confirmation: string,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    const response = await api.delete<
      ApiResponse<{ success: boolean; message: string }>
    >("/profile", {
      data: { confirmation },
    });
    return response.data;
  }
}

// Instance singleton
export const authApiDataSource = new AuthApiDataSource();
