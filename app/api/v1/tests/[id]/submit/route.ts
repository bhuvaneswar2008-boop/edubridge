import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

const SubmitSchema = z.object({
  attemptId: z.string().optional(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOption: z.number().int().min(0).max(3).nullable(),
    })
  ),
})

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const result = SubmitSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid submission data' }, { status: 400 })
    }

    const { attemptId, answers } = result.data

    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        subject: true,
        testQuestions: {
          include: { question: true },
        },
      },
    })

    if (!test) {
      return NextResponse.json({ success: false, error: 'Test not found' }, { status: 404 })
    }

    // Map questions by id
    const questionsMap = new Map<string, any>()
    for (const tq of test.testQuestions) {
      questionsMap.set(tq.question.id, tq.question)
    }

    let correctCount = 0
    const detailedReview: any[] = []
    const answerRecords: any[] = []

    for (const ans of answers) {
      const q = questionsMap.get(ans.questionId)
      if (!q) continue

      const isCorrect = ans.selectedOption === q.correctOption
      if (isCorrect) correctCount++

      let optionsList: string[] = []
      try {
        optionsList = JSON.parse(q.options)
      } catch {
        optionsList = []
      }

      detailedReview.push({
        questionId: q.id,
        questionText: q.questionText,
        options: optionsList,
        userSelection: ans.selectedOption,
        correctOption: q.correctOption,
        isCorrect,
        explanation: q.explanation,
      })

      answerRecords.push({
        questionId: q.id,
        selectedOption: ans.selectedOption,
        isCorrect,
      })
    }

    const totalQuestions = test.testQuestions.length
    const score = Math.round((correctCount / (totalQuestions || 1)) * test.totalMarks)
    const passed = score >= test.passMarks

    // Find or create test attempt
    let activeAttemptId = attemptId
    if (activeAttemptId) {
      await prisma.testAttempt.update({
        where: { id: activeAttemptId },
        data: {
          completedAt: new Date(),
          score,
          totalScore: test.totalMarks,
          passed,
        },
      })
    } else {
      const newAttempt = await prisma.testAttempt.create({
        data: {
          userId: user.id,
          testId: test.id,
          completedAt: new Date(),
          score,
          totalScore: test.totalMarks,
          passed,
        },
      })
      activeAttemptId = newAttempt.id
    }

    // Save individual answers
    for (const ansRec of answerRecords) {
      await prisma.testAnswer.create({
        data: {
          attemptId: activeAttemptId,
          questionId: ansRec.questionId,
          selectedOption: ansRec.selectedOption,
          isCorrect: ansRec.isCorrect,
        },
      })
    }

    // Update Progress for subject
    const subjectId = test.subjectId
    const currentProgress = await prisma.progress.findUnique({
      where: {
        userId_subjectId: {
          userId: user.id,
          subjectId,
        },
      },
    })

    if (currentProgress) {
      const boost = passed ? 6 : 2
      await prisma.progress.update({
        where: { id: currentProgress.id },
        data: {
          percentage: Math.min(100, currentProgress.percentage + boost),
          lastActivityAt: new Date(),
        },
      })
    }

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Test Results: ${test.title}`,
        message: `You scored ${score}/${test.totalMarks} (${passed ? 'Passed 🎉' : 'Needs Practice 💪'}). Check your detailed answer review.`,
        type: passed ? 'success' : 'warning',
        link: '/test',
        isRead: false,
      },
    })

    return NextResponse.json({
      success: true,
      result: {
        attemptId: activeAttemptId,
        score,
        totalMarks: test.totalMarks,
        passMarks: test.passMarks,
        correctCount,
        totalQuestions,
        passed,
        detailedReview,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
