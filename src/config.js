export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
    apiUrl: import.meta.env.VITE_API_URL,
    endpoints: {
      auth: {
        login: "/user/login",
        register: "/user",
        refresh: "/user/refresh",
      },
    },
  },
  token: {
    accessTokenKey: "accessToken",
    refreshTokenExpiry: 30, // days
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => `${config.api.apiUrl}${endpoint}`;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: getApiUrl(config.api.endpoints.auth.login),
  REGISTER: getApiUrl(config.api.endpoints.auth.register),
  REFRESH: getApiUrl(config.api.endpoints.auth.refresh),
};

// Token configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: config.token.accessTokenKey,
  REFRESH_TOKEN_EXPIRY: config.token.refreshTokenExpiry,
};

// Base API URL for axios
export const API_BASE_URL = config.api.apiUrl;
