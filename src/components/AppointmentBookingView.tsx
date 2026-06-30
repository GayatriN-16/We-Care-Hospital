/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Heart,
  Baby,
  Activity,
  Brain,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Printer,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Department, Doctor, Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import SignInSection from './SignInSection';

interface AppointmentBookingViewProps {
  preselectedDoctorId: string | null;
  onClearPreselectedDoctor: () => void;
  onBookingSuccess: () => void;
  onNavigate: (tab: string) => void;
}

// Icon mapper helper
const getIconComponent = (name: string) => {
  switch (name) {
    case 'Heart':
      return Heart;
    case 'Baby':
      return Baby;
    case 'Activity':
      return Activity;
    case 'Brain':
      return Brain;
    case 'Shield':
      return Shield;
    case 'Sparkles':
      return Sparkles;
    default:
      return Activity;
  }
};

export default function AppointmentBookingView({
  preselectedDoctorId,
  onClearPreselectedDoctor,
  onBookingSuccess,
  onNavigate,
}: AppointmentBookingViewProps) {
  const { user, loading } = useAuth();

  // Steps: 1 = Department, 2 = Doctor, 3 = Date & Time, 4 = Patient Info, 5 = Receipt
  const [step, setStep] = useState(1);

  // Selections
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Form Inputs
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [visitReason, setVisitReason] = useState('');

  // Generated Confirmed Pass
  const [confirmedPass, setConfirmedPass] = useState<Appointment | null>(null);

  // Prefill logged-in user credentials
  useEffect(() => {
    if (user) {
      setPatientName(user.displayName || '');
      setPatientEmail(user.email || '');
    }
  }, [user]);

  // Handle pre-selection logic
  useEffect(() => {
    if (preselectedDoctorId) {
      const doctor = DOCTORS.find((d) => d.id === preselectedDoctorId);
      if (doctor) {
        const dept = DEPARTMENTS.find((dp) => dp.id === doctor.departmentId);
        setSelectedDoc(doctor);
        if (dept) setSelectedDept(dept);
        setStep(3); // Skip directly to Date & Time selection!
      }
    }
  }, [preselectedDoctorId]);

  // Clean state when leaving
  useEffect(() => {
    return () => {
      onClearPreselectedDoctor();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-8 w-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 animate-pulse">Initializing reservation environment...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <SignInSection
        title="Schedule Your Appointment"
        subtitle="Sign in with your patient account to book a secure clinic reservation with our medical experts."
      />
    );
  }

  // Filtered doctors for selected department
  const availableDoctors = selectedDept
    ? DOCTORS.filter((d) => d.departmentId === selectedDept.id)
    : [];

  // Create a list of next 7 working days to select from (skipping Sundays)
  const getNextAvailableDays = () => {
    const dates = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let count = 0;
    let dayOffset = 1;

    while (count < 7) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      const dayName = weekdays[d.getDay()];

      // Skip Sunday
      if (dayName !== 'Sun') {
        const dateStr = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        // Filter based on doctor availability if doctor is selected
        const isDocAvailable = selectedDoc ? selectedDoc.availability.includes(dayName) : true;

        dates.push({
          dateStr,
          label,
          dayName,
          isDocAvailable
        });
        count++;
      }
      dayOffset++;
    }
    return dates;
  };

  const datesToSelect = getNextAvailableDays();

  const handleDeptSelect = (dept: Department) => {
    setSelectedDept(dept);
    // If we changed department, reset selected doctor
    if (selectedDoc && selectedDoc.departmentId !== dept.id) {
      setSelectedDoc(null);
    }
    setStep(2);
  };

  const handleDocSelect = (doc: Doctor) => {
    setSelectedDoc(doc);
    setStep(3);
  };

  const handleBack = () => {
    if (step > 1) {
      // If we are at Step 3 and had a preselected doctor, going back takes us to Step 1
      if (step === 3 && preselectedDoctorId) {
        onClearPreselectedDoctor();
        setStep(1);
      } else {
        setStep(step - 1);
      }
    }
  };

  const validateForm = () => {
    if (!patientName.trim()) return 'Please enter patient full name.';
    if (!patientEmail.trim() || !patientEmail.includes('@')) return 'Please enter a valid email address.';
    if (!patientPhone.trim() || patientPhone.length < 8) return 'Please enter a valid contact phone number.';
    if (!visitReason.trim()) return 'Please describe the reason for your visit.';
    return '';
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    if (!selectedDept || !selectedDoc || !selectedDate || !selectedTimeSlot) {
      alert('Please fill out all reservation steps.');
      return;
    }

    if (!user) {
      alert('You must be signed in to book an appointment.');
      return;
    }

    // Create unique registration receipt ID
    const bookingId = 'WCH-' + Math.floor(100000 + Math.random() * 90000);

    const newAppointment: Appointment = {
      id: bookingId,
      patientName,
      patientEmail,
      patientPhone,
      doctorId: selectedDoc.id,
      doctorName: selectedDoc.name,
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      reason: visitReason,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userId: user.uid
    };

    if (user.isLocalSandbox) {
      try {
        // Save to local storage for Sandbox bypass mode
        const existingBookingsStr = localStorage.getItem('we_care_appointments');
        const existingBookings: Appointment[] = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
        existingBookings.unshift(newAppointment);
        localStorage.setItem('we_care_appointments', JSON.stringify(existingBookings));

        setConfirmedPass(newAppointment);
        setStep(5);
        onBookingSuccess();
      } catch (e) {
        console.error('Error saving sandbox booking locally:', e);
        alert('Could not save booking to Sandbox container storage.');
      }
      return;
    }

    try {
      // Save to Firestore bookings collection
      const docRef = doc(db, 'bookings', bookingId);
      await setDoc(docRef, newAppointment);

      setConfirmedPass(newAppointment);
      setStep(5);
      onBookingSuccess();
    } catch (error) {
      console.warn('Firestore booking submission failed, attempting local fallback:', error);
      try {
        const existingBookingsStr = localStorage.getItem('we_care_appointments');
        const existingBookings: Appointment[] = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
        existingBookings.unshift(newAppointment);
        localStorage.setItem('we_care_appointments', JSON.stringify(existingBookings));

        setConfirmedPass(newAppointment);
        setStep(5);
        onBookingSuccess();
      } catch (e) {
        console.error(e);
        handleFirestoreError(error, OperationType.CREATE, `bookings/${bookingId}`);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetForm = () => {
    // Clear selections
    setSelectedDept(null);
    setSelectedDoc(null);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setVisitReason('');
    setConfirmedPass(null);
    onClearPreselectedDoctor();
    setStep(1);
  };

  // Step names for indicator banner
  const stepsList = ['Specialization', 'Physician', 'Schedule', 'Patient Data'];

  return (
    <div className="max-w-4xl mx-auto pb-16 px-4 md:px-6">
      {/* Step Indicator Widget (Only show for steps 1-4) */}
      {step < 5 && (
        <div className="mb-10 pt-4">
          <div className="flex items-center justify-between">
            {stepsList.map((stLabel, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-[10px] md:text-xs font-semibold tracking-wide ${
                        isActive ? 'text-blue-600 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {stLabel}
                    </span>
                  </div>
                  {idx < stepsList.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-colors ${
                        step > stepNum ? 'bg-emerald-500' : 'bg-slate-100'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Form Box */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Department */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-display text-xl font-bold text-slate-900">Step 1: Select Specialization Department</h2>
                <p className="text-xs text-slate-400">Choose the medical clinical wing best suited for your diagnosis or consult.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {DEPARTMENTS.map((dept) => {
                  const Icon = getIconComponent(dept.iconName);
                  return (
                    <div
                      key={dept.id}
                      id={`select-dept-${dept.id}`}
                      onClick={() => handleDeptSelect(dept)}
                      className="group flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 h-10 w-10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-display font-bold text-slate-900 text-sm">{dept.name}</h3>
                        <p className="text-[11px] text-slate-400 leading-normal">{dept.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Doctor */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-slate-900">Step 2: Choose Specialist Physician</h2>
                  <p className="text-xs text-slate-400">
                    Select a board-certified doctor in the <strong>{selectedDept?.name}</strong> wing.
                  </p>
                </div>
                <button
                  id="step2-back-btn"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" /> Go Back
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {availableDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    id={`select-doc-${doc.id}`}
                    onClick={() => handleDocSelect(doc)}
                    className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all items-center"
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={doc.image}
                      alt={doc.name}
                      className="h-16 w-16 rounded-lg object-cover shrink-0 border border-slate-100"
                    />
                    <div className="space-y-0.5">
                      <h3 className="font-display font-bold text-slate-900 text-sm leading-snug">{doc.name}</h3>
                      <p className="text-[11px] font-medium text-blue-600">{doc.role}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{doc.specialty}</p>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Exp: <strong className="text-slate-700">{doc.experienceYears} Years</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Choose Date & Time */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-slate-900">Step 3: Select Date & Time Slot</h2>
                  <p className="text-xs text-slate-400">
                    Consulting with <strong>{selectedDoc?.name}</strong> ({selectedDept?.name}).
                  </p>
                </div>
                <button
                  id="step3-back-btn"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" /> Go Back
                </button>
              </div>

              {/* Date Selection Cards */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4 text-blue-600" /> Choose Available Date
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {datesToSelect.map((dt) => (
                    <button
                      key={dt.dateStr}
                      id={`date-select-${dt.dateStr}`}
                      disabled={!dt.isDocAvailable}
                      onClick={() => {
                        setSelectedDate(dt.dateStr);
                        setSelectedTimeSlot(''); // Reset time on date change
                      }}
                      className={`rounded-xl p-3 text-center border transition-all text-xs flex flex-col gap-1 ${
                        selectedDate === dt.dateStr
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : dt.isDocAvailable
                          ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-bold">{dt.label}</span>
                      <span className={`text-[9px] ${selectedDate === dt.dateStr ? 'text-blue-100' : 'text-slate-400'}`}>
                        {dt.isDocAvailable ? 'Slots Available' : 'Doctor Unavailable'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots (only show if date is picked) */}
              {selectedDate && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-indigo-600" /> Choose Appointment Time Slot
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {selectedDoc?.timeSlots.map((slot) => (
                      <button
                        key={slot}
                        id={`time-select-${slot.replace(':', '').replace(' ', '')}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`rounded-xl py-3 border text-center text-xs font-mono font-medium transition-all ${
                          selectedTimeSlot === slot
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button
                  id="step3-next-btn"
                  disabled={!selectedDate || !selectedTimeSlot}
                  onClick={() => setStep(4)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-xs font-bold text-white shadow-md transition-all ${
                    selectedDate && selectedTimeSlot
                      ? 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]'
                      : 'bg-slate-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>Enter Patient Details</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Patient Info */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-slate-900">Step 4: Register Patient Information</h2>
                  <p className="text-xs text-slate-400">
                    For checkup with <strong>{selectedDoc?.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTimeSlot}</strong>.
                  </p>
                </div>
                <button
                  id="step4-back-btn"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" /> Go Back
                </button>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Patient Full Name *</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        id="booking-patient-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Patient Email Address *</label>
                    <input
                      id="booking-patient-email"
                      type="email"
                      required
                      placeholder="john.doe@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Patient Contact Phone *</label>
                  <input
                    id="booking-patient-phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Reason for Consultation / Symptoms *</label>
                  <textarea
                    id="booking-patient-reason"
                    rows={4}
                    required
                    placeholder="Briefly describe the symptoms or reason for consulting the specialist..."
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-50 flex justify-end">
                  <button
                    id="submit-booking-btn"
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="h-5 w-5 animate-pulse" />
                    <span>Confirm & Schedule Consultation</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 5: Confirmed Receipt */}
          {step === 5 && confirmedPass && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Success Badge */}
              <div className="text-center space-y-2">
                <div className="mx-auto rounded-full bg-emerald-50 h-16 w-16 flex items-center justify-center text-emerald-500">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">Appointment Successfully Scheduled!</h2>
                <p className="text-xs text-slate-400">Your electronic consultation receipt is generated and registered securely.</p>
              </div>

              {/* Printable Ticket Receipt Card */}
              <div className="border border-slate-100 rounded-2xl bg-slate-50 p-6 md:p-8 space-y-6 relative overflow-hidden print:border-none print:bg-white">
                {/* Visual barcode indicator lines */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-900 text-lg">WE CARE CLINIC PASS</h3>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">ID: {confirmedPass.id}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400">Registered On</p>
                    <p className="text-xs font-semibold text-slate-800">{confirmedPass.createdAt}</p>
                  </div>
                </div>

                {/* Main data grids */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Patient Information</p>
                    <p className="text-sm font-bold text-slate-900">{confirmedPass.patientName}</p>
                    <p className="text-xs text-slate-500">{confirmedPass.patientEmail}</p>
                    <p className="text-xs text-slate-500">{confirmedPass.patientPhone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Physician / Specialization</p>
                    <p className="text-sm font-bold text-slate-900">{confirmedPass.doctorName}</p>
                    <p className="text-xs font-semibold text-blue-600">{confirmedPass.departmentName} Department</p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 border-t border-slate-200 pt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Consultation Slot</p>
                    <p className="text-sm font-bold text-indigo-600 flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4" /> {confirmedPass.date}
                    </p>
                    <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {confirmedPass.timeSlot}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reason for Visit</p>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{confirmedPass.reason}"
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="border-t border-dashed border-slate-300 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
                    Status: Confirmed Registration
                  </span>
                  
                  {/* Pseudo Barcode */}
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-32 flex gap-0.5 items-center bg-slate-950 px-1 opacity-80 rounded">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-white h-full shrink-0"
                          style={{ width: `${i % 3 === 0 ? 3 : i % 5 === 0 ? 1 : 2}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[8px] font-mono font-bold text-slate-400 mt-1 uppercase">*{confirmedPass.id}*</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <button
                  id="print-receipt-btn"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  id="book-another-btn"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
                >
                  <span>Book Another Appointment</span>
                </button>
                <button
                  id="view-bookings-tab-btn"
                  onClick={() => onNavigate('bookings')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all"
                >
                  <FileText className="h-4 w-4" />
                  <span>Go to My Bookings</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
