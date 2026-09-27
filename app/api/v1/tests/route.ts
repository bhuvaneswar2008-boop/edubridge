import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subjectId')
    const classId = searchParams.get('classId')

    const whereClause: any = { isPublished: true }
    if (subjectId) whereClause.subjectId = subjectId
    if (classId) whereClause.classLevelId = classId

    const tests = await prisma.test.findMany({
      where: whereClause,
      include: {
        subject: {
          select: { id: true, name: true, slug: true, accentColor: true },
        },
        classLevel: {
          select: { id: true, name: true },
        },
        _count: {
          select: { testQuestions: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const formattedTests = tests.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      durationMin: t.durationMin,
      totalMarks: t.totalMarks,
      passMarks: t.passMarks,
      subject: t.subject,
      classLevel: t.classLevel?.name || 'Class 8',
      questionCount: t._count.testQuestions,
    }))

    return NextResponse.json({ success: true, tests: formattedTests })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
