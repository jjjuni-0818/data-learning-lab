import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

/**
 * 현재 로그인된 사용자를 반환하는 훅.
 * 로그인 상태가 바뀔 때마다 (로그인/로그아웃) 자동으로 최신 상태로 갱신됩니다.
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return user
}
