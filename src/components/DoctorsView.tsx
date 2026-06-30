/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Search, Filter, Calendar, Award, Mail } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data';
import { Doctor } from '../types';

interface DoctorsViewProps {
  onSelectDoctor: (doctor: Doctor) => void;
  onBookWithDoctor: (doctorId: string) => void;
}

export default function DoctorsView({ onSelectDoctor, onBookWithDoctor }: DoctorsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Filter handlers
  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-12 pb-16 px-4 md:px-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pt-6">
        <div className="space-y-1">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Medical Staff</span>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">Our Elite Specialists</h1>
          <p className="text-sm text-slate-500">
            Consult with our world-renowned, double-certified healthcare professionals and surgeons.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            id="doc-search"
            type="text"
            placeholder="Search doctor name, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
        <button
          id="filter-dept-all"
          onClick={() => setSelectedDeptFilter('all')}
          className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all ${
            selectedDeptFilter === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Departments
        </button>
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            id={`filter-dept-${dept.id}`}
            onClick={() => setSelectedDeptFilter(dept.id)}
            className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all ${
              selectedDeptFilter === dept.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc) => {
            const docDept = DEPARTMENTS.find((d) => d.id === doc.departmentId);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={doc.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md"
              >
                {/* Photo Header */}
                <div className="relative h-64 overflow-hidden bg-slate-50">
                  <img
                    referrerPolicy="no-referrer"
                    src={doc.image}
                    alt={doc.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Department Badge overlay */}
                  {docDept && (
                    <span className="absolute top-4 left-4 rounded-lg bg-slate-900/70 px-3 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur-md uppercase">
                      {docDept.name}
                    </span>
                  )}
                  {/* Rating Badge overlay */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 space-y-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{doc.role}</p>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{doc.bio}</p>
                  </div>

                  {/* Fact Lines */}
                  <div className="border-t border-slate-50 pt-3 space-y-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-slate-400" />
                      <span><strong>{doc.experienceYears} Years</strong> Experience</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="truncate">Available: <strong>{doc.availability.join(', ')}</strong></span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      id={`doc-card-view-${doc.id}`}
                      onClick={() => onSelectDoctor(doc)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      id={`doc-card-book-${doc.id}`}
                      onClick={() => onBookWithDoctor(doc.id)}
                      className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <p className="font-semibold text-slate-800">No medical specialists found matching your filter</p>
          <p className="text-xs text-slate-400">Try clearing the search query or selecting "All Departments".</p>
        </div>
      )}
    </div>
  );
}
