import { useGetDoctorQuery } from '@/hooks/patients/doctorHook';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type Doctor = {
  doctor_id: number | string;
  name: string;
  specialization: string;
  email: string;
  availability: string;
  consultation_fee?: string;
  img?: string | null;
};

const DoctorsList = () => {
  const { data: doctors, isLoading, isError, error } = useGetDoctorQuery();

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
        <p className="mt-4 text-gray-600">Loading doctors...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">
          Failed to load doctors
        </h3>
        <p className="mt-2 text-red-600">{error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Available Doctors</h1>
      
      {doctors?.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No doctors currently available.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {doctors?.map((doctor: Doctor, index: number) => (
            <DoctorCard key={doctor.doctor_id.toString()} doctor={doctor} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

interface DoctorCardProps {
  doctor: Doctor;
  index: number;
}

const DoctorCard = ({ doctor, index }: DoctorCardProps) => {
  const imageUrl = doctor.img || 'https://i.pinimg.com/736x/8e/5b/6a/8e5b6a2191656c1ac5d4571577870170.jpg';

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
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  // Ensure doctor_id is converted to string for the route param
  const doctorIdParam = doctor.doctor_id.toString();

  return (
    <motion.div
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
      variants={cardVariants}
      whileHover="hover"
      initial="hidden"
      animate="show"
      custom={index}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className="h-48 overflow-hidden bg-gray-200"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        <img
          src={imageUrl}
          alt={doctor.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://i.pinimg.com/736x/8e/5b/6a/8e5b6a2191656c1ac5d4571577870170.jpg';
          }}
        />
      </motion.div>

      <div className="p-5">
        <motion.h2
          className="text-xl font-semibold text-gray-800 mb-2"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          {doctor.name}
        </motion.h2>

        <motion.p
          className="text-blue-600 font-medium mb-1"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={0.45}
        >
          {doctor.specialization}
        </motion.p>

        <div className="mt-4 space-y-2 text-gray-600">
          <motion.p
            className="flex items-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={0.5}
          >
            <svg
              className="mr-2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {doctor.email}
          </motion.p>

          <motion.p
            className="flex items-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={0.55}
          >
            <svg
              className="mr-2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {doctor.availability}
          </motion.p>
        </div>

        <motion.div
          className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={0.6}
        >
          <span className="text-lg font-bold text-gray-900">
            Ksh {doctor.consultation_fee?.toLocaleString() ?? 'Not specified'}
          </span>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/dashboard/patient/doctors/appointmentsForm/$doctor_id"
              params={{ doctor_id: doctorIdParam }}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Book Appointment
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorsList;