import { useEffect } from 'react'
import { useVerifyPayment } from '@/hooks/payments/paymentHook'
import { useLocation } from '@tanstack/react-router'

interface PaymentVerificationProps {
  onSuccess: () => void
  onError: () => void
}

export const PaymentVerification = ({ onSuccess, onError }: PaymentVerificationProps) => {
  const location = useLocation()
  const { data: verificationData, refetch: verifyPayment, isError } = useVerifyPayment()

  useEffect(() => {
    // Check for payment reference in URL
    const queryParams = new URLSearchParams(location.search)
    const reference = queryParams.get('reference')
    
    if (reference) {
      verifyPayment()
    }
  }, [location, verifyPayment])

  useEffect(() => {
    if (verificationData) {
      // Handle successful verification
      console.log('Payment verified:', verificationData)
      onSuccess()
    }
  }, [verificationData, onSuccess])

  useEffect(() => {
    if (isError) {
      onError()
    }
  }, [isError, onError])

  return null
}