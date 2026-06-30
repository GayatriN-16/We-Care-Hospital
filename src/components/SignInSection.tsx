import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Heart, Shield, Calendar, Activity, Info, ExternalLink, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignInSectionProps {
  title?: string;
  subtitle?: string;
}

export default function SignInSection({
  title = "Access Your Patient Portal",
  subtitle = "Please sign in or create an account to manage, schedule, and view your appointments securely."
}: SignInSectionProps) {
  const { signInWithGoogle, signInDemo, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningDemo, setIsSigningDemo] = useState(false);

  // activeTab controls the top-level form: 'signin' or 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    setError(null);
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError("Unable to complete Google Authentication inside this framed preview. Please click 'Open in New Tab' or use the Email Sign In / Demo Sandbox below instead!");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setIsSigningDemo(true);
    try {
      await signInDemo();
    } catch (err: any) {
      console.error(err);
      setError("Demo anonymous authentication was rejected. Please ensure Anonymous Auth is enabled in your Firebase console, or open the app in a new tab to use Google login.");
    } finally {
      setIsSigningDemo(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please fill in all credentials.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSigningIn(true);
    try {
      if (activeTab === 'signup') {
        if (!name.trim()) {
          setError("Please enter your name to register.");
          setIsSigningIn(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, name.trim());
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Please verify your credentials or try sandbox fallback.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100/50 flex flex-col items-center text-center space-y-6"
      >
        {/* Visual Header Icon */}
        <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 shadow-inner">
          <Heart className="h-8 w-8 fill-blue-100 text-blue-600 animate-pulse" />
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-500 max-w-xs">
            {subtitle}
          </p>
        </div>

        {/* Top-Level Sign In vs Sign Up Tabs */}
        <div className="w-full flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab('signin'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all ${
              activeTab === 'signin' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-signup-btn"
            onClick={() => { setActiveTab('signup'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all ${
              activeTab === 'signup' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up / Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          error.toLowerCase().includes('unauthorized-domain') ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-left space-y-3 w-full">
              <div className="flex items-start gap-2.5 text-rose-800">
                <Shield className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 animate-pulse" />
                <h4 className="text-xs font-bold leading-tight">Firebase Domain Unauthorized</h4>
              </div>
              <p className="text-[11px] text-rose-700/90 leading-relaxed">
                Your current domain (<strong>{window.location.hostname}</strong>) has not been added to your Firebase project's <strong>Authorized Domains</strong>.
              </p>
              <div className="text-[10px] bg-white rounded-lg p-3 border border-rose-100 space-y-1.5 text-slate-700 font-mono">
                <p className="font-sans font-bold text-slate-800 mb-1">How to fix this in 30 seconds:</p>
                <p>1. Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-sans font-bold">Firebase Console</a></p>
                <p>2. Go to <strong>Authentication</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Authorized Domains</strong></p>
                <p>3. Add the following hostnames:</p>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-150 select-all font-bold text-slate-800 break-all leading-normal">
                  {window.location.hostname}<br/>
                  ais-dev-n4lkakcqjxgbdzdmsohj46-515244983126.asia-east1.run.app<br/>
                  ais-pre-n4lkakcqjxgbdzdmsohj46-515244983126.asia-east1.run.app
                </div>
              </div>
              <p className="text-[11px] text-rose-600 leading-normal">
                💡 <strong>Immediate workaround:</strong> Sign Up or Sign In using the form below. If Firebase Auth is fully restricted on this domain, our intelligent fallback system will create an instant Sandbox session for you!
              </p>
            </div>
          ) : (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2.5 rounded-lg w-full text-left">
              {error}
            </p>
          )
        )}

        {/* Primary Auth Form */}
        <form onSubmit={handleEmailAuthSubmit} className="w-full text-left space-y-4">
          
          {/* Name Input (Shown ONLY on Sign Up) */}
          {activeTab === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Your Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="E.g. Jennifer Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                placeholder="jennifer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              Must be at least 6 characters.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || isSigningIn}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 px-4 text-xs font-black text-white hover:bg-slate-800 transition-all disabled:opacity-50 mt-2 cursor-pointer"
          >
            {isSigningIn ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
            )}
            <span>{isSigningIn ? "Processing..." : activeTab === 'signup' ? "Create Account & Sign Up" : "Sign In securely"}</span>
          </button>

          {/* Alternative Quick Sign-In Options */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Or Easy Bypass Alternatives
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Google Sign In button */}
            <button
              type="button"
              disabled={loading || isSigningIn || isSigningDemo}
              onClick={handleSignIn}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <LogIn className="h-3.5 w-3.5 text-blue-600" />
              <span>Google Auth</span>
            </button>

            {/* Sandbox Sign In Button */}
            <button
              type="button"
              disabled={loading || isSigningIn || isSigningDemo}
              onClick={handleDemoSignIn}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>Demo Sandbox</span>
            </button>
          </div>

          {/* Bottom toggle link */}
          <div className="text-center pt-3 border-t border-slate-100 text-xs">
            {activeTab === 'signin' ? (
              <p className="text-slate-500">
                Don't have a patient account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(null); }}
                  className="text-blue-600 font-extrabold hover:underline"
                >
                  Sign Up & Register here
                </button>
              </p>
            ) : (
              <p className="text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setError(null); }}
                  className="text-blue-600 font-extrabold hover:underline"
                >
                  Sign In here
                </button>
              </p>
            )}
          </div>
        </form>

        <p className="text-[10px] text-slate-400">
          By signing in, you agree to our hospital privacy policies and medical safety terms.
        </p>
      </motion.div>

      {/* Helpful developer & testing tip container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-xl border border-amber-100 bg-amber-50/50 p-5 space-y-3"
      >
        <div className="flex items-start gap-2.5 text-amber-800">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <h3 className="text-xs font-bold leading-tight">Testing inside the AI Studio Preview</h3>
        </div>
        <div className="text-[11px] text-amber-700/90 leading-relaxed space-y-2">
          <p>
            Due to standard browser security rules, Google Sign-In popups are blocked inside **embedded iframes** like this preview workspace.
          </p>
          <p className="font-semibold text-amber-800">
            Choose either of these easy options:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-amber-750">
            <li>
              <strong>Instant Sandbox / Email Login:</strong> Create an account or sign in with any email under the <em>"Email & Password"</em> tab to bypass iframe popups instantly!
            </li>
            <li>
              <strong>Full Google Sign-In:</strong> Click the <strong>Open in New Tab</strong> button (top right of the preview pane) to open the app directly. Google Authentication will work flawlessly!
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
