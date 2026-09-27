'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  CheckCircle2,
  FileQuestion,
  Bell,
  User as UserIcon,
  Sparkles,
  LogOut,
} from 'lucide-react'
import EduBridgeLogo from '@/components/EduBridgeLogo'

interface UserData {
  id: string
  email: string
  profile?: {
    fullName: string
    gradeClass: string
    avatarUrl?: string
  }
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [user, setUser] = useState<UserData | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})

    fetch('/api/v1/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.unreadCount === 'number') {
          setUnreadCount(data.unreadCount)
        }
      })
      .catch(() => {})
  }, [pathname])

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Subjects', href: '/subjects', icon: BookOpen },
    { label: 'Practice', href: '/practice', icon: CheckCircle2 },
    { label: 'Test', href: '/test', icon: FileQuestion },
  ]

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (pathname === '/login') return null

  return (
    <>
      {/* ========================================================================= */}
      {/* 💻 DESKTOP & LAPTOP FLOATING TOP NAVIGATION (Screen width >= md / 768px)  */}
      {/* ========================================================================= */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 justify-center px-4 py-3 sm:py-4 pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-4 sm:px-6 py-2.5 rounded-full liquid-glass specular-shine transition-all duration-500 ${
            isScrolled
              ? 'bg-slate-950/70 shadow-2xl py-2 border-white/35 backdrop-blur-3xl'
              : 'bg-white/12 shadow-glass'
          }`}
          aria-label="Main Navigation"
        >
          {/* Brand with Official Logo */}
          <Link href="/dashboard" className="group active:scale-95 transition-all">
            <EduBridgeLogo size={38} />
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="flex items-center gap-1.5 bg-black/25 p-1 rounded-full border border-white/15 backdrop-blur-xl shadow-inner">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white liquid-bubble scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 hover:scale-102'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-blue-300 scale-110' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Action Icons: Notifications, Profile, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notification Bell */}
            <Link
              href="/notifications"
              className="relative p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-white/15 transition-all duration-300 hover:scale-105"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-glow-biology animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Avatar / Link */}
            <Link
              href="/profile"
              className="flex items-center gap-2 p-1.5 pl-2.5 sm:pr-3.5 rounded-full liquid-glass bg-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 text-xs text-slate-200 border border-white/25 shadow-sm"
              aria-label="Student Profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-emerald-400 flex items-center justify-center font-bold text-white text-xs ring-1 ring-white/40 overflow-hidden shadow-sm">
                {user?.profile?.fullName ? user.profile.fullName.charAt(0) : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline font-medium">
                {user?.profile?.fullName?.split(' ')[0] || 'Aarav'}
              </span>
            </Link>

            {/* Quick Logout */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex p-2.5 rounded-full text-slate-400 hover:text-rose-300 hover:bg-rose-500/15 transition-all duration-300 hover:scale-105"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* 📱 MOBILE TOP MINIMAL APP HEADER (Screen width < md / 768px)               */}
      {/* ========================================================================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 px-3 py-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between px-3.5 py-2 rounded-2xl liquid-glass-dock shadow-xl">
          {/* Brand with Official Logo */}
          <Link href="/dashboard" className="group active:scale-95 transition-all">
            <EduBridgeLogo size={32} />
          </Link>

          {/* Right actions: AI Quick Trigger + Notifications Bell + Profile Avatar */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-tutor'))}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/40 text-blue-200 text-xs font-bold active:scale-90 transition-all shadow-sm"
              title="Ask AI Tutor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI</span>
            </button>

            <Link
              href="/notifications"
              className="relative p-2 rounded-xl text-slate-200 hover:text-white active:scale-90 transition-all duration-150"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-glow-biology animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-emerald-400 p-[1.5px] shadow-sm active:scale-90 transition-all duration-150 flex items-center justify-center"
              aria-label="Student Profile"
            >
              <div className="w-full h-full bg-slate-900/90 rounded-full flex items-center justify-center font-bold text-xs text-white">
                {user?.profile?.fullName ? user.profile.fullName.charAt(0) : <UserIcon className="w-3.5 h-3.5" />}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 📱 MOBILE BOTTOM LIQUID-GLASS NAVIGATION DOCK (STRICTLY AT BOTTOM)        */}
      {/* ========================================================================= */}
      <nav
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '12px',
          right: '12px',
          zIndex: 9999,
          maxWidth: '520px',
          margin: '0 auto',
        }}
        className="md:hidden flex items-center justify-around py-2 px-2 rounded-3xl liquid-glass-dock shadow-2xl"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? 'text-white liquid-bubble font-bold shadow-lg scale-105'
                  : 'text-slate-300 hover:text-white font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'text-blue-300 scale-110' : 'text-slate-300'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          )
        })}
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 ${
            pathname === '/profile'
              ? 'text-white liquid-bubble font-bold shadow-lg scale-105'
              : 'text-slate-300 hover:text-white font-medium'
          }`}
        >
          <UserIcon className={`w-5 h-5 transition-transform duration-150 ${pathname === '/profile' ? 'text-blue-300 scale-110' : 'text-slate-300'}`} />
          <span className="text-[10px] tracking-tight">Profile</span>
        </Link>
      </nav>

    </>
  )
}
