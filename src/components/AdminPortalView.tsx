import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Activity, 
  Calendar, 
  User, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  PlusCircle, 
  LogOut, 
  Lock, 
  Mail, 
  Phone, 
  Heart, 
  RefreshCw,
  AlertCircle,
  Briefcase,
  Sliders,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, query } from 'firebase/firestore';
import { Appointment, Doctor, Department } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data';

export default function AdminPortalView() {
  const { user, signInAdmin, logOut, loading: authLoading } = useAuth();
  
  // Login credentials states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Administrative stats & list states
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  
  // Intake / Create Booking form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    departmentId: '',
    doctorId: '',
    date: '',
    timeSlot: '',
    reason: '',
    status: 'confirmed' as const,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load bookings list in real-time
  useEffect(() => {
    if (!user || !user.isAdmin) {
      setBookings([]);
      setLoadingBookings(false);
      return;
    }

    setLoadingBookings(true);

    if (user.isLocalSandbox) {
      const loadLocal = () => {
        const localData = localStorage.getItem('we_care_appointments');
        if (localData) {
          try {
            const list: Appointment[] = JSON.parse(localData);
            list.sort((a, b) => b.id.localeCompare(a.id));
            setBookings(list);
          } catch (e) {
            console.error('Error parsing local sandbox storage:', e);
          }
        }
        setLoadingBookings(false);
      };
      loadLocal();
      window.addEventListener('storage', loadLocal);
      return () => window.removeEventListener('storage', loadLocal);
    }

    // Live Stream from Firebase for Admin
    const bookingsQuery = query(collection(db, 'bookings'));
    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingsList = snapshot.docs.map((d) => d.data() as Appointment);
        bookingsList.sort((a, b) => b.id.localeCompare(a.id));
        setBookings(bookingsList);
        setLoadingBookings(false);
      },
      (error) => {
        console.warn('Admin onSnapshot rejected by Firestore (possible rule propagation lag). Falling back to local storage:', error);
        // Fallback
        const localData = localStorage.getItem('we_care_appointments');
        if (localData) {
          try {
            const list: Appointment[] = JSON.parse(localData);
            list.sort((a, b) => b.id.localeCompare(a.id));
            setBookings(list);
          } catch (e) {
            console.error(e);
          }
        }
        setLoadingBookings(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // Derived filtered listings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesDept = deptFilter === 'all' || booking.departmentId === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Administrative Quick Stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  // Actions: Update clinical status
  const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    if (user?.isLocalSandbox) {
      const localData = localStorage.getItem('we_care_appointments');
      if (localData) {
        try {
          const list: Appointment[] = JSON.parse(localData);
          const updated = list.map((appt) => {
            if (appt.id === bookingId) {
              return { ...appt, status: newStatus };
            }
            return appt;
          });
          localStorage.setItem('we_care_appointments', JSON.stringify(updated));
          setBookings(updated);
        } catch (e) {
          console.error(e);
        }
      }
      return;
    }

    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.warn('Firestore booking update failed, fallback to local update:', error);
      const localData = localStorage.getItem('we_care_appointments');
      if (localData) {
        try {
          const list: Appointment[] = JSON.parse(localData);
          const updated = list.map((appt) => {
            if (appt.id === bookingId) {
              return { ...appt, status: newStatus };
            }
            return appt;
          });
          localStorage.setItem('we_care_appointments', JSON.stringify(updated));
          setBookings(updated);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  // Form submission handler: Create booking
  const handleCreateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate entries
    const { patientName, patientEmail, patientPhone, departmentId, doctorId, date, timeSlot, reason, status } = formData;
    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim() || !departmentId || !doctorId || !date || !timeSlot || !reason.trim()) {
      setFormError('Please complete all clinical and contact fields before intake.');
      return;
    }

    setIsSubmitting(true);

    const bookingId = 'WCH-' + Math.floor(100000 + Math.random() * 90000);
    const selectedDept = DEPARTMENTS.find(d => d.id === departmentId);
    const selectedDoc = DOCTORS.find(d => d.id === doctorId);

    const newAppointment: Appointment = {
      id: bookingId,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      doctorId,
      doctorName: selectedDoc?.name || 'Staff Specialist',
      departmentId,
      departmentName: selectedDept?.name || 'General Outpatient',
      date,
      timeSlot,
      reason: reason.trim(),
      status,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userId: 'ADMIN-UID-CREATED'
    };

    if (user?.isLocalSandbox) {
      try {
        const localData = localStorage.getItem('we_care_appointments');
        const list: Appointment[] = localData ? JSON.parse(localData) : [];
        list.unshift(newAppointment);
        localStorage.setItem('we_care_appointments', JSON.stringify(list));
        
        setBookings(list);
        setShowAddForm(false);
        setFormData({
          patientName: '',
          patientEmail: '',
          patientPhone: '',
          departmentId: '',
          doctorId: '',
          date: '',
          timeSlot: '',
          reason: '',
          status: 'confirmed',
        });
      } catch (e) {
        console.error(e);
        setFormError('Could not save booking to database.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const docRef = doc(db, 'bookings', bookingId);
      await setDoc(docRef, newAppointment);
      
      setShowAddForm(false);
      setFormData({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        departmentId: '',
        doctorId: '',
        date: '',
        timeSlot: '',
        reason: '',
        status: 'confirmed',
      });
    } catch (error: any) {
      console.warn('Firestore direct write failed, adding to local storage fallback:', error);
      try {
        const localData = localStorage.getItem('we_care_appointments');
        const list: Appointment[] = localData ? JSON.parse(localData) : [];
        list.unshift(newAppointment);
        localStorage.setItem('we_care_appointments', JSON.stringify(list));
        setBookings(list);
        setShowAddForm(false);
      } catch (e) {
        console.error(e);
        setFormError('Firestore security rejected booking submit. (Rule propagation lag)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      await signInAdmin(emailInput, passwordInput);
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || 'Administrative credentials verification failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Helper arrays for dynamic selection in Intake Form
  const currentDeptDoctors = DOCTORS.filter(d => d.departmentId === formData.departmentId);
  const selectedDocInfo = DOCTORS.find(d => d.id === formData.doctorId);
  const availableSlots = selectedDocInfo ? selectedDocInfo.timeSlots : [];

  // If loading authentication state
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-8 w-8 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Checking credentials security clearance...</p>
      </div>
    );
  }

  // LOGIN SCREEN FOR ADMINISTRATIVE ACCESS
  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl text-center space-y-6"
        >
          {/* Logo badge */}
          <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
            <Shield className="h-7 w-7 text-blue-400 fill-blue-400/10 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-black text-slate-900 tracking-tight">
              Hospital Admin Gateway
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Restricted medical records portal. Please sign in with your clinic administrator credentials.
            </p>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="gayatrinikam9999@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {loginError && (
              <div className="flex gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 px-4 text-xs font-black text-white hover:bg-slate-800 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoggingIn ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Shield className="h-4 w-4 text-blue-400" />
              )}
              <span>{isLoggingIn ? "Authorizing Staff..." : "Sign In to Admin Portal"}</span>
            </button>
          </form>

          {/* Prompting Hint Container */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-[11px] text-blue-800 text-left space-y-1 leading-relaxed">
            <p className="font-bold">🔑 Use assigned clinic details:</p>
            <p><strong>Email:</strong> gayatrinikam9999@gmail (or @gmail.com)</p>
            <p><strong>Password:</strong> 1609</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // LOGGED-IN CLINICAL ADMIN DASHBOARD
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
      
      {/* 1. Portal Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-800 uppercase tracking-wider">
              <Shield className="h-3 w-3 text-blue-600" /> Security Level: Hospital Admin
            </span>
            {user.isLocalSandbox && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-extrabold text-emerald-600 uppercase">
                Sandbox Mode
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Clinical Administration Dashboard
          </h1>
          <p className="text-xs text-slate-500 leading-none">
            Welcome, <span className="font-bold text-slate-700">{user.displayName}</span> ({user.email})
          </p>
        </div>

        <button
          onClick={() => logOut()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 transition-all"
        >
          <LogOut className="h-4 w-4 text-slate-400" />
          <span>Lock Terminal</span>
        </button>
      </div>

      {/* 2. Admin Quick Clinical Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Intake Bookings', count: stats.total, color: 'text-slate-900', bg: 'bg-slate-50 border-slate-150' },
          { label: 'Active Scheduled', count: stats.confirmed, color: 'text-blue-600', bg: 'bg-blue-50/40 border-blue-100' },
          { label: 'Outpatients Completed', count: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50/30 border-emerald-100' },
          { label: 'Cancelled Sessions', count: stats.cancelled, color: 'text-rose-600', bg: 'bg-rose-50/30 border-rose-100' },
        ].map((item, index) => (
          <div key={index} className={`rounded-2xl border p-5 space-y-1 text-left ${item.bg}`}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none block">
              {item.label}
            </span>
            <h3 className={`text-2xl font-black ${item.color} leading-none`}>
              {loadingBookings ? '...' : item.count}
            </h3>
          </div>
        ))}
      </div>

      {/* 3. Sliding / Toggle Intake Form */}
      <div className="border border-slate-200 rounded-3xl bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <PlusCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-display font-extrabold text-sm text-slate-900">
              In-Patient Clinical Intake Form
            </h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              showAddForm 
                ? 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300' 
                : 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10'
            }`}
          >
            {showAddForm ? 'Hide Intake Form' : 'New Patient Reservation'}
          </button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden border-b border-slate-100"
            >
              <form onSubmit={handleCreateBookingSubmit} className="p-6 space-y-6 text-left border-t border-slate-100">
                <div className="grid gap-5 md:grid-cols-3">
                  {/* Patient Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Patient Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Jennifer Smith"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Patient Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Patient Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="patient@gmail.com"
                        value={formData.patientEmail}
                        onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Patient Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Patient Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Phone className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 019-2834"
                        value={formData.patientPhone}
                        onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Clinical Department
                    </label>
                    <select
                      required
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, doctorId: '', timeSlot: '' })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Department...</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor Selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Assigned Clinician
                    </label>
                    <select
                      required
                      disabled={!formData.departmentId}
                      value={formData.doctorId}
                      onChange={(e) => setFormData({ ...formData, doctorId: e.target.value, timeSlot: '' })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Doctor...</option>
                      {currentDeptDoctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} - {d.role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Consultation Date
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Time slot selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Appointment Time Slot
                    </label>
                    <select
                      required
                      disabled={!formData.doctorId}
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Time Slot...</option>
                      {availableSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Intake Reservation Status
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    >
                      <option value="confirmed">Confirmed (Default)</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Visit Reason */}
                  <div className="space-y-1 md:col-span-3">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Clinical Visit Reason / Symptoms Summary
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Enter brief symptoms description, referral reason, or post-operation check specifics..."
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="flex gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>{formError}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 border border-blue-700 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span>{isSubmitting ? "Submitting Intake..." : "Submit Clinical Booking"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Controls, Filters, Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full md:max-w-md relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search bookings by ID, patient name, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
              Dept:
            </span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            >
              <option value="all">All Specialties</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            >
              <option value="all">All States</option>
              <option value="confirmed">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Main Bookings List Container */}
      <div className="border border-slate-150 rounded-3xl bg-white shadow-sm overflow-hidden text-left">
        {loadingBookings ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-400 animate-pulse">Syncing general hospital record books...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Sliders className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-black text-slate-800">No Clinic Records Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no reservations matches within selected criteria or hospital rosters. Submit a new Intake Booking to test immediately.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 font-extrabold text-slate-400 uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="px-6 py-4">ID / Intake</th>
                  <th className="px-6 py-4">Patient Information</th>
                  <th className="px-6 py-4">Assigned Specialist</th>
                  <th className="px-6 py-4">Session Date & Time</th>
                  <th className="px-6 py-4">Symptoms / Reason</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBookings.map((booking) => {
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* ID / Intake */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">
                          {booking.id}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Rec: {booking.createdAt}
                        </span>
                      </td>

                      {/* Patient Details */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block leading-normal">
                          {booking.patientName}
                        </span>
                        <span className="text-[10px] text-slate-400 flex flex-col gap-0.5 leading-none mt-1">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3 shrink-0" /> {booking.patientEmail}</span>
                          <span className="flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3 shrink-0" /> {booking.patientPhone}</span>
                        </span>
                      </td>

                      {/* Specialist */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block leading-tight">
                          {booking.doctorName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-[10px] font-extrabold text-blue-600 mt-1 leading-none uppercase">
                          {booking.departmentName}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-800 font-bold block">
                          {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1 leading-none">
                          <Clock className="h-3 w-3 text-slate-400 shrink-0" /> {booking.timeSlot}
                        </span>
                      </td>

                      {/* Visit Reason */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-500 leading-relaxed text-[11px]">
                          {booking.reason}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          booking.status === 'confirmed' 
                            ? 'bg-blue-50 border border-blue-100 text-blue-600'
                            : booking.status === 'completed'
                            ? 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                            : 'bg-rose-50 border border-rose-100 text-rose-600'
                        }`}>
                          {booking.status === 'confirmed' && <Clock className="h-3 w-3 shrink-0" />}
                          {booking.status === 'completed' && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                          {booking.status === 'cancelled' && <XCircle className="h-3 w-3 shrink-0" />}
                          <span>
                            {booking.status === 'confirmed' 
                              ? 'Confirmed' 
                              : booking.status === 'cancelled' 
                              ? 'Declined' 
                              : 'Completed'}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-1.5">
                          {booking.status !== 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 transition-all font-extrabold text-[10px] px-2.5 shadow-sm inline-flex items-center gap-1 cursor-pointer"
                              title="Confirm patient appointment"
                            >
                              <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                              <span>Confirm</span>
                            </button>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'completed')}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all font-bold text-[10px] px-2 cursor-pointer"
                              title="Set status to completed"
                            >
                              Complete
                            </button>
                          )}

                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-600 transition-all font-extrabold text-[10px] px-2.5 shadow-sm inline-flex items-center gap-1 cursor-pointer"
                              title="Decline patient appointment"
                            >
                              <XCircle className="h-3 w-3 text-rose-500 shrink-0" />
                              <span>Decline</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
