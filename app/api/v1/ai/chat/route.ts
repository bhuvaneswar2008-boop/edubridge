import { NextResponse } from 'next/server'
import { AIChatSchema, askEduBridgeTutor } from '@/lib/ai-adapter'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    const userId = user?.id || 'guest-session'

    const body = await req.json()
    const validation = AIChatSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid chat parameters: message required (max 2000 chars)' },
        { status: 400 }
      )
    }

    const input = validation.data
    const tutorResponse = await askEduBridgeTutor(input, userId)

    // Persist conversation if user is logged in
    let conversationId = input.conversationId
    if (user?.id) {
      if (!conversationId) {
        const conv = await prisma.aIConversation.create({
          data: {
            userId: user.id,
            title: `${input.subject || 'General'} - ${input.chapter || 'Session'}`,
          },
        })
        conversationId = conv.id
      }

      // Save user prompt
      await prisma.aIMessage.create({
        data: {
          conversationId,
          sender: 'user',
          text: input.message,
        },
      })

      // Save tutor response
      await prisma.aIMessage.create({
        data: {
          conversationId,
          sender: 'assistant',
          text: tutorResponse.reply + (tutorResponse.checkingQuestion ? `\n\n💡 ${tutorResponse.checkingQuestion}` : ''),
        },
      })
    }

    return NextResponse.json({
      success: true,
      reply: tutorResponse.reply,
      action: tutorResponse.action,
      checkingQuestion: tutorResponse.checkingQuestion,
      conversationId,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'AI Tutor service unavailable' },
      { status: error.message?.includes('Rate limit') ? 429 : 500 }
    )
  }
}
