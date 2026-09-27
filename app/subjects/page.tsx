'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  ArrowRight,
  BookOpen,
  CheckCircle,
  PlayCircle,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'

interface Chapter {
  id: string
  title: string
  description: string
  order: number
  video?: { duration: string }
  lessons: { id: string; title: string }[]
}

interface Subject {
  id: string
  slug: string
  name: string
  description: string
  accentColor: string
  chapters: Chapter[]
}

const iconsMap: Record<string, any> = {
  Physics: Atom,
  Chemistry: FlaskConical,
  Mathematics: Calculator,
  Biology: Dna,
}

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string; pill: string }> = {
  blue: {
    bg: 'bg-slate-900/90 hover:bg-slate-900/95',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
    glow: 'shadow-glow-physics',
    pill: 'bg-blue-500/25 text-blue-200 border-blue-400/40',
  },
  green: {
    bg: 'bg-slate-900/90 hover:bg-slate-900/95',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    glow: 'shadow-glow-chemistry',
    pill: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40',
  },
  orange: {
    bg: 'bg-slate-900/90 hover:bg-slate-900/95',
    text: 'text-orange-300',
    border: 'border-orange-500/40',
    glow: 'shadow-glow-math',
    pill: 'bg-orange-500/25 text-orange-200 border-orange-400/40',
  },
  pink: {
    bg: 'bg-slate-900/90 hover:bg-slate-900/95',
    text: 'text-pink-300',
    border: 'border-pink-500/40',
    glow: 'shadow-glow-biology',
    pill: 'bg-pink-500/25 text-pink-200 border-pink-400/40',
  },
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/subjects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.subjects) {
          setSubjects(data.subjects)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-28 sm:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Subjects
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            Physics, Chemistry, Mathematics & Biology
          </p>
        </div>
      </div>

      {/* Grid of 4 Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((s) => {
          const Icon = iconsMap[s.name] || BookOpen
          const colors = colorMap[s.accentColor] || colorMap.blue
          return (
            <div
              key={s.id}
              className={`liquid-glass-card rounded-3xl p-6 sm:p-7 border border-white/20 transition-all ${colors.bg} ${colors.glow}`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-slate-800/80 border ${colors.border} ${colors.text} shadow-md`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colors.pill}`}>
                  5 Demo Chapters
                </span>
              </div>

              {/* Title & Desc */}
              <h2 className="text-2xl font-bold text-white mb-2">{s.name}</h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5 min-h-[40px]">
                {s.description}
              </p>

              {/* Chapter Highlights List */}
              <div className="space-y-2 mb-6">
                {s.chapters.slice(0, 3).map((ch, idx) => (
                  <div
                    key={ch.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-slate-100 font-medium"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{ch.title}</span>
                    </div>
                    {ch.video && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-200 shrink-0 ml-2 font-medium">
                        <PlayCircle className="w-3.5 h-3.5 text-blue-300" />
                        {ch.video.duration}
                      </span>
                    )}
                  </div>
                ))}
                {s.chapters.length > 3 && (
                  <p className="text-xs font-semibold text-slate-200 text-right pr-1">
                    + {s.chapters.length - 3} more chapters
                  </p>
                )}
              </div>

              {/* Action Button */}
              <Link
                href={`/subjects/${s.slug}`}
                className="w-full py-3 px-4 rounded-2xl liquid-glass bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/25 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Enter {s.name} Syllabus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )
        })}
      </div>

      <AITutorModal />
    </div>
  )
}
