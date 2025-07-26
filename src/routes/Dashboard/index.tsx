import { getUserRoleHelper } from '@/lib/authHelper'
import { createFileRoute } from '@tanstack/react-router'
import DoctorDashboard from '@/components/doctorLanding'
import PatientDashboard from '@/components/patientLanding'
import AdminDashboard from '@/components/adminLanding'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const currentRole = getUserRoleHelper()
  if (currentRole === 'doctor') {
    return <DoctorDashboard />
  } else if (currentRole === 'admin') {
    return <AdminDashboard />
  } else {
    return <PatientDashboard />
  }
};
