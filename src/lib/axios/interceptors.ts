import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getToken, removeToken } from "@/lib/storage";
import { RouteConstants } from "@/shared/constants/routes";

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

export function passResponseInterceptor(response: AxiosResponse) {
  return response;
}

// Full navigation, so none of the signed-out client's cached data survives.
export function unauthorizedResponseInterceptor(error: AxiosError) {
  if (error.response?.status === 401 && getToken().accessToken) {
    removeToken();
    const next = `${window.location.pathname}${window.location.search}`;
    window.location.assign(
      RouteConstants.auth.signIn.generate({}, next === "/" ? {} : { next }),
    );
  }
  return Promise.reject(error);
}
