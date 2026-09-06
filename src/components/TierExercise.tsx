import { useRef, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { runCapturingOutput, type PyodideInterface } from '../lib/pyodideClient'

interface TierExerciseProps {
  pyodide: PyodideInterface
  label: string
  prompt: string
  starterCode: string
  /** 학생 코드 뒤에 이어붙여 실행할 파이썬 검증 코드 (assert 문) */
  assertion: string
  hint: string
  solutionCode: string
  solutionExplain: string
  locked: boolean
  initiallyPassed: boolean
  onPass: () => void
}

// assertion 코드를 try 블록 안에 넣기 위해 들여쓰기를 맞춰줍니다.
function indent(code: string, spaces = 4) {
  const pad = ' '.repeat(spaces)
  return code
    .split('\n')
    .map((line) => (line.trim() ? pad + line : line))
    .join('\n')
}

// 실행 결과 문자열에서 "__GRADE__:PASS:메시지" 형태의 채점 결과 줄을 찾아 파싱합니다.
function parseGrade(output: string): { ok: boolean; message: string } | null {
  const line = output.split('\n').find((l) => l.startsWith('__GRADE__:'))
  if (!line) return null
  const rest = line.slice('__GRADE__:'.length)
  const sep = rest.indexOf(':')
  return { ok: rest.slice(0, sep) === 'PASS', message: rest.slice(sep + 1) }
}

function TierExercise({
  pyodide,
  label,
  prompt,
  starterCode,
  assertion,
  hint,
  solutionCode,
  solutionExplain,
  locked,
  initiallyPassed,
  onPass,
}: TierExerciseProps) {
  const [code, setCode] = useState(starterCode)
  const [running, setRunning] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [passed, setPassed] = useState(initiallyPassed)
  // Editor의 onMount는 마운트 시점에 한 번만 호출되므로, 항상 최신 handleGrade를
  // 실행할 수 있게 ref를 하나 만들어둡니다. (Hooks 규칙상 조건부 return보다 위에 있어야 함)
  const handleGradeRef = useRef<() => void>(() => {})

  if (locked) {
    return (
      <div
        style={{
          padding: 16,
          border: '1px dashed #ccc',
          borderRadius: 8,
          marginBottom: 16,
          color: '#999',
          fontSize: 13,
        }}
      >
        🔒 {label} — 이전 단계를 먼저 통과하면 열립니다.
      </div>
    )
  }

  async function handleGrade() {
    setRunning(true)
    setFeedback(null)

    // 학생 코드 뒤에 채점용 assert 문을 이어붙여서 실행합니다.
    const gradingCode = `${code}

try:
${indent(assertion)}
    print("__GRADE__:PASS:정답입니다! 다음 단계로 진행하세요.")
except AssertionError as e:
    print(f"__GRADE__:FAIL:{str(e) if str(e) else '값이 일치하지 않습니다. 다시 확인해보세요.'}")
except Exception as e:
    print(f"__GRADE__:FAIL:오류가 발생했어요: {e}")
`
    const { output, error } = await runCapturingOutput(pyodide, gradingCode)
    const result = parseGrade(output)

    if (result) {
      setFeedback(result)
      if (result.ok) {
        setPassed(true)
        onPass()
      }
    } else {
      setFeedback({ ok: false, message: `채점 중 문제가 발생했어요: ${error ?? '알 수 없는 오류'}` })
    }
    setRunning(false)
  }

  handleGradeRef.current = handleGrade

  const handleEditorMount: OnMount = (editor, monacoInstance) => {
    editor.addCommand(monacoInstance.KeyMod.Shift | monacoInstance.KeyCode.Enter, () => {
      handleGradeRef.current()
    })
  }

  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#2563eb',
            background: '#eff6ff',
            padding: '2px 8px',
            borderRadius: 12,
          }}
        >
          {label}
        </span>
        {passed && <span style={{ fontSize: 12, color: '#16a34a' }}>✅ 통과</span>}
      </div>

      <p style={{ fontSize: 13, marginBottom: 10 }}>{prompt}</p>

      <Editor
        height="140px"
        defaultLanguage="python"
        value={code}
        onChange={(v) => setCode(v ?? '')}
        onMount={handleEditorMount}
        options={{ fontSize: 13, minimap: { enabled: false } }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <button onClick={handleGrade} disabled={running}>
          채점하기
        </button>
        <button onClick={() => setShowHint((v) => !v)}>{showHint ? '힌트 숨기기' : '힌트 보기'}</button>
        {passed && (
          <button onClick={() => setShowSolution((v) => !v)}>
            {showSolution ? '정답 숨기기' : '정답 해설 보기'}
          </button>
        )}
        <span style={{ fontSize: 11, color: '#999' }}>Shift+Enter로도 채점돼요</span>
      </div>

      {showHint && (
        <div style={{ marginTop: 8, fontSize: 12.5, color: '#92400e', background: '#fffbeb', padding: 10, borderRadius: 6 }}>
          💡 {hint}
        </div>
      )}

      {feedback && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12.5,
            padding: 10,
            borderRadius: 6,
            background: feedback.ok ? '#f0fdf4' : '#fef2f2',
            color: feedback.ok ? '#16a34a' : '#dc2626',
          }}
        >
          {feedback.ok ? '✅' : '❌'} {feedback.message}
        </div>
      )}

      {showSolution && (
        <div style={{ marginTop: 8 }}>
          <pre
            style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: 10,
              borderRadius: 6,
              fontSize: 12.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {solutionCode}
          </pre>
          <p style={{ fontSize: 12.5, color: '#555', marginTop: 6 }}>{solutionExplain}</p>
        </div>
      )}
    </div>
  )
}

export default TierExercise
