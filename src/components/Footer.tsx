/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Mail, Phone, MapPin, Shield, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-16 px-6">
      <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-12">
        
        {/* Column 1: Hospital details & contact snippet (5 columns) */}
        <div className="md:col-span-5 space-y-5">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <Heart className="h-4 w-4 fill-current" />
            </div>
            <span className="font-display text-base font-extrabold text-slate-900">
              We Care Hospital
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Providing exceptional medical discovery and empathetic bedside therapies. Proudly serving our global community with award-winning physicians and surgeons 24 hours a day.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 max-w-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Phone className="h-4 w-4 text-blue-600 animate-bounce" />
              <span>Emergency ER Dispatch (24/7)</span>
            </div>
            <p className="text-xs font-mono font-bold text-blue-700 pl-6">+1 (800) 999-CARE</p>
          </div>
        </div>

        {/* Column 2: Quick Links (3 columns) */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-display font-bold text-slate-900 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-xs text-slate-500">
            {['home', 'departments', 'doctors', 'about'].map((link) => (
              <li key={link}>
                <button
                  id={`footer-link-${link}`}
                  onClick={() => onNavigate(link)}
                  className="hover:text-blue-600 capitalize text-left transition-colors font-medium"
                >
                  {link === 'about' ? 'About Us' : link}
                </button>
              </li>
            ))}
            <li>
              <button
                id="footer-link-book"
                onClick={() => onNavigate('book')}
                className="hover:text-blue-600 text-left transition-colors font-semibold text-blue-500"
              >
                Book Appointment
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Operational hours (4 columns) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-display font-bold text-slate-900 text-sm">Our Facilities</h4>
          <ul className="space-y-3 text-xs text-slate-500">
            <li className="flex gap-2.5 items-start">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                450 Clinical Innovation Blvd, Suite 200, <br />
                San Francisco, CA 94107
              </span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span>contact@wecarehospital.com</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p>Clinic Hours: Mon - Sat (8 AM - 8 PM)</p>
                <p className="text-blue-600 font-semibold mt-0.5">Emergency Trauma ER: Open 24/7</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-6xl mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-medium text-slate-400">
        <div>
          © {currentYear} We Care Hospital Inc. All Rights Reserved.
        </div>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-end items-center">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-emerald-500" /> HIPAA Compliant Security
          </span>
          <span>•</span>
          <span>Terms of Use</span>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <button
            id="footer-admin-link"
            onClick={() => onNavigate('admin')}
            className="hover:text-slate-800 transition-colors font-extrabold flex items-center gap-1.5 text-blue-600"
          >
            <Shield className="h-3 w-3 text-blue-500" /> Staff Portal
          </button>
        </div>
      </div>
    </footer>
  );
}
