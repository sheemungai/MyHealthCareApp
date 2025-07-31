import { useState, useEffect } from 'react'
import { useGetAppointmentsByIdQuery } from '@/hooks/patients/appointmentHook'
import { useInitPayments, useVerifyPayment } from '@/hooks/payments/paymentHook'
import { getUserEmailHelper } from '@/lib/authHelper'

interface AppointmentCardProps {
  appointment: {
    appointment_id: number
    patient_id: number
    doctor_id: number
    appointment_time: string
    payment_status: string
    status: string
    reason: string
    created_at: string
    authorization_url?: string
    payment_reference?: string
    join_url?: string
    payment_id?: number
  }
  onPaymentVerified?: () => void
}

const AppointmentCard = ({
  appointment,
  onPaymentVerified,
}: AppointmentCardProps) => {
  console.log('AppointmentCard rendered with appointment:', appointment)
  const initPaymentMutation = useInitPayments()
  const verifyPaymentMutation = useVerifyPayment()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const verifyPayment = async (appointment_id: number) => {
    try {
      setIsVerifying(true)
      setVerificationError(null)

      const result = await verifyPaymentMutation.mutateAsync(appointment_id)

      if (result.payment?.status === 'completed') {
        localStorage.removeItem('pending_payment_ref')
        localStorage.removeItem('appointment_id')
        onPaymentVerified?.()
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
      setVerificationError(
        'Payment verification failed. Please refresh to check status.',
      )
    } finally {
      setIsVerifying(false)
    }
  }

  // Check for pending payments on mount
  useEffect(() => {
    const pendingRef = localStorage.getItem('pending_payment_ref')
    const storedAppointmentId = localStorage.getItem('appointment_id')

    if (
      pendingRef &&
      storedAppointmentId &&
      parseInt(storedAppointmentId) === appointment.appointment_id
    ) {
      verifyPayment(appointment.appointment_id)
    }
  }, [])

  const handlePayment = async () => {
    console.log('handlePayment called')

    if (appointment.payment_status === 'pending') {
      console.log('Payment is pending, verifying...')
      setIsVerifying(true)
      await verifyPayment(Number(appointment.appointment_id) || 0)
      setIsVerifying(false)
      return
    }

    if (appointment.authorization_url) {
      // Store payment reference for verification
      if (appointment.payment_reference) {
        localStorage.setItem(
          'pending_payment_ref',
          appointment.payment_reference,
        )
        localStorage.setItem(
          'appointment_id',
          appointment.appointment_id.toString(),
        )
      }

      // Open payment page and start verification
      window.open(appointment.authorization_url, '_blank')
      if (appointment.appointment_id) {
        verifyPayment(appointment.appointment_id)
      }
    } else {
      // Initialize new payment
      try {
        console.log('Initializing new payment...')
        const paymentData = {
          appointment_id: appointment.appointment_id,
          patient_id: appointment.patient_id,
          email: getUserEmailHelper(),
          doctor_id: appointment.doctor_id,
          payment_method: 'paystack',
          pharmacy_order_id: 0,
          status: 'pending',
        }

        const result = await initPaymentMutation.mutateAsync(paymentData)
        console.log('Payment initialization result:', result)

        if (result.authorization_url && result.payment_reference) {
          localStorage.setItem('pending_payment_ref', result.payment_reference)
          localStorage.setItem(
            'appointment_id',
            appointment.appointment_id.toString(),
          )

          window.open(result.authorization_url, '_blank')
          verifyPayment(result.appointment_id)
        }
      } catch (error: any) {
        console.error('Payment initialization failed:', error)
        alert(
          `Failed to initialize payment. Error: ${error?.message || 'Unknown error'}`,
        )
      }
    }
  }

  const getPaymentButtonText = () => {
    console.log('appointment.payment_status:', appointment.payment_status)

    if (initPaymentMutation.isPending) return 'Initializing Payment...'
    if (isVerifying) return 'Verifying Payment...'
    if (appointment.payment_status === 'completed') return 'Payment Completed'
    if (appointment.payment_status === 'pending') return 'Verify Payment'

    if (appointment.payment_status === 'unpaid') return 'Make Payment'

    return 'Make Payment'
  }

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Appointment #{appointment.appointment_id}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">Date & Time:</span>{' '}
          {formatDate(appointment.appointment_time)}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Doctor:</span> {appointment.doctor_id}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Reason:</span> {appointment.reason}
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-medium">Created:</span>{' '}
          {formatDate(appointment.created_at)}
        </p>

        {verificationError && (
          <p className="text-red-500 text-sm">{verificationError}</p>
        )}
      </div>

      <div className="mt-4">
        {appointment.payment_status === 'unpaid' ||
        appointment.payment_status === 'pending' ? (
          <button
            onClick={handlePayment}
            disabled={initPaymentMutation.isPending || isVerifying}
            className={`w-full px-4 py-2 rounded text-white ${
              initPaymentMutation.isPending || isVerifying
                ? 'bg-yellow-500'
                : 'bg-blue-500 hover:bg-blue-600'
            } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {getPaymentButtonText()}
          </button>
        ) : (
          <button className="w-full px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors">
            Payment Completed
          </button>
        )}
      </div>
      <br />
      <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
        <a
          href={appointment.join_url} // Patient gets join_url
          target="_blank"
          rel="noopener noreferrer"
        >
          Join Zoom Meeting
        </a>
      </button>
    </div>
  )
}

export const PatientAppointments = ({ patientId }: { patientId: number }) => {
  const {
    data: appointments,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAppointmentsByIdQuery(patientId)

  const handleRefresh = () => {
    refetch()
  }

  if (isLoading)
    return <div className="text-center py-8">Loading appointments...</div>
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    )

  const appointmentsArray = Array.isArray(appointments)
    ? appointments
    : [appointments].filter(Boolean)

  if (!appointmentsArray.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No appointments found for this patient.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Patient Appointments
        </h2>
        {/* <button
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointmentsArray.map((appointment) => (
          <AppointmentCard
            key={appointment.appointment_id}
            appointment={appointment}
            onPaymentVerified={handleRefresh}
          />
        ))}
      </div>
    </div>
  )
}

export default PatientAppointments
