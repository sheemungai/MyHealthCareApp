// import { useQuery, useMutation } from "@tanstack/react-query";
// import { TPatient } from "@/Types/types";
// import { useUpdateProfileFn } from "@/hooks/patients/profile";

// const PatientProfileForm = () => {
//   // Fetch patient data
//   const { data: patient, isLoading, isError } = useQuery({
//     queryKey: ['profile'],
//     queryFn: () => fetchPatientProfile(), // You'll need to implement this
//   });

//   const updateProfileMutation = useUpdateProfileFn();

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
    
//     const updatedPatient: Omit<TPatient, 'patient_id'> = {
//       name: formData.get('name') as string,
//       email: formData.get('email') as string,
//       dob: formData.get('dob') as string,
//       gender: formData.get('gender') as string,
//       phone: formData.get('phone') as string,
//       address: formData.get('address') as string,
//     };

//     // Include patient_id from existing data for the update
//     const fullPatientData: TPatient = {
//       ...updatedPatient,
//       patient_id: patient?.patient_id || 0, // Provide a fallback if needed
//     };

//     updateProfileMutation.mutate(fullPatientData);
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error loading profile</div>;
//   if (!patient) return <div>No profile data found</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Name Field */}
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               defaultValue={patient.name}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Email Field */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               defaultValue={patient.email}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               defaultValue={patient.password}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Date of Birth Field */}
//           <div>
//             <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
//               Date of Birth
//             </label>
//             <input
//               type="date"
//               id="dob"
//               name="dob"
//               defaultValue={patient.dob.split('T')[0]}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Gender Field */}
//           <div>
//             <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
//               Gender
//             </label>
//             <select
//               id="gender"
//               name="gender"
//               defaultValue={patient.gender}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//               <option value="Prefer not to say">Prefer not to say</option>
//             </select>
//           </div>

//           {/* Phone Field */}
//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               defaultValue={patient.phone}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//         </div>

//         {/* Address Field */}
//         <div>
//           <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//             Address
//           </label>
//           <textarea
//             id="address"
//             name="address"
//             defaultValue={patient.address}
//             rows={3}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Profile Image Upload (optional) */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Profile Image
//           </label>
//           <div className="flex items-center space-x-4">
//             {patient.img ? (
//               <img 
//                 src={patient.img} 
//                 alt="Profile" 
//                 className="h-16 w-16 rounded-full object-cover"
//               />
//             ) : (
//               <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-500">No image</span>
//               </div>
//             )}
//             <input
//               type="file"
//               id="img"
//               name="img"
//               accept="image/*"
//               className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="flex justify-end space-x-4 pt-4">
//           <button
//             type="button"
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={updateProfileMutation.isPending}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>

//         {updateProfileMutation.isError && (
//           <div className="text-red-500 mt-2">
//             Error updating profile: {updateProfileMutation.error.message}
//           </div>
//         )}

//         {updateProfileMutation.isSuccess && (
//           <div className="text-green-600 mt-2">
//             Profile updated successfully!
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default PatientProfileForm;