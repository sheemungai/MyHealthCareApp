// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { 
  getCurrentUserProfile, 
  updateUserProfileFn, 
  uploadProfileImageFn 
} from '@/API/users';
import type { UpdateProfileData, UserProfile } from '@/Types/types';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentUserProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (userId: number, data: UpdateProfileData) => {
    try {
      setLoading(true);
      const updated = await updateUserProfileFn(userId, data);
      setProfile(updated);
      return { success: true, data: updated };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Upload image
  const uploadImage = async (userId:  number, file: File) => {
    try {
      setLoading(true);
      const { imageUrl } = await uploadProfileImageFn(userId, file);
      // Update profile with new image URL
      if (profile) {
        setProfile({ ...profile, img: imageUrl });
      }
      return { success: true, imageUrl };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadImage,
    clearError,
  };
};