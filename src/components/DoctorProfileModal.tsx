/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, GraduationCap, Calendar, Mail, Star, Sparkles, Heart } from 'lucide-react';
import { Doctor, Department } from '../types';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  department: Department | undefined;
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (doctorId: string) => void;
}

export default function DoctorProfileModal({
  doctor,
  department,
  isOpen,
  onClose,
  onBookAppointment,
}: DoctorProfileModalProps) {
  if (!doctor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Top Close Button */}
            <button
              id="close-doc-modal"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Doctor Header Banner */}
            <div className="relative h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="absolute bottom-4 left-6 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  <Sparkles className="mr-1 h-3.0 w-3.0 animate-pulse text-amber-300" />
                  We Care Specialist
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-6 pb-6">
              {/* Photo & Essential Details */}
              <div className="relative -mt-16 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                <img
                  referrerPolicy="no-referrer"
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-32 w-32 rounded-2xl border-4 border-white object-cover shadow-lg"
                />
                <div className="mb-2">
                  <h3 className="font-display text-2xl font-bold text-slate-900">{doctor.name}</h3>
                  <p className="font-medium text-blue-600">{doctor.role}</p>
                  <p className="text-sm text-slate-500">{doctor.specialty}</p>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid gap-6 md:grid-cols-5">
                {/* Left col: Stats & Credentials (2 cols) */}
                <div className="space-y-4 md:col-span-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <h4 className="mb-2 font-display text-sm font-semibold text-slate-800">Professional Ratings</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(doctor.rating) ? 'fill-current' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-800">{doctor.rating}</span>
                      <span className="text-xs text-slate-400">({doctor.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 space-y-3">
                    <h4 className="font-display text-sm font-semibold text-slate-800">Quick Facts</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Award className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>{doctor.experienceYears} Years of Experience</span>
                    </div>
                    {department && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Heart className="h-4 w-4 text-pink-500 shrink-0" />
                        <span>Department: <strong>{department.name}</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="break-all">{doctor.contactEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Right col: Bio, Education, Availability (3 cols) */}
                <div className="space-y-4 md:col-span-3">
                  <div>
                    <h4 className="mb-1 font-display text-sm font-semibold text-slate-800">Biography</h4>
                    <p className="text-sm leading-relaxed text-slate-600">{doctor.bio}</p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-display text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-indigo-600" /> Education & Credentials
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                      {doctor.education.map((edu, idx) => (
                        <li key={idx} className="leading-snug">{edu}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 font-display text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-emerald-600" /> Schedule Availability
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                        const isAvailable = doctor.availability.includes(day);
                        return (
                          <span
                            key={day}
                            className={`rounded px-2 py-1 text-xs font-medium tracking-wide ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-50 text-slate-300 border border-slate-100'
                            }`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  id="modal-cancel-btn"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Close Profile
                </button>
                <button
                  id="modal-book-btn"
                  onClick={() => {
                    onBookAppointment(doctor.id);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Book Instant Appointment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
