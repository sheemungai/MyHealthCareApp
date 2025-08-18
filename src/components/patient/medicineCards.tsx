import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useGetMedicineQuery } from '@/hooks/patients/medicine';
import OrderMedicineModal from './ordersForm';
import { getUserIdHelper } from '@/lib/authHelper';
import { Loader2 } from 'lucide-react';

type Medicine = {
  medicine_id: number;
  name: string;
  description: string;
  stock_quantity: number;
  price: string;
  expiry_date: string;
  img: string | null;
};

const MedicinesList = () => {
  const { data: medicines, isLoading, isError, error } = useGetMedicineQuery();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading available medicines...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">
          Failed to load medicines
        </h3>
        <p className="mt-2 text-red-600">{error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Available Medicines</h1>
      
      {medicines?.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No medicines currently available.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {medicines?.map((medicine: Medicine, index: number) => (
            <MedicineCard
              key={medicine.medicine_id}
              medicine={medicine}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

interface MedicineCardProps {
  medicine: Medicine;
  index: number;
}

const MedicineCard = ({ medicine, index }: MedicineCardProps) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const patientId = getUserIdHelper();

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
      scale: 1.02,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 },
    },
  };

  const handleOrderSuccess = (orderData: unknown) => {
    console.log('Order created:', orderData);
    setShowOrderModal(false);
    // Add success notification here
  };

  const formattedExpiryDate = new Date(medicine.expiry_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const imageUrl = medicine.img || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <>
      <motion.div
        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
        variants={cardVariants}
        whileHover="hover"
        initial="hidden"
        animate="show"
        transition={{ delay: index * 0.1 }}
      >
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={medicine.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{medicine.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{medicine.description}</p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="font-medium">Stock:</span>
              <span className="ml-1">{medicine.stock_quantity}</span>
            </div>

            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-gray-400"
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
              <span className="font-medium">Expires:</span>
              <span className="ml-1">{formattedExpiryDate}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-lg font-bold text-blue-600">
              Ksh {medicine.price}
            </span>

            <motion.button
              onClick={() => setShowOrderModal(true)}
              className={`rounded-md px-4 py-2 text-white ${
                medicine.stock_quantity > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={medicine.stock_quantity <= 0}
              whileHover={{ scale: medicine.stock_quantity > 0 ? 1.05 : 1 }}
              whileTap={{ scale: medicine.stock_quantity > 0 ? 0.95 : 1 }}
            >
              {medicine.stock_quantity > 0 ? 'Order Now' : 'Out of Stock'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {showOrderModal && (
        <OrderMedicineModal
          medicine={{
            medicine_id: medicine.medicine_id,
            name: medicine.name,
            price: Number(medicine.price),
          }}
          patientId={Number(patientId)}
          onClose={() => setShowOrderModal(false)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </>
  );
};

export default MedicinesList;