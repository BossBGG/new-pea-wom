import api, {ApiResponse} from "@/app/api/Api";
import {DashboardObj} from "@/types";

export const getDashboardData =
  (year: string, view: "SELF" | "ALL" = "ALL"): Promise<ApiResponse<DashboardObj>> => {
    return api.get(`/v1/dashboard?year=${year}&view=${view.toLowerCase()}`);
  }
