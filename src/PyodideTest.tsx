import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'

// index.html에서 CDN 스크립트로 불러온 전역 함수라, 타입스크립트에게 따로 알려줍니다.
declare global {
  interface Window {
    loadPyodide: (opts?: { indexURL?: string }) => Promise<PyodideInterface>
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  setStdout: (opts: { batched: (msg: string) => void }) => void
  setStderr: (opts: { batched: (msg: string) => void }) => void
}

const DEFAULT_CODE = `# 여기에 파이썬 코드를 직접 작성해보세요
def get_average(nums):
    return sum(nums) / len(nums)

scores = [88, 92, 79]
print("평균 점수:", get_average(scores))
`

function PyodideTest() {
  const pyodideRef = useRef<PyodideInterface | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'running' | 'error'>('loading')
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState('')

  useEffect(() => {
    window
      .loadPyodide()
      .then((pyodide) => {
        pyodideRef.current = pyodide
        setStatus('ready')
      })
      .catch((err) => {
        console.error(err)
        setStatus('error')
      })
  }, [])

  async function handleRun() {
    const pyodide = pyodideRef.current
    if (!pyodide) return

    setStatus('running')
    const lines: string[] = []
    pyodide.setStdout({ batched: (msg) => lines.push(msg) })
    pyodide.setStderr({ batched: (msg) => lines.push(msg) })

    try {
      await pyodide.runPythonAsync(code)
      setOutput(lines.join('\n'))
    } catch (err) {
      setOutput(String(err))
    } finally {
      setStatus('ready')
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Pyodide + Monaco 연결 테스트</h1>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
        브라우저 안에서 파이썬 코드를 직접 작성하고 실행해보는 임시 화면입니다.
      </p>

      <div style={{ fontSize: 13, marginBottom: 8 }}>
        상태:{' '}
        {status === 'loading' && '⏳ 파이썬 환경 불러오는 중... (처음 한 번은 몇 초 걸려요)'}
        {status === 'ready' && '✅ 실행 준비 완료'}
        {status === 'running' && '⏳ 실행 중...'}
        {status === 'error' && '❌ 파이썬 환경 로딩 실패'}
      </div>

      <Editor
        height="200px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value ?? '')}
        options={{ fontSize: 13, minimap: { enabled: false } }}
      />

      <button
        onClick={handleRun}
        disabled={status === 'loading' || status === 'running'}
        style={{ marginTop: 12 }}
      >
        ▶ 실행
      </button>

      <pre
        style={{
          marginTop: 12,
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: 12,
          borderRadius: 8,
          minHeight: 60,
          fontSize: 13,
          whiteSpace: 'pre-wrap',
        }}
      >
        {output || '실행 결과가 여기에 표시됩니다.'}
      </pre>
    </div>
  )
}

export default PyodideTest
