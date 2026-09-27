import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        physics: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
          glow: 'rgba(59, 130, 246, 0.4)',
        },
        chemistry: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#047857',
          glow: 'rgba(16, 185, 129, 0.4)',
        },
        mathematics: {
          light: '#fb923c',
          DEFAULT: '#f97316',
          dark: '#c2410c',
          glow: 'rgba(249, 115, 22, 0.4)',
        },
        biology: {
          light: '#f472b6',
          DEFAULT: '#ec4899',
          dark: '#be185d',
          glow: 'rgba(236, 72, 153, 0.4)',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.65)',
          DEFAULT: 'rgba(255, 255, 255, 0.45)',
          dark: 'rgba(15, 23, 42, 0.55)',
          border: 'rgba(255, 255, 255, 0.25)',
          highlight: 'rgba(255, 255, 255, 0.35)',
        }
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
        'glow-physics': '0 0 25px rgba(59, 130, 246, 0.45)',
        'glow-chemistry': '0 0 25px rgba(16, 185, 129, 0.45)',
        'glow-math': '0 0 25px rgba(249, 115, 22, 0.45)',
        'glow-biology': '0 0 25px rgba(236, 72, 153, 0.45)',
      },
      animation: {
        'liquid-glow': 'liquidGlow 8s ease-in-out infinite alternate',
        'shimmer': 'shimmer 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        liquidGlow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.2))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.45))' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
