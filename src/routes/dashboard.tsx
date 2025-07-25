import { Outlet, createFileRoute } from '@tanstack/react-router'
import { FaBars, FaTimes, FaBell, FaUserCircle } from 'react-icons/fa'
import { useState } from 'react'
import SideNav from '@/components/sideNav'
import type { Role } from '@/Types/types'
import { getUserRoleHelper } from '@/lib/authHelper'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  // getUserRole
  // const role = 'admin' // This should be dynamically set based on user role
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const role: Role = getUserRoleHelper() as Role;
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
              <div className="flex items-center space-x-4">
                <button className="p-1 text-gray-500 hover:text-gray-700 relative">
                  <FaBell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <div className="flex items-center space-x-2">
                  <FaUserCircle size={24} className="text-gray-400" />
                  <span className="text-sm font-medium">{role}</span>
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