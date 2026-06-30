/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Heart,
  Shield,
  Activity,
  Star,
  ArrowRight,
  Sparkles,
  PhoneCall,
  FlameKindling,
  Award
} from 'lucide-react';
import { DEPARTMENTS, TESTIMONIALS } from '../data';
import { Department } from '../types';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onSelectDepartment: (deptId: string) => void;
}

export default function HomeView({ onNavigate, onSelectDepartment }: HomeViewProps) {
  // Take 3 departments to display as featured
  const featuredDepartments = DEPARTMENTS.slice(0, 3);

  // Quick stat configurations
  const stats = [
    { value: '99.4%', label: 'Surgery Success Rate', icon: Shield, color: 'text-emerald-500 bg-emerald-50' },
    { value: '45+', label: 'Elite Specialists', icon: Award, color: 'text-blue-500 bg-blue-50' },
    { value: '25,000+', label: 'Happy Recovered Patients', icon: Heart, color: 'text-rose-500 bg-rose-50' },
    { value: '15 Mins', label: 'Average ER Response', icon: Clock, color: 'text-amber-500 bg-amber-50' }
  ];

  const corePillars = [
    {
      title: 'Emergency ICU 24/7',
      description: 'Fully equipped trauma response team and rapid surgical dispatch ready at a moment’s notice.',
      icon: Activity,
    },
    {
      title: 'Advanced Robotic Surgery',
      description: 'High-precision minimally invasive surgical tools ensuring swifter healing and minimal scarring.',
      icon: Shield,
    },
    {
      title: 'Pristine Patient Care',
      description: 'Spacious, sterilized, quiet recovery suites designed to provide a restful and healing atmosphere.',
      icon: Heart,
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-24 px-6 md:px-12 lg:px-24 rounded-3xl mx-4 my-6 shadow-xl">
        {/* Background Decorative Grid and Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column Text content */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-4 py-1.5 text-sm font-semibold text-blue-400 border border-blue-500/25">
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                <span>Leader in Clinical Innovation</span>
              </div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
                Compassionate Care. <br />
                <span className="text-blue-400">Exceptional Medicine.</span>
              </h1>
              <p className="max-w-xl text-lg text-slate-300 leading-relaxed">
                At <span className="font-semibold text-white">We Care Hospital</span>, we blend cutting-edge surgical technology with deeply personalized therapies, ensuring you and your loved ones receive world-class care.
              </p>
              
              {/* Call to Actions */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="hero-book-btn"
                  onClick={() => onNavigate('book')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment Now</span>
                </button>
                <button
                  id="hero-departments-btn"
                  onClick={() => onNavigate('departments')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3.5 font-semibold text-slate-200 backdrop-blur-sm hover:bg-slate-800 hover:text-white transition-all"
                >
                  Explore Departments
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Trust Badge Indicators */}
              <div className="flex items-center gap-6 border-t border-slate-800 pt-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Joint Commission Accredited</span>
                </div>
                <div>•</div>
                <div>24/7 Critical Trauma Team Active</div>
              </div>
            </div>

            {/* Right Column Custom Image Grid */}
            <div className="relative lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-30 blur-xl" />
                <img
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=600"
                  alt="Modern Hospital Equipment"
                  className="relative rounded-2xl border border-slate-800 object-cover shadow-2xl h-[360px] w-full"
                />
                
                {/* Overlay Card */}
                <div className="absolute -bottom-6 -left-6 rounded-xl bg-slate-900 border border-slate-800 p-4 shadow-xl flex items-center gap-3 backdrop-blur-md">
                  <div className="rounded-lg bg-blue-500/25 p-2 text-blue-400">
                    <PhoneCall className="h-5 w-5 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Emergency Helpline</p>
                    <p className="text-sm font-mono font-bold text-white">+1 (800) 999-CARE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Hospital Overview & Pillars Section */}
      <section className="px-6 max-w-6xl mx-auto grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left column Illustration or Image */}
        <div className="lg:col-span-5 relative">
          <img
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600"
            alt="Doctor speaking with family"
            className="rounded-2xl shadow-lg border border-slate-100 object-cover w-full h-[450px]"
          />
          <div className="absolute -bottom-6 -right-6 rounded-2xl bg-blue-600 p-6 text-white max-w-[200px] shadow-lg">
            <p className="text-3xl font-extrabold font-display">25+</p>
            <p className="text-xs text-blue-100 mt-1">Years of medical legacy in cardiac, orthopedic and patient care</p>
          </div>
        </div>

        {/* Right column Core text and Pillars */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Why Generations of Families Choose We Care Hospital
          </h2>
          <p className="text-slate-600 leading-relaxed text-base">
            Since our founding, we have operated on a singular core belief: clinical treatment is only half the battle; human empathy, clear patient communication, and continuous support are what truly complete the recovery cycle.
          </p>

          <div className="space-y-4 pt-2">
            {corePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="shrink-0 rounded-lg bg-blue-50 p-2.5 text-blue-600 h-10 w-10 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-slate-900 text-base">{pillar.title}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">{pillar.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              id="home-about-link-btn"
              onClick={() => onNavigate('about')}
              className="group inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Learn more about our core philosophy</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Clinical Departments */}
      <section className="bg-slate-50 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Our Clinical Centers</span>
              <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight mt-1">
                Featured Medical Departments
              </h2>
            </div>
            <button
              id="all-depts-btn"
              onClick={() => onNavigate('departments')}
              className="group inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 text-sm"
            >
              <span>View all 6 clinical departments</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Department Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {featuredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    referrerPolicy="no-referrer"
                    src={dept.image}
                    alt={dept.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 font-display text-lg font-bold text-white">
                    {dept.name}
                  </h3>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed flex-1">
                    {dept.description}
                  </p>
                  
                  {/* Key Services Preview */}
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">Specialized Care Includes:</p>
                    <ul className="space-y-1">
                      {dept.services.slice(0, 2).map((srv, index) => (
                        <li key={index} className="flex items-center text-xs text-slate-500">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="truncate">{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-3">
                    <button
                      id={`explore-dept-btn-${dept.id}`}
                      onClick={() => onSelectDepartment(dept.id)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <span>Explore Department & Doctors</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Healing Stories / Testimonials */}
      <section className="px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Patient Testimonials</span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Real Stories of Healing & Recovery
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-500">
            Hear directly from patients who entrusted We Care Hospital with their vital surgeries, pediatric visits, and orthopedic recovery treatments.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm relative overflow-hidden"
            >
              {/* Star ratings */}
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <blockquote className="text-sm leading-relaxed text-slate-600 italic flex-1">
                "{testimonial.text}"
              </blockquote>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-50 pt-4">
                <img
                  referrerPolicy="no-referrer"
                  src={testimonial.avatar}
                  alt={testimonial.patientName}
                  className="h-10 w-10 rounded-full object-cover shadow-inner"
                />
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs">{testimonial.patientName}</h4>
                  <p className="text-[10px] font-medium text-slate-400">
                    Age {testimonial.age} • <span className="text-blue-500 font-semibold">{testimonial.treatment}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Booking Banner CTA */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white px-8 py-12 md:py-16 text-center">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to Consult with an Expert Physician?
            </h2>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              Skip the long queues and endless phone hold times. Pick your preferred department, select an certified expert doctor, and lock in your convenient consultation hour in under 2 minutes.
            </p>
            <div className="pt-2">
              <button
                id="cta-book-btn"
                onClick={() => onNavigate('book')}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 shadow-lg hover:bg-slate-50 hover:scale-[1.02] transition-all"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Your Appointment Today</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
