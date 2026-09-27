import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

const AttemptSchema = z.object({
  questionId: z.string().min(1),
  selectedOption: z.number().int().min(0).max(3),
})

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const result = AttemptSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid attempt parameters' }, { status: 400 })
    }

    const { questionId, selectedOption } = result.data
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        chapter: {
          include: { subject: true },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 })
    }

    const isCorrect = question.correctOption === selectedOption

    // Record the attempt in database
    const attempt = await prisma.practiceAttempt.create({
      data: {
        userId: user.id,
        questionId: question.id,
        selectedOption,
        isCorrect,
      },
    })

    // If correct, update subject progress slightly
    if (isCorrect) {
      const subjectId = question.chapter.subjectId
      const currentProgress = await prisma.progress.findUnique({
        where: {
          userId_subjectId: {
            userId: user.id,
            subjectId,
          },
        },
      })

      if (currentProgress && currentProgress.percentage < 100) {
        await prisma.progress.update({
          where: { id: currentProgress.id },
          data: {
            percentage: Math.min(100, currentProgress.percentage + 1),
            lastActivityAt: new Date(),
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctOption: question.correctOption,
      explanation: question.explanation,
      attemptId: attempt.id,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
