import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/admin/medicines')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/medicines"!</div>
}
