import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/pharmarcist/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/pharmarcist/patients"!</div>
}
