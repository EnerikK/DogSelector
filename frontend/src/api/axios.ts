import axios from "axios";

const ACCESS_TOKEN_KEY = "shelterAccessToken";
const REFRESH_TOKEN_KEY = "shelterRefreshToken";
const API_BASE_URL = import.meta.env.VITE_API_URL + "/api/v1";

export const authStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const refresh = authStorage.getRefreshToken();

    if (status !== 401 || !refresh || originalRequest?._retry || originalRequest?.url?.includes("/auth/refresh/")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = api
        .request<{ access: string }>({
          baseURL: API_BASE_URL,
          url: "/auth/refresh/",
          method: "post",
          data: { refresh },
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          authStorage.setTokens(response.data.access, refresh);
          return response.data.access;
        })
        .catch(() => {
          authStorage.clear();
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newAccess = await refreshPromise;
    if (!newAccess) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
    return api(originalRequest);
  }
);

export default api;
