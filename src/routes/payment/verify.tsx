import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/payment/verify')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/payment/verify"!</div>
}
