// Client-side only utilities
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  upload: `${API_BASE_URL}/api/upload`,
  init: `${API_BASE_URL}/api/init`,
  adminLogin: `${API_BASE_URL}/api/admin/login`,
  adminLogout: `${API_BASE_URL}/api/admin/logout`,
  adminPhotos: `${API_BASE_URL}/api/admin/photos`,
} as const

// Simple fetch wrapper for API calls
export async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  return response
}