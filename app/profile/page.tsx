'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User as UserIcon,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  LogOut,
  Flame,
  Settings,
  Bell,
  Sparkles,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'

interface UserProfile {
  id: string
  email: string
  role: string
  profile?: {
    fullName: string
    gradeClass: string
    avatarUrl?: string
    streakDays: number
  }
}

interface SubjectProgress {
  subjectName: string
  percentage: number
  accentColor: string
}

interface TestAttempt {
  id: string
  startedAt: string
  score: number
  totalScore: number
  passed: boolean
  test: {
    title: string
    subject: { name: string }
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<SubjectProgress[]>([])
  const [attempts, setAttempts] = useState<TestAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login'
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.success && data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})

    // 2. Fetch progress
    fetch('/api/v1/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.subjects) {
          setProgress(
            data.subjects.map((s: any) => ({
              subjectName: s.subjectName,
              percentage: s.percentage,
              accentColor: s.accentColor,
            }))
          )
        }
      })
      .catch(() => {})

    // 3. Fetch attempts
    fetch('/api/v1/tests/attempts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.attempts) {
          setAttempts(data.attempts)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Student Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 bg-slate-900/40 border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-[2px] shadow-glow-physics">
              <div className="w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center font-bold text-2xl text-white">
                {user?.profile?.fullName?.charAt(0) || 'A'}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {user?.profile?.gradeClass || 'Class 8'}
              </span>
              <span className="text-xs text-slate-400">CBSE Student</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {user?.profile?.fullName || 'Aarav Sharma'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{user?.email || 'demo@student.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-glass bg-orange-500/10 border border-orange-500/30">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400/30" />
            <div>
              <div className="text-[10px] text-slate-300">Learning Streak</div>
              <div className="text-sm font-bold text-white">
                {user?.profile?.streakDays || 4} Days
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-glass bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Progress Overview Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Curriculum Mastery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {progress.map((p) => (
            <div
              key={p.subjectName}
              className="liquid-glass rounded-2xl p-5 bg-slate-900/30 border border-white/15 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{p.subjectName}</span>
                <span className="font-bold text-emerald-400">{p.percentage}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                  style={{ width: `${p.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Scores & Attempts History */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 bg-slate-900/30 border border-white/15 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Examination History</span>
          </h2>
          <Link
            href="/test"
            className="text-xs font-semibold text-blue-300 hover:text-blue-200"
          >
            Take New Test
          </Link>
        </div>

        {attempts.length === 0 ? (
          <p className="text-sm text-slate-200 py-4 text-center font-medium">
            No test attempts recorded yet. Head over to the Test Center to begin your first diagnostic test!
          </p>
        ) : (
          <div className="space-y-2.5">
            {attempts.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/15 text-sm sm:text-base font-medium"
              >
                <div>
                  <h4 className="font-bold text-white text-base">{att.test.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-200">
                    {new Date(att.startedAt).toLocaleDateString()} • {att.test.subject.name}
                  </p>
                </div>

                <span
                  className={`font-bold px-3.5 py-1.5 rounded-full text-xs sm:text-sm ${
                    att.passed
                      ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 shadow-sm'
                      : 'bg-rose-500/25 text-rose-200 border border-rose-500/40 shadow-sm'
                  }`}
                >
                  {att.score} / {att.totalScore} ({att.passed ? 'Passed' : 'Needs Practice'})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile App & API Foundation Notice */}
      <div className="liquid-glass rounded-3xl p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/20 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-amber-300 shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Cross-Platform Sync Ready</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            EduBridge uses unified REST APIs (`/api/v1/*`) and session authentication. The upcoming EduBridge mobile app will synchronize your exact learning state, test scores, and AI Tutor sessions directly.
          </p>
        </div>
      </div>

      <AITutorModal />
    </div>
  )
}
