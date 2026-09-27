import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        subject: true,
        classLevel: true,
        testQuestions: {
          orderBy: { order: 'asc' },
          include: {
            question: true,
          },
        },
      },
    })

    if (!test) {
      return NextResponse.json({ success: false, error: 'Test not found' }, { status: 404 })
    }

    const questions = test.testQuestions.map((tq) => {
      let optionsList: string[] = []
      try {
        optionsList = JSON.parse(tq.question.options)
      } catch {
        optionsList = []
      }
      return {
        id: tq.question.id,
        order: tq.order,
        questionText: tq.question.questionText,
        options: optionsList,
        difficulty: tq.question.difficulty,
        // Notice: correctOption and explanation are verified server-side on submit
      }
    })

    return NextResponse.json({
      success: true,
      test: {
        id: test.id,
        title: test.title,
        description: test.description,
        durationMin: test.durationMin,
        totalMarks: test.totalMarks,
        passMarks: test.passMarks,
        subject: test.subject,
        classLevel: test.classLevel?.name || 'Class 8',
        questions,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
