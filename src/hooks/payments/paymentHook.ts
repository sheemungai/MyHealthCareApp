import { useMutation} from "@tanstack/react-query"
import { initPaymentFn, verifyPaymentFn } from "@/API/payments"

export const useInitPayments = () => {
  return useMutation({
    mutationFn: (paymentData: any) => initPaymentFn(paymentData),
  })
}

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (reference: number) => verifyPaymentFn(reference),
  })
}