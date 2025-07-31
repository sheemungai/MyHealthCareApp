import {
  FiUsers,
  FiCalendar,
  FiFileText,
  FiActivity,
} from 'react-icons/fi'
import { Link } from '@tanstack/react-router'

const DoctorDashboard = () => {
  // Route cards configuration
  const routeCards = [
    {
      title: 'Patients',
      icon: <FiUsers className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      route: '/dashboard/doctor/patient',
      description: 'View your patient records',
    },
    {
      title: 'Appointments',
      icon: <FiCalendar className="h-8 w-8" />,
      color: 'bg-green-100 text-green-600',
      route: '/dashboard/doctor/appointments',
      description: 'Manage your schedule',
    },
    {
      title: 'Prescriptions',
      icon: <FiFileText className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-600',
      route: '/dashboard/doctor/prescriptions',
      description: 'Create and manage prescriptions',
    },
    {
      title: 'Records',
      icon: <FiActivity className="h-8 w-8" />,
      color: 'bg-orange-100 text-orange-600',
      route: '/dashboard/doctor/records',
      description: 'Access medical records',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Doctor!
        </h1>
        <p className="text-gray-600">
          Access your medical tools and patient information
        </p>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {routeCards.map((card) => (
          <Link
            key={card.title}
            to={card.route}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center hover:transform hover:-translate-y-1"
          >
            <div className={`p-4 rounded-full ${card.color} mb-4`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {card.title}
            </h3>
            <p className="text-gray-500 text-sm">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DoctorDashboard