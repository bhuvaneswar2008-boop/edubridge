import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subjectId')
    const chapterId = searchParams.get('chapterId')

    const whereClause: any = {}
    if (chapterId) {
      whereClause.chapterId = chapterId
    } else if (subjectId) {
      whereClause.chapter = { subjectId }
    }

    const questions = await prisma.question.findMany({
      where: whereClause,
      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
      },
      take: 50,
    })

    const parsedQuestions = questions.map((q) => {
      let optionsList: string[] = []
      try {
        optionsList = JSON.parse(q.options)
      } catch {
        optionsList = []
      }
      return {
        id: q.id,
        questionText: q.questionText,
        options: optionsList,
        explanation: q.explanation,
        correctOption: q.correctOption,
        difficulty: q.difficulty,
        chapter: {
          id: q.chapter.id,
          title: q.chapter.title,
          subject: {
            id: q.chapter.subject.id,
            name: q.chapter.subject.name,
            slug: q.chapter.subject.slug,
            accentColor: q.chapter.subject.accentColor,
          },
        },
      }
    })

    return NextResponse.json({ success: true, questions: parsedQuestions })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
