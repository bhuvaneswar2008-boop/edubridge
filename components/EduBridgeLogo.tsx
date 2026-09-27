'use client'

import React from 'react'

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export default function EduBridgeLogo({ className = '', size = 36, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Geometric Modern EduBridge Hex/Bridge Symbol */}
      <div
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300"
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full bg-slate-950/90 rounded-2xl flex items-center justify-center backdrop-blur-md overflow-hidden relative">
          {/* Subtle Ambient Radial Flare */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-400/20 pointer-events-none" />

          {/* SVG Symbol: Stylized Bridge Arch + Ascending Knowledge Steps */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-1/2 h-1/2 text-white relative z-10"
          >
            {/* Bridge Arch */}
            <path
              d="M3 19C7 10 17 10 21 19"
              className="stroke-emerald-400"
            />
            {/* Horizontal Pathway Beam */}
            <line x1="3" y1="19" x2="21" y2="19" className="stroke-slate-400/70" />
            {/* Keystone Spark (Rising Knowledge Star) */}
            <circle cx="12" cy="7" r="2" className="fill-amber-400 stroke-amber-300" />
            {/* Suspension Rays */}
            <line x1="8" y1="19" x2="10" y2="12.5" className="stroke-blue-400/80" />
            <line x1="16" y1="19" x2="14" y2="12.5" className="stroke-blue-400/80" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tight text-white flex items-center gap-0.5">
            Edu<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-300">Bridge</span>
          </span>
          <span className="text-[9px] text-slate-300 font-semibold tracking-wider uppercase mt-0.5">
            Learn • Practice • Grow
          </span>
        </div>
      )}
    </div>
  )
}
