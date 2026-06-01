'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ICONS } from '@/src/constants';
import Spinner from '@/components/ui/Spinner';

interface NavLinkItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  badgeKey?: string;
}

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvatarError(false);
  }, [user]);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside to close mobile drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Route labels for breadcrumbs
  const getFriendlyTitle = (path: string): string => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/users')) return 'Users Management';
    if (path.startsWith('/admin/leaders')) return 'Leaders & Pastors';
    if (path.startsWith('/admin/tuesday-fellowship')) return 'Tuesday Fellowship';
    if (path.startsWith('/admin/campuses')) return 'Light Campuses';
    if (path.startsWith('/admin/teachings')) return 'Teachings Database';
    if (path.startsWith('/admin/events')) return 'Events Planner';
    if (path.startsWith('/admin/blog')) return 'Blog Publisher';
    if (path.startsWith('/admin/prayers')) return 'Prayer Wall';
    if (path.startsWith('/admin/testimonies')) return 'Testimonies Manager';
    if (path.startsWith('/admin/serve')) return 'Ministry Teams';
    if (path.startsWith('/admin/torch-kids')) return 'Torch Kids';
    if (path.startsWith('/admin/new-converts')) return 'New Converts';
    if (path.startsWith('/admin/content')) return 'System Settings';
    return 'Admin Control';
  };

  const navLinks: NavLinkItem[] = [
    { name: 'Dashboard', path: '/admin', icon: ICONS.Settings },
    { name: 'Users', path: '/admin/users', icon: ICONS.Users },
    { name: 'Leaders', path: '/admin/leaders', icon: ICONS.Shield },
    { name: 'Tuesday Fellowship', path: '/admin/tuesday-fellowship', icon: ICONS.Flame },
    { name: 'Light Campuses', path: '/admin/campuses', icon: ICONS.MapPin },
    { name: 'Teachings', path: '/admin/teachings', icon: ICONS.BookOpen },
    { name: 'Events Coordinator', path: '/admin/events', icon: ICONS.Calendar },
    { name: 'Blog Publisher', path: '/admin/blog', icon: ICONS.FileText },
    { name: 'Prayer Requests', path: '/admin/prayers', icon: ICONS.Heart },
    { name: 'Testimonies', path: '/admin/testimonies', icon: ICONS.Quote },
    { name: 'Ministry Teams', path: '/admin/serve', icon: ICONS.HeartHandshake },
    { name: 'Torch Kids', path: '/admin/torch-kids', icon: ICONS.Child },
    { name: 'New Converts', path: '/admin/new-converts', icon: ICONS.Smile },
    { name: 'Content Control', path: '/admin/content', icon: ICONS.Edit },
    { name: 'Admin Chat', path: '/chat', icon: ICONS.MessageSquare },
  ];

  // 1. Loading state barrier
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-400 text-sm font-semibold tracking-wider uppercase animate-pulse">
          Verifying security privileges...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated / Unauthorized state barrier
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-brand-surface border border-red-500/20 text-center shadow-2xl backdrop-blur-xl animate-fadeInUp">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <ICONS.AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
            Access Denied
          </h1>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            You do not have the required administrative permissions to access this workspace. If you believe this is an error, please sign in with an administrator account.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-brand-dark font-black text-sm transition-transform hover:-translate-y-0.5 shadow-md shadow-orange-500/10"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-lg bg-brand-muted hover:bg-white/10 text-white font-bold text-sm transition-colors border border-white/5"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSubPage = pathname !== '/admin';
  const roleColor =
    user.role === 'Super-Admin'
      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]';

  const renderNavLinks = (isMobile: boolean) => {
    return (
      <nav className="space-y-1.5 px-3 py-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.path || (link.path !== '/admin' && pathname.startsWith(link.path));

          return (
            <Link
              key={link.name}
              href={link.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 transform hover:translate-x-1 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-yellow-500/5 text-white border-orange-500/30'
                  : 'bg-transparent text-brand-text-dark hover:text-white border-transparent hover:bg-white/[0.02]'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <span className="truncate">{link.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col lg:flex-row">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex w-72 shrink-0 bg-brand-surface border-r border-brand-muted/30 flex-col h-screen sticky top-0">
        {/* Sidebar Header */}
        <div className="h-20 px-6 border-b border-brand-muted/30 flex items-center gap-3.5">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-sm animate-pulse" />
            <img
              src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png"
              alt="Torch Fellowship"
              className="w-10 h-10 object-contain relative hover:rotate-12 transition-transform duration-300"
            />
          </div>
          <div>
            <h2 className="text-base font-serif font-black text-white leading-tight tracking-wide">
              Torch Admin
            </h2>
            <p className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
              Control Suite
            </p>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-muted scrollbar-track-transparent">
          {renderNavLinks(false)}
        </div>

        {/* Sidebar Footer (Admin Profile) */}
        <div className="p-4 border-t border-brand-muted/30 bg-brand-dark/35 flex items-center gap-3">
          <img
            src={(!avatarError && user.avatarUrl) ? user.avatarUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email)}&background=2B2F36&color=EAEAEA&size=64`}
            alt={user.fullName || user.email}
            onError={() => setAvatarError(true)}
            className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0 shadow-md"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{user.fullName || 'Admin'}</h4>
            <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider mt-1 ${roleColor}`}>
              {user.role}
            </span>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
          >
            <ICONS.LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ─── MOBILE STICKY TOP BAR ─── */}
      <header className="lg:hidden h-16 bg-brand-surface/80 backdrop-blur-xl border-b border-brand-muted/30 sticky top-0 z-40 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img
            src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png"
            alt="Torch Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white text-sm font-serif font-black tracking-wide">
            Torch Admin
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 bg-brand-muted/30 hover:bg-brand-muted/60 text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Open Navigation Drawer"
        >
          <ICONS.Menu className="w-5 h-5" />
        </button>
      </header>

      {/* ─── MOBILE NAVIGATION DRAWER ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

          {/* Drawer container */}
          <div
            ref={mobileRef}
            className="absolute top-0 left-0 bottom-0 w-72 bg-brand-surface border-r border-brand-muted/30 flex flex-col shadow-2xl animate-slideRight"
          >
            {/* Drawer Header */}
            <div className="h-16 px-4 border-b border-brand-muted/30 flex items-center justify-between bg-brand-dark/20">
              <div className="flex items-center gap-2">
                <img
                  src="https://res.cloudinary.com/dn2mbmhmi/image/upload/v1755273222/Torch-logo_ithw3f.png"
                  alt="Torch Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-white text-sm font-serif font-black tracking-wide">
                  Navigation
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                aria-label="Close Navigation Drawer"
              >
                <ICONS.X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto">
              {renderNavLinks(true)}
            </div>

            {/* Profile footer */}
            <div className="p-4 border-t border-brand-muted/30 bg-brand-dark/35 flex items-center gap-3">
              <img
                src={(!avatarError && user.avatarUrl) ? user.avatarUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email)}&background=2B2F36&color=EAEAEA&size=64`}
                alt={user.fullName || user.email}
                onError={() => setAvatarError(true)}
                className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{user.fullName || 'Admin'}</h4>
                <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-wider mt-1 ${roleColor}`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <ICONS.LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN WORKSPACE CONTENT ─── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Header Bar */}
        <section className="h-16 border-b border-brand-muted/35 bg-brand-surface/20 px-4 md:px-8 flex items-center justify-between shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-gray-500 font-medium">Admin Suite</span>
            <span className="text-gray-600">/</span>
            <span className="text-orange-400 font-bold tracking-wide">
              {getFriendlyTitle(pathname)}
            </span>
          </div>

          {/* Quick Exit Navigation Link */}
          {isSubPage ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-muted hover:bg-white/10 border border-white/5 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <span className="text-[10px]">←</span> Dashboard
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-muted hover:bg-white/10 border border-white/5 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <span className="text-[10px]">←</span> Go to Site
            </Link>
          )}
        </section>

        {/* Content Wrapper */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideRight {
          animation: slideRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
