'use client'

import React, { useState } from 'react'
import {
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Edit2,
  Check,
  Video,
  FlaskConical,
  Atom,
  Clock,
  Volume2,
} from 'lucide-react'

interface VideoProps {
  embedUrl: string
  title: string
  duration: string
  licenseOrAuthorization: string
  chapterTitle: string
  subjectName: string
}

export default function LessonVideoPlayer({
  embedUrl: initialEmbedUrl,
  title,
  duration,
  licenseOrAuthorization,
  chapterTitle,
  subjectName,
}: VideoProps) {
  const [currentUrl, setCurrentUrl] = useState(initialEmbedUrl)
  const [activeTab, setActiveTab] = useState<'video' | 'simulation'>('video')
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  const [editedUrl, setEditedUrl] = useState(initialEmbedUrl)

  // Simulation interactive state
  const [simStep, setSimStep] = useState(0)
  const [simRunning, setSimRunning] = useState(false)

  // Format YouTube embed URL cleanly with modern parameters
  const formatEmbedUrl = (raw: string) => {
    if (!raw) return ''
    let clean = raw.trim()
    if (clean.includes('watch?v=')) {
      clean = clean.replace('watch?v=', 'embed/')
    }
    if (clean.includes('youtu.be/')) {
      clean = clean.replace('youtu.be/', 'www.youtube.com/embed/')
    }
    if (clean.includes('youtube-nocookie.com/embed/')) {
      clean = clean.replace('youtube-nocookie.com/embed/', 'www.youtube.com/embed/')
    }
    // Remove duplicate parameters if any
    const base = clean.split('?')[0]
    return `${base}?enablejsapi=1&rel=0&modestbranding=1`
  }

  const handleSaveUrl = () => {
    if (editedUrl.trim()) {
      setCurrentUrl(editedUrl.trim())
    }
    setIsEditingUrl(false)
  }

  // Construct direct link to watch in YouTube / external browser
  const getWatchUrl = () => {
    if (currentUrl.includes('/embed/')) {
      const parts = currentUrl.split('/embed/')[1]?.split('?')[0]
      if (parts) return `https://www.youtube.com/watch?v=${parts}`
    }
    return currentUrl
  }

  return (
    <div className="liquid-glass rounded-3xl p-5 sm:p-7 bg-slate-950/85 border border-white/30 shadow-2xl space-y-4 backdrop-blur-3xl">
      {/* Top Controls: Mode Switcher & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight">
              {title}
            </h3>
            <span className="text-xs sm:text-sm text-slate-200 flex items-center gap-2 mt-0.5 font-medium">
              <span>{subjectName}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" /> {duration}
              </span>
            </span>
          </div>
        </div>

        {/* Tab Switcher: Video vs Interactive Simulation */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/20 shrink-0">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'video'
                ? 'liquid-bubble text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 text-blue-300" />
            <span>Video Lecture</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'simulation'
                ? 'liquid-bubble text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Interactive Lab</span>
          </button>
        </div>
      </div>

      {/* Main Screen: Video Embed or Interactive Simulation */}
      {activeTab === 'video' ? (
        <div className="space-y-3">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/90 border border-white/25 shadow-2xl">
            <iframe
              src={formatEmbedUrl(currentUrl)}
              title={title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          {/* Quick Controls Bar underneath */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-100 pt-1 font-medium">
            <div className="flex items-center gap-3">
              <a
                href={getWatchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <ExternalLink className="w-4 h-4 text-blue-300" />
                <span>Open in YouTube Tab</span>
              </a>

              <button
                onClick={() => setIsEditingUrl(!isEditingUrl)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 transition-colors font-medium"
                title="Replace video URL"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                <span>Edit Source</span>
              </button>
            </div>

            <span className="text-emerald-300 font-semibold bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
              {licenseOrAuthorization}
            </span>
          </div>

          {/* URL Editor input (if toggled) */}
          {isEditingUrl && (
            <div className="p-3 rounded-2xl bg-black/40 border border-white/20 flex items-center gap-2 animate-fadeIn">
              <input
                type="text"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                placeholder="Paste any YouTube or MP4 video URL..."
                className="flex-1 bg-white/10 text-white text-xs px-3.5 py-2 rounded-xl border border-white/15 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleSaveUrl}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Update Player</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Interactive Visual Simulation Lab */
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900/90 border border-white/20 p-6 flex flex-col justify-between shadow-2xl">
          {/* Top simulation badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Live Interactive Demonstration: {chapterTitle}
              </span>
            </div>
            <button
              onClick={() => {
                setSimStep((prev) => (prev + 1) % 4)
              }}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Next Stage ({simStep + 1}/4)</span>
            </button>
          </div>

          {/* Dynamic Visual Stage depending on subject */}
          <div className="my-auto flex flex-col items-center justify-center text-center space-y-4">
            {subjectName === 'Physics' && (
              <div className="space-y-4 w-full max-w-lg">
                <div className="relative w-full h-20 bg-black/40 rounded-2xl border border-white/15 p-2 overflow-hidden flex items-center">
                  {/* Road markings */}
                  <div className="absolute inset-x-0 h-[2px] border-b-2 border-dashed border-white/30" />
                  {/* Moving object with physics simulation */}
                  <div
                    className="relative z-10 transition-all duration-700 ease-out flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-lg"
                    style={{
                      transform: `translateX(${simStep * 28 + 10}%)`,
                    }}
                  >
                    <span>🚗 Speed: {(simStep + 1) * 20} m/s</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                    <span className="text-slate-300 block text-[11px]">Distance (s)</span>
                    <span className="text-sm font-bold text-white">{(simStep + 1) * 100} m</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                    <span className="text-slate-300 block text-[11px]">Time (t)</span>
                    <span className="text-sm font-bold text-white">{(simStep + 1) * 5} s</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                    <span className="text-emerald-200 block text-[11px]">Velocity (v)</span>
                    <span className="text-sm font-bold text-emerald-300">20 m/s</span>
                  </div>
                </div>
              </div>
            )}

            {subjectName === 'Chemistry' && (
              <div className="space-y-3">
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin [animation-duration:8s]" />
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-400/40 animate-spin [animation-duration:5s] [animation-direction:reverse]" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center font-bold text-xs text-white shadow-glow-math">
                    6p 6n
                  </div>
                  <div className="absolute top-0 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-glow-physics animate-ping" />
                  <div className="absolute bottom-0 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-glow-physics" />
                </div>
                <div className="text-xs text-slate-200 font-medium">
                  {simStep === 0 && 'Atom Stage 1: Central Nucleus with 6 Protons and 6 Neutrons'}
                  {simStep === 1 && 'Atom Stage 2: K-Shell inner orbit with 2 valence electrons'}
                  {simStep === 2 && 'Atom Stage 3: L-Shell outer orbit with 4 covalent electrons'}
                  {simStep === 3 && 'Atom Stage 4: Stable Carbon Element (Atomic Number 6, Mass 12)'}
                </div>
              </div>
            )}

            {subjectName === 'Mathematics' && (
              <div className="space-y-3 w-full max-w-md">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/20 text-center font-mono">
                  <span className="text-xs text-slate-400 block mb-1">Interactive BODMAS Step Resolution</span>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {simStep === 0 && '12 + 4 × (8 - 3) ÷ 2'}
                    {simStep === 1 && '12 + 4 × [ 5 ] ÷ 2  (Brackets resolved)'}
                    {simStep === 2 && '12 + [ 20 ÷ 2 ]  (Multiplication before division)'}
                    {simStep === 3 && '12 + 10 = 22  (Final Addition Result!)'}
                  </div>
                </div>
              </div>
            )}

            {subjectName === 'Biology' && (
              <div className="space-y-3 w-full max-w-md">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <span className="text-xs font-bold text-emerald-300 block mb-1">
                    Cellular Photosynthesis Formula in Action
                  </span>
                  <div className="text-sm font-bold text-white font-mono">
                    6 CO₂ + 6 H₂O + Sunlight ➔ C₆H₁₂O₆ + 6 O₂
                  </div>
                  <p className="text-xs text-slate-200 mt-2">
                    {simStep === 0 && 'Step 1: Stomata absorb Carbon Dioxide from atmospheric air.'}
                    {simStep === 1 && 'Step 2: Xylem vessels conduct water from subterranean roots to leaves.'}
                    {simStep === 2 && 'Step 3: Chlorophyll absorbs photons from solar radiation.'}
                    {simStep === 3 && 'Step 4: Glucose is synthesized and pure Oxygen gas is released!'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom simulation explanation */}
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center text-xs text-slate-200">
            Interactive visual simulation active. You can also switch back to the video lecture anytime above!
          </div>
        </div>
      )}
    </div>
  )
}
