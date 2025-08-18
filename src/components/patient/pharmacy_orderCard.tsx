import { useGetPharmacyOrders } from '@/hooks/patients/pharmacy_ordersHook';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

type Medicine = {
  name: string;
  price: number;
  img?: string;
};

type PharmacyOrder = {
  pharmacy_order_id: number;
  patient_id: number;
  medication_name: string;
  dosage: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled' | 'processing';
  created_at: string;
  medicine?: Medicine;
};

const statusConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
} as const;

interface PharmacyOrdersListProps {
  patientId: number;
}

export const PharmacyOrdersList = ({ patientId }: PharmacyOrdersListProps) => {
  const { data, isLoading, isError, error } = useGetPharmacyOrders(patientId);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const orders = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading your pharmacy orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">
          Failed to load orders
        </h3>
        <p className="mt-2 text-red-600">{error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Pharmacy Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {orders.map((order) => (
            <OrderCard
              key={order.pharmacy_order_id}
              order={order}
              formatDate={formatDate}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

interface OrderCardProps {
  order: PharmacyOrder;
  formatDate: (date: string) => string;
}

const OrderCard = ({ order, formatDate }: OrderCardProps) => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 },
    },
  };

  const status = statusConfig[order.status];

  return (
    <motion.div
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      variants={cardVariants}
      whileHover="hover"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {order.medication_name}
            </h2>
            <p className="text-sm text-gray-500">
              Order #{order.pharmacy_order_id}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.text}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Dosage:</span>
            <span className="ml-2">{order.dosage}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Quantity:</span>
            <span className="ml-2">{order.quantity}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <svg
            className="mr-2 h-4 w-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Ordered: {formatDate(order.created_at)}
        </div>
      </div>
    </motion.div>
  );
};

export default PharmacyOrdersList;