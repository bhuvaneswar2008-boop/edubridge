import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { setSessionCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))

    let name = (body.name || body.fullName || '').toString().trim()
    let rawEmail = (body.email || '').toString().trim().toLowerCase()
    let password = (body.password || '').toString()
    let gradeClass = (body.gradeClass || 'Class 10').toString().trim()

    // Fallbacks if blank
    if (!name) {
      name = rawEmail ? rawEmail.split('@')[0] : 'Student'
      name = name
        .split(/[._-]/)
        .filter(Boolean)
        .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ') || 'Student'
    }

    if (!rawEmail) {
      const slugName = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'
      rawEmail = `${slugName}@edubridge.org`
    } else if (!rawEmail.includes('@')) {
      rawEmail = `${rawEmail}@edubridge.org`
    }

    if (!password) {
      password = 'demo'
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: rawEmail },
      include: { profile: true },
    })

    if (user) {
      // User exists: update profile name & grade if provided, never reject password
      if (name && user.profile) {
        await prisma.studentProfile.update({
          where: { userId: user.id },
          data: {
            fullName: name,
            ...(gradeClass ? { gradeClass } : {}),
          },
        })
      }
    } else {
      // New user: create fresh record and 0% progress
      const passwordHash = await bcrypt.hash(password, 6)

      user = await prisma.user.create({
        data: {
          email: rawEmail,
          passwordHash,
          role: 'STUDENT',
          profile: {
            create: {
              fullName: name,
              gradeClass: gradeClass || 'Class 10',
              streakDays: 1,
            },
          },
        },
        include: { profile: true },
      })

      // Initialize fresh 0% progress records for all subjects
      const subjects = await prisma.subject.findMany({ select: { id: true } })
      for (const subj of subjects) {
        await prisma.progress.create({
          data: {
            userId: user.id,
            subjectId: subj.id,
            percentage: 0,
            completedLessons: '[]',
          },
        })
      }

      // Welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `Welcome to EduBridge, ${name.split(' ')[0]}! 🌟`,
          message: `Your learning account is ready. Explore Physics, Chemistry, Maths & Biology at your own pace.`,
          type: 'success',
        },
      })
    }

    // Set session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const finalUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: finalUser?.id,
        email: finalUser?.email,
        role: finalUser?.role,
        profile: finalUser?.profile,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
