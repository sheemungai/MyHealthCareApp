import { deleteAppointmentFn, getAppointmentsFn } from '@/API/appointments'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAppointmentQuery = (
  
) => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAppointmentsFn(),
  })
}

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAppointmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}


