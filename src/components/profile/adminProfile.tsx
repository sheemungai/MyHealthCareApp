import React, { useState, useEffect } from 'react';
import type { AdminUser, UpdateProfileData } from '@/Types/types';
import { getCurrentUserProfile, updateUserProfileFn } from '@/API/users';
import { BaseProfile } from './baseProfile';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<AdminUser>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUserProfile();
      if (user.role === 'admin') {
        setProfile(user as AdminUser);
        setFormData(user as AdminUser);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const updateData: UpdateProfileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      
      const updatedUser = await updateUserProfileFn(profile.user_id, updateData);
      setProfile(updatedUser as AdminUser);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <BaseProfile
      user={profile}
      isEditing={isEditing}
      loading={loading}
      onEdit={() => setIsEditing(true)}
      onCancel={() => {
        setIsEditing(false);
        setFormData(profile);
      }}
      onSave={handleSubmit}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="text-gray-600 capitalize">{profile.role}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-medium">{profile.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
      )}
    </BaseProfile>
  );
};