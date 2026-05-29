// components/profile/BaseProfile.tsx
import React,{ type ReactNode }  from 'react';

interface BaseUser {
  role: string;
  [key: string]: any;
}

interface BaseProfileProps {
  user: BaseUser;
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (e: React.FormEvent) => void;
  children: ReactNode;
}

export const BaseProfile: React.FC<BaseProfileProps> = ({
  user,
  isEditing,
  loading,
  onEdit,
  onCancel,
  onSave,
  children
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white capitalize">
              {user.role} Profile
            </h2>
            {!isEditing && (
              <button
                onClick={onEdit}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={onSave}>
              {children}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};