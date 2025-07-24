import { useEffect } from 'react'
import { useVerifyPayment } from '@/hooks/payments/paymentHook'
import { useLocation } from '@tanstack/react-router'  // or next/router if using Next.js

export const PaymentVerification = () => {
  const location = useLocation()
  const { data: verificationData, refetch: verifyPayment } = useVerifyPayment()

  useEffect(() => {
    // Check if URL contains payment reference (this depends on how Paystack redirects)
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
      // You might want to show a success message or update the UI
    }
  }, [verificationData])

  return null
}