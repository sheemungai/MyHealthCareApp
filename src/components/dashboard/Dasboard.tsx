// components/dashboard/Dashboard.tsx
import { useState } from 'react';
import {
  FiUser,
  FiCalendar,
  FiFileText,
  FiShoppingCart,
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiGrid,
  FiList,
  FiUsers,
  
} from 'react-icons/fi';
import { FaUserMd, FaPills, FaUser } from 'react-icons/fa';
import { useDashboard } from '@/hooks/useDashboard';
import type { DashboardCard } from '@/Types/dashboard';

interface DashboardProps {
  dashboardId: number;
  title?: string;
  description?: string;
  onCardAction?: (action: string, card: DashboardCard) => void;
}

const Dashboard = ({ 
  dashboardId, 
  title = "Dashboard",
  description = "Your personalized medical dashboard",
  onCardAction 
}: DashboardProps) => {
  const { dashboardData, cards, loading, error, refetchDashboardData } = useDashboard(dashboardId);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localLoading, setLocalLoading] = useState(false);

  // Helper functions for card rendering
  const getIcon = (type: DashboardCard['type']) => {
    switch (type) {
      case 'doctor': return <FaUserMd className="h-5 w-5" />;
      case 'appointment': return <FiCalendar className="h-5 w-5" />;
      case 'record': return <FiFileText className="h-5 w-5" />;
      case 'pharmacy-order': return <FaPills className="h-5 w-5" />;
      case 'user': return <FiUser className="h-5 w-5" />;
      default: return <FiFileText className="h-5 w-5" />;
    }
  };

  const getCardColor = (type: DashboardCard['type']) => {
    const colors = {
      doctor: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: 'bg-teal-100 text-teal-600' },
      appointment: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'bg-green-100 text-green-600' },
      record: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'bg-orange-100 text-orange-600' },
      'pharmacy-order': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'bg-yellow-100 text-yellow-600' },
      user: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'bg-blue-100 text-blue-600' }
    };
    return colors[type] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'bg-gray-100 text-gray-600' };
  };

  const getActionIcon = (action: string) => {
    const icons = {
      'view-profile': FiEye,
      'view-details': FiEye,
      'edit-profile': FiEdit,
      'reschedule': FiEdit,
      'cancel': FiTrash2,
      'delete': FiTrash2,
      'download': FiFileText,
      'share': FiUser,
      'book-appointment': FiCalendar,
      'contact': FiUser,
      'track-order': FiEye,
      'reorder': FiShoppingCart
    };
    const IconComponent = icons[action as keyof typeof icons] || FiEye;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatActionLabel = (action: string) => {
    return action.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleRefresh = async () => {
    setLocalLoading(true);
    await refetchDashboardData(dashboardId);
    setLocalLoading(false);
  };

  const handleCardAction = (action: string, card: DashboardCard) => {
    onCardAction?.(action, card);
  };

  // Render loading state
  const renderLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded-full w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-full w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-full w-4/6"></div>
        </div>
      ))}
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 mb-4">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
      >
        Try Again
      </button>
    </div>
  );

  // Render empty state
  const renderEmpty = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <div className="text-gray-500 mb-4">
        <FiFileText className="h-12 w-12 mx-auto mb-3" />
        <p className="font-semibold">No dashboard items</p>
        <p className="text-sm">This dashboard doesn't have any items yet.</p>
      </div>
    </div>
  );

  // Render individual card
  const renderCard = (card: DashboardCard) => {
    const colors = getCardColor(card.type);
    
    return (
      <div
        key={`${card.type}-${card.id}`}
        className={`bg-white rounded-xl shadow-sm border ${colors.border} hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
      >
        {/* Card Header */}
        <div className={`p-4 border-b ${colors.border}`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${colors.icon}`}>
              {getIcon(card.type)}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
              {card.type.replace('-', ' ')}
            </span>
          </div>
          
          <h3 className="font-semibold text-gray-800 text-lg mb-1">
            {card.title}
          </h3>
          
          {card.subtitle && (
            <p className="text-gray-600 text-sm mb-2">
              {card.subtitle}
            </p>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          {card.description && (
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {card.description}
            </p>
          )}

          {card.stats && Object.keys(card.stats).length > 0 && (
            <div className="space-y-2 mb-4">
              {Object.entries(card.stats).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500 capitalize">{key}:</span>
                  <span className="font-medium text-gray-800">{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          {card.imageUrl && (
            <div className="mb-4">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Card Actions */}
        {card.actions && card.actions.length > 0 && (
          <div className="p-4 pt-0">
            <div className="flex flex-wrap gap-2">
              {card.actions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleCardAction(action, card)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    colors.bg
                  } ${colors.text} hover:opacity-80`}
                  title={formatActionLabel(action)}
                >
                  {getActionIcon(action)}
                  <span className="hidden sm:inline">
                    {formatActionLabel(action)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render cards grid
  const renderCards = () => (
    <div className={`grid gap-6 ${
      viewMode === 'list' 
        ? 'grid-cols-1 max-w-4xl mx-auto' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`}>
      {cards.map(renderCard)}
    </div>
  );

  const isLoading = loading || localLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {dashboardData?.title || title}
            </h1>
            <p className="text-gray-600 mt-1">
              {dashboardData?.description || description}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid view"
              >
                <FiGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List view"
              >
                <FiList className="h-4 w-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Refresh dashboard"
            >
              <FiRefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        {dashboardData && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
              <FiUsers className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-blue-600 mb-1">Doctors</p>
              <p className="text-xl font-bold text-blue-800">{dashboardData.totalDoctors}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
              <FiCalendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-green-600 mb-1">Appointments</p>
              <p className="text-xl font-bold text-green-800">{dashboardData.totalAppointments}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-100">
              <FiFileText className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-orange-600 mb-1">Records</p>
              <p className="text-xl font-bold text-orange-800">{dashboardData.totalRecords}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-100">
              <FaPills className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-sm text-yellow-600 mb-1">Pharmacy Orders</p>
              <p className="text-xl font-bold text-yellow-800">{dashboardData.totalPharmacyOrders}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-100">
              <FaUser className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-purple-600 mb-1">Users</p>
              <p className="text-xl font-bold text-purple-800">{dashboardData.totalUsers}</p>
            </div>
          </div>
        )}
      </div>

      {/* Cards Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Dashboard Items ({cards.length})
          </h2>
        </div>

        {isLoading && renderLoading()}
        {error && !isLoading && renderError()}
        {!isLoading && !error && cards.length === 0 && renderEmpty()}
        {!isLoading && !error && cards.length > 0 && renderCards()}
      </section>

      {/* Last Updated */}
      {dashboardData && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date(dashboardData.updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default Dashboard;