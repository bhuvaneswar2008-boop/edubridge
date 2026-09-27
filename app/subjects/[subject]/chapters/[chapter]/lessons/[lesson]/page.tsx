'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Award,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'
import LessonVideoPlayer from '@/components/LessonVideoPlayer'

interface QuizItem {
  question: string
  options: string[]
  answer: number
  explanation: string
}

interface LessonData {
  id: string
  title: string
  objective: string
  simpleContent: string
  workedExample: string
  keyPoints: string
  quickQuiz: string
  chapter: {
    id: string
    title: string
    subject: {
      id: string
      name: string
      slug: string
      accentColor: string
    }
    video?: {
      title: string
      embedUrl: string
      duration: string
      licenseOrAuthorization: string
    }
    lessons: { id: string; title: string; order: number }[]
  }
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params?.lesson as string
  const subjectSlug = params?.subject as string

  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [completing, setCompleting] = useState(false)

  // Quiz state
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // AI Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false)

  useEffect(() => {
    if (!lessonId) return
    fetch(`/api/v1/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.lesson) {
          setLesson(data.lesson)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [lessonId])

  const handleMarkComplete = async () => {
    if (!lesson || completing) return
    setCompleting(true)
    try {
      const res = await fetch(`/api/v1/lessons/${lesson.id}/complete`, {
        method: 'POST',
      })
      const data = await res.json()
      if (data.success) {
        setIsCompleted(true)
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    } catch {
      // error handling
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Lesson Not Found</h2>
        <Link href="/subjects" className="text-blue-400 underline text-base">
          Return to Subjects
        </Link>
      </div>
    )
  }

  let parsedKeyPoints: string[] = []
  try {
    parsedKeyPoints = JSON.parse(lesson.keyPoints)
  } catch {
    parsedKeyPoints = [lesson.keyPoints]
  }

  let parsedQuiz: QuizItem[] = []
  try {
    parsedQuiz = JSON.parse(lesson.quickQuiz)
  } catch {
    parsedQuiz = []
  }

  const activeQuiz = parsedQuiz[0]

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-16">
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/subjects/${subjectSlug}`)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-100 hover:text-white transition-colors px-4 py-2 rounded-full liquid-glass bg-white/10 hover:bg-white/20 border border-white/25 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {lesson.chapter.subject.name} Chapters</span>
        </button>

        <button
          onClick={() => setAiModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full liquid-glass bg-gradient-to-r from-blue-600/40 to-purple-600/40 border border-blue-400/40 text-blue-200 text-sm font-semibold hover:scale-105 transition-all shadow-md"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask AI Tutor</span>
        </button>
      </div>

      {/* Header & Learning Objective */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 bg-slate-900/60 border border-white/30 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-medium">
          <span className="font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/25 text-blue-200 border border-blue-500/40 shadow-sm">
            {lesson.chapter.subject.name}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-100 font-semibold">{lesson.chapter.title}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
          {lesson.title}
        </h1>

        {/* Learning Objective Box */}
        <div className="p-5 rounded-2xl bg-white/10 border border-white/20 flex items-start gap-3.5 shadow-inner">
          <Lightbulb className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
              Learning Objective
            </span>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              {lesson.objective}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Video Player & Lab Simulator */}
      {lesson.chapter.video && (
        <LessonVideoPlayer
          embedUrl={lesson.chapter.video.embedUrl}
          title={lesson.chapter.video.title}
          duration={lesson.chapter.video.duration}
          licenseOrAuthorization={lesson.chapter.video.licenseOrAuthorization}
          chapterTitle={lesson.chapter.title}
          subjectName={lesson.chapter.subject.name}
        />
      )}

      {/* 3. Simple Conceptual Explanation */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 bg-slate-900/55 border border-white/25 shadow-xl space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <span>Conceptual Breakdown</span>
        </h2>
        <div className="text-slate-100 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-3 font-normal">
          {lesson.simpleContent}
        </div>
      </div>

      {/* 4. Worked Example */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 bg-indigo-950/45 border border-indigo-400/35 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <Award className="w-6 h-6 text-indigo-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Worked Example & Solution</h2>
        </div>
        <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/20 text-base sm:text-lg text-slate-50 whitespace-pre-line leading-relaxed font-sans shadow-inner">
          {lesson.workedExample}
        </div>
      </div>

      {/* 5. Key Points */}
      {parsedKeyPoints.length > 0 && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 bg-slate-900/55 border border-white/25 shadow-xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-blue-400" />
            <span>Key Takeaways</span>
          </h2>
          <ul className="space-y-3">
            {parsedKeyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3.5 text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-blue-500/25 text-blue-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-500/40 shadow-sm">
                  {i + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Quick In-Lesson Quiz */}
      {activeQuiz && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 bg-purple-950/35 border border-purple-400/35 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-purple-300" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">In-Lesson Quick Check</h2>
            </div>
            <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-purple-500/25 text-purple-200 border border-purple-500/40">
              1 Question Check
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {activeQuiz.question}
          </p>

          <div className="space-y-3">
            {activeQuiz.options.map((opt, idx) => {
              const isSelected = selectedQuizAnswer === idx
              const isCorrectAnswer = activeQuiz.answer === idx

              let optionStyle = 'bg-white/10 hover:bg-white/15 text-slate-100 border-white/20'
              if (quizSubmitted) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-500/30 text-white border-emerald-400 shadow-glow-chemistry font-bold'
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-rose-500/30 text-rose-100 border-rose-400 font-medium'
                }
              } else if (isSelected) {
                optionStyle = 'bg-blue-600/50 text-white border-blue-400 shadow-md font-semibold'
              }

              return (
                <button
                  key={idx}
                  onClick={() => !quizSubmitted && setSelectedQuizAnswer(idx)}
                  className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-medium transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {quizSubmitted && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={() => {
                if (selectedQuizAnswer !== null) setQuizSubmitted(true)
              }}
              disabled={selectedQuizAnswer === null}
              className="py-3 px-7 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Verify Answer
            </button>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 text-sm sm:text-base text-slate-100 space-y-1.5 shadow-inner">
              <span className="font-bold text-emerald-300 block">Explanation:</span>
              <p className="leading-relaxed font-normal">{activeQuiz.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* 7. Action Bar: Mark Complete & Practice */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-7 bg-slate-900/60 border border-white/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg">Finished this lesson?</h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
            Marking complete automatically updates your progress and builds your CBSE streak.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/practice"
            className="flex-1 sm:flex-initial text-center px-5 py-3 rounded-2xl liquid-glass bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/25 transition-all shadow-sm"
          >
            Practice Chapter
          </Link>

          <button
            onClick={handleMarkComplete}
            disabled={completing || isCompleted}
            className={`flex-1 sm:flex-initial px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-glow-chemistry cursor-default'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white hover:scale-105 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isCompleted ? 'Completed 🎉' : completing ? 'Saving...' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      <AITutorModal
        initialSubject={lesson.chapter.subject.name}
        initialChapter={lesson.chapter.title}
        lessonTitle={lesson.title}
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  )
}
