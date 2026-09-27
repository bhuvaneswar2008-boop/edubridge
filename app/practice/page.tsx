'use client'

import React, { useEffect, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Atom,
  FlaskConical,
  Calculator,
  Dna,
  Filter,
  Award,
  Menu,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'

interface PracticeQuestion {
  id: string
  questionText: string
  options: string[]
  explanation: string
  difficulty: string
  chapter: {
    id: string
    title: string
    subject: {
      id: string
      name: string
      slug: string
      accentColor: string
    }
  }
}

export default function PracticePage() {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Current question interaction
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    submitted: boolean
    isCorrect: boolean
    correctOption: number
    explanation: string
  } | null>(null)

  // Session stats
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)

  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false)

  const fetchQuestions = (subjSlug: string = 'all') => {
    setLoading(true)
    fetch('/api/v1/practice')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.questions) {
          let list: PracticeQuestion[] = data.questions
          if (subjSlug !== 'all') {
            list = list.filter((q) => q.chapter.subject.slug === subjSlug)
          }
          setQuestions(list)
          setCurrentIndex(0)
          setSelectedOption(null)
          setFeedback(null)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchQuestions(selectedSubject)
  }, [selectedSubject])

  const currentQ = questions[currentIndex]

  const handleSubmitAttempt = async () => {
    if (selectedOption === null || !currentQ || submitting) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/v1/practice/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          selectedOption,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setFeedback({
          submitted: true,
          isCorrect: data.isCorrect,
          correctOption: data.correctOption,
          explanation: data.explanation,
        })
        setSessionTotal((prev) => prev + 1)
        if (data.isCorrect) {
          setSessionCorrect((prev) => prev + 1)
        }
      }
    } catch {
      // attempt error handling
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setFeedback(null)
    }
  }

  const handleRetry = () => {
    setSelectedOption(null)
    setFeedback(null)
  }

  const subjectsFilter = [
    { label: 'All Subjects', slug: 'all' },
    { label: 'Physics', slug: 'physics' },
    { label: 'Chemistry', slug: 'chemistry' },
    { label: 'Mathematics', slug: 'mathematics' },
    { label: 'Biology', slug: 'biology' },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto pb-28 sm:pb-8">
      {/* Header (Clean Minimal UI) */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Practice Arena
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">Instant solutions & verified CBSE steps</p>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl liquid-glass bg-slate-900/80 border border-white/20 shrink-0 shadow-md">
          <Award className="w-4 h-4 text-amber-300" />
          <div className="text-xs font-bold text-white">
            {sessionTotal > 0
              ? `${sessionCorrect}/${sessionTotal} (${Math.round((sessionCorrect / sessionTotal) * 100)}%)`
              : '0 / 0'}
          </div>
        </div>
      </div>

      {/* 3-Line Subject Selector Bar */}
      <div className="liquid-glass rounded-2xl p-2 bg-slate-950/80 border border-white/20 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-lg">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold shrink-0 border border-white/15">
          <Menu className="w-4 h-4 text-blue-300" />
          <span>Subjects:</span>
        </div>
        {subjectsFilter.map((f) => (
          <button
            key={f.slug}
            onClick={() => setSelectedSubject(f.slug)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 shrink-0 ${
              selectedSubject === f.slug
                ? 'liquid-bubble text-white shadow-md font-extrabold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Question Card */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
        </div>
      ) : !currentQ ? (
        <div className="liquid-glass rounded-3xl p-10 text-center space-y-3 bg-slate-900/50">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-white">No questions found</h3>
          <p className="text-sm text-slate-200">Try selecting another subject filter.</p>
        </div>
      ) : (
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 bg-slate-950/90 border border-white/30 shadow-2xl space-y-6">
          {/* Question Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/25 text-blue-200 border border-blue-500/40 shadow-sm">
                {currentQ.chapter.subject.name}
              </span>
              <span className="text-sm text-slate-100 font-semibold">{currentQ.chapter.title}</span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-medium">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-amber-300 font-bold">
                {currentQ.difficulty}
              </span>
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
            {currentQ.questionText}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx
              const isSubmitted = feedback?.submitted

              let optClass = 'bg-slate-900/80 hover:bg-slate-800/90 text-white border-white/20'
              if (isSubmitted) {
                if (idx === feedback.correctOption) {
                  optClass = 'bg-emerald-950/70 text-emerald-200 border-emerald-400 shadow-glow-chemistry font-bold'
                } else if (isSelected && !feedback.isCorrect) {
                  optClass = 'bg-rose-950/70 text-rose-200 border-rose-400 font-medium'
                }
              } else if (isSelected) {
                optClass = 'bg-blue-600/60 text-white border-blue-400 shadow-glow-physics font-bold'
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isSubmitted && setSelectedOption(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-sm sm:text-base font-medium transition-all flex items-center justify-between ${optClass}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center font-bold text-sm shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-semibold">{opt}</span>
                  </div>

                  {isSubmitted && idx === feedback.correctOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !feedback.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Explanation Box */}
          {feedback?.submitted && (
            <div
              className={`p-5 rounded-2xl border transition-all animate-fadeIn ${
                feedback.isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm flex items-center gap-2">
                  {feedback.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Correct Answer! Excellent job.
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      Not quite right. Let&apos;s learn why:
                    </>
                  )}
                </span>
                <button
                  onClick={() => setAiModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-blue-300 hover:text-white underline font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI Tutor to clarify
                </button>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                {feedback.explanation}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={handleRetry}
              disabled={!feedback?.submitted}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Question</span>
            </button>

            <div className="flex items-center gap-3">
              {!feedback?.submitted ? (
                <button
                  onClick={handleSubmitAttempt}
                  disabled={selectedOption === null || submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs shadow-md transition-all active:scale-95"
                >
                  {submitting ? 'Verifying...' : 'Check Answer'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= questions.length - 1}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <AITutorModal
        initialSubject={currentQ?.chapter?.subject?.name || 'General Science'}
        initialChapter={currentQ?.chapter?.title || 'Practice Question'}
        lessonTitle={currentQ?.questionText}
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  )
}
