/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Calendar, FileText, Activity, LogOut, LogIn } from 'lucide-react';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  bookingTriggerCount: number; // helps refresh count from App state
}

export default function Header({ currentTab, onNavigate, bookingTriggerCount }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);
  const { user, signInWithGoogle, logOut } = useAuth();

  // Compute active bookings count (non-cancelled) in real-time from Firestore
  useEffect(() => {
    if (!user) {
      setActiveBookingsCount(0);
      return;
    }

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingsList = snapshot.docs.map((d) => d.data() as Appointment);
        const activeCount = bookingsList.filter((b) => b.status === 'confirmed').length;
        setActiveBookingsCount(activeCount);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      }
    );

    return unsubscribe;
  }, [user]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'about', label: 'About Us' },
  ];

  const handleLinkClick = (tabId: string) => {
    onNavigate(tabId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl h-20 items-center justify-between px-4 md:px-6">
        {/* Branding Logo */}
        <div
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            <Heart className="h-5 w-5 fill-current animate-pulse text-rose-200" />
          </div>
          <div>
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
              We Care
            </span>
            <span className="ml-1 rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-blue-600 uppercase tracking-wider">
              Hospital
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`nav-link-${link.id}`}
              onClick={() => handleLinkClick(link.id)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                currentTab === link.id
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Bookings link with count */}
          <button
            id="nav-link-bookings"
            onClick={() => handleLinkClick('bookings')}
            className={`relative rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
              currentTab === 'bookings'
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>My Bookings</span>
            {activeBookingsCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-bounce">
                {activeBookingsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Desktop CTA and Auth button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="header-book-btn"
            onClick={() => handleLinkClick('book')}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-all hover:scale-[1.02]"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Appointment</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.displayName}`}
                alt={user.displayName || 'Patient'}
                className="h-8.5 w-8.5 rounded-full border border-blue-100 object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => logOut()}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                title="Sign Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger menu trigger */}
        <button
          id="mobile-menu-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-slate-100 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 right-0 z-50 border-b border-slate-100 bg-white p-4 shadow-xl md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`mobile-nav-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full rounded-xl py-3 px-4 text-left text-sm font-bold transition-all ${
                  currentTab === link.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Bookings */}
            <button
              id="mobile-nav-bookings"
              onClick={() => handleLinkClick('bookings')}
              className={`w-full rounded-xl py-3 px-4 text-left text-sm font-bold transition-all flex items-center justify-between ${
                currentTab === 'bookings'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>My Bookings</span>
              </div>
              {activeBookingsCount > 0 && (
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* Direct Book button */}
            <button
              id="mobile-nav-book-btn"
              onClick={() => handleLinkClick('book')}
              className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>

            {/* User Profile in Mobile Drawer */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.displayName}`}
                      alt={user.displayName || 'Patient'}
                      className="h-10 w-10 rounded-full border border-blue-100 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-slate-800 leading-tight">
                        {user.displayName || 'Patient Portal'}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logOut();
                      setIsOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-150 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signInWithGoogle();
                    setIsOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
