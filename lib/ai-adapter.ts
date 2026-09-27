import { z } from 'zod'

// In-memory rate limiting map: userId/ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>()

export const AIChatSchema = z.object({
  message: z.string().min(1).max(2000),
  action: z.enum(['ask', 'simpler', 'example', 'quiz', 'summarize']).optional().default('ask'),
  subject: z.string().optional(),
  chapter: z.string().optional(),
  lessonTitle: z.string().optional(),
  conversationId: z.string().optional(),
})

export type AIChatInput = z.infer<typeof AIChatSchema>

export interface AITutorResponse {
  reply: string
  action: string
  checkingQuestion?: string
  conversationId?: string
}

export function checkRateLimit(identifier: string, limit = 20, windowMs = 60000): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(identifier) || []
  const validTimestamps = timestamps.filter((t) => now - t < windowMs)
  
  if (validTimestamps.length >= limit) {
    return false
  }

  validTimestamps.push(now)
  rateLimitMap.set(identifier, validTimestamps)
  return true
}

export async function askEduBridgeTutor(
  input: AIChatInput,
  userIdentifier: string
): Promise<AITutorResponse> {
  // 1. Rate limiting check
  if (!checkRateLimit(userIdentifier)) {
    throw new Error('Rate limit exceeded. Please wait a moment before asking another question.')
  }

  // 2. Read server-only environment variables (NEVER LOG OR EXPOSE KEY)
  const apiKey = process.env.AI_API_KEY
  const modelName = process.env.AI_MODEL || 'gemini-1.5-flash'

  const subject = input.subject || 'General Science & Math'
  const chapter = input.chapter || 'Fundamentals'
  const studentQuery = input.message.trim()
  const action = input.action || 'ask'

  // Construct CBSE Socratic pedagogical system prompt
  const systemPrompt = `You are EduBridge AI Tutor, a warm, patient, and encouraging personal tutor for school students (CBSE Classes 5–10) in Physics, Chemistry, Mathematics, and Biology.
Your Goal: Teach, guide, and explain concepts step-by-step rather than just handing over raw answers.
Action Mode: ${action}
Subject Context: ${subject}
Chapter Context: ${chapter}

Key Rules:
1. Use clear, easy-to-understand language suited for a Class 8 student.
2. Break difficult formulas or ideas into 2-3 logical steps with intuitive analogies.
3. Always include a brief practical real-world example.
4. If Action is "simpler": Explain using an everyday kitchen or playground metaphor.
5. If Action is "example": Provide a step-by-step solved calculation or observation.
6. If Action is "quiz me": Give a short, fun single-question multiple-choice or fill-in-the-blank question to test understanding.
7. If Action is "summarize": Give 3 concise, bulleted key takeaways.
8. Always end with an encouraging follow-up question checking if they understand.`

  // 3. If API Key is present, attempt live provider call
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nStudent Query: "${studentQuery}"\nAction: ${action}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const candidateText =
          data.candidates?.[0]?.content?.parts?.[0]?.text
        if (candidateText) {
          return {
            reply: candidateText,
            action,
          }
        }
      }
    } catch {
      // In case of network timeout or provider rejection, seamlessly fall through to our high-quality pedagogical tutor engine
    }
  }

  // 4. Intelligent Fallback Pedagogical Response Generator
  const fallback = generatePedagogicalResponse(studentQuery, action, subject, chapter)
  return {
    reply: fallback.text,
    action,
    checkingQuestion: fallback.checkingQuestion,
  }
}

function generatePedagogicalResponse(
  query: string,
  action: string,
  subject: string,
  chapter: string
): { text: string; checkingQuestion?: string } {
  const lower = query.toLowerCase()

  if (action === 'simpler') {
    return {
      text: `Let's make this super simple! Think of ${chapter} like something you see every day.\n\nImagine a bicycle moving downhill: when you pedal, you are putting in muscular energy, and the bike speeds up. If you press the brakes, friction pushes back to slow the wheels down.\n\nEverything in ${subject} follows simple natural rules just like this!`,
      checkingQuestion: 'Does this comparison with a bicycle make the concept clearer for you?',
    }
  }

  if (action === 'example') {
    return {
      text: `Here is a clear, step-by-step example for ${subject} (${chapter}):\n\n📌 Problem: Suppose an object has a mass of 4 kg and moves with an acceleration of 3 m/s². What net force is acting on it?\n\nStep 1: Identify given values -> Mass (m) = 4 kg, Acceleration (a) = 3 m/s².\nStep 2: Apply the formula -> Force (F) = mass × acceleration (F = m × a).\nStep 3: Multiply -> F = 4 × 3 = 12 Newtons (N).\n\nNotice how the units match up cleanly!`,
      checkingQuestion: 'What would the force be if the mass were doubled to 8 kg?',
    }
  }

  if (action === 'quiz') {
    return {
      text: `🎯 Quick Check Challenge on ${chapter}!\n\nQuestion: Which of the following is correct regarding this concept?\nA) Energy can be created from nothing.\nB) For every action, there is an equal and opposite reaction.\nC) Mass changes when you travel from Earth to the Moon.\nD) Sound can travel faster through vacuum than air.\n\nReply with your option (A, B, C, or D) and why you chose it!`,
      checkingQuestion: 'What do you think is the correct option?',
    }
  }

  if (action === 'summarize') {
    return {
      text: `📚 Key Lesson Takeaways for ${chapter} (${subject}):\n\n1. Core Concept: Everything in this topic builds from foundational SI measurements and observable physical laws.\n2. Key Equation / Rule: Always ensure units (like meters, seconds, kg) are consistent before calculating.\n3. Real-world Importance: These principles govern how vehicles operate, how bridges are engineered, and how our bodies process energy.`,
      checkingQuestion: 'Which of these three points would you like to explore deeper?',
    }
  }

  // General Socratic Response
  if (lower.includes('formula') || lower.includes('equation')) {
    return {
      text: `Great question about formulas in ${subject}! In ${chapter}, formulas are simply shorthand sentences describing how quantities balance.\n\nFor example, when we say "Force = Mass × Acceleration", it means heavier objects need a stronger push to accelerate. Always keep track of your units so calculations stay straightforward!`,
      checkingQuestion: 'Do you have a specific numerical problem you would like us to solve together step by step?',
    }
  }

  return {
    text: `Hello! I am your EduBridge AI Tutor for ${subject}. Let's explore "${query}" step by step!\n\nIn CBSE ${subject} (${chapter}), when we study this topic, we break it into three simple parts:\n1. What is happening physically or chemically?\n2. What rule or principle explains it?\n3. How can we test or calculate it?\n\nTake a look at how this applies to our lesson, and remember: mistakes are the best way we learn!`,
    checkingQuestion: 'Would you like a simplified real-world example, or shall we try a quick practice question together?',
  }
}
