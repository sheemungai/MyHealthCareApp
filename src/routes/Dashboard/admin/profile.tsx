// // routes/dashboard/admin/profile.tsx
// import { AdminProfile } from '@/components/profile/adminProfile'
// import { createFileRoute, redirect } from '@tanstack/react-router'

// export const Route = createFileRoute('/dashboard/admin/profile')({
//   component: AdminProfile,
//   beforeLoad: async () => {
//     const token = localStorage.getItem('token')
//     const role = localStorage.getItem('role')
    
//     if (!token || role !== 'admin') {
//       throw redirect({ to: '/login' })
//     }
    
//     return true
//   },
// })