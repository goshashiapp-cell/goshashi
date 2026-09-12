'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Check,
  X,
  TrendingUp,
  Tag,
  Settings,
  Eye,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'PARTNERS' | 'ORDERS' | 'COUPONS' | 'USERS'>('METRICS');

  // KYC Review Queue State
  const [partnerQueue, setPartnerQueue] = useState([
    {
      id: 'PTR-501',
      name: 'Vikas Kumar',
      category: 'Plumbing',
      city: 'Gurugram',
      pan: 'ABCDE1234F',
      status: 'PENDING',
      submittedDate: 'Today, 10:15 AM',
    },
    {
      id: 'PTR-502',
      name: 'Sunil Yadav',
      category: 'Electrical',
      city: 'Gurugram',
      pan: 'WXYZP5678Q',
      status: 'PENDING',
      submittedDate: 'Today, 11:30 AM',
    },
    {
      id: 'PTR-480',
      name: 'Rajesh Sharma',
      category: 'Home Cleaning',
      city: 'Gurugram',
      pan: 'SHARJ9876R',
      status: 'APPROVED',
      submittedDate: 'Yesterday',
    },
  ]);

  const handleKycDecision = (partnerId: string, decision: 'APPROVED' | 'REJECTED') => {
    setPartnerQueue((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, status: decision } : p)),
    );
  };

  // Users Directory State & Data
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'PARTNER' | 'ADMIN'>('ALL');
  const [inspectingUser, setInspectingUser] = useState<any | null>(null);

  const [platformUsers] = useState([
    {
      id: 'usr-customer-003',
      name: 'Shashi Kumar',
      email: 'shashi.customer@goshashi.com',
      mobile: '+91 98111 22233',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      joinedDate: 'Mar 01, 2026',
      totalOrders: 14,
      totalSpend: '₹18,450',
      address: 'Tower 4, Flat 1202, DLF Phase 5, Golf Course Road, Sector 54, Gurugram, Haryana 122002',
      referralCode: 'SHASHI2026',
      isVerified: true,
    },
    {
      id: 'usr-customer-004',
      name: 'Amit Verma',
      email: 'amit.verma@example.com',
      mobile: '+91 98223 34455',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      joinedDate: 'Apr 12, 2026',
      totalOrders: 3,
      totalSpend: '₹2,350',
      address: 'Sector 57, Sushant Lok Phase 3, Gurugram',
      referralCode: 'AMIT455',
      isVerified: true,
    },
    {
      id: 'usr-customer-005',
      name: 'Pooja Gupta',
      email: 'pooja.gupta@example.com',
      mobile: '+91 98334 45566',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      joinedDate: 'May 04, 2026',
      totalOrders: 1,
      totalSpend: '₹399',
      address: 'DLF Cyber City, Tower 10, DLF Phase 2, Gurugram',
      referralCode: 'POOJA99',
      isVerified: true,
    },
    {
      id: 'usr-partner-002',
      name: 'Rajesh Sharma',
      email: 'rajesh.partner@goshashi.com',
      mobile: '+91 98999 88877',
      role: 'PARTNER',
      status: 'ACTIVE',
      joinedDate: 'Feb 15, 2026',
      category: 'Electrical & AC Repair',
      kycStatus: 'APPROVED',
      rating: 4.9,
      completedJobs: 142,
      pan: 'SHARJ9876R',
      city: 'Gurugram',
      isVerified: true,
    },
    {
      id: 'usr-partner-501',
      name: 'Vikas Kumar',
      email: 'vikas.kumar@example.com',
      mobile: '+91 98777 66655',
      role: 'PARTNER',
      status: 'PENDING',
      joinedDate: 'Sep 10, 2026',
      category: 'Plumbing & Water Care',
      kycStatus: 'PENDING',
      rating: 0,
      completedJobs: 0,
      pan: 'ABCDE1234F',
      city: 'Gurugram',
      isVerified: false,
    },
    {
      id: 'usr-admin-001',
      name: 'GoShashi Admin',
      email: 'admin@goshashi.com',
      mobile: '+91 98765 43210',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      joinedDate: 'Jan 10, 2026',
      totalOrders: 0,
      isVerified: true,
    },
  ]);

  const filteredUsers = platformUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.mobile.includes(userSearch) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole =
      userRoleFilter === 'ALL'
        ? true
        : userRoleFilter === 'ADMIN'
        ? u.role.includes('ADMIN')
        : u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketplace Operations</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
              Super Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Live metrics, partner verification queue, user directory, and order governance.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['METRICS', 'USERS', 'PARTNERS', 'ORDERS', 'COUPONS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'METRICS'
                ? 'Overview & KPIs'
                : tab === 'USERS'
                ? `Users Directory (${platformUsers.length})`
                : tab === 'PARTNERS'
                ? `KYC Queue (${partnerQueue.filter((p) => p.status === 'PENDING').length})`
                : tab === 'ORDERS'
                ? 'Orders & Revenue'
                : 'Coupons'}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'METRICS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total GMV (Gross)</span>
                <DollarSign className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-2">₹1,84,500</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% this week
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Platform Cut</span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-black text-emerald-600 mt-2">₹27,675</h3>
              <p className="text-[11px] text-slate-400 mt-1">15% commission + platform fees</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending KYC Approvals</span>
                <ShieldAlert className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-3xl font-black text-amber-600 mt-2">
                {partnerQueue.filter((p) => p.status === 'PENDING').length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Requires immediate ops review</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Verified Pros</span>
                <Briefcase className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-2">48</h3>
              <p className="text-[11px] text-slate-400 mt-1">Across 8 categories in Gurugram</p>
            </div>
          </div>

          {/* Quick actions & category distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">City Performance</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Gurugram (DLF Phase 1-5, Golf Course Rd)</span>
                  <span className="font-mono font-bold text-emerald-600">68% bookings</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Sohna Road & Sector 47-50</span>
                  <span className="font-mono font-bold text-emerald-600">22% bookings</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-bold text-slate-800">New Gurugram (Sector 82-90)</span>
                  <span className="font-mono font-bold text-emerald-600">10% bookings</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">Top In-Demand Categories</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Home Deep Cleaning</span>
                  <span className="font-bold text-slate-900">₹78,400</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full w-[45%]" />
                </div>

                <div className="flex justify-between text-slate-600 pt-2">
                  <span>Appliance & AC Repair</span>
                  <span className="font-bold text-slate-900">₹52,200</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[30%]" />
                </div>

                <div className="flex justify-between text-slate-600 pt-2">
                  <span>Plumbing & Electrical</span>
                  <span className="font-bold text-slate-900">₹36,100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[20%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KYC QUEUE */}
      {activeTab === 'PARTNERS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900">Partner KYC Verification Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Approve government identification and bank records before partners receive live bookings.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Partner ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">PAN Number</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partnerQueue.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-4 font-mono font-bold text-slate-500">{p.id}</td>
                    <td className="py-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-4 text-slate-600">{p.category}</td>
                    <td className="py-4 font-mono text-slate-600">{p.pan}</td>
                    <td className="py-4 text-slate-400">{p.submittedDate}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        p.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {p.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleKycDecision(p.id, 'APPROVED')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleKycDecision(p.id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-1 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Action Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Recent Marketplace Bookings</h3>
          <div className="space-y-3">
            {[
              { id: 'GS-2026-10492', service: 'Complete Deep Home Cleaning', customer: 'Shashi Kumar', partner: 'Rajesh Sharma', amount: 3200, status: 'CONFIRMED' },
              { id: 'GS-2026-10491', service: 'Split AC Power Jet Deep Service', customer: 'Amit Verma', partner: 'Rajesh Sharma', amount: 538, status: 'COMPLETED' },
              { id: 'GS-2026-10490', service: 'Water Leakage & Pipe Joint Repair', customer: 'Pooja Gupta', partner: 'Auto-Dispatching', amount: 399, status: 'SEARCHING_PARTNER' },
            ].map((o) => (
              <div key={o.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-400">{o.id}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{o.service}</h4>
                  <p className="text-slate-500 mt-0.5">Customer: {o.customer} • Partner: {o.partner}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-black text-slate-900 text-sm block">₹{o.amount}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeTab === 'COUPONS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900">Active Promotional Coupons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-black text-slate-900">SHASHI150</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
              </div>
              <p className="text-slate-600">Flat ₹150 OFF on orders above ₹499. First-time booking promotion.</p>
              <span className="text-[11px] text-slate-400 block">Valid until Dec 31, 2026</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-black text-slate-900">WELCOME20</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
              </div>
              <p className="text-slate-600">20% discount up to ₹300 on orders above ₹799.</p>
              <span className="text-[11px] text-slate-400 block">Valid until Dec 31, 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USERS DIRECTORY (ADMIN-ONLY VISIBILITY) */}
      {activeTab === 'USERS' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">Platform Users Directory</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                  Admin Privilege
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every user&apos;s confidential profile, addresses, contact details, and account records.
              </p>
            </div>

            {/* Search & Role Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, email, mobile..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs w-60 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {(['ALL', 'CUSTOMER', 'PARTNER', 'ADMIN'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1 rounded-lg transition-colors text-[11px] ${
                      userRoleFilter === role
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">User ID</th>
                  <th className="pb-3">User & Contact Details</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Key Details & Activity</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No users match the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-mono font-bold text-slate-500">{u.id}</td>
                      <td className="py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {u.name}
                          {u.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>{u.email}</span>
                          <span>•</span>
                          <span>{u.mobile}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            u.role.includes('ADMIN')
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'PARTNER'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600">
                        {u.role === 'CUSTOMER' ? (
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-900">{u.totalOrders} Orders</span>
                            <span className="text-slate-400"> ({u.totalSpend})</span>
                          </div>
                        ) : u.role === 'PARTNER' ? (
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-900">{u.category}</span>
                            <span className="text-slate-400"> • {u.completedJobs} jobs</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Full System Privileges</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectingUser(u)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1 shadow-sm transition-colors text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> Inspect
                          </button>
                          <Link
                            href={`/users/${u.id}`}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                            title="Open dedicated profile page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECTOR MODAL: FULL USER DETAILS */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {inspectingUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{inspectingUser.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                      {inspectingUser.role}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{inspectingUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Notice */}
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-2.5 text-xs text-purple-900">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                <strong>Confidential Administrator Dossier:</strong> Regular users cannot view this profile or its associated details.
              </span>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
                Contact & Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                  <span className="font-bold text-slate-900">{inspectingUser.email}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Phone</span>
                  <span className="font-bold text-slate-900">{inspectingUser.mobile}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Status</span>
                  <span className="font-bold text-emerald-700">{inspectingUser.status}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Member Since</span>
                  <span className="font-bold text-slate-900">{inspectingUser.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Role Specific Details */}
            {inspectingUser.address && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                  Registered Customer Address
                </h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                  {inspectingUser.address}
                </div>
              </div>
            )}

            {inspectingUser.pan && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                  Partner Government Identification
                </h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">PAN Number</span>
                    <span className="font-mono font-bold text-slate-900">{inspectingUser.pan}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">KYC Status</span>
                    <span className="font-bold text-emerald-700">{inspectingUser.kycStatus}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link
                href={`/users/${inspectingUser.id}`}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Open in dedicated page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setInspectingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
