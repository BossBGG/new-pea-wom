import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {showError} from "@/app/helpers/Alert";
import {store} from "@/app/redux/store";
import {refreshTokenApi} from "@/app/api/LoginApi";
import {clearToken, setToken} from "@/app/redux/slices/AuthSlice";
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

export const refreshApi = axios.create({
  baseURL: window.__ENV__?.NEXT_PUBLIC_APP_API_BASE_URL || "/api",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = store.getState().auth.token || null;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

refreshApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
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
        return clearAuthAndLogout(error)
      }

      try {
        console.log('try to refreshToken >>>>')
        const refreshToken = await refreshApi.post("/v1/auth/refresh-token");
        console.log('refreshToken >>>>', refreshToken);
        if(refreshToken.status === 401 || refreshToken.status === 429) {
          return clearAuthAndLogout(error)
        }else {
          const newAccessToken = refreshToken.data?.api_token;
          console.log('newAccessToken >>> ', newAccessToken);
          if (!newAccessToken) {
            return clearAuthAndLogout(error)
          }

          store.dispatch(setToken(newAccessToken));
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError: any) {
        console.log('catch refreshToken >>>>', refreshError);
        if (refreshError.response) {
          const status = refreshError.response.status;
          console.log('refresh token failed with status >>>', status);

          if (status === 401 || status === 429) {
            return clearAuthAndLogout(error);
          }
        }

        return clearAuthAndLogout(refreshError);
      }
    }
    showError(error.message || '')
    return Promise.reject(error);
  }
);

const clearAuthAndLogout = (error: any) => {
  console.log('clearAuthAndLogout')
  store.dispatch(clearToken());
  store.dispatch(clearUserProfile());
  window.location.href = "/login"
  return Promise.reject(error);
}

export default api;
