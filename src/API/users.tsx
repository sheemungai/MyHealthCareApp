// API/users.ts
import url from '@/constants/urls'
import { getAccessTokenHelper } from '@/lib/authHelper'
import type {
  TUser,
  UserProfile,
  UpdateProfileData,
  CreateUserData,
} from '@/Types/types'

// ============ USER MANAGEMENT FUNCTIONS ============

/**
 * Get all users with pagination and search (Admin/Doctor only)
 */
export const getUserFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: TUser[]
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${url}/users?${params.toString()}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

/**
 * Delete a user (Admin only)
 */
export const deleteUserFn = async (userId: number): Promise<void> => {
  const fullUrl = `${url}/users/${userId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete user')
  }
}

/**
 * Create a new user (Admin only)
 */
export const createUserFn = async (userData: CreateUserData) => {
  const fullUrl = `${url}/users`
  console.log('userData', userData)

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create user')
  }

  const data = await response.json()
  console.log('Created user:', data)
  return data
}

/**
 * @deprecated Use updateUserProfileFn instead (uses PATCH method to match backend)
 */
export const updateUserFn = async (
  userId: number,
  userData: Partial<TUser>,
): Promise<TUser> => {
  const fullUrl = `${url}/users/${userId}`

  const response = await fetch(fullUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }

  return response.json()
}

// ============ PROFILE MANAGEMENT FUNCTIONS ============

/**
 * Get current logged-in user's profile
 * Works for patients, doctors, and admins
 */
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const fullUrl = `${url}/users/me`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch user profile')
  }

  const result = await response.json()
  // Handle both response formats: { success: true, data: user } or direct user object
  return result.data || result
}

/**
 * Update user profile (works for patients, doctors, and admins)
 * Uses PATCH method to match backend
 */
export const updateUserProfileFn = async (
  userId: number,
  userData: UpdateProfileData,
): Promise<UserProfile> => {
  const fullUrl = `${url}/users/${userId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update profile')
  }

  const result = await response.json()
  return result.data || result
}

/**
 * Upload profile image for a user
 * @param userId - The user ID
 * @param file - The image file to upload
 * @returns Object containing the image URL
 */
export const uploadProfileImageFn = async (
  userId: number,
  file: File,
): Promise<{ imageUrl: string }> => {
  const fullUrl = `${url}/users/upload-image/${userId}`
  const token = getAccessTokenHelper()

  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to upload image')
  }

  const result = await response.json()
  return { imageUrl: result.imageUrl }
}

/**
 * Get user by ID (Admin/Doctor only)
 */
export const getUserByIdFn = async (userId: number): Promise<UserProfile> => {
  const fullUrl = `${url}/users/${userId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch user')
  }

  const result = await response.json()
  return result.data || result
}

/**
 * Update user password
 * @param userId - The user ID
 * @param currentPassword - Current password for verification
 * @param newPassword - New password to set
 */
export const updateUserPasswordFn = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> => {
  const fullUrl = `${url}/users/${userId}/password`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update password')
  }

  return response.json()
}

// ============ BULK OPERATIONS (Admin only) ============

/**
 * Get all users without pagination (Admin only)
 */
export const getAllUsersFn = async (): Promise<TUser[]> => {
  const fullUrl = `${url}/users/all`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const result = await response.json()
  return result.data || result
}

/**
 * Get users by role (Admin/Doctor only)
 */
export const getUsersByRoleFn = async (role: string): Promise<TUser[]> => {
  const fullUrl = `${url}/users/role/${role}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users by role')
  }

  const result = await response.json()
  return result.data || result
}

// ============ HELPER FUNCTIONS ============

/**
 * Get user profile image URL
 */
export const getProfileImageUrl = (imgPath?: string): string => {
  if (!imgPath) return '/default-avatar.png'
  if (imgPath.startsWith('http')) return imgPath
  return `${url}${imgPath}`
}

/**
 * Check if user has permission to edit a profile
 */
export const canEditProfile = (
  currentUserId: number,
  targetUserId: number,
  currentUserRole: string,
): boolean => {
  return currentUserId === targetUserId || currentUserRole === 'admin'
}
