import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'
import PyodideTest from './PyodideTest'
import './App.css'

function App() {
  // 현재 로그인된 사용자 (없으면 null)
  const [user, setUser] = useState<User | null>(null)
  // 입력 폼 값
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // 화면에 보여줄 상태 메시지
  const [message, setMessage] = useState('')

  // 처음 화면이 뜰 때 + 로그인 상태가 바뀔 때마다 user를 최신 상태로 갱신
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSignUp() {
    setMessage('회원가입 처리 중...')
    const { error } = await supabase.auth.signUp({ email, password })
    setMessage(error ? `❌ 회원가입 실패: ${error.message}` : '✅ 회원가입 성공! 이메일함에서 인증 메일을 확인해주세요.')
  }

  async function handleSignIn() {
    setMessage('로그인 처리 중...')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMessage(error ? `❌ 로그인 실패: ${error.message}` : '✅ 로그인 성공!')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setMessage('로그아웃했습니다.')
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Supabase 연결 테스트</h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
        회원가입 · 로그인이 실제로 되는지 확인하는 임시 화면입니다.
      </p>

      <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>현재 로그인 상태</div>
        <div style={{ fontSize: 13 }}>{user ? `✅ ${user.email} 로 로그인됨` : '로그인 안 됨'}</div>
        {user && (
          <button onClick={handleSignOut} style={{ marginTop: 8 }}>
            로그아웃
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 (6자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSignUp}>회원가입</button>
        <button onClick={handleSignIn}>로그인</button>
      </div>

      {message && <p style={{ fontSize: 13, marginTop: 16 }}>{message}</p>}

      <hr style={{ margin: '40px 0' }} />
      <PyodideTest />
    </div>
  )
}

export default App
