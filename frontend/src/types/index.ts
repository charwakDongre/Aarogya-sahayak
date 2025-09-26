export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  phone: string;
  gender?: string;
  state?: string;
  district?: string;
  city?: string;
  conditions?: string[];
  preferredLanguage?: string;
}

export interface Vital {
  id: string;
  type: 'heart_rate' | 'blood_pressure' | 'temperature' | 'weight' | 'glucose';
  value: string;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: 'medication' | 'appointment' | 'exercise' | 'general';
  priority: 'high' | 'medium' | 'low';
  scheduledTime: string;
  isCompleted: boolean;
  isRecurring: boolean;
  recurringPattern?: string;
}