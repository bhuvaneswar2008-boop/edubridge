'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Award,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'

interface QuestionItem {
  id: string
  order: number
  questionText: string
  options: string[]
  difficulty: string
}

interface TestDetail {
  id: string
  title: string
  description: string
  durationMin: number
  totalMarks: number
  passMarks: number
  subject: { name: string; slug: string; accentColor: string }
  classLevel: string
  questions: QuestionItem[]
}

interface DetailedReviewItem {
  questionId: string
  questionText: string
  options: string[]
  userSelection: number | null
  correctOption: number
  isCorrect: boolean
  explanation: string
}

interface TestResult {
  attemptId: string
  score: number
  totalMarks: number
  passMarks: number
  correctCount: number
  totalQuestions: number
  passed: boolean
  detailedReview: DetailedReviewItem[]
}

export default function TestTakePage() {
  const params = useParams()
  const router = useRouter()
  const testId = params?.id as string

  const [test, setTest] = useState<TestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [attemptId, setAttemptId] = useState<string | null>(null)

  // Test state
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  // Result state
  const [result, setResult] = useState<TestResult | null>(null)

  useEffect(() => {
    if (!testId) return
    fetch(`/api/v1/tests/${testId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.test) {
          setTest(data.test)
          setSecondsRemaining(data.test.durationMin * 60)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [testId])

  // Timer countdown
  useEffect(() => {
    if (!started || result || secondsRemaining <= 0) return
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [started, result, secondsRemaining])

  const handleStartTest = async () => {
    try {
      const res = await fetch(`/api/v1/tests/${testId}/start`, { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setAttemptId(data.attemptId)
      }
    } catch {
      // fallback
    }
    setStarted(true)
  }

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleClearOption = (questionId: string) => {
    setAnswers((prev) => {
      const copy = { ...prev }
      delete copy[questionId]
      return copy
    })
  }

  const handleAutoSubmit = () => {
    submitTest()
  }

  const submitTest = async () => {
    if (!test || submitting) return
    setSubmitting(true)
    setShowConfirmSubmit(false)

    const payloadAnswers = test.questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] !== undefined ? answers[q.id] : null,
    }))

    try {
      const res = await fetch(`/api/v1/tests/${test.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attemptId || undefined,
          answers: payloadAnswers,
        }),
      })

      const data = await res.json()
      if (data.success && data.result) {
        setResult(data.result)
        if (data.result.passed) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          })
        }
      }
    } catch {
      // submit error
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!test) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Test Not Found</h2>
        <Link href="/test" className="text-blue-400 underline text-sm">
          Return to Test Center
        </Link>
      </div>
    )
  }

  // Format Timer mm:ss
  const mins = Math.floor(secondsRemaining / 60)
  const secs = secondsRemaining % 60
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

  // 1. Initial Start Screen
  if (!started && !result) {
    return (
      <div className="max-w-2xl mx-auto py-8 animate-fadeIn">
        <button
          onClick={() => router.push('/test')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-4 px-3 py-1.5 rounded-full bg-white/10 border border-white/15"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Test Center</span>
        </button>

        <div className="liquid-glass-card rounded-3xl p-8 bg-slate-950/90 border border-white/25 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {test.subject.name}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">{test.classLevel}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{test.title}</h1>
          <p className="text-slate-300 text-sm leading-relaxed">{test.description}</p>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div>
              <div className="text-xs text-slate-400">Duration</div>
              <div className="text-base font-bold text-white mt-0.5">{test.durationMin} mins</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Questions</div>
              <div className="text-base font-bold text-white mt-0.5">{test.questions.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Passing Mark</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">
                {test.passMarks} / {test.totalMarks}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
            ⚠️ <strong>Exam Instructions:</strong> Once you begin, the timer starts automatically. You can navigate between questions freely using the question grid. Your responses will be submitted and graded by the server upon completion.
          </div>

          <button
            onClick={handleStartTest}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-base shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Begin Examination Now
          </button>
        </div>
      </div>
    )
  }

  // 2. Results Screen
  if (result) {
    const percentage = Math.round((result.score / result.totalMarks) * 100)
    return (
      <div className="max-w-4xl mx-auto py-6 space-y-8 animate-fadeIn">
        {/* Result Hero Header */}
        <div
          className={`liquid-glass rounded-3xl p-8 border shadow-2xl text-center space-y-4 ${
            result.passed
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : 'bg-rose-950/40 border-rose-500/40'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/10 border border-white/20 shadow-md">
            {result.passed ? (
              <Award className="w-8 h-8 text-emerald-300" />
            ) : (
              <RotateCcw className="w-8 h-8 text-rose-300" />
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-white">
            {result.passed ? 'Test Passed! Outstanding Work 🎉' : 'Test Complete — Keep Practicing! 💪'}
          </h1>

          <div className="flex items-center justify-center gap-6 py-2">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">Final Score</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {result.score} <span className="text-base sm:text-lg font-medium text-slate-300">/ {result.totalMarks}</span>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-white/20" />
            <div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">Percentage</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">{percentage}%</div>
            </div>
            <div className="w-[1px] h-10 bg-white/20" />
            <div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">Correct Answers</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {result.correctCount} / {result.totalQuestions}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-3">
            <Link
              href="/test"
              className="px-6 py-3 rounded-xl liquid-glass bg-white/15 hover:bg-white/25 text-white font-medium text-xs border border-white/20 transition-all"
            >
              Return to Test Center
            </Link>
            <button
              onClick={() => {
                setResult(null)
                setStarted(false)
                setAnswers({})
                setSecondsRemaining(test.durationMin * 60)
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md transition-all"
            >
              Retake This Test
            </button>
          </div>
        </div>

        {/* Detailed Question-by-Question Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Detailed Answer Review & Explanations</span>
          </h2>

          <div className="space-y-4">
            {result.detailedReview.map((rev, idx) => (
              <div
                key={rev.questionId}
                className="liquid-glass rounded-2xl p-5 sm:p-6 bg-slate-900/40 border border-white/15 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
                    Question {idx + 1}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      rev.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {rev.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{rev.isCorrect ? 'Correct (+1 mark)' : 'Incorrect (0 marks)'}</span>
                  </span>
                </div>

                <h3 className="font-semibold text-white text-sm sm:text-base">
                  {rev.questionText}
                </h3>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {rev.options.map((opt, optIdx) => {
                    const isUserChoice = rev.userSelection === optIdx
                    const isRightAnswer = rev.correctOption === optIdx

                    let style = 'bg-white/5 border-white/10 text-slate-300'
                    if (isRightAnswer) {
                      style = 'bg-emerald-500/25 border-emerald-500/50 text-emerald-200 font-semibold shadow-sm'
                    } else if (isUserChoice && !isRightAnswer) {
                      style = 'bg-rose-500/25 border-rose-500/50 text-rose-200 line-through'
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between ${style}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                        {isRightAnswer && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-0.5">Explanation:</span>
                  <p>{rev.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 3. Active Test Taking Interface
  const currentQuestion = test.questions[currentIndex]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6 animate-fadeIn">
      {/* Top Test Banner: Title, Timer, and Progress */}
      <div className="liquid-glass rounded-2xl p-4 bg-slate-900/60 border border-white/20 shadow-lg flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
            {test.subject.name} • {test.classLevel}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[280px] sm:max-w-md">
            {test.title}
          </h2>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base ${
            secondsRemaining < 300
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-white/10 text-white border-white/20'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>{formattedTime}</span>
        </div>

        {/* Submit Early Button */}
        <button
          onClick={() => setShowConfirmSubmit(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md transition-all"
        >
          Submit Test
        </button>
      </div>

      {/* Question Navigation Grid (1 to N) */}
      <div className="liquid-glass rounded-2xl p-3 bg-slate-900/30 border border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] text-slate-400 font-medium shrink-0 px-2">Questions:</span>
        {test.questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined
          const isCurrent = currentIndex === idx
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                isCurrent
                  ? 'bg-white text-slate-900 ring-2 ring-blue-400 scale-105'
                  : isAnswered
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>

      {/* Main Question Display */}
      {currentQuestion && (
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 bg-slate-950/90 border border-white/25 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <span className="font-bold text-xs sm:text-sm px-3 py-1 rounded-full bg-blue-500/25 text-blue-200 border border-blue-500/40">
              Question {currentIndex + 1} of {test.questions.length}
            </span>
            <div className="text-xs sm:text-sm font-medium text-slate-200">
              {answeredCount} of {test.questions.length} answered
            </div>
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
            {currentQuestion.questionText}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = answers[currentQuestion.id] === optIdx
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border text-sm sm:text-base font-semibold transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-blue-600/60 text-white border-blue-400 shadow-glow-physics scale-[1.01]'
                      : 'bg-white/10 hover:bg-white/15 text-slate-100 border-white/20'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isSelected ? 'bg-white text-blue-900 shadow-md' : 'bg-white/15 text-slate-200'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-snug">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Navigation and Clear row */}
          <div className="flex items-center justify-between pt-4 border-t border-white/15">
            <button
              onClick={() => handleClearOption(currentQuestion.id)}
              disabled={answers[currentQuestion.id] === undefined}
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-rose-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Clear selection
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl liquid-glass bg-white/10 hover:bg-white/20 text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed border border-white/15 transition-all"
              >
                Previous
              </button>

              {currentIndex < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Review & Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md liquid-glass rounded-3xl p-6 bg-slate-950/90 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-300">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Submit Examination?</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> out of{' '}
              <strong>{test.questions.length}</strong> questions.
              {answeredCount < test.questions.length && (
                <span className="text-amber-200 block mt-1">
                  You have {test.questions.length - answeredCount} unanswered questions!
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl liquid-glass bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15"
              >
                Continue Test
              </button>
              <button
                onClick={submitTest}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AITutorModal initialSubject={test.subject.name} initialChapter={test.title} />
    </div>
  )
}
