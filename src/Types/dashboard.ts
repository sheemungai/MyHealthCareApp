// types/dashboard.ts
export interface Dashboard {
  id: number;
  createdAt: string;
  updatedAt: string;
  doctors?: Doctor[];
  appointments?: Appointment[];
  records?: Record[];
  pharmacyOrders?: PharmacyOrder[];
  users?: User[];
}

export interface DashboardCard {
  stats: boolean;
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  actions?: string[];
  type: 'doctor' | 'appointment' | 'record' | 'pharmacy-order' | 'user';
  entity?: any;
}

export interface DashboardData {
  id: number;
  title: string;
  description: string;
  cards: DashboardCard[];
  totalDoctors: number;
  totalAppointments: number;
  totalRecords: number;
  totalPharmacyOrders: number;
  totalUsers: number;
  createdAt: string;
  updatedAt: string;
}

// You might need to import these from your existing types
export interface Doctor {
  doctor_id: number;
  doctor_name: string;
  specialization?: string;
  experience_years?: number;
  consultation_fee?: number;
}

export interface Appointment {
  appointment_id: number;
  appointment_time: string;
  reason?: string;
  payment_status?: string;
  doctor?: Doctor;
}

export interface Record {
  record_id: number;
  date_created: string;
  diagnosis?: string;
  doctor?: Doctor;
  patient?: any;
}

export interface PharmacyOrder {
  pharmacy_order_id: number;
  pharmacy_order_date: string;
  total_amount?: number;
  order_status?: string;
}

export interface User {
  user_id: number;
  name: string;
  email?: string;
  role?: string;
  date_created?: string;
}