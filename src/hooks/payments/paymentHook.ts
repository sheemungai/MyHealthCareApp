import { useMutation, useQuery } from "@tanstack/react-query"
import { initPaymentFn, verifyPaymentFn } from "@/API/payments"

export const useInitPayments = () => {
  return useMutation({
    mutationFn: (paymentData: any) => initPaymentFn(paymentData),
  })
}

export const useVerifyPayment = () => {
  return useQuery({
    queryKey: ['verifyPayment'],
    queryFn: () => verifyPaymentFn(),
    enabled: false, // We'll manually trigger this when needed
  })
}