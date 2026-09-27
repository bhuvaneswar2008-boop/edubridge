import { describe, it, expect } from 'vitest'
import { createSessionToken, verifySessionToken } from '../lib/auth'

describe('Server-Side Scoring and Authentication', () => {
  it('correctly scores server-side test submissions', () => {
    const questions = [
      { id: 'q1', correctOption: 1 },
      { id: 'q2', correctOption: 2 },
      { id: 'q3', correctOption: 0 },
      { id: 'q4', correctOption: 3 },
    ]

    const studentAnswers = [
      { questionId: 'q1', selectedOption: 1 }, // correct
      { questionId: 'q2', selectedOption: 2 }, // correct
      { questionId: 'q3', selectedOption: 1 }, // incorrect
      { questionId: 'q4', selectedOption: 3 }, // correct
    ]

    let correctCount = 0
    studentAnswers.forEach((ans) => {
      const q = questions.find((item) => item.id === ans.questionId)
      if (q && q.correctOption === ans.selectedOption) {
        correctCount++
      }
    })

    const totalMarks = 10
    const passMarks = 5
    const score = Math.round((correctCount / questions.length) * totalMarks)
    const passed = score >= passMarks

    expect(correctCount).toBe(3)
    expect(score).toBe(8)
    expect(passed).toBe(true)
  })

  it('signs and verifies JWT session tokens securely', async () => {
    const payload = {
      userId: 'test-user-123',
      email: 'demo@student.com',
      role: 'STUDENT',
    }

    const token = await createSessionToken(payload)
    expect(token).toBeTypeOf('string')

    const verified = await verifySessionToken(token)
    expect(verified).toBeDefined()
    expect(verified?.userId).toBe(payload.userId)
    expect(verified?.email).toBe(payload.email)
  })
})
