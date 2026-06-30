/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Award, Heart, CheckCircle, ChevronDown, ChevronUp, Clock, Calendar } from 'lucide-react';

export default function AboutView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const values = [
    {
      title: 'Clinical Excellence',
      description: 'We adhere to the absolute highest international healthcare and surgical standards, continuously updating our diagnostic equipment and operating techniques.',
      icon: Award,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Empathy-First Care',
      description: 'Every treatment plan is built with deep compassion, placing the physical, mental, and emotional comfort of patients and families at the core.',
      icon: Heart,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      title: 'Rigorous Patient Safety',
      description: 'Our infection control, sterilization, and double-verification medication administration protocols represent the absolute gold-standard in health defense.',
      icon: Shield,
      color: 'text-emerald-600 bg-emerald-50',
    }
  ];

  const milestones = [
    { year: '2001', title: 'Hospital Founding', text: 'We Care Hospital opened as a specialized 40-bed cardiac care clinic, with a vision to streamline complex heart procedures.' },
    { year: '2008', title: 'Pediatric & Orthopedic Launch', text: 'Expanded with two brand-new dedicated wings, onboarding a team of pediatricians and joint surgeons.' },
    { year: '2015', title: 'Robotic Surgery & Trauma Wing', text: 'Pioneered advanced robotic joint replacement and electrophysiology labs, earning major Joint Commission approvals.' },
    { year: '2022', title: 'Comprehensive Oncology Center', text: 'Inaugurated a state-of-the-art cancer treatment institute offering precision molecular therapy and supportive care.' }
  ];

  const FAQs = [
    {
      q: 'How do I schedule an appointment with a specialist?',
      a: 'Scheduling is simple! Click on the "Book Appointment" tab in our header menu, select the department, pick your doctor, and choose an available date/time slot. Fill in your details to instantly reserve your consultation.'
    },
    {
      q: 'Do you offer 24/7 emergency care and trauma support?',
      a: 'Yes, absolutely. We Care Hospital operates a fully equipped Level 1 emergency room, intensive care unit, and trauma surgery suite 24 hours a day, 365 days a year. No prior appointment is needed for critical trauma and acute emergency cases.'
    },
    {
      q: 'What should I bring on the day of my clinical appointment?',
      a: 'Please bring a valid photo identification card (such as a driver’s license or passport), your active insurance card, any previous medical records or imaging reports (X-rays, MRIs, blood tests) related to your condition, and a list of your current medications.'
    },
    {
      q: 'Is parking available for patients and visiting family?',
      a: 'Yes, We Care Hospital provides a spacious, secure multi-level parking garage directly adjacent to the main lobby entrance. Standard patient parking is free, and we also offer 24/7 valet parking services at the emergency and main entrances.'
    },
    {
      q: 'Can I view or cancel my scheduled appointments?',
      a: 'Yes. By navigating to the "My Bookings" page, you can review all upcoming appointments, view doctor contact details, and cancel any scheduled bookings if your calendar changes.'
    }
  ];

  return (
    <div className="space-y-16 pb-16 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto pt-6">
        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Who We Are</span>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
          A Legacy of Trust, Innovation & Healing
        </h1>
        <p className="text-sm text-slate-500">
          Serving our community with award-winning medical expertise, state-of-the-art technologies, and compassionate patient care since 2001.
        </p>
      </div>

      {/* Core Mission & Vision */}
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left Side: Modern Image and Overlap Badge */}
        <div className="relative">
          <img
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1579154204601-01588f35116f?auto=format&fit=crop&q=80&w=800"
            alt="Research lab and advanced medical devices"
            className="rounded-2xl shadow-md border border-slate-100 object-cover w-full h-[380px]"
          />
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-slate-800 shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-spin" />
            <span>Joint Commission Accredited</span>
          </div>
        </div>

        {/* Right Side: Mission & Vision texts */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-slate-900">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Our mission is to advance health and well-being by providing exceptional, inclusive, and high-quality clinical care. We combine cutting-edge science, medical discovery, and compassionate human-to-human therapy to make every patient feel secure and respected.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-slate-900">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We envision We Care Hospital as a premier global hub of healthcare innovation. By pioneering robotic interventions, molecular precision oncology, and responsive emergency processes, we strive to elevate the clinical recovery rates of our community and set the benchmark for healing excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
            <div className="flex gap-2.5">
              <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-semibold text-slate-900 text-sm">100% Sanitized</h4>
                <p className="text-xs text-slate-500">Rigorous sanitation cycle and air filtration.</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-semibold text-slate-900 text-sm">Award-Winning</h4>
                <p className="text-xs text-slate-500">Consistently rated in top 10 regional hospitals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-8">
        <div className="text-center space-y-1">
          <h2 className="font-display text-2xl font-bold text-slate-900">Our Core Values</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">The guiding principles that shape every diagnosis, operation, and supportive clinical interaction.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 hover:border-blue-100 transition-colors"
              >
                <div className={`rounded-xl p-3 inline-block ${val.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg">{val.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hospital History Timeline */}
      <section className="bg-slate-50 py-12 px-6 rounded-3xl space-y-10">
        <div className="text-center space-y-1">
          <h2 className="font-display text-2xl font-bold text-slate-900">Our Growth Journey</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">Tracing the milestones that transformed us into a full-scale clinical powerhouse.</p>
        </div>

        <div className="relative border-l border-blue-100 ml-4 md:ml-32 space-y-8">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-6 md:pl-8">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-sm" />

              {/* Layout */}
              <div className="grid gap-2 md:grid-cols-5 items-start">
                <span className="font-display font-extrabold text-blue-600 text-xl tracking-tight md:col-span-1">{m.year}</span>
                <div className="md:col-span-4 space-y-1">
                  <h4 className="font-display font-bold text-slate-900 text-base">{m.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="font-display text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-xs">Everything you need to know about scheduling, emergency trauma, and medical records.</p>
        </div>

        <div className="space-y-3">
          {FAQs.map((faq, index) => {
            const isOpened = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden"
              >
                <button
                  id={`faq-btn-${index}`}
                  onClick={() => setOpenFaq(isOpened ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left font-display font-semibold text-slate-950 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  {isOpened ? (
                    <ChevronUp className="h-4 w-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isOpened ? 'auto' : 0, opacity: isOpened ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 text-slate-500 text-xs md:text-sm leading-relaxed border-t border-slate-50">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
