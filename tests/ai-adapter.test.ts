import { describe, it, expect } from 'vitest'
import { checkRateLimit, askEduBridgeTutor, AIChatSchema } from '../lib/ai-adapter'

describe('EduBridge AI Tutor Adapter', () => {
  it('validates input schema correctly', () => {
    const valid = AIChatSchema.safeParse({
      message: 'Explain Newton’s Third Law',
      action: 'simpler',
      subject: 'Physics',
    })
    expect(valid.success).toBe(true)

    const invalid = AIChatSchema.safeParse({
      message: '', // empty message
    })
    expect(invalid.success).toBe(false)
  })

  it('enforces rate limiting on rapid requests', () => {
    const id = 'test-rate-limit-user'
    for (let i = 0; i < 20; i++) {
      expect(checkRateLimit(id, 20)).toBe(true)
    }
    // 21st request should be rejected
    expect(checkRateLimit(id, 20)).toBe(false)
  })

  it('generates high quality pedagogical responses without leaking secrets', async () => {
    const res = await askEduBridgeTutor(
      {
        message: 'What is momentum?',
        action: 'simpler',
        subject: 'Physics',
        chapter: 'Motion and Speed',
      },
      'test-student-unique-1'
    )

    expect(res).toBeDefined()
    expect(res.reply).toBeTypeOf('string')
    expect(res.reply.length).toBeGreaterThan(20)
    // Guarantee secret key is never part of response
    if (process.env.AI_API_KEY) {
      expect(res.reply.includes(process.env.AI_API_KEY)).toBe(false)
    }
  })
})
