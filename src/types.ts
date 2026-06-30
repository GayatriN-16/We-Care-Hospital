/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Doctor {
  id: string;
  name: string;
  role: string;
  specialty: string;
  departmentId: string;
  image: string;
  bio: string;
  education: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  availability: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
  timeSlots: string[]; // e.g. ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"]
  contactEmail: string;
}

export interface Department {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  iconName: string; // lucide icon name
  image: string;
  services: string[];
  stats: {
    label: string;
    value: string;
  }[];
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  userId: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  age: number;
  treatment: string;
  text: string;
  rating: number;
  avatar: string;
}
