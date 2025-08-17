import { updatePatientFn } from "@/API/patients"
import type { TPatient} from "@/Types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateProfileFn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patientData: TPatient) => updatePatientFn(patientData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}