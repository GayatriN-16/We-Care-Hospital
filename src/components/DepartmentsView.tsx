/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Baby,
  Activity,
  Brain,
  Shield,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Award,
  ChevronRight,
  Star,
  Search
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Department, Doctor } from '../types';

interface DepartmentsViewProps {
  onNavigate: (tab: string) => void;
  selectedDeptId: string | null;
  onClearSelectedDept: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookWithDoctor: (doctorId: string) => void;
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

export default function DepartmentsView({
  onNavigate,
  selectedDeptId,
  onClearSelectedDept,
  onSelectDoctor,
  onBookWithDoctor,
}: DepartmentsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDeptId, setCurrentDeptId] = useState<string | null>(selectedDeptId);

  // Sync internal state with prop from Home/Navbar redirections
  useEffect(() => {
    setCurrentDeptId(selectedDeptId);
  }, [selectedDeptId]);

  const handleSelectDepartment = (id: string) => {
    setCurrentDeptId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setCurrentDeptId(null);
    onClearSelectedDept();
  };

  // Filtered departments based on search query
  const filteredDepartments = DEPARTMENTS.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Current selected department details
  const activeDepartment = DEPARTMENTS.find((d) => d.id === currentDeptId);
  // Filter doctors who belong to current department
  const departmentDoctors = activeDepartment
    ? DOCTORS.filter((doc) => doc.departmentId === activeDepartment.id)
    : [];

  return (
    <div className="pb-16 px-4 md:px-6 max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {!currentDeptId ? (
          /* Grid of Departments */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-12 pt-6"
          >
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Expert Specializations</span>
                <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Our Clinical Departments</h1>
                <p className="text-sm text-slate-500">We offer specialized medical and surgical wings, staffed by board-certified physicians.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:max-w-xs shrink-0">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  id="dept-search"
                  type="text"
                  placeholder="Search departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>

            {/* Grid */}
            {filteredDepartments.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDepartments.map((dept) => {
                  const Icon = getIconComponent(dept.iconName);
                  return (
                    <div
                      key={dept.id}
                      onClick={() => handleSelectDepartment(dept.id)}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        {/* Header icon and arrow */}
                        <div className="flex items-center justify-between">
                          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="rounded-full bg-slate-50 p-1.5 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>

                        {/* Title & description */}
                        <div>
                          <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {dept.name}
                          </h3>
                          <p className="text-xs font-semibold text-blue-500 mt-0.5">{dept.tagline}</p>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                            {dept.description}
                          </p>
                        </div>
                      </div>

                      {/* Micro Statistics */}
                      <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4 text-[11px] font-medium text-slate-400">
                        <span>Success: <strong className="text-slate-700">{dept.stats[1].value}</strong></span>
                        <span>•</span>
                        <span>{DOCTORS.filter(d => d.departmentId === dept.id).length} Doctors assigned</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <p className="font-semibold text-slate-800">No departments found matching "{searchQuery}"</p>
                <p className="text-xs text-slate-400">Try checking spelling or search with a general term like Cardiac or Skin.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* Department Detail Subview */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12 pt-4"
          >
            {/* Back Navigation Bar */}
            <div className="flex items-center gap-4">
              <button
                id="back-to-depts-grid"
                onClick={handleBackToGrid}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Departments</span>
              </button>
              <div className="text-xs text-slate-400">
                Departments / <span className="font-medium text-slate-800">{activeDepartment?.name}</span>
              </div>
            </div>

            {/* Department Cover Hero */}
            {activeDepartment && (
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[340px] flex items-end p-6 md:p-12 shadow-xl">
                <div className="absolute inset-0">
                  <img
                    referrerPolicy="no-referrer"
                    src={activeDepartment.image}
                    alt={activeDepartment.name}
                    className="h-full w-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-2xl space-y-3">
                  <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30 backdrop-blur-md">
                    Clinical Center of Excellence
                  </span>
                  <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
                    Department of {activeDepartment.name}
                  </h1>
                  <p className="text-base text-slate-300 md:text-lg leading-relaxed font-light">
                    {activeDepartment.tagline}
                  </p>
                </div>
              </div>
            )}

            {/* Detailed Layout */}
            {activeDepartment && (
              <div className="grid gap-12 lg:grid-cols-12">
                {/* Left side: Clinical info and specialized services (7 columns) */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="space-y-3">
                    <h2 className="font-display text-2xl font-bold text-slate-900">Clinical Overview</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {activeDepartment.longDescription}
                    </p>
                  </div>

                  {/* Specialized Services bullets */}
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle className="h-5 w-5 text-emerald-600" /> Specialized Medical Services
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {activeDepartment.services.map((service, index) => (
                        <div key={index} className="flex gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs font-medium text-slate-700 leading-snug">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Operational Statistics (5 columns) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                    <h3 className="font-display text-base font-bold text-slate-900">Operational Milestones</h3>
                    <div className="space-y-4">
                      {activeDepartment.stats.map((stat, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                          <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                          <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Contact Notice */}
                  <div className="rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-6 shadow-lg space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/10 rounded-bl-full" />
                    <h4 className="font-display font-semibold text-sm">Need Department Assistance?</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You can consult directly with our department coordinators for records, clinical trials, or hospital admission queries.
                    </p>
                    <div className="text-xs font-mono font-semibold text-blue-400">
                      Email: clinic-{activeDepartment.id}@wecarehospital.com
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Department Doctors Section */}
            {activeDepartment && (
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Expert Specialists</span>
                  <h2 className="font-display text-2xl font-bold text-slate-900">Doctors in {activeDepartment.name}</h2>
                  <p className="text-xs text-slate-500">Book direct consultations with our {activeDepartment.name} team leaders.</p>
                </div>

                {departmentDoctors.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {departmentDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="group flex flex-col sm:flex-row gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md"
                      >
                        {/* Profile Pic */}
                        <img
                          referrerPolicy="no-referrer"
                          src={doc.image}
                          alt={doc.name}
                          className="h-28 w-28 rounded-xl object-cover border border-slate-100 self-center sm:self-auto shrink-0"
                        />

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <h3 className="font-display font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                              {doc.name}
                            </h3>
                            <p className="text-xs font-semibold text-blue-600">{doc.role}</p>
                            <p className="text-[11px] text-slate-400 truncate">{doc.specialty}</p>

                            <div className="flex items-center gap-1 text-amber-500 pt-1">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              <span className="text-xs font-bold text-slate-800 font-mono">{doc.rating}</span>
                              <span className="text-[10px] text-slate-400">({doc.reviewsCount} reviews)</span>
                            </div>
                          </div>

                          {/* CTAs */}
                          <div className="flex gap-2">
                            <button
                              id={`dept-doc-view-${doc.id}`}
                              onClick={() => onSelectDoctor(doc)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              View Profile
                            </button>
                            <button
                              id={`dept-doc-book-${doc.id}`}
                              onClick={() => onBookWithDoctor(doc.id)}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No doctors currently cataloged in this department.</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
