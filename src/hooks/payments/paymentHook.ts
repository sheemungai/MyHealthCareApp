import { useMutation, useQuery } from '@tanstack/react-query'
import { initPaymentFn, verifyPaymentFn } from '@/API/payments'

export const useInitPayments = () => {
  return useMutation({
    mutationFn: (paymentData: any) => initPaymentFn(paymentData),
    onSuccess: (data) => {
      console.log('Payment initialization successful:', data)
    },
    onError: (error) => {
      console.error('Payment initialization failed:', error)
    },
  })
}

export const useVerifyPayment = (reference?: string) => {
  return useQuery({
    queryKey: ['verifyPayment', reference],
    queryFn: () => verifyPaymentFn(),
    enabled: !!reference, // Only run when we have a reference
  })
}
