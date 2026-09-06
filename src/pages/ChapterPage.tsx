import { useEffect, useRef, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../hooks/useUser'
import { ensureMicropipPackages, getPyodide, runCapturingOutput, type PyodideInterface } from '../lib/pyodideClient'
import ExerciseCard from '../components/ExerciseCard'
import { findChapter } from '../curriculum'
import type { ChapterContent, Tier } from '../types/chapter'

// 진행률은 "tier:exerciseId" 형태의 키로 관리합니다.
function progressKey(tier: string, exerciseId: string) {
  return `${tier}:${exerciseId}`
}

// 예제 코드가 matplotlib 그래프를 그렸을 때, 이 마커로 시작하는 줄에
// base64 PNG 이미지를 실어서 출력합니다. (pyodideClient.ts의 stdout 캡처를 그대로 재사용)
const IMAGE_MARKER = '__IMAGE__:'

function ChapterPage({ chapterId, description, exampleCode, tiers, pyodidePackages, micropipPackages }: ChapterContent) {
  const user = useUser()
  const found = findChapter(chapterId)
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [passed, setPassed] = useState<Record<string, boolean>>({})
  const [exampleOutput, setExampleOutput] = useState('')
  const [exampleImage, setExampleImage] = useState<string | null>(null)
  const runExampleRef = useRef<() => void>(() => {})

  useEffect(() => {
    let cancelled = false
    async function load() {
      const py = await getPyodide(pyodidePackages ?? ['pandas'])
      if (micropipPackages?.length) {
        await ensureMicropipPackages(py, micropipPackages)
      }
      if (!cancelled) setPyodide(py)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [pyodidePackages, micropipPackages])

  useEffect(() => {
    if (!user || !found) return
    supabase
      .from('progress')
      .select('tier, exercise_id, completed')
      .eq('user_id', user.id)
      .eq('module_id', found.module.id)
      .eq('chapter_id', chapterId)
      .then(({ data }) => {
        if (!data) return
        const next: Record<string, boolean> = {}
        for (const row of data as { tier: string; exercise_id: string; completed: boolean }[]) {
          if (row.completed) next[progressKey(row.tier, row.exercise_id)] = true
        }
        setPassed(next)
      })
  }, [user, found, chapterId])

  async function handlePass(tierKey: string, exerciseId: string) {
    setPassed((prev) => ({ ...prev, [progressKey(tierKey, exerciseId)]: true }))
    if (!user || !found) return
    await supabase.from('progress').upsert(
      {
        user_id: user.id,
        module_id: found.module.id,
        chapter_id: chapterId,
        tier: tierKey,
        exercise_id: exerciseId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id,chapter_id,tier,exercise_id' },
    )
  }

  function isTierComplete(tier: Tier) {
    return tier.exercises.every((ex) => passed[progressKey(tier.key, ex.id)])
  }

  async function runExample() {
    if (!pyodide) return
    const { output, error } = await runCapturingOutput(pyodide, exampleCode)
    if (error) {
      setExampleOutput(`❌ ${error}`)
      setExampleImage(null)
      return
    }
    const lines = output.split('\n')
    const imageLine = lines.find((l) => l.startsWith(IMAGE_MARKER))
    const textLines = lines.filter((l) => !l.startsWith(IMAGE_MARKER))
    setExampleOutput(textLines.join('\n').trim())
    setExampleImage(imageLine ? imageLine.slice(IMAGE_MARKER.length) : null)
  }

  if (!user) {
    return <p style={{ fontSize: 14, color: '#666' }}>이 챕터를 보려면 먼저 로그인해주세요.</p>
  }

  if (!found) {
    return <p style={{ fontSize: 14, color: '#666' }}>알 수 없는 챕터예요.</p>
  }

  if (!pyodide) {
    const loadingHint = micropipPackages?.length
      ? '⏳ 파이썬 환경을 불러오는 중... (이 챕터는 추가 라이브러리를 설치해서 조금 더 걸릴 수 있어요)'
      : '⏳ 파이썬 + pandas 환경을 불러오는 중... (처음 한 번은 몇 초 걸려요)'
    return <p style={{ fontSize: 14, color: '#666' }}>{loadingHint}</p>
  }

  runExampleRef.current = runExample

  const handleExampleEditorMount: OnMount = (editor, monacoInstance) => {
    editor.addCommand(monacoInstance.KeyMod.Shift | monacoInstance.KeyCode.Enter, () => {
      runExampleRef.current()
    })
  }

  const chapterIndex = found.module.chapters.findIndex((ch) => ch.id === chapterId)

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 4 }}>
        {found.module.label} · CHAPTER {chapterIndex + 1}
      </div>
      <h1 style={{ fontSize: 21, marginBottom: 12 }}>{found.chapter.label}</h1>
      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{description}</p>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>예제 코드</div>
        <Editor
          height="140px"
          defaultLanguage="python"
          value={exampleCode}
          onMount={handleExampleEditorMount}
          options={{ readOnly: true, fontSize: 14, minimap: { enabled: false } }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <button onClick={runExample}>▶ 실행해보기</button>
          <span style={{ fontSize: 12, color: '#999' }}>Shift+Enter로도 실행돼요</span>
        </div>
        {exampleOutput && (
          <pre
            style={{
              marginTop: 8,
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: 12,
              borderRadius: 8,
              fontSize: 13.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {exampleOutput}
          </pre>
        )}
        {exampleImage && (
          <img
            src={`data:image/png;base64,${exampleImage}`}
            alt="예제 실행 결과 그래프"
            style={{
              marginTop: 8,
              maxWidth: '100%',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              background: '#fff',
            }}
          />
        )}
      </div>

      <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

      {tiers.map((tier, idx) => {
        const unlocked = idx === 0 || isTierComplete(tiers[idx - 1])
        const tierDone = isTierComplete(tier)
        const doneCount = tier.exercises.filter((ex) => passed[progressKey(tier.key, ex.id)]).length

        if (!unlocked) {
          return (
            <div
              key={tier.key}
              style={{ padding: 16, border: '1px dashed #ccc', borderRadius: 10, marginBottom: 20, color: '#999', fontSize: 14 }}
            >
              🔒 {tier.label} — 이전 단계를 모두 통과하면 열립니다.
            </div>
          )
        }

        return (
          <div key={tier.key} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  background: 'var(--color-accent-soft)',
                  padding: '3px 10px',
                  borderRadius: 12,
                }}
              >
                {tier.label}
              </span>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                {doneCount} / {tier.exercises.length} 문제 통과
              </span>
              {tierDone && <span style={{ fontSize: 13, color: 'var(--color-success)' }}>✅ 단계 완료</span>}
            </div>

            {tier.exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                pyodide={pyodide}
                prompt={ex.prompt}
                starterCode={ex.starterCode}
                assertion={ex.assertion}
                hint={ex.hint}
                solutionCode={ex.solutionCode}
                solutionExplain={ex.solutionExplain}
                initiallyPassed={!!passed[progressKey(tier.key, ex.id)]}
                onPass={() => handlePass(tier.key, ex.id)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default ChapterPage
