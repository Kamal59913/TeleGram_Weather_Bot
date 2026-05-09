// src/config/auth.ts
export const AUTH_CONFIG = {
  TOKEN_NAME: import.meta.env.VITE_AUTH_TOKEN_NAME || "admin-panel-token",
} as const;
