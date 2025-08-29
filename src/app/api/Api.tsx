import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {dismissAlert} from "@/app/helpers/Alert";
import {store} from "@/app/redux/store";
import {refreshTokenApi} from "@/app/api/LoginApi";
import {clearToken, setToken} from "@/app/redux/slices/AuthSlice";
import {router} from "next/client";
import {clearUserProfile} from "@/app/redux/slices/UserSlice";
// import {setLoading} from "@/app/redux/slices/LoadingSlice";

export type ApiResponse<T = null> = AxiosResponse<BaseApiResponse<T>>;

interface BaseApiResponse<T> {
  status_code: number;
  message: string;
  data: T | null;
  error?: Array<string>;
}

const api: AxiosInstance = axios.create({
  baseURL: window.__ENV__?.NEXT_PUBLIC_APP_API_BASE_URL || "/api",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // store.dispatch(setLoading(true));
    // console.log('request >>>>>> ', store.getState().loading)
    const accessToken = store.getState().auth.token || null;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = store.getState().auth.token;
      if (!token) {
        return await clearAuthAndLogout(error)
      }

      try {
        const refreshToken = await refreshTokenApi();
        if(refreshToken.status === 401) {
          return await clearAuthAndLogout(error)
        }

        const newAccessToken = refreshToken.data?.api_token;
        if (!newAccessToken) {
          return await clearAuthAndLogout(error)
        }

        store.dispatch(setToken(newAccessToken));
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        return await clearAuthAndLogout(refreshError)
      }
    }
    dismissAlert();
    return Promise.reject(error);
  }
);

const clearAuthAndLogout = (error: any) => {
  store.dispatch(clearToken());
  store.dispatch(clearUserProfile());
  router.push("/login");
  return Promise.reject(error);
}

export default api;
