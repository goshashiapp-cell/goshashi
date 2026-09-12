'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('shashi.customer@goshashi.com');
  const [password, setPassword] = useState('GoShashi@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Demo credential handling
      if (identifier.includes('admin')) {
        localStorage.setItem('gs_token', 'demo-jwt-admin-token');
        localStorage.setItem(
          'gs_user',
          JSON.stringify({
            id: 'usr-admin-001',
            name: 'GoShashi Admin',
            email: 'admin@goshashi.com',
            mobile: '9876543210',
            role: 'ADMIN',
          }),
        );
        router.push('/admin');
      } else if (identifier.includes('partner') || identifier === '9899988877') {
        localStorage.setItem('gs_token', 'demo-jwt-partner-token');
        localStorage.setItem(
          'gs_user',
          JSON.stringify({
            id: 'usr-partner-002',
            name: 'Rajesh Sharma',
            email: 'rajesh.partner@goshashi.com',
            mobile: '9899988877',
            role: 'PARTNER',
          }),
        );
        router.push('/partner');
      } else {
        localStorage.setItem('gs_token', 'demo-jwt-customer-token');
        localStorage.setItem(
          'gs_user',
          JSON.stringify({
            id: 'usr-customer-003',
            name: 'Shashi Kumar',
            email: 'shashi.customer@goshashi.com',
            mobile: '9811122233',
            role: 'CUSTOMER',
          }),
        );
        router.push('/bookings');
      }
      setLoading(false);
    }, 800);
  };

  const fillCredentials = (type: 'customer' | 'partner' | 'admin') => {
    if (type === 'customer') {
      setIdentifier('shashi.customer@goshashi.com');
      setPassword('GoShashi@2026');
    } else if (type === 'partner') {
      setIdentifier('rajesh.partner@goshashi.com');
      setPassword('GoShashi@2026');
    } else {
      setIdentifier('admin@goshashi.com');
      setPassword('GoShashi@2026');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
          GS
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome to GoShashi</h1>
        <p className="text-xs text-slate-500">Sign in to book home care or manage your operations.</p>
      </div>

      {/* Quick Role Fillers */}
      <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs flex justify-around">
        <button
          type="button"
          onClick={() => fillCredentials('customer')}
          className="px-2.5 py-1 rounded-lg hover:bg-white text-slate-700 font-bold transition-colors"
        >
          Customer Demo
        </button>
        <button
          type="button"
          onClick={() => fillCredentials('partner')}
          className="px-2.5 py-1 rounded-lg hover:bg-white text-slate-700 font-bold transition-colors"
        >
          Partner Demo
        </button>
        <button
          type="button"
          onClick={() => fillCredentials('admin')}
          className="px-2.5 py-1 rounded-lg hover:bg-white text-slate-700 font-bold transition-colors"
        >
          Admin Demo
        </button>
      </div>

      <form onSubmit={handleLogin} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Email or Mobile Number
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. name@domain.com or 9876543210"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 shadow-inner"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <span className="text-xs text-brand-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 shadow-inner"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-brand-600 hover:underline">
            Register now
          </Link>
        </div>
      </form>
    </div>
  );
}
