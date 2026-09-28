import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }
  redirect('/dashboard')
}

