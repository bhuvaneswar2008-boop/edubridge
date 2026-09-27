'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  X,
  Lightbulb,
  HelpCircle,
  BookOpen,
  RotateCcw,
  MessageSquare,
  Bot,
  User,
} from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'assistant'
  text: string
  action?: string
  checkingQuestion?: string
}

interface AITutorProps {
  initialSubject?: string
  initialChapter?: string
  lessonTitle?: string
  isOpen?: boolean
  onClose?: () => void
}

export default function AITutorModal({
  initialSubject = 'General Science & Math',
  initialChapter = 'Fundamentals',
  lessonTitle,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}: AITutorProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalOpen

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your EduBridge AI Tutor 🌟. I am here to help you understand ${initialSubject} (${initialChapter}) step-by-step. Feel free to ask any question or tap one of the quick actions below!`,
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (customMessage?: string, actionType: 'ask' | 'simpler' | 'example' | 'quiz' | 'summarize' = 'ask') => {
    const textToSend = customMessage || inputMessage.trim()
    if (!textToSend || loading) return

    const userMsgId = Date.now().toString()
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSend, action: actionType },
    ])
    setInputMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          action: actionType,
          subject: initialSubject,
          chapter: initialChapter,
          lessonTitle,
          conversationId,
        }),
      })

      const data = await res.json()
      if (data.success) {
        if (data.conversationId) setConversationId(data.conversationId)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: data.reply,
            action: data.action,
            checkingQuestion: data.checkingQuestion,
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: `⚠️ ${data.error || 'Could not complete request. Please try again.'}`,
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: '⚠️ Connection error. Please check your internet connection.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (actionType: 'simpler' | 'example' | 'quiz' | 'summarize') => {
    const actionPrompts = {
      simpler: `Can you explain ${lessonTitle || initialChapter} in simpler everyday terms?`,
      example: `Can you give me another worked example for this topic?`,
      quiz: `Quiz me with a quick question to test my understanding!`,
      summarize: `Can you summarize the most important points of this lesson?`,
    }
    handleSend(actionPrompts[actionType], actionType)
  }

  const close = () => {
    if (isControlled && controlledOnClose) {
      controlledOnClose()
    } else {
      setInternalOpen(false)
    }
  }

  useEffect(() => {
    const handleOpen = () => setInternalOpen(true)
    window.addEventListener('open-ai-tutor', handleOpen)
    return () => window.removeEventListener('open-ai-tutor', handleOpen)
  }, [])

  return (
    <>
      {/* Floating Trigger Button (when modal is closed) */}
      {!isOpen && (
        <>
          {/* Desktop Floating Pill */}
          <button
            onClick={() => setInternalOpen(true)}
            className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4.5 py-3 rounded-full liquid-glass specular-shine bg-gradient-to-r from-blue-600/35 via-indigo-600/35 to-purple-600/35 border border-white/35 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group backdrop-blur-2xl"
            aria-label="Open AI Tutor"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 shadow-md animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-wide">Ask AI Tutor</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-glow-chemistry"></span>
            </span>
          </button>

          {/* Mobile Floating Button (Compact circular button placed safely at bottom-24 right-4) */}
          <button
            onClick={() => setInternalOpen(true)}
            className="md:hidden fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full liquid-glass-dock shadow-2xl flex items-center justify-center border border-blue-400/40 active:scale-90 transition-transform duration-150"
            aria-label="Open AI Tutor"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center shadow-md animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </button>
        </>
      )}

      {/* Floating Liquid-Glass Chat Drawer/Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md transition-all animate-fadeIn">
          <div className="relative w-full max-w-xl h-[85vh] sm:h-[630px] rounded-t-3xl sm:rounded-3xl liquid-glass specular-shine bg-slate-950/85 border border-white/30 shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-[1px] shadow-glow-physics">
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    EduBridge AI Tutor
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      CBSE 5–10
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 truncate max-w-[260px]">
                    {initialSubject} • {initialChapter}
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close tutor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Pedagogical Action Pills */}
            <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto border-b border-white/10 bg-black/20 text-xs no-scrollbar">
              <button
                onClick={() => handleActionClick('simpler')}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-blue-200 border border-white/10 whitespace-nowrap transition-all active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                Explain simpler
              </button>
              <button
                onClick={() => handleActionClick('example')}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/10 whitespace-nowrap transition-all active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                Give another example
              </button>
              <button
                onClick={() => handleActionClick('quiz')}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 border border-white/10 whitespace-nowrap transition-all active:scale-95"
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
                Quiz me
              </button>
              <button
                onClick={() => handleActionClick('summarize')}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 border border-white/10 whitespace-nowrap transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                Summarize lesson
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600/80 text-white rounded-br-sm border border-blue-400/30 shadow-md'
                        : 'liquid-glass bg-white/10 text-slate-100 rounded-bl-sm border border-white/15 shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    {msg.checkingQuestion && (
                      <div className="mt-3 pt-2.5 border-t border-white/15 text-xs text-amber-200 font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{msg.checkingQuestion}</span>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/20">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md animate-pulse">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="liquid-glass px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-slate-300 flex items-center gap-2">
                    <span className="flex space-x-1">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Tutor is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 border-t border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask anything about ${initialChapter}...`}
                disabled={loading}
                className="flex-1 bg-white/10 text-white placeholder-slate-400 text-sm px-4 py-2.5 rounded-full border border-white/20 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
