import { useState } from 'react'
import { supabase } from './lib/supabaseClient'
import { useUser } from './hooks/useUser'
import Chapter1 from './pages/Chapter1'
import './App.css'

function App() {
  const user = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSignUp() {
    setMessage('회원가입 처리 중...')
    const { error } = await supabase.auth.signUp({ email, password })
    setMessage(error ? `❌ 회원가입 실패: ${error.message}` : '✅ 회원가입 성공!')
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
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontWeight: 700 }}>Data Learning Lab</div>
        {user ? (
          <div style={{ fontSize: 13 }}>
            {user.email} <button onClick={handleSignOut}>로그아웃</button>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: '#666' }}>로그인이 필요합니다</span>
        )}
      </div>

      {!user && (
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 24 }}>
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
          {message && <p style={{ fontSize: 13, marginTop: 12 }}>{message}</p>}
        </div>
      )}

      {user && <Chapter1 />}
    </div>
  )
}

export default App
