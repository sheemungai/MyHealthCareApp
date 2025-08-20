import {
  createAppointmentFn,
  deleteAppointmentFn,
  getAppointmentsFn,
} from '@/API/doctor API/appointments'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAppointmentsQuery = (AppointmentId: number) => {
  return useQuery({
    queryKey: ['appointments', AppointmentId],
    queryFn: () => getAppointmentsFn(AppointmentId),
  })
}

export const useGetAppointmentsByIdQuery = (appointmentId: number) => {
  return useQuery({
    queryKey: ['appointments', appointmentId],
    queryFn: () => getAppointmentsFn(appointmentId),
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

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (appointmentData: {
      doctor_id: number
      name: string
      patient_id: number
      status: string
      reason: string
      appointment_time: Date
      created_at: Date
    }) => createAppointmentFn(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
