'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check auth status
    const savedUser = localStorage.getItem('gs_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                GS
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center">
                  Go<span className="text-brand-600">Shashi</span>
                </span>
                <span className="hidden sm:block text-[10px] font-semibold tracking-wider uppercase text-slate-400 -mt-1">
                  On-Demand Home Care
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-700 hover:border-slate-300 cursor-pointer transition-colors">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span className="font-medium">Gurugram (NCR)</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <Link
              href="/services"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:border-brand-400 hover:bg-white hover:text-slate-600 transition-all shadow-inner text-sm"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search for &quot;deep cleaning&quot;, &quot;AC repair&quot;...</span>
            </Link>
          </div>

          {/* Action Links */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/services"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              All Services
            </Link>

            <Link
              href="/partner"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-300 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Become a Partner</span>
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-400 transition-all"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  title="My Profile"
                >
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>{user.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <Link
                  href="/bookings"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200 hover:bg-brand-100 transition-colors"
                >
                  <span>Bookings</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/25 hover:shadow-lg transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/cart"
              className="p-2 rounded-lg bg-slate-100 text-slate-700"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Services
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            My Profile
          </Link>
          <Link
            href="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            My Bookings
          </Link>
          <Link
            href="/partner"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Become a Partner
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Admin Portal
          </Link>
          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <button
                onClick={() => {
                  localStorage.removeItem('gs_token');
                  localStorage.removeItem('gs_user');
                  setUser(null);
                  window.location.reload();
                }}
                className="w-full text-left px-3 py-2 text-rose-600 font-medium"
              >
                Log Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 px-4 rounded-xl bg-brand-600 text-white font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
