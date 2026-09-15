export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  condition: string;
  department: string;
  vitals: string;
  heart_rate: number;
  bp: string;
  o2: number;
  status: string;
  triage: string;
  arrived_at: string;
  created_at?: string;
}

export interface Ambulance {
  id: number;
  code: string;
  status: string;
  eta_minutes: number | null;
  location: string;
  crew: string;
  notes: string;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: string;
  avatar: string;
  department: string;
}

export interface Resource {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  icon: string;
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: string;
  casualties: number;
  status: string;
  eta_minutes: number;
  created_at?: string;
}

export interface Activity {
  id: number;
  message: string;
  icon: string;
  color: string;
  created_at?: string;
}

export interface HospitalMetrics {
  id: number;
  available_beds: number;
  er_patients: number;
  wait_time_mins: number;
  o2_supply_pct: number;
  blood_bank_type: string;
  blood_units: number;
  surgeons_on_call: number;
  hospital_name: string;
  updated_at?: string;
}
