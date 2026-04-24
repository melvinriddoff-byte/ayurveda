export type DoshaType = 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha' | null;

export type AppointmentType = 'in-person' | 'video';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type UserRole = 'patient' | 'hospital';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Hospital {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  yearEstablished: number;
  accreditations: string[];
  specialties: string[];
  doctors: Doctor[];
  amenities: string[];
}

export interface Doctor {
  id: string;
  hospitalId: string;
  hospitalName: string;
  name: string;
  photo: string;
  title: string;
  specialties: string[];
  doshaExpertise: DoshaType[];
  bio: string;
  experience: number;
  education: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  consultationFee: number;
  videoFee: number;
  availableDays: string[];
  nextAvailable: string;
  acceptsVideo: boolean;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  email: string;
  dob: string;
  dosha: DoshaType;
  doshaAssessmentDate?: string;
  medicalHistory: string;
  allergies: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
  followUpDate?: string;
  prescription?: string;
  meetingLink?: string;
  fee: number;
}

export interface DoshaQuestion {
  id: string;
  question: string;
  category: 'body' | 'mind' | 'digestion' | 'sleep' | 'emotion';
  options: {
    text: string;
    dosha: 'vata' | 'pitta' | 'kapha';
  }[];
}

export interface DoshaResult {
  dominant: 'vata' | 'pitta' | 'kapha';
  secondary?: 'vata' | 'pitta' | 'kapha';
  scores: { vata: number; pitta: number; kapha: number };
  description: string;
  recommendations: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
