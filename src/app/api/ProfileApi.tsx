import api, { ApiResponse } from "@/app/api/Api";
import { User } from "@/types";

export function getProfile(): Promise<ApiResponse<User>> {
  return api.get("/v1/auth/profile");
}
