import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const attempts = await prisma.testAttempt.findMany({
      where: { userId: user.id },
      include: {
        test: {
          include: {
            subject: {
              select: { id: true, name: true, slug: true, accentColor: true },
            },
          },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ success: true, attempts })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
