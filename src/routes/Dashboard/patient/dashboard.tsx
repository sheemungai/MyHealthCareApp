import PatientDashboard from '@/components/patientLanding'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/dashboard')({
  component: PatientDashboard,
})


