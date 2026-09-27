import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { order: 'asc' },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            video: true,
            lessons: {
              select: { id: true, title: true, order: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, subjects })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
