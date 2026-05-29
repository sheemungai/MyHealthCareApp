import React, { useEffect, useState } from 'react';
import { getCurrentUserProfile } from '@/API/users';
import { PatientProfile } from './patientProfile';
import { DoctorProfile } from './doctorProfile';
import { AdminProfile } from './adminProfile';

export const ProfileRouter: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // First try to get from localStorage
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
          setUserRole(storedRole);
          setLoading(false);
          return;
        }

        // If not in localStorage, fetch from API
        const user = await getCurrentUserProfile();
        const role = user.role;
        localStorage.setItem('role', role);
        setUserRole(role);
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  switch (userRole) {
    case 'patient':
      return <PatientProfile />;
    case 'doctor':
      return <DoctorProfile />;
    case 'admin':
      return <AdminProfile />;
    default:
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Please log in to view your profile</p>
        </div>
      );
  }
};