import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import type { PatientUser, UpdateProfileData } from '@/Types/types';
import { BaseProfile } from './baseProfile';

export const PatientProfile: React.FC = () => {
  const { profile, loading, updateProfile, uploadImage } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PatientUser>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleEdit = () => {
    if (profile && profile.role === 'patient') {
      setFormData(profile);
      setIsEditing(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploadingImage(true);
    const result = await uploadImage(profile.user_id, file);
    if (result.success) {
      alert('Profile image updated successfully!');
    } else {
      alert(result.error);
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updateData: UpdateProfileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
    };

    const result = await updateProfile(profile.user_id, updateData);
    if (result.success) {
      setIsEditing(false);
      alert('Profile updated successfully!');
    } else {
      alert(result.error);
    }
  };

  if (!profile || profile.role !== 'patient') {
    return <div className="p-6 text-center">No patient profile found</div>;
  }

  const patientProfile = profile as PatientUser;

  return (
    <BaseProfile
      user={patientProfile}
      isEditing={isEditing}
      loading={loading}
      onEdit={handleEdit}
      onCancel={() => setIsEditing(false)}
      onSave={handleSubmit}
    >
      {isEditing ? (
        <div className="space-y-4">
          {/* Image Upload */}
          <div className="flex items-center space-x-4">
            <img
              src={patientProfile.img || '/default-avatar.png'}
              alt={patientProfile.name}
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
              className="w-full p-2 border rounded-lg"
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
              className="w-full p-2 border rounded-lg"
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
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.split('T')[0] : ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={patientProfile.img || '/default-avatar.png'}
              alt={patientProfile.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">{patientProfile.name}</h3>
              <p className="text-gray-600 capitalize">{patientProfile.role}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{patientProfile.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-medium">{patientProfile.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date of Birth</label>
              <p className="font-medium">
                {patientProfile.dob ? new Date(patientProfile.dob).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Gender</label>
              <p className="font-medium capitalize">{patientProfile.gender || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500">Address</label>
              <p className="font-medium">{patientProfile.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      )}
    </BaseProfile>
  );
};