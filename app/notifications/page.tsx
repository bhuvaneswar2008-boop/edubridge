'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  CheckCircle2,
  FileQuestion,
  Info,
  AlertTriangle,
  ArrowRight,
  CheckCheck,
} from 'lucide-react'
import AITutorModal from '@/components/AITutorModal'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  link?: string
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = () => {
    fetch('/api/v1/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.notifications) {
          setNotifications(data.notifications)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAllRead = async () => {
    await fetch('/api/v1/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    fetchNotifications()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'test':
        return <FileQuestion className="w-5 h-5 text-blue-400" />
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />
      default:
        return <Info className="w-5 h-5 text-indigo-400" />
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Stay updated with your diagnostic test announcements, score milestones, and lesson releases.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all"
        >
          <CheckCheck className="w-4 h-4 text-emerald-300" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-10 text-center space-y-3 bg-slate-900/30">
          <Bell className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No notifications yet</h3>
          <p className="text-xs text-slate-300">
            You&apos;re completely up to date with all your subjects!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`liquid-glass rounded-2xl p-4 sm:p-5 border transition-all flex items-start justify-between gap-4 ${
                item.isRead
                  ? 'bg-slate-900/40 border-white/15 opacity-90'
                  : 'bg-slate-900/70 border-white/30 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 shrink-0 mt-0.5">
                  {getTypeIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base sm:text-lg">
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-sm" />
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
                    {item.message}
                  </p>
                  <span className="text-xs text-slate-300 font-medium block pt-1">
                    {new Date(item.createdAt).toLocaleDateString()} at{' '}
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {item.link && (
                <Link
                  href={item.link}
                  className="p-2 rounded-xl liquid-glass bg-white/10 hover:bg-white/20 text-white shrink-0"
                  aria-label="View link"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      <AITutorModal />
    </div>
  )
}
