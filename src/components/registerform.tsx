import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, 
  FaCheck, FaTimes, FaSpinner, FaCalendarAlt, 
  FaVenusMars, FaMapMarkerAlt, FaBriefcaseMedical, 
  FaIdCard, FaClock, FaMoneyBillWave 
} from 'react-icons/fa'

export function RegistrationPage() {
  const [registrationStatus, setRegistrationStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [role, setRole] = useState('patient') // Track role separately for immediate UI updates

  // Manual validation functions
  const validateName = (name: string, fieldName: string) => {
    if (!name) return `${fieldName} is required`
    if (name.length < 2) return `${fieldName} must be at least 2 characters`
    return null
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!re.test(email)) return 'Please enter a valid email'
    return null
  }

  const validatePhone = (phone: string) => {
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,}[-\s.]?[0-9]{3,}$/im
    if (!phone) return 'Phone number is required'
    if (!re.test(phone)) return 'Please enter a valid phone number'
    return null
  }

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'patient',
      password: '',
      confirmPassword: '',
      // Patient fields
      dob: '',
      gender: '',
      address: '',
      // Doctor fields
      specialization: '',
      licenseNumber: '',
      availability: '',
      consultationFee: ''
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Check if passwords match
        if (value.password !== value.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        
        // Prepare data based on role
        const userData = {
          name: `${value.firstName} ${value.lastName}`,
          email: value.email,
          phone: value.phone,
          role: value.role,
          password: value.password,
        }

        if (value.role === 'patient') {
          Object.assign(userData, {
            dob: value.dob,
            gender: value.gender,
            address: value.address
          })
        } else if (value.role === 'doctor') {
          Object.assign(userData, {
            specialization: value.specialization,
            licenseNumber: value.licenseNumber,
            availability: value.availability,
            consultationFee: Number(value.consultationFee)
          })
        }

        // Mock success - replace with real registration
        console.log('Submitting:', userData)
        setRegistrationStatus({
          success: true,
          message: 'Registration successful! Welcome to our platform!'
        })
        
      } catch (error) {
        setRegistrationStatus({
          success: false,
          message: error instanceof Error ? error.message : 'Registration failed. Please try again.'
        })
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  // Handle role change with immediate UI update
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setRole(newRole)
    form.getField('role').handleChange(newRole)
    setRegistrationStatus(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Registration Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Register With Us</h1>
        <p className="text-lg text-gray-600">Join our community today</p>
      </div>

      {/* Registration Form Container */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        {/* Status Message */}
        {registrationStatus && (
          <div className={`mb-6 p-4 rounded-md flex items-center ${
            registrationStatus.success 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {registrationStatus.success ? (
              <FaCheck className="mr-2 text-green-500" />
            ) : (
              <FaTimes className="mr-2 text-red-500" />
            )}
            <span>{registrationStatus.message}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name Field */}
            <form.Field
              name="firstName"
              children={(field) => {
                const error = validateName(field.state.value, 'First name')
                return (
                  <div className="col-span-1">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className={`h-5 w-5 ${
                          field.state.value 
                            ? error 
                              ? 'text-red-400' 
                              : 'text-green-400'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                          setRegistrationStatus(null)
                        }}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          field.state.value
                            ? error
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } rounded-md shadow-sm focus:outline-none`}
                        placeholder="John"
                      />
                    </div>
                    {field.state.value && error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaTimes className="mr-1" /> {error}
                      </p>
                    )}
                  </div>
                )
              }}
            />

            {/* Last Name Field */}
            <form.Field
              name="lastName"
              children={(field) => {
                const error = validateName(field.state.value, 'Last name')
                return (
                  <div className="col-span-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className={`h-5 w-5 ${
                          field.state.value 
                            ? error 
                              ? 'text-red-400' 
                              : 'text-green-400'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="lastName"
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                          setRegistrationStatus(null)
                        }}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          field.state.value
                            ? error
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } rounded-md shadow-sm focus:outline-none`}
                        placeholder="Doe"
                      />
                    </div>
                    {field.state.value && error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaTimes className="mr-1" /> {error}
                      </p>
                    )}
                  </div>
                )
              }}
            />

            {/* Email Field */}
            <form.Field
              name="email"
              children={(field) => {
                const error = validateEmail(field.state.value)
                return (
                  <div className="col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className={`h-5 w-5 ${
                          field.state.value 
                            ? error 
                              ? 'text-red-400' 
                              : 'text-green-400'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                          setRegistrationStatus(null)
                        }}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          field.state.value
                            ? error
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } rounded-md shadow-sm focus:outline-none`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {field.state.value && error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaTimes className="mr-1" /> {error}
                      </p>
                    )}
                    {field.state.value && !error && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <FaCheck className="mr-1" /> Email looks good!
                      </p>
                    )}
                  </div>
                )
              }}
            />

            {/* Phone Field */}
            <form.Field
              name="phone"
              children={(field) => {
                const error = validatePhone(field.state.value)
                return (
                  <div className="col-span-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className={`h-5 w-5 ${
                          field.state.value 
                            ? error 
                              ? 'text-red-400' 
                              : 'text-green-400'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                          setRegistrationStatus(null)
                        }}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          field.state.value
                            ? error
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } rounded-md shadow-sm focus:outline-none`}
                        placeholder="+1234567890"
                      />
                    </div>
                    {field.state.value && error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaTimes className="mr-1" /> {error}
                      </p>
                    )}
                    {field.state.value && !error && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <FaCheck className="mr-1" /> Valid phone number
                      </p>
                    )}
                  </div>
                )
              }}
            />

            {/* Role Field */}
            <div className="col-span-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role*
              </label>
              <select
                id="role"
                value={role}
                onChange={handleRoleChange}
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            {/* Password Field */}
            <form.Field
              name="password"
              children={(field) => {
                const error = validatePassword(field.state.value)
                return (
                  <div className="col-span-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className={`h-5 w-5 ${
                          field.state.value 
                            ? error 
                              ? 'text-red-400' 
                              : 'text-green-400'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                          setRegistrationStatus(null)
                        }}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          field.state.value
                            ? error
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } rounded-md shadow-sm focus:outline-none`}
                        placeholder="••••••"
                      />
                    </div>
                    {field.state.value && error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaTimes className="mr-1" /> {error}
                      </p>
                    )}
                    {field.state.value && !error && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <FaCheck className="mr-1" /> Password meets requirements
                      </p>
                    )}
                  </div>
                )
              }}
            />

            {/* Confirm Password Field */}
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const password = form.getFieldValue('password')
                const error = 
                  !field.state.value ? 'Please confirm your password' :
                  field.state.value !== password ? 'Passwords do not match' : null
                
                return (
                  <div className="col-span-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className={`h-5 w-5 ${
                          field.state.value 
                            ? error 
                              ? 'text-red-400' 
                              : 'text-green-400'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                          setRegistrationStatus(null)
                        }}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          field.state.value
                            ? error
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } rounded-md shadow-sm focus:outline-none`}
                        placeholder="••••••"
                      />
                    </div>
                    {field.state.value && error && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FaTimes className="mr-1" /> {error}
                      </p>
                    )}
                    {field.state.value && !error && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <FaCheck className="mr-1" /> Passwords match!
                      </p>
                    )}
                  </div>
                )
              }}
            />

            {/* Patient-specific fields */}
            {role === 'patient' && (
              <>
                {/* Date of Birth */}
                <form.Field
                  name="dob"
                  children={(field) => (
                    <div className="col-span-1">
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="dob"
                          type="date"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                />

                {/* Gender */}
                <form.Field
                  name="gender"
                  children={(field) => (
                    <div className="col-span-1">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaVenusMars className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="gender"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}
                />

                {/* Address */}
                <form.Field
                  name="address"
                  children={(field) => (
                    <div className="col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="address"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123 Main St, Nairobi"
                        />
                      </div>
                    </div>
                  )}
                />
              </>
            )}

            {/* Doctor-specific fields */}
            {role === 'doctor' && (
              <>
                {/* Specialization */}
                <form.Field
                  name="specialization"
                  children={(field) => (
                    <div className="col-span-1">
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBriefcaseMedical className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="specialization"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Cardiology"
                        />
                      </div>
                    </div>
                  )}
                />

                {/* License Number */}
                <form.Field
                  name="licenseNumber"
                  children={(field) => (
                    <div className="col-span-1">
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        License Number*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="licenseNumber"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="MD-123456"
                        />
                      </div>
                    </div>
                  )}
                />

                {/* Availability */}
                <form.Field
                  name="availability"
                  children={(field) => (
                    <div className="col-span-1">
                      <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                        Availability*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaClock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="availability"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Mon-Fri, 9am-5pm"
                        />
                      </div>
                    </div>
                  )}
                />

                {/* Consultation Fee */}
                <form.Field
                  name="consultationFee"
                  children={(field) => (
                    <div className="col-span-1">
                      <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                        Consultation Fee (KSH)*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMoneyBillWave className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="consultationFee"
                          type="number"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="2000"
                        />
                      </div>
                    </div>
                  )}
                />
              </>
            )}
          </div>

          {/* Submit Button */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`w-full mt-6 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !canSubmit || isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          />
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}