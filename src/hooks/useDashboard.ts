// hooks/useDashboard.ts
import { createDashboardFn, deleteDashboardFn, getDashboardCardsFn, getDashboardDataFn, getDashboardFn, getDashboardsFn, updateDashboardFn, type CreateDashboardDto, type UpdateDashboardDto } from '@/API/dashboard';
import type { Dashboard, DashboardCard, DashboardData } from '@/Types/dashboard';
import { useState, useEffect } from 'react';


export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardsFn();
      setDashboards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboards');
    } finally {
      setLoading(false);
    }
  };

  const createDashboard = async (dashboardData: CreateDashboardDto): Promise<Dashboard> => {
    try {
      const newDashboard = await createDashboardFn(dashboardData);
      setDashboards(prev => [...prev, newDashboard]);
      return newDashboard;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create dashboard');
    }
  };

  const deleteDashboard = async (dashboardId: number): Promise<void> => {
    try {
      await deleteDashboardFn(dashboardId);
      setDashboards(prev => prev.filter(d => d.id !== dashboardId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete dashboard');
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  return {
    dashboards,
    loading,
    error,
    refetch: fetchDashboards,
    createDashboard,
    deleteDashboard
  };
};

export const useDashboard = (dashboardId?: number) => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardFn(id);
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardDataFn(id);
      setDashboardData(data);
      setCards(data.cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardCards = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardCardsFn(id);
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard cards');
    } finally {
      setLoading(false);
    }
  };

  const updateDashboard = async (id: number, dashboardData: UpdateDashboardDto): Promise<Dashboard> => {
    try {
      const updatedDashboard = await updateDashboardFn(id, dashboardData);
      setDashboard(updatedDashboard);
      return updatedDashboard;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update dashboard');
    }
  };

  useEffect(() => {
    if (dashboardId) {
      fetchDashboardData(dashboardId);
    }
  }, [dashboardId]);

  return {
    dashboard,
    dashboardData,
    cards,
    loading,
    error,
    refetchDashboard: fetchDashboard,
    refetchDashboardData: fetchDashboardData,
    refetchDashboardCards: fetchDashboardCards,
    updateDashboard
  };
};

export const useDashboardActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDashboard = async (dashboardData: CreateDashboardDto): Promise<Dashboard> => {
    setLoading(true);
    setError(null);
    try {
      const newDashboard = await createDashboardFn(dashboardData);
      return newDashboard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create dashboard';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateDashboard = async (dashboardId: number, dashboardData: UpdateDashboardDto): Promise<Dashboard> => {
    setLoading(true);
    setError(null);
    try {
      const updatedDashboard = await updateDashboardFn(dashboardId, dashboardData);
      return updatedDashboard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update dashboard';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteDashboard = async (dashboardId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteDashboardFn(dashboardId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete dashboard';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createDashboard,
    updateDashboard,
    deleteDashboard
  };
};