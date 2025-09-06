// api/dashboard.ts
import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";
import type { DashboardData, DashboardCard, Dashboard } from "@/Types/dashboard";

export interface CreateDashboardDto {
  doctorIds?: number[];
  appointmentIds?: number[];
  recordIds?: number[];
  pharmacyOrderIds?: number[];
  userIds?: number[];
}

export interface UpdateDashboardDto extends CreateDashboardDto {}

export const getDashboardsFn = async (): Promise<Dashboard[]> => {
  const fullUrl = `${url}/dashboard`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const getDashboardFn = async (dashboardId: number): Promise<Dashboard> => {
  const fullUrl = `${url}/dashboard/${dashboardId}`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const getDashboardDataFn = async (dashboardId: number): Promise<DashboardData> => {
  const fullUrl = `${url}/dashboard/${dashboardId}/data`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const getDashboardCardsFn = async (dashboardId: number): Promise<DashboardCard[]> => {
  const fullUrl = `${url}/dashboard/${dashboardId}/cards`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const createDashboardFn = async (dashboardData: CreateDashboardDto): Promise<Dashboard> => {
  const fullUrl = `${url}/dashboard`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dashboardData),
  });

  if (!response.ok) {
    throw new Error('Failed to create dashboard');
  }

  return response.json();
}

export const updateDashboardFn = async (dashboardId: number, dashboardData: UpdateDashboardDto): Promise<Dashboard> => {
  const fullUrl = `${url}/dashboard/${dashboardId}`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(dashboardData),
  });

  if (!response.ok) {
    throw new Error('Failed to update dashboard');
  }

  return response.json();
}

export const deleteDashboardFn = async (dashboardId: number): Promise<void> => {
  const fullUrl = `${url}/dashboard/${dashboardId}`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete dashboard');
  }
}