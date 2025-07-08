import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/appointments"!</div>
}
