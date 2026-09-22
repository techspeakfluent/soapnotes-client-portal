import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken } from "@/lib/storage";

export function rejectErrorInterceptor(error: AxiosError) {
  return Promise.reject(error);
}

/** Attaches the bearer token to every request. */
export function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const { accessToken } = getToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}
