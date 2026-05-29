import React, { useState, useEffect } from 'react';
import type { DoctorUser, UpdateProfileData } from '@/Types/types';
import { getCurrentUserProfile, updateUserProfileFn, uploadProfileImageFn } from '@/API/users';
import { BaseProfile } from './baseProfile';

export const DoctorProfile: React.FC = () => {
  const [profile, setProfile] = useState<DoctorUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Partial<DoctorUser>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUserProfile();
      if (user.role === 'doctor') {
        setProfile(user as DoctorUser);
        setFormData(user as DoctorUser);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingImage(true);
    try {
      const result = await uploadProfileImageFn(profile.user_id, file);
      setProfile({ ...profile, img: result.imageUrl });
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
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
        specialization: formData.specialization,
        license_number: formData.license_number,
        consultation_fee: formData.consultation_fee,
      };
      
      const updatedUser = await updateUserProfileFn(profile.user_id, updateData);
      setProfile(updatedUser as DoctorUser);
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
          {/* Image Upload */}
          <div className="flex items-center space-x-4">
            <img
              src={profile.img || '/default-avatar.png'}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="text-sm"
              />
              {uploadingImage && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-1">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">License Number</label>
            <input
              type="text"
              name="license_number"
              value={formData.license_number || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Consultation Fee ($)</label>
            <input
              type="number"
              name="consultation_fee"
              value={formData.consultation_fee || 0}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              step="10"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={profile.img || '/default-avatar.png'}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">Dr. {profile.name}</h3>
              <p className="text-gray-600">{profile.specialization}</p>
              <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
            </div>
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
            <div>
              <label className="text-sm text-gray-500">License Number</label>
              <p className="font-medium">{profile.license_number}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Consultation Fee</label>
              <p className="font-medium">${profile.consultation_fee}</p>
            </div>
          </div>
        </div>
      )}
    </BaseProfile>
  );
};