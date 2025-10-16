/* eslint-disable @typescript-eslint/no-explicit-any */

import { navigateTo } from "./navigateService";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ID_TOKEN_KEY = "id_token";
const AUTH_TOKEN_KEY = "auth_token";
const USER = "user";

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const setIdToken = (idToken: string) => {
  localStorage.setItem(ID_TOKEN_KEY, idToken);
};

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const getIdToken = (): string | null =>
  localStorage.getItem(ID_TOKEN_KEY);

export const getUser = (): string | null => localStorage.getItem(USER);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ID_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER);
};

export const refreshTokenFn = async (): Promise<any> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return;
  const baseURL = "/api";
  if (!baseURL) throw new Error("API base URL is not defined");
  const res = await fetch(`${baseURL}/refresh-access-token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-refresh-token": refreshToken,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await res.json();
  const accessToken = data.access_token;
  if (!accessToken) throw new Error("No access token returned from server");
  setAccessToken(accessToken);

  return accessToken;
};

export const logout = () => {
  clearTokens();
  navigateTo("/login");
};
