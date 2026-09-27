'use client'

import React, { useState } from 'react'
import { ArrowRight, Lock, Mail, User, GraduationCap } from 'lucide-react'
import EduBridgeLogo from '@/components/EduBridgeLogo'

const CLASS_OPTIONS = ['Class 10', 'Class 8', 'Class 7', 'Class 6', 'Class 5']

export default function LoginPage() {
  const [fullName, setFullName] = useState('')
  const [gradeClass, setGradeClass] = useState('Class 10')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
          gradeClass,
        }),
      })

      const data = await res.json()
      if (data.success) {
        // Direct browser navigation ensures session cookie is refreshed immediately on mobile
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Unable to log in. Please try again.')
        setLoading(false)
      }
    } catch {
      // In case of any network issue, retry or redirect
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-8 px-4">
      <div className="w-full max-w-md liquid-glass rounded-3xl p-6 sm:p-9 shadow-2xl border border-white/20 relative overflow-hidden backdrop-blur-2xl bg-slate-950/85">
        {/* Ambient background flares */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* EduBridge Logo & Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <EduBridgeLogo size={52} showText={false} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-300">Bridge</span>
          </h1>
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest mt-1">
            Learn • Practice • Grow
          </p>
          <p className="text-[11px] text-slate-400 mt-1.5">
            CBSE Class 5–10 Interactive E-Learning
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1">
              Your Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                placeholder="Enter your name"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Class Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
              <span>Select Class Level</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CLASS_OPTIONS.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setGradeClass(cls)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    gradeClass === cls
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md font-bold'
                      : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-4 rounded-xl liquid-glass bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm border border-white/25 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Entering EduBridge...' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
