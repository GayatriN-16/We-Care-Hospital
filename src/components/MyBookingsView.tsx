/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Calendar,
  Clock,
  Heart,
  User,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import SignInSection from './SignInSection';

interface MyBookingsViewProps {
  onNavigate: (tab: string) => void;
}

export default function MyBookingsView({ onNavigate }: MyBookingsViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading } = useAuth();

  // Load bookings from Firestore in real-time or fall back to local storage
  useEffect(() => {
    if (!user) {
      setAppointments([]);
      return;
    }

    if (user.isLocalSandbox) {
      const loadLocal = () => {
        const localData = localStorage.getItem('we_care_appointments');
        if (localData) {
          try {
            const list: Appointment[] = JSON.parse(localData);
            // Sort local sandbox bookings by descending creation
            list.sort((a, b) => b.id.localeCompare(a.id));
            setAppointments(list.filter((b) => b.userId === user.uid));
          } catch (e) {
            console.error('Error parsing local storage bookings:', e);
          }
        }
      };
      loadLocal();
      window.addEventListener('storage', loadLocal);
      return () => window.removeEventListener('storage', loadLocal);
    }

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingsList = snapshot.docs.map((d) => d.data() as Appointment);
        // Sort appointments by id descending for order consistency
        bookingsList.sort((a, b) => b.id.localeCompare(a.id));
        setAppointments(bookingsList);
      },
      (error) => {
        console.warn('Firestore onSnapshot error, falling back to local storage:', error);
        const localData = localStorage.getItem('we_care_appointments');
        if (localData) {
          try {
            const list: Appointment[] = JSON.parse(localData);
            list.sort((a, b) => b.id.localeCompare(a.id));
            setAppointments(list.filter((b) => b.userId === user.uid));
          } catch (e) {
            console.error(e);
          }
        }
      }
    );

    return unsubscribe;
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this scheduled clinical appointment?');
    if (!confirmCancel) return;

    if (user?.isLocalSandbox) {
      const localData = localStorage.getItem('we_care_appointments');
      if (localData) {
        try {
          const list: Appointment[] = JSON.parse(localData);
          const updated = list.map((appt) => {
            if (appt.id === bookingId) {
              return { ...appt, status: 'cancelled' as const };
            }
            return appt;
          });
          localStorage.setItem('we_care_appointments', JSON.stringify(updated));
          setAppointments(updated.filter((b) => b.userId === user.uid));
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        status: 'cancelled'
      });
    } catch (error) {
      console.warn('Firestore update failed, falling back to cancel booking locally:', error);
      const localData = localStorage.getItem('we_care_appointments');
      if (localData) {
        try {
          const list: Appointment[] = JSON.parse(localData);
          const updated = list.map((appt) => {
            if (appt.id === bookingId) {
              return { ...appt, status: 'cancelled' as const };
            }
            return appt;
          });
          localStorage.setItem('we_care_appointments', JSON.stringify(updated));
          setAppointments(updated.filter((b) => b.userId === user.uid));
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-8 w-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 animate-pulse">Retrieving clinical consultation history...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <SignInSection
        title="View Your Consultations"
        subtitle="Sign in to your secure patient account to view, track, or cancel your scheduled clinic bookings."
      />
    );
  }

  // Filtered list based on search query
  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-16 px-4 md:px-6 max-w-4xl mx-auto">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pt-6">
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Patient Dashboard</span>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Your Consultations</h1>
          <p className="text-sm text-slate-500">Review, manage, or cancel your upcoming hospital appointments.</p>
        </div>

        {/* Search input (only show if there are actual appointments) */}
        {appointments.length > 0 && (
          <div className="relative w-full md:max-w-xs shrink-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              id="bookings-search"
              type="text"
              placeholder="Search by ID, Doctor, Patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {appointments.length === 0 ? (
          /* Empty State fallback */
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-xl mx-auto space-y-6"
          >
            <div className="mx-auto rounded-full bg-blue-50 text-blue-500 h-14 w-14 flex items-center justify-center">
              <FileText className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-slate-900 text-lg">No Appointments Booked Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                You currently do not have any upcoming medical or surgical consultations scheduled at We Care Hospital.
              </p>
            </div>
            <button
              id="empty-bookings-cta-btn"
              onClick={() => onNavigate('book')}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all cursor-pointer"
            >
              <span>Schedule Your First Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : filteredAppointments.length === 0 ? (
          /* Search mismatch state */
          <motion.div
            key="search-empty"
            className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200"
          >
            <p className="font-semibold text-slate-800">No matching appointments found for "{searchQuery}"</p>
            <p className="text-xs text-slate-400 mt-1">Try searching with a different keyword like Doctor name or Patient name.</p>
          </motion.div>
        ) : (
          /* List of Bookings */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredAppointments.map((appt) => {
              const isCancelled = appt.status === 'cancelled';
              return (
                <div
                  key={appt.id}
                  className={`rounded-2xl border p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between gap-6 transition-all ${
                    isCancelled ? 'border-slate-100 opacity-65' : 'border-slate-100 hover:border-indigo-100 hover:shadow-md'
                  }`}
                >
                  {/* Left Column: Patient & Doctor Info */}
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                        ID: {appt.id}
                      </span>
                      {isCancelled ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-100">
                          <XCircle className="h-3 w-3" /> Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                          <CheckCircle className="h-3 w-3" /> Confirmed
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">Created: {appt.createdAt}</span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Patient metadata */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</p>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="h-4 w-4 text-slate-400" /> {appt.patientName}
                        </p>
                        <p className="text-xs text-slate-500">{appt.patientEmail}</p>
                        <p className="text-xs text-slate-500">{appt.patientPhone}</p>
                      </div>

                      {/* Doctor metadata */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physician / Specialization</p>
                        <p className="text-sm font-bold text-slate-900">{appt.doctorName}</p>
                        <p className="text-xs font-semibold text-indigo-600">{appt.departmentName} Department</p>
                        <p className="text-xs text-slate-400 italic mt-1 font-light">"Reason: {appt.reason}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Time Slot & Action Button */}
                  <div className="flex flex-col sm:flex-row md:flex-col justify-between items-start md:items-end gap-4 shrink-0 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultation Hour</p>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-indigo-500" /> {appt.date}
                      </p>
                      <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-indigo-500" /> {appt.timeSlot}
                      </p>
                    </div>

                    {/* Cancel Action CTA */}
                    {!isCancelled && (
                      <button
                        id={`cancel-appt-btn-${appt.id}`}
                        onClick={() => handleCancelBooking(appt.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
