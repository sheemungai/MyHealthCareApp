import { initPaymentFn, verifyPaymentFn } from "@/API/payments"
import { useQuery } from "@tanstack/react-query"

export const useInitPayments = (payments: any) => {
    useQuery({
        queryKey: ['initPayments'],
        queryFn: () => initPaymentFn(payments),
    })
}

export const useVerifyPayment = () => {
    return useQuery({
        queryKey: ['verifyPayment'],
        queryFn: () => verifyPaymentFn(),
    })
}
