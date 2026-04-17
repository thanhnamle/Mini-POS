const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '';

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');
export const HAS_REMOTE_API =
  API_BASE_URL.length > 0 && !API_BASE_URL.includes('example.execute-api');

export const CURRENCY = '$';
