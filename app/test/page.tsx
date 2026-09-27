'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileQuestion,
  Clock,
  Award,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
  Calendar,
  Sparkles,
  Menu,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'

interface TestItem {
  id: string
  title: string
  description: string
  durationMin: number
  totalMarks: number
  passMarks: number
  subject: {
    id: string
    name: string
    slug: string
    accentColor: string
  }
  classLevel: string
  questionCount: number
}

interface TestAttemptItem {
  id: string
  startedAt: string
  completedAt: string
  score: number
  totalScore: number
  passed: boolean
  test: {
    title: string
    subject: { name: string; accentColor: string }
  }
}

export default function TestCenterPage() {
  const [tests, setTests] = useState<TestItem[]>([])
  const [pastAttempts, setPastAttempts] = useState<TestAttemptItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<string>('all')

  useEffect(() => {
    // 1. Fetch Tests
    fetch('/api/v1/tests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tests) {
          setTests(data.tests)
        }
      })
      .catch(() => {})

    // 2. Fetch past attempts
    fetch('/api/v1/tests/attempts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.attempts) {
          setPastAttempts(data.attempts)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredTests = tests.filter((t) => {
    const matchesSubj =
      selectedSubject === 'all' || t.subject.slug === selectedSubject
    const matchesClass =
      selectedClass === 'all' || t.classLevel.toLowerCase() === selectedClass.toLowerCase()
    return matchesSubj && matchesClass
  })

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-6xl mx-auto pb-28 sm:pb-8">
      {/* Header (Clean Minimal UI) */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Test Center
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">Timed CBSE diagnostic assessments</p>
        </div>
      </div>

      {/* 3-Line Filter Bar (Subject & Class Selector) */}
      <div className="liquid-glass rounded-2xl p-2.5 bg-slate-950/80 border border-white/20 space-y-2 shadow-lg">
        {/* Subject Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold shrink-0 border border-white/15">
            <Menu className="w-4 h-4 text-blue-300" />
            <span>Subject:</span>
          </div>
          {['all', 'physics', 'chemistry', 'mathematics', 'biology'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all duration-150 active:scale-95 shrink-0 ${
                selectedSubject === s
                  ? 'liquid-bubble text-white shadow-md font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {s === 'all' ? 'All Subjects' : s}
            </button>
          ))}
        </div>

        {/* Class Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 border-t border-white/10 pt-2">
          <span className="text-xs text-slate-300 font-bold shrink-0 px-2">Class:</span>
          {['all', 'Class 7', 'Class 8', 'Class 10'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedClass(c)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 shrink-0 ${
                selectedClass === c
                  ? 'bg-blue-600 text-white border border-blue-400 shadow-md font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {c === 'all' ? 'All Classes' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Test Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-10 text-center space-y-3 bg-slate-900/30">
          <FileQuestion className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No tests match selected filters</h3>
          <p className="text-xs text-slate-300">Try changing your subject or class selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTests.map((t) => (
            <div
              key={t.id}
              className="liquid-glass-card rounded-3xl p-6 sm:p-7 bg-slate-950/85 border border-white/25 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/25 text-blue-200 border border-blue-500/40 shadow-sm">
                    {t.subject.name}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/15 text-slate-100 border border-white/15">
                    {t.classLevel}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {t.title}
                </h3>
                <p className="text-sm text-slate-100 leading-relaxed mb-5 font-normal">
                  {t.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-200 font-medium py-3 border-t border-white/15 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-300" /> {t.durationMin} mins
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <FileQuestion className="w-4 h-4 text-blue-300" /> {t.questionCount} Questions
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-300" /> {t.totalMarks} Marks
                  </span>
                </div>

                <Link
                  href={`/test/${t.id}`}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Start Timed Test</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past Test History */}
      {pastAttempts.length > 0 && (
        <div className="liquid-glass rounded-3xl p-6 bg-slate-900/30 border border-white/15 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Recent Test Submissions</span>
          </h2>

          <div className="space-y-2.5">
            {pastAttempts.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm"
              >
                <div>
                  <h4 className="font-semibold text-white">{att.test.title}</h4>
                  <p className="text-xs text-slate-400">
                    {new Date(att.startedAt).toLocaleDateString()} • {att.test.subject.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold px-3 py-1 rounded-full text-xs ${
                      att.passed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {att.score} / {att.totalScore} ({att.passed ? 'Passed' : 'Needs Practice'})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AITutorModal />
    </div>
  )
}
