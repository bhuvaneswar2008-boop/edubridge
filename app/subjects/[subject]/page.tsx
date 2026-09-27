'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  BookOpen,
  CheckCircle2,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  Video,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'

interface Lesson {
  id: string
  title: string
  order: number
}

interface Chapter {
  id: string
  title: string
  description: string
  order: number
  video?: {
    title: string
    duration: string
    embedUrl: string
    licenseOrAuthorization: string
  }
  lessons: Lesson[]
  questions: { id: string }[]
}

interface SubjectDetail {
  id: string
  name: string
  slug: string
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

export default function SubjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const subjectSlug = params?.subject as string

  const [subject, setSubject] = useState<SubjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!subjectSlug) return
    fetch(`/api/v1/subjects/${subjectSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.subject) {
          setSubject(data.subject)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [subjectSlug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Subject Not Found</h2>
        <Link href="/subjects" className="text-blue-400 underline text-sm">
          Return to Subjects
        </Link>
      </div>
    )
  }

  const Icon = iconsMap[subject.name] || BookOpen

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.push('/subjects')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-4 px-3 py-1.5 rounded-full bg-white/10 border border-white/15"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Subjects</span>
        </button>

        {/* Hero header */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 bg-slate-950/85 border border-white/25 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-blue-300 shadow-md">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  CBSE Class 5–10
                </span>
                <span className="text-xs text-slate-400">5 Demo Chapters</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">{subject.name}</h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">{subject.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/practice"
              className="px-5 py-2.5 rounded-2xl liquid-glass bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              Practice {subject.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Chapters Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Curriculum Chapters</span>
          <span className="text-xs text-slate-400 font-normal">
            (Step-by-step Video & Interactive Lessons)
          </span>
        </h2>

        <div className="space-y-4">
          {subject.chapters.map((ch, idx) => {
            const firstLessonId = ch.lessons?.[0]?.id
            return (
              <div
                key={ch.id}
                className="liquid-glass-card rounded-2xl p-5 sm:p-6 bg-slate-950/85 border border-white/20 hover:border-white/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
                      {idx + 1}
                    </span>
                    <h3 className="font-extrabold text-white text-lg sm:text-xl">{ch.title}</h3>
                  </div>

                  <p className="text-slate-100 text-sm sm:text-base leading-relaxed pl-9 font-normal">
                    {ch.description}
                  </p>

                  {/* Resource & Lesson meta */}
                  <div className="flex flex-wrap items-center gap-3 pl-9 text-xs sm:text-sm text-slate-200 pt-1 font-medium">
                    {ch.video && (
                      <span className="flex items-center gap-1.5 text-blue-200 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                        <Video className="w-4 h-4 text-blue-300" />
                        <span>Video: {ch.video.duration}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-emerald-200 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                      <BookOpen className="w-4 h-4 text-emerald-300" />
                      <span>{ch.lessons?.length || 1} Guided Lesson</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-200 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                      <CheckCircle2 className="w-4 h-4 text-purple-300" />
                      <span>Practice Questions Available</span>
                    </span>
                  </div>
                </div>

                {/* Right button */}
                <div className="lg:shrink-0 pl-8 lg:pl-0 flex items-center gap-3">
                  {firstLessonId ? (
                    <Link
                      href={`/subjects/${subject.slug}/chapters/${ch.id}/lessons/${firstLessonId}`}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Start Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/practice"
                      className="px-4 py-2 rounded-xl liquid-glass bg-white/10 text-white text-xs font-medium"
                    >
                      Practice Topic
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <AITutorModal initialSubject={subject.name} initialChapter={subject.chapters[0]?.title} />
    </div>
  )
}
