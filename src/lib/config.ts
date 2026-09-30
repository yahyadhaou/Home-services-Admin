export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000/api/v1";

export const ACCESS_COOKIE = "hs_admin_access";
export const REFRESH_COOKIE = "hs_admin_refresh";

// Matches the backend's JWT_ACCESS_EXPIRES_IN default (15m) / JWT_REFRESH_EXPIRES_IN (30d) —
// see homeservice-backend/src/config/env.js. Kept slightly under the real
// token lifetime so the cookie never outlives the token it holds.
export const ACCESS_COOKIE_MAX_AGE = 14 * 60;
export const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
