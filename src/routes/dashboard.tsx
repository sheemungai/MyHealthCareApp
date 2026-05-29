import { Outlet, createFileRoute, Link } from '@tanstack/react-router'
import { FaBars, FaTimes, FaBell, FaUserCircle } from 'react-icons/fa'
import { useState } from 'react'
import SideNav from '@/components/sideNav'
import type { Role } from '@/Types/types'
import { getUserRoleHelper } from '@/lib/authHelper'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const role: Role = getUserRoleHelper() as Role;

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed md:static z-40 w-64 h-full transition-all duration-300 ease-in-out 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <SideNav role={role} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">Hospital Management</h1>
              
              {/* Top Navigation Icons - UNCOMMENTED AND ENHANCED */}
              <div className="flex items-center space-x-4">
                {/* Notification Bell
                <button className="p-1 text-gray-500 hover:text-gray-700 relative">
                  <FaBell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button> */}
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <FaUserCircle size={24} className="text-gray-400 hover:text-gray-600 transition" />
                    <span className="text-sm font-medium capitalize hidden sm:inline-block">
                      {role}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowProfileDropdown(false)}
                      />
                      
                      {/* Dropdown Content */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            <FaUserCircle className="inline mr-2" size={16} />
                            My Profile
                          </Link>
                          
                          <hr className="my-1" />
                          
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}