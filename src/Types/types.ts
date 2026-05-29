export interface loginResponse {
 token: {
   accessToken: string
   refreshToken: string
 }
 user:{
   email: string
  role: Role,
  user_id: string
 }
 
}

export interface loginType {
  email: string
  password: string
}

// Base User Type
export interface TUser {
  user_id:number;
  name: string;
  email: string;
  phone: string;
  role: string | 'patient' | 'doctor' | 'admin';
  img?: string;
  created_at: string;
}


export interface TProfile{
  name: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;

}

export type UserRole = 'admin' | 'pharmacist' | 'patient' | 'doctor'

export type AuthState = {
  tokens: Tokens | null
  user: UserAuthType | null
  isAuthenticated: boolean
}

export enum Role {
  admin = 'admin',
  pharmacist = 'pharmacist',
  patient = 'patient',
  doctor = 'doctor',
}


export interface UserAuthType {
  user_id: string
  email: string
  role: Role
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}
export type AuthActions = {
  login: (token: Tokens, userData: UserAuthType) => void;
  logout: () => void;
  updateAccessToken: (newAccessToken: string) => void;
  updateUser: (updatedUser: Partial<UserAuthType>) => void;
  verifyUser: () => void;
  reinitialize: () => void;
};

export type AuthStoreType = AuthState & AuthActions;


export interface TDoctor {
  doctor_id: number | string;
  doctor_name: string;
  email: string;
  specialization: string;
  license_number: string;
  availability: string;
  consultation_fee: number;
  appointment_id: number;
}

export interface TPatient {
  patient_id: number;
  name: string;
  email: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;

}

export interface TAppointment {
  appointment_id: number ;
  patient_id: number;
  name: string;
  doctor_id: number;
  appointment_time: string;
  status: string;
  payment_status: string;
  reason: string;
  created_at: string;
  join_url?: string;
  start_url?: string;
  authorization_url?: string;
}

export interface TPrescription {
  prescription_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number | null; // Made nullable
  notes: string;
  created_at: string;
}

export interface TPharmacyOrder {
  pharmacy_order_id: number;
  patient_id: number;
  doctor_id: number;
  quantity: number;
  status: string;
  created_at: string;
}

export interface TMedicine {
  medicine_id: number;
  name: string;
  description: string;
  stock_quantity: number;
  price: number;
  expiry_date: string;
}

export interface TRecord{
  record_id: number;
  patient_id: number;
  doctor_id: number;
  prescription_id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TPayment {
  payment_id: number; 
  appointment_id: number;
  patient_id: number; 
  payment_method: string;
  pharmacy_order_id: number;
  created_at: string;
  authorization_url: string;
  payment_reference: string;
  amount: number; 
  status: string;
}
  
export interface Doctor{
     doctor_id: string | number;
  name: string;
  specialization: string;
  email: string;
  availability: string;
  license_number: string;
  consultation_fee?: number;
};



// Patient specific type
export interface PatientUser extends TUser {
  role: 'patient';
  dob?: string;
  gender?: string;
  address?: string;
}

// Doctor specific type
export interface DoctorUser extends TUser {
  role: 'doctor';
  specialization: string;
  license_number: string;
  consultation_fee: number;
}

// Admin specific type
export interface AdminUser extends TUser {
  role: 'admin';
}

// Union type for all user profiles
export type UserProfile = PatientUser | DoctorUser | AdminUser;

// Update profile data type (all fields optional)
export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  // Patient fields
  dob?: string;
  gender?: string;
  address?: string;
  // Doctor fields
  specialization?: string;
  license_number?: string;
  consultation_fee?: number;
  img?: string;
}

// For creating a new user
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  // Optional patient fields
  dob?: string;
  gender?: string;
  address?: string;
  // Optional doctor fields
  specialization?: string;
  license_number?: string;
  consultation_fee?: number;
}

// API Response wrapper (if your backend uses this format)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}