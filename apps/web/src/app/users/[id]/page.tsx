'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Lock,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface UserDossier {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: string;
  joinedDate: string;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  customer?: {
    referralCode: string;
    totalOrders: number;
    defaultAddress: string;
  };
  partner?: {
    businessName: string;
    category: string;
    kycStatus: string;
    rating: number;
    completedJobs: number;
  };
  auditLogs?: Array<{ action: string; timestamp: string; details: string }>;
}

// Demo directory data for lookup
const mockUserDatabase: Record<string, UserDossier> = {
  'usr-admin-001': {
    id: 'usr-admin-001',
    name: 'GoShashi Admin',
    email: 'admin@goshashi.com',
    mobile: '9876543210',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    joinedDate: 'Jan 10, 2026',
    isMobileVerified: true,
    isEmailVerified: true,
    auditLogs: [
      { action: 'system.login', timestamp: 'Today, 09:30 AM', details: 'Admin console access granted' },
      { action: 'partner.kyc_approve', timestamp: 'Yesterday, 04:15 PM', details: 'Approved partner PTR-480' },
    ],
  },
  'usr-partner-002': {
    id: 'usr-partner-002',
    name: 'Rajesh Sharma',
    email: 'rajesh.partner@goshashi.com',
    mobile: '9899988877',
    role: 'PARTNER',
    status: 'ACTIVE',
    joinedDate: 'Feb 15, 2026',
    isMobileVerified: true,
    isEmailVerified: true,
    partner: {
      businessName: 'Sharma Home & Electrical Services',
      category: 'Electrical & AC Repair',
      kycStatus: 'APPROVED',
      rating: 4.9,
      completedJobs: 142,
    },
    auditLogs: [
      { action: 'kyc.documents_uploaded', timestamp: 'Feb 15, 2026', details: 'Aadhaar & PAN submitted' },
      { action: 'job.completed', timestamp: 'Today, 12:45 PM', details: 'Order GS-2026-10491 completed' },
    ],
  },
  'usr-customer-003': {
    id: 'usr-customer-003',
    name: 'Shashi Kumar',
    email: 'shashi.customer@goshashi.com',
    mobile: '9811122233',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    joinedDate: 'Mar 01, 2026',
    isMobileVerified: true,
    isEmailVerified: true,
    customer: {
      referralCode: 'SHASHI2026',
      totalOrders: 14,
      defaultAddress: 'Tower 4, Flat 1202, DLF Phase 5, Golf Course Road, Sector 54, Gurugram, Haryana 122002',
    },
    auditLogs: [
      { action: 'order.created', timestamp: 'Yesterday, 06:20 PM', details: 'Booking for Deep Home Cleaning' },
    ],
  },
  'usr-customer-004': {
    id: 'usr-customer-004',
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    mobile: '9822334455',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    joinedDate: 'Apr 12, 2026',
    isMobileVerified: true,
    isEmailVerified: false,
    customer: {
      referralCode: 'AMIT455',
      totalOrders: 3,
      defaultAddress: 'Sector 57, Sushant Lok Phase 3, Gurugram',
    },
  },
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);

  const [targetUser, setTargetUser] = useState<UserDossier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get current logged in user
    const saved = localStorage.getItem('gs_user');
    let loggedInUser = null;
    if (saved) {
      try {
        loggedInUser = JSON.parse(saved);
        setCurrentUser(loggedInUser);
      } catch {
        // ignore
      }
    } else {
      // Default to customer demo if not logged in
      loggedInUser = {
        id: 'usr-customer-003',
        name: 'Shashi Kumar',
        email: 'shashi.customer@goshashi.com',
        role: 'CUSTOMER',
      };
      setCurrentUser(loggedInUser);
    }

    // 2. Fetch target user data
    if (userId) {
      const found = mockUserDatabase[userId] || {
        id: userId,
        name: 'User ' + userId,
        email: `user.${userId}@example.com`,
        mobile: '9800000000',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        joinedDate: '2026-05-10',
        isMobileVerified: true,
        isEmailVerified: true,
      };
      setTargetUser(found);
    }
    setLoading(false);
  }, [userId]);

  if (loading || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-slate-500">Checking authorization and fetching user record...</p>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';
  const isSelf = currentUser.id === userId || currentUser.email === targetUser?.email;

  // STRICT ACCESS CONTROL CHECK:
  // If the user is NOT an Admin AND is NOT viewing their own profile:
  // Show Access Restricted Security Barrier!
  if (!isAdmin && !isSelf) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-rose-200 shadow-xl shadow-rose-500/5 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider border border-rose-200">
              Access Restricted • 403 Forbidden
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              User Profile Privacy Protection
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Under GoShashi security and privacy rules, regular users are strictly prohibited from viewing profiles or personal details of other users.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1.5 text-left">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <Lock className="w-4 h-4 text-rose-500" />
              <span>Restricted Information:</span>
            </div>
            <p>Personal identities, phone numbers, addresses, and account activity are strictly confidential. Only authorized GoShashi administrators have permission to view all users&apos; details.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all"
            >
              View My Own Profile
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If Admin OR Self: Show Full Details
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href={isAdmin ? '/admin' : '/profile'}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {targetUser?.name}
                </h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider border border-purple-200">
                    Admin Inspector Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">User ID: {targetUser?.id}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              targetUser?.status === 'ACTIVE'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {targetUser?.status}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider">
            {targetUser?.role}
          </span>
        </div>
      </div>

      {/* Admin Notice */}
      {isAdmin && !isSelf && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-3 text-xs text-purple-900">
          <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <span className="font-bold">Privileged Administrator Inspection: </span>
            You are viewing this user&apos;s full confidential profile as an authorized platform administrator. Regular users cannot view this page.
          </div>
        </div>
      )}

      {/* User Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact & Identity Dossier */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Identity & Contact</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                <span className="font-bold text-slate-800 truncate block">{targetUser?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Phone</span>
                <span className="font-bold text-slate-800">{targetUser?.mobile}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration Date</span>
                <span className="font-bold text-slate-800">{targetUser?.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer or Partner Details */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Account Role Details</h3>

          {targetUser?.customer && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Referral Code</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{targetUser.customer.referralCode}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Lifetime Bookings</span>
                  <span className="font-black text-slate-900 text-sm">{targetUser.customer.totalOrders} Orders</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Registered Address</span>
                <p className="text-slate-700 font-medium">{targetUser.customer.defaultAddress}</p>
              </div>
            </div>
          )}

          {targetUser?.partner && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">KYC Status</span>
                  <span className="font-bold text-emerald-700">{targetUser.partner.kycStatus}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Rating</span>
                  <span className="font-black text-amber-600">★ {targetUser.partner.rating}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed Jobs</span>
                  <span className="font-black text-slate-900">{targetUser.partner.completedJobs}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Registered Business</span>
                <p className="text-slate-800 font-bold">{targetUser.partner.businessName}</p>
                <p className="text-slate-500">{targetUser.partner.category}</p>
              </div>
            </div>
          )}

          {/* Audit Logs for Admin */}
          {isAdmin && targetUser?.auditLogs && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Recent Activity Log</span>
              <div className="space-y-1.5">
                {targetUser.auditLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-50">
                    <span className="font-mono text-slate-700">{log.action}: {log.details}</span>
                    <span className="text-slate-400">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
