/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import DepartmentsView from './components/DepartmentsView';
import DoctorsView from './components/DoctorsView';
import AppointmentBookingView from './components/AppointmentBookingView';
import MyBookingsView from './components/MyBookingsView';
import DoctorProfileModal from './components/DoctorProfileModal';
import AdminPortalView from './components/AdminPortalView';
import { DOCTORS, DEPARTMENTS } from './data';
import { Doctor } from './types';

export default function App() {
  // Navigation State: 'home' | 'departments' | 'doctors' | 'about' | 'book' | 'bookings'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Deep linking triggers
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);

  // Doctor modal state
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Counter to force Header component to update its badge count when appointments are scheduled or deleted
  const [bookingTriggerCount, setBookingTriggerCount] = useState(0);

  const handleNavigate = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDeptId(deptId);
    setCurrentTab('departments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSelectedDept = () => {
    setSelectedDeptId(null);
  };

  const handleSelectDoctorForModal = (doctor: Doctor) => {
    setSelectedDoctorForModal(doctor);
    setIsModalOpen(true);
  };

  const handleBookWithDoctor = (doctorId: string) => {
    setPreselectedDoctorId(doctorId);
    setCurrentTab('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearPreselectedDoctor = () => {
    setPreselectedDoctorId(null);
  };

  const handleBookingSuccess = () => {
    setBookingTriggerCount((prev) => prev + 1);
  };

  // Find department details for active modal doctor
  const modalDoctorDepartment = selectedDoctorForModal
    ? DEPARTMENTS.find((d) => d.id === selectedDoctorForModal.departmentId)
    : undefined;

  // Render correct content view based on tab
  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleNavigate}
            onSelectDepartment={handleSelectDepartment}
          />
        );
      case 'departments':
        return (
          <DepartmentsView
            onNavigate={handleNavigate}
            selectedDeptId={selectedDeptId}
            onClearSelectedDept={handleClearSelectedDept}
            onSelectDoctor={handleSelectDoctorForModal}
            onBookWithDoctor={handleBookWithDoctor}
          />
        );
      case 'doctors':
        return (
          <DoctorsView
            onSelectDoctor={handleSelectDoctorForModal}
            onBookWithDoctor={handleBookWithDoctor}
          />
        );
      case 'about':
        return <AboutView />;
      case 'book':
        return (
          <AppointmentBookingView
            preselectedDoctorId={preselectedDoctorId}
            onClearPreselectedDoctor={handleClearPreselectedDoctor}
            onBookingSuccess={handleBookingSuccess}
            onNavigate={handleNavigate}
          />
        );
      case 'bookings':
        return <MyBookingsView onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPortalView />;
      default:
        return (
          <HomeView
            onNavigate={handleNavigate}
            onSelectDepartment={handleSelectDepartment}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased select-none">
      {/* Universal Sticky Header Navigation */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        bookingTriggerCount={bookingTriggerCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 mt-6">
        {renderActiveView()}
      </main>

      {/* Specialist Profile Modal Popup */}
      <DoctorProfileModal
        doctor={selectedDoctorForModal}
        department={modalDoctorDepartment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAppointment={handleBookWithDoctor}
      />

      {/* Universal Website Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
