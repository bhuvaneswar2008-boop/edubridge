import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 })
    }

    const subjectId = lesson.chapter.subjectId
    const subjectName = lesson.chapter.subject.name

    // Fetch existing progress
    let progress = await prisma.progress.findUnique({
      where: {
        userId_subjectId: {
          userId: user.id,
          subjectId,
        },
      },
    })

    let completedList: string[] = []
    if (progress?.completedLessons) {
      try {
        completedList = JSON.parse(progress.completedLessons)
      } catch {
        completedList = []
      }
    }

    if (!completedList.includes(lesson.id)) {
      completedList.push(lesson.id)
    }

    // Recalculate percentage (incrementally based on completed lessons)
    const newPercentage = Math.min(100, (progress ? progress.percentage : 0) + 20)

    if (progress) {
      progress = await prisma.progress.update({
        where: { id: progress.id },
        data: {
          percentage: newPercentage,
          completedLessons: JSON.stringify(completedList),
          lastActivityAt: new Date(),
        },
      })
    } else {
      progress = await prisma.progress.create({
        data: {
          userId: user.id,
          subjectId,
          percentage: 20,
          completedLessons: JSON.stringify(completedList),
        },
      })
    }

    // Add notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Lesson Completed! 🎉',
        message: `You completed "${lesson.title}" in ${subjectName}. Keep up the great work!`,
        type: 'success',
        link: `/subjects/${lesson.chapter.subject.slug}`,
        isRead: false,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Lesson marked as completed',
      progress,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
