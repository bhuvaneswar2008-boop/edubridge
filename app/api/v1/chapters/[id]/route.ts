import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: params.id },
      include: {
        subject: true,
        video: true,
        lessons: {
          orderBy: { order: 'asc' },
        },
        questions: true,
      },
    })

    if (!chapter) {
      return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, chapter })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
