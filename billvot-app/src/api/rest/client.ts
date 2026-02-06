import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export type ApiResponse<T> = {
  success: boolean;
  result: T;
  message?: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  code?: string;
};

export type PageableResponse<T> = {
  result: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

type AuthStore = {
  token: string | null;
  getState?: () => { token: string | null };
};

let authStore: AuthStore | null = null;

export const setAuthStore = (store: AuthStore) => {
  authStore = store;
};

const getToken = (): string | null => {
  if (authStore?.getState) {
    return authStore.getState().token;
  }
  return authStore?.token || null;
};

export const getBaseURL = (): string => {
  return import.meta.env.VITE_API_BASE_URL || "/api";
};

const createRestClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log("Unauthorized - token may be expired");
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const restClient = createRestClient();
