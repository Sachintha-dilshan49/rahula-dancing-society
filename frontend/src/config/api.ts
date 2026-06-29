// Central API configuration.
//
// In production set NEXT_PUBLIC_API_URL (e.g. https://api.rahuladance.lk) in the
// deployment environment. Locally it falls back to the dev backend so nothing
// needs to be configured for development.
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Strip any trailing slash so we can safely append paths.
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

// Base URL for all REST endpoints.
export const API_URL = `${API_BASE}/api`;
