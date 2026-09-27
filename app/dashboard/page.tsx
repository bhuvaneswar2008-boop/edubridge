'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Flame,
  Target,
  Clock,
  Play,
  CheckCircle2,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  BookOpen,
  Calendar,
  Award,
  Zap,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'

interface ProgressItem {
  subjectId: string
  subjectName: string
  slug: string
  accentColor: string
  percentage: number
  completedCount: number
  totalChapters: number
}

interface TestItem {
  id: string
  title: string
  durationMin: number
  subject: { name: string; accentColor: string; slug: string }
  classLevel: string
  questionCount: number
}

const subjectIcons: Record<string, any> = {
  Physics: Atom,
  Chemistry: FlaskConical,
  Mathematics: Calculator,
  Biology: Dna,
}

const colorStyles: Record<string, { bg: string; text: string; border: string; glow: string; bar: string }> = {
  blue: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-300',
    border: 'border-blue-500/30',
    glow: 'shadow-glow-physics',
    bar: 'from-blue-500 to-cyan-400',
  },
  green: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    glow: 'shadow-glow-chemistry',
    bar: 'from-emerald-500 to-teal-400',
  },
  orange: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-300',
    border: 'border-orange-500/30',
    glow: 'shadow-glow-math',
    bar: 'from-orange-500 to-amber-400',
  },
  pink: {
    bg: 'bg-pink-500/15',
    text: 'text-pink-300',
    border: 'border-pink-500/30',
    glow: 'shadow-glow-biology',
    bar: 'from-pink-500 to-rose-400',
  },
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('')
  const [gradeClass, setGradeClass] = useState('Class 10')
  const [streakDays, setStreakDays] = useState(1)
  const [progressList, setProgressList] = useState<ProgressItem[]>([
    { subjectId: '1', subjectName: 'Physics', slug: 'physics', accentColor: 'blue', percentage: 0, completedCount: 0, totalChapters: 5 },
    { subjectId: '2', subjectName: 'Chemistry', slug: 'chemistry', accentColor: 'green', percentage: 0, completedCount: 0, totalChapters: 5 },
    { subjectId: '3', subjectName: 'Mathematics', slug: 'mathematics', accentColor: 'orange', percentage: 0, completedCount: 0, totalChapters: 5 },
    { subjectId: '4', subjectName: 'Biology', slug: 'biology', accentColor: 'pink', percentage: 0, completedCount: 0, totalChapters: 5 },
  ])
  const [upcomingTests, setUpcomingTests] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Fetch user
    fetch('/api/v1/auth/me')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login'
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.success && data.user?.profile) {
          setUserName(data.user.profile.fullName.split(' ')[0])
          setGradeClass(data.user.profile.gradeClass)
          setStreakDays(data.user.profile.streakDays || 1)
        }
      })
      .catch(() => {})

    // 2. Fetch progress
    fetch('/api/v1/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.subjects?.length) {
          setProgressList(data.subjects)
        }
      })
      .catch(() => {})

    // 3. Fetch upcoming tests
    fetch('/api/v1/tests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tests) {
          setUpcomingTests(data.tests.slice(0, 2))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ========================================================================= */}
      {/* 💻 DESKTOP & LAPTOP VIEW (Visible on screen width >= md / 768px)          */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-8">
        {/* 1. Student Greeting & Quick Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full liquid-glass bg-white/15 text-emerald-300 border border-white/20">
                {gradeClass}
              </span>
              <span className="text-xs text-slate-300">CBSE Curriculum</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-emerald-300">{userName}!</span>
            </h1>
            <p className="text-slate-100 text-base mt-1.5 font-medium">
              Ready to explore today&apos;s science and mathematics goals?
            </p>
          </div>

          {/* Top badges: Streak & Today's Goal */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-glass bg-orange-500/20 border border-orange-500/40 shadow-sm">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400/40 animate-bounce" />
              <div>
                <div className="text-xs text-slate-200 font-semibold leading-tight">Daily Streak</div>
                <div className="text-sm font-bold text-white leading-tight">{streakDays} Days</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-glass bg-emerald-500/20 border border-emerald-500/40 shadow-sm">
              <Target className="w-5 h-5 text-emerald-300" />
              <div>
                <div className="text-xs text-slate-200 font-semibold leading-tight">Today&apos;s Goal</div>
                <div className="text-sm font-bold text-white leading-tight">1 Lesson + 1 Quiz</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Continue Learning Hero Card */}
        <div className="liquid-glass liquid-sheen specular-shine rounded-3xl p-6 sm:p-8 bg-slate-950/85 border border-white/30 shadow-2xl relative overflow-hidden group hover:border-white/50 transition-all duration-500">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                <span className="tracking-wide uppercase">Continue Learning</span>
                <span>•</span>
                <span className="tracking-wide uppercase">Physics</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2.5">
                Motion and Speed: Distance, Speed and Velocity
              </h2>
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed mb-4 font-normal">
                Explore how velocity incorporates speed and direction, master standard SI units, and solve practical motion problems with your Socratic AI Tutor.
              </p>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-200 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-300" /> 11 mins video
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-300" /> Interactive Quick Quiz
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/subjects/physics"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/35 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Lesson</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Subject Progress (Physics, Chemistry, Mathematics, Biology) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Subject Mastery</span>
              <span className="text-xs font-normal text-slate-400">(CBSE Aligned)</span>
            </h2>
            <Link
              href="/subjects"
              className="text-xs font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1"
            >
              <span>View All Chapters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {progressList.map((item) => {
              const Icon = subjectIcons[item.subjectName] || BookOpen
              const styles = colorStyles[item.accentColor] || colorStyles.blue
              return (
                <Link
                  key={item.subjectId}
                  href={`/subjects/${item.slug}`}
                  className="liquid-glass-card rounded-2xl p-5 border border-white/20 block group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${styles.bg} ${styles.text} ${styles.border} border`}>
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
                      {item.percentage}%
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-blue-200 transition-colors">
                    {item.subjectName}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium mb-4">
                    5 Chapters • {item.completedCount} in progress
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden p-[1px] shadow-inner">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${styles.bar} liquid-progress transition-all duration-1000 shadow-sm`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* 4. Upcoming Tests & Quick Practice Launch */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Tests (2 Cols) */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-7 bg-slate-950/85 border border-white/25 shadow-xl lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-indigo-300" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Upcoming CBSE Diagnostic Tests</h2>
              </div>
              <Link
                href="/test"
                className="text-xs sm:text-sm font-bold text-blue-300 hover:text-blue-200 flex items-center gap-1"
              >
                <span>Explore All (10)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {upcomingTests.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all shadow-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-200 border border-blue-500/35">
                        {t.subject?.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{t.classLevel}</span>
                    </div>
                    <h4 className="font-bold text-white text-base">{t.title}</h4>
                    <div className="text-xs sm:text-sm text-slate-200 font-medium flex items-center gap-3">
                      <span>⏱️ {t.durationMin} mins</span>
                      <span>•</span>
                      <span>📝 {t.questionCount} Questions</span>
                    </div>
                  </div>

                  <Link
                    href={`/test/${t.id}`}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all shrink-0 hover:scale-105 active:scale-95"
                  >
                    Start Test
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Practice Access Box */}
          <div className="liquid-glass liquid-sheen rounded-3xl p-6 bg-gradient-to-br from-indigo-950/90 to-purple-950/85 border border-white/25 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Practice Arena</h3>
              <p className="text-xs text-slate-200 leading-relaxed mb-4 font-normal">
                Test your knowledge on any chapter with immediate explanations, hints, and retries.
              </p>
            </div>

            <Link
              href="/practice"
              className="w-full py-3 px-4 rounded-xl liquid-glass bg-white/20 hover:bg-white/30 text-white font-semibold text-xs text-center border border-white/30 shadow-md transition-all block"
            >
              Launch Practice Arena
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW (Visible on screen width < md / 768px: Mobile Phones)      */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-4 pb-28 pt-1">
        {/* Mobile Header Card (Matches Subjects/Practice/Profile transparency) */}
        <div className="liquid-glass-card rounded-3xl p-4 sm:p-5 bg-slate-950/85 border border-white/25 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-emerald-400 p-[1.5px] shadow-glow-physics">
                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center font-extrabold text-base text-white">
                  {userName.charAt(0)}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {gradeClass} CBSE
                </span>
                <h1 className="text-xl font-extrabold text-white mt-0.5 tracking-tight">
                  Hi, {userName}! 👋
                </h1>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-500/20 border border-orange-500/35">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400/50" />
              <span className="text-xs font-bold text-white">{streakDays}d Streak</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <span>🎯</span> Daily Goal:
            </span>
            <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
              1 Lesson Done
            </span>
          </div>
        </div>

        {/* Priority Learning Tasks (Integrated Resume Lesson + Next Timed Test) */}
        <div className="space-y-3">
          {/* 1. Resume Current Topic */}
          <div className="liquid-glass-card rounded-3xl p-5 bg-slate-950/85 border border-white/25 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span>Resume Lesson</span>
              </span>
              <span className="text-[11px] text-slate-200 font-semibold flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                <Clock className="w-3.5 h-3.5 text-blue-300" /> 11m
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white leading-snug">
                Physics: Motion & Speed
              </h2>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Distance, displacement, velocity formulas, and practical SI units.
              </p>
            </div>

            <Link
              href="/subjects/physics"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all duration-150"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Lesson</span>
            </Link>
          </div>

          {/* 2. Upcoming Timed Test (Integrated Right in Priority Tasks!) */}
          {upcomingTests.length > 0 && (
            <div className="liquid-glass-card rounded-3xl p-5 bg-slate-950/85 border border-white/25 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Next Timed Test</span>
                </span>
                <Link href="/test" className="text-xs text-blue-300 font-bold active:opacity-70">
                  All Tests →
                </Link>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {upcomingTests[0].subject?.name}
                </span>
                <h3 className="font-bold text-white text-base mt-1.5">
                  {upcomingTests[0].title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span>⏱️ {upcomingTests[0].durationMin} mins</span>
                  <span>•</span>
                  <span>📝 {upcomingTests[0].questionCount} Questions</span>
                </div>
              </div>

              <Link
                href={`/test/${upcomingTests[0].id}`}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all duration-150"
              >
                <span>Take Test Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Subject Grid (2x2 touch cards matching subjects page styling) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white tracking-wide">Curriculum Subjects</h3>
            <Link href="/subjects" className="text-xs font-bold text-blue-300 active:opacity-70">
              See All →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {progressList.map((item) => {
              const Icon = subjectIcons[item.subjectName] || BookOpen
              const styles = colorStyles[item.accentColor] || colorStyles.blue
              return (
                <Link
                  key={item.subjectId}
                  href={`/subjects/${item.slug}`}
                  className="liquid-glass-card rounded-2xl p-4 space-y-2.5 active:scale-95 transition-all duration-150 block bg-slate-950/85 border border-white/20 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${styles.bg} ${styles.text} ${styles.border} border`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                      {item.percentage}%
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm">{item.subjectName}</h4>
                    <span className="text-[10px] text-slate-300 block">5 Chapters</span>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${styles.bar}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile Quick Practice Banner */}
        <Link
          href="/practice"
          className="liquid-glass-card rounded-3xl p-4 flex items-center justify-between gap-3 active:scale-95 transition-all duration-150 block bg-slate-950/85 border border-white/25 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Practice Arena</h4>
              <p className="text-xs text-slate-300">Instant hints & step-by-step solutions</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-300 shrink-0" />
        </Link>
      </div>

      {/* Floating AI Tutor instance */}
      <AITutorModal initialSubject="Physics" initialChapter="Motion and Speed" />
    </div>
  )
}
