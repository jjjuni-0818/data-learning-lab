import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'
import './AuthScreen.css'

const FEATURES = [
  '데이콘보다 완만한 난이도로 첫걸음부터',
  '브라우저 안에서 바로 코드 작성 + 자동채점',
  '단원마다 초급 → 중급 → 고급 3단계 복습',
]

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  )
}

function AuthScreen() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    const { error } =
      mode === 'signUp'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setFeedback({ ok: false, text: error.message })
    } else if (mode === 'signUp') {
      setFeedback({ ok: true, text: '회원가입 완료! 자동으로 로그인됩니다.' })
    }
    setLoading(false)
  }

  const brandBlock = (
    <>
      <div className="auth-logo">
        <span className="auth-logo-dot" />
        Data Learning Lab
      </div>
      <h1>비전공자를 위한 데이터분석 학습</h1>
      <p className="auth-brand-tagline">
        Python · Pandas · 시각화 · 데이터베이스를 실습하며 배우는 학습 플랫폼입니다.
      </p>
      <div className="auth-feature-list">
        {FEATURES.map((f) => (
          <div className="auth-feature" key={f}>
            <CheckIcon />
            <span>{f}</span>
          </div>
        ))}
      </div>
    </>
  )

  return (
    <div className="auth-screen">
      <div className="auth-brand">
        <div className="auth-brand-inner">{brandBlock}</div>
      </div>

      <div className="auth-form-panel">
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div className="auth-mobile-header">
            <div className="auth-logo" style={{ color: 'var(--color-accent)', justifyContent: 'center' }}>
              <span className="auth-logo-dot" style={{ background: 'var(--color-accent)' }} />
              Data Learning Lab
            </div>
          </div>

          <div className="auth-card">
            <h2>{mode === 'signUp' ? '회원가입' : '로그인'}</h2>
            <p className="auth-card-subtext">
              {mode === 'signUp'
                ? '이메일과 비밀번호로 계정을 만들어요.'
                : '학습을 이어서 하려면 로그인해주세요.'}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">이메일</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="password">비밀번호</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상"
                />
              </div>
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? '처리 중...' : mode === 'signUp' ? '회원가입' : '로그인'}
              </button>
            </form>

            <div className="auth-switch">
              {mode === 'signUp' ? (
                <>
                  이미 계정이 있으신가요?{' '}
                  <button onClick={() => setMode('signIn')}>로그인</button>
                </>
              ) : (
                <>
                  계정이 없으신가요? <button onClick={() => setMode('signUp')}>회원가입</button>
                </>
              )}
            </div>

            {feedback && (
              <div className={`auth-message ${feedback.ok ? 'success' : 'error'}`}>{feedback.text}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen
