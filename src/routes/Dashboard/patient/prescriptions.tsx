import PrescriptionsCard from '@/components/patient/prescriptionsCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patient/prescriptions')({
  component: PrescriptionsCard,
})

