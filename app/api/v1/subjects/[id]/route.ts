import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idOrSlug = params.id.toLowerCase()
    const subject = await prisma.subject.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: idOrSlug }],
      },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            video: true,
            lessons: {
              orderBy: { order: 'asc' },
            },
            questions: {
              select: { id: true, questionText: true, difficulty: true },
            },
          },
        },
      },
    })

    if (!subject) {
      return NextResponse.json({ success: false, error: 'Subject not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, subject })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
