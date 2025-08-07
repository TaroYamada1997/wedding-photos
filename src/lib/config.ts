// API configuration - can point to Vercel API or local development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export const API_ENDPOINTS = {
  upload: `${API_BASE_URL}/api/upload`,
  init: `${API_BASE_URL}/api/init`,
  adminLogin: `${API_BASE_URL}/api/admin/login`,
  adminLogout: `${API_BASE_URL}/api/admin/logout`,
  adminPhotos: `${API_BASE_URL}/api/admin/photos`,
} as const