'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  MapPin,
  Calendar,
  Lock,
  Edit2,
  Check,
  LogOut,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Briefcase,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id?: string;
    name?: string;
    email?: string;
    mobile?: string;
    role?: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: 'Tower 4, Flat 1202, DLF Phase 5, Golf Course Road, Sector 54, Gurugram, Haryana 122002',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('gs_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setFormData((prev) => ({
          ...prev,
          name: parsed.name || '',
          email: parsed.email || '',
          mobile: parsed.mobile || '',
        }));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = {
      ...user,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
    };
    setUser(updated);
    localStorage.setItem('gs_user', JSON.stringify(updated));
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.removeItem('gs_user');
      localStorage.removeItem('gs_token');
      sessionStorage.clear();
      // Clear cookies
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
    } catch {
      // ignore
    }
    setUser(null);
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">You are Signed Out</h2>
          <p className="text-xs text-slate-500">
            Please sign in with your account credentials to view and manage your profile.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition-all"
          >
            Sign In to GoShashi
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Account Profile</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isAdmin
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : user.role === 'PARTNER'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {user.role || 'CUSTOMER'}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Manage your personal contact details, security settings, and addresses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" /> Admin Console
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <span className="font-bold">Privacy Protection Policy Active: </span>
          Your profile, phone number, and address are strictly confidential. Under platform privacy rules, other regular users cannot view your profile or personal details. Only authorized GoShashi administrators can access user records.
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          Your profile details have been saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-sky-400 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'GS'}
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.id || 'usr-customer-003'}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="text-xs font-black text-emerald-700">Active Verified</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Member Since</span>
                <span className="text-xs font-black text-slate-800">Sept 2026</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Account Shortcuts</h3>
            <Link
              href="/bookings"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 group"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" /> My Bookings
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-700 group"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" /> Active Cart
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Personal Information & Address Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your private contact details registered on the platform</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {isEditing ? 'Cancel' : 'Edit Details'}
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                    Primary Service City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled
                      value="Gurugram, Haryana"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                  Saved Default Address
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/25 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Data Privacy & Access Policy Card */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-brand-600" /> GoShashi Privacy & Security Guarantees
            </h4>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>Your personal contact information is never shared publicly or displayed to other platform users.</li>
              <li>Only GoShashi authorized administrators have access to platform user records for support and compliance.</li>
              <li>When booking services, partners only receive necessary service address details during active job fulfillment.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
