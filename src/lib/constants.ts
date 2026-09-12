export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://backend-nodejs-q65c.onrender.com";

export const USER_ID =
  process.env.NEXT_PUBLIC_USER_ID ?? "user-id";

export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;
