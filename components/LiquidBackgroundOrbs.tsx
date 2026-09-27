'use client'

import React, { useEffect, useState } from 'react'

export default function LiquidBackgroundOrbs() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100)
      const y = Math.round((e.clientY / window.innerHeight) * 100)
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-[1]"
      aria-hidden="true"
    >
      {/* Interactive mouse-following liquid light refraction glow */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full transition-transform duration-700 ease-out opacity-25 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, rgba(52, 211, 153, 0.4) 50%, transparent 70%)',
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Primary Floating Liquid Orb 1: Cyan / Blue (Top Left) */}
      <div className="absolute top-[10%] left-[15%] w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-blue-600/35 to-cyan-400/30 blur-[90px] animate-liquid-orb-1" />

      {/* Floating Liquid Orb 2: Emerald / Mint (Center Right) */}
      <div className="absolute top-[35%] right-[10%] w-[460px] h-[460px] rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-400/25 blur-[95px] animate-liquid-orb-2" />

      {/* Floating Liquid Orb 3: Violet / Purple (Bottom Left) */}
      <div className="absolute bottom-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/35 to-purple-500/30 blur-[100px] animate-liquid-orb-3" />

      {/* Floating Liquid Orb 4: Rose / Amber (Bottom Right) */}
      <div className="absolute bottom-[20%] right-[18%] w-[380px] h-[380px] rounded-full bg-gradient-to-tl from-pink-500/25 via-rose-500/20 to-amber-400/20 blur-[90px] animate-liquid-orb-4" />
    </div>
  )
}
