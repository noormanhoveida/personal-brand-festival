import { apiClient } from "./client";
import { Role } from "../features/auth/authSlice";

interface AuthResponse {
  accessToken: string;
  role: Role;
}

export async function login(identifier: string, password: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", {
    identifier,
    password,
  });
  return data;
}

export async function register(input: { email?: string; phone?: string; password: string }) {
  const { data } = await apiClient.post<{ message: string; email?: string; phone?: string; channel: "email" | "phone" }>("/auth/register", input);
  return data;
}

export async function verifyEmail(email: string, code: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/verify-email", { email, code });
  return data;
}

export async function verifyPhone(phone: string, code: string) {
  const { data } = await apiClient.post<AuthResponse>("/auth/verify-phone", { phone, code });
  return data;
}

export async function resendVerification(email: string) {
  const { data } = await apiClient.post<{ message: string }>("/auth/resend-verification", { email });
  return data;
}

export async function resendPhoneVerification(phone: string) {
  const { data } = await apiClient.post<{ message: string }>("/auth/resend-phone-verification", { phone });
  return data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export async function forgotPassword(email: string) {
  const { data } = await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(input: { email: string; code: string; newPassword: string }) {
  const { data } = await apiClient.post<{ message: string }>("/auth/reset-password", input);
  return data;
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  const { data } = await apiClient.post<{ message: string }>("/auth/change-password", input);
  return data;
}
