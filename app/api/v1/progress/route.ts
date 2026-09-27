import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const subjects = await prisma.subject.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { chapters: true },
        },
      },
    })

    const progressRecords = await prisma.progress.findMany({
      where: { userId: user.id },
    })

    const progressMap = new Map<string, any>()
    for (const p of progressRecords) {
      progressMap.set(p.subjectId, p)
    }

    const subjectProgress = subjects.map((subj) => {
      const record = progressMap.get(subj.id)
      let completedLessonsList: string[] = []
      if (record?.completedLessons) {
        try {
          completedLessonsList = JSON.parse(record.completedLessons)
        } catch {
          completedLessonsList = []
        }
      }

      return {
        subjectId: subj.id,
        subjectName: subj.name,
        slug: subj.slug,
        accentColor: subj.accentColor,
        percentage: record ? record.percentage : 0,
        completedCount: completedLessonsList.length,
        totalChapters: subj._count.chapters,
        lastActivityAt: record ? record.lastActivityAt : null,
      }
    })

    // Compute overall progress
    const totalPercentage = subjectProgress.reduce((sum, item) => sum + item.percentage, 0)
    const overallProgress = Math.round(totalPercentage / (subjectProgress.length || 1))

    return NextResponse.json({
      success: true,
      overallProgress,
      streakDays: user.profile?.streakDays || 1,
      subjects: subjectProgress,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
