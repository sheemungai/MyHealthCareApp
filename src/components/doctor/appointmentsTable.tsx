// components/DoctorsAppointmentsTable.tsx
import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  useGetAppointmentsByIdQuery,
  useDeleteAppointment,
  useCreateAppointment,
} from '@/hooks/doctor/appointment'
import type { TAppointment } from '@/Types/types'

export const DoctorsAppointmentsTable = ({
  doctorId,
}: {
  doctorId: number
}) => {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    status: 'scheduled',
    reason: '',
    appointment_date: '',
    appointment_time: '',
  })

  const {
    data: doctorData,
    isLoading,
    isError,
    refetch,
  } = useGetAppointmentsByIdQuery(doctorId)
  const appointments = doctorData?.appointments || []

  const deleteMutation = useDeleteAppointment()
  const createMutation = useCreateAppointment()

  // Format date to Kenyan format
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        doctor_id: doctorId,
        patient_id: Number(formData.patientId),
        status: formData.status,
        reason: formData.reason,
        created_at: new Date(),
        appointment_time: new Date(),
      })
      setShowModal(false)
      setFormData({
        patientId: '',
        name: '',
        status: 'scheduled',
        reason: '',
        appointment_date: '',
        appointment_time: '',
      })
      refetch()
    } catch (error) {
      console.error('Error creating appointment:', error)
    }
  }

  const columns = useMemo<ColumnDef<TAppointment>[]>(
    () => [
      {
        header: 'Appointment ID',
        accessorKey: 'appointment_id',
        size: 120,
      },
      {
        header: 'Patient ID',
        accessorKey: 'patient_id',
        size: 100,
      },
      {
        header: 'Appointment Time',
        accessorFn: (row) => formatDateTime(row.appointment_time),
      },
      {
        header: 'Status',
        accessorKey: 'status',
      },
      {
        header: 'Reason',
        accessorKey: 'reason',
      },
      {
        header: 'Created At',
        accessorFn: (row) => formatDateTime(row.created_at),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Error loading appointments. Please try again.
      </div>
    )
  }

  if (!appointments.length && !showModal) {
    return (
      <div className="text-center p-4">
        <div className="text-gray-500 mb-4">
          No appointments found for this doctor.
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Appointment
        </button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Doctor's Appointments
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Appointment
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search appointments by status, reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {appointments.length} appointments
          </div>
        </div>
      </div>

      {/* Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {table.getRowModel().rows.map((row) => {
          const appointment = row.original
          return (
            <div
              key={appointment.appointment_id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">
                  Appointment #{appointment.appointment_id}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Patient ID:</span>{' '}
                  {appointment.patient_id}
                </div>
                {/* <div>
                  <span className="font-medium">Patient:</span>{' '}
                  {appointment.name}
                </div> */}
                <div>
                  <span className="font-medium">Scheduled:</span>{' '}
                  {formatDateTime(appointment.appointment_time)}
                </div>
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {formatDateTime(appointment.created_at)}
                </div>
                <div className="pt-2">
                  <span className="font-medium">Reason:</span>
                  <p className="text-gray-700 mt-1">{appointment.reason}</p>
                </div>
              </div>
              <div>
                <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                  <a
                    href={`https://zoom.us/join?confno=${appointment.join_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Zoom Meeting
                  </a>
                </button>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete this appointment?`,
                      )
                    ) {
                      deleteMutation.mutate(appointment.appointment_id)
                    }
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal for Add Appointment Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Schedule New Appointment
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID
                    </label>
                    <input
                      type="number"
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Time
                    </label>
                    <input
                      type="time"
                      name="appointment_time"
                      value={formData.appointment_time}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {createMutation.isPending
                      ? 'Saving...'
                      : 'Save Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
