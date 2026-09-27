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

    const test = await prisma.test.findUnique({
      where: { id: params.id },
    })

    if (!test) {
      return NextResponse.json({ success: false, error: 'Test not found' }, { status: 404 })
    }

    // Create a new attempt
    const attempt = await prisma.testAttempt.create({
      data: {
        userId: user.id,
        testId: test.id,
        startedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      startedAt: attempt.startedAt,
      durationMin: test.durationMin,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
