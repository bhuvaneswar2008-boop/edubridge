import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        chapter: {
          include: {
            subject: true,
            video: true,
            lessons: {
              select: { id: true, title: true, order: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, lesson })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
