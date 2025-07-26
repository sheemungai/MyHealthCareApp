import {
  FiCalendar,
  FiShoppingCart,
  FiFileText,
  FiCreditCard,
} from 'react-icons/fi'
import { FaUserMd } from 'react-icons/fa'
import { Link } from '@tanstack/react-router'

const PatientDashboard = () => {
  // Route cards configuration
  const routeCards = [
    {
      title: 'My Appointments',
      icon: <FiCalendar className="h-8 w-8" />,
      color: 'bg-blue-100 text-blue-600',
      route: '/dashboard/patient/appointments',
      description: 'Schedule and view your doctor appointments',
    },
    {
      title: 'My Doctors',
      icon: <FaUserMd className="h-8 w-8" />,
      color: 'bg-teal-100 text-teal-600',
      route: '/dashboard/patient/doctors',
      description: 'View your healthcare providers',
    },
    {
      title: 'My Prescriptions',
      icon: <FiFileText  className="h-8 w-8" />,
      color: 'bg-green-100 text-green-600',
      route: '/dashboard/patient/prescriptions',
      description: 'Access your prescribed medications',
    },
    {
      title: 'Pharmacy Orders',
      icon: <FiShoppingCart className="h-8 w-8" />,
      color: 'bg-purple-100 text-purple-600',
      route: '/dashboard/patient/pharmacy_orders',
      description: 'View and track your medication orders',
    },
    {
        title: ' Medicines',
        icon: <FiFileText className="h-8 w-8" />,
        color: 'bg-yellow-100 text-yellow-600',
        route: '/dashboard/patient/medicines',
        description: 'Browse available medicines',
    }
  
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back, Patient!
        </h1>
        <p className="text-gray-600">
          Manage your healthcare journey in one place
        </p>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
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

export default PatientDashboard