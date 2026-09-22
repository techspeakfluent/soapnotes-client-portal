type StorageKey = "access_token" | "refresh_token";

const PREFIX = "soapnotes_client_portal_";

export const storage = {
  get(key: StorageKey): string | null {
    try {
      return window.localStorage.getItem(`${PREFIX}${key}`);
    } catch {
      return null;
    }
  },
  set(key: StorageKey, value: string) {
    window.localStorage.setItem(`${PREFIX}${key}`, value);
  },
  clear(key: StorageKey) {
    window.localStorage.removeItem(`${PREFIX}${key}`);
  },
};

export const getToken = () => ({
  accessToken: storage.get("access_token"),
  refreshToken: storage.get("refresh_token"),
});

export const setAccessToken = (token: string) =>
  storage.set("access_token", token);

export const setRefreshToken = (token: string) =>
  storage.set("refresh_token", token);

export const removeToken = () => {
  storage.clear("access_token");
  storage.clear("refresh_token");
};
