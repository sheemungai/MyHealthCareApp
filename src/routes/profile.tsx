// routes/profile.tsx
import { ProfileRouter } from '@/components/profile/profileRouter'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: ProfileRouter,
  beforeLoad: async ({ location }) => {
    // Get token from localStorage (now correctly stored by login)
    const token = localStorage.getItem('token')
    
    console.log('Profile route - Token exists:', !!token)
    console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null')
    console.log('Role:', localStorage.getItem('role'))
    
    if (!token) {
      // Redirect to login page
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
    
    return true
  },
})