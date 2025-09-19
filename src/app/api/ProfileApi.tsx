import api, { ApiResponse } from "@/app/api/Api";
import { User } from "@/types";

export function getProfile(): Promise<ApiResponse<User>> {
  return api.get("/v1/auth/profile");
}

export function uploadProfileApi(uuid: string, data: FormData): Promise<ApiResponse<User>> {
  return api.post(`/v1/users/${uuid}/profile-image`, data)
}

export function uploadSignatureApi(uuid: string, data: FormData): Promise<ApiResponse<User>> {
  return api.post(`/v1/users/${uuid}/signature-image?signatureType=signature`, data)
}

export function deleteSignature(uuid: string): Promise<ApiResponse> {
  return api.delete(`/v1/users/${uuid}/signature-image`)
}

export function resetProfileImage(uuid: string): Promise<ApiResponse> {
  return api.post(`/v1/users/${uuid}/profile-image/reset-to-default`)
}
