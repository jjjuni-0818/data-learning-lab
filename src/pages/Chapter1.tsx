import { useEffect, useRef, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../hooks/useUser'
import { getPyodide, runCapturingOutput, type PyodideInterface } from '../lib/pyodideClient'
import TierExercise from '../components/TierExercise'

const MODULE_ID = '1_pandas'
const CHAPTER_ID = '01_dataframe_basics'

const EXAMPLE_CODE = `import pandas as pd

data = {'이름': ['민준', '서연', '하은'], '나이': [17, 16, 17], '점수': [88, 92, 79]}
df = pd.DataFrame(data)
print(df.head())
`

const TIERS = [
  {
    key: 'beginner',
    label: '초급',
    prompt: '주어진 데이터로 DataFrame을 만들고, 전체 행의 개수를 반환하는 함수를 완성하세요.',
    starterCode: `import pandas as pd

def count_rows(data):
    df = pd.DataFrame(data)
    # TODO: 행의 개수를 반환하세요
    pass
`,
    assertion: `assert count_rows({'이름': ['민준', '서연', '하은'], '나이': [17, 16, 17]}) == 3`,
    hint: 'DataFrame의 행 개수는 len(df) 또는 df.shape[0]로 구할 수 있어요.',
    solutionCode: `import pandas as pd

def count_rows(data):
    df = pd.DataFrame(data)
    return len(df)
`,
    solutionExplain: 'len(df)는 DataFrame의 행 개수를 반환합니다. df.shape[0]도 같은 값을 줘요.',
  },
  {
    key: 'intermediate',
    label: '중급',
    prompt: '나이가 min_age 이상인 사람의 이름만 리스트로 반환하는 함수를 완성하세요.',
    starterCode: `import pandas as pd

def filter_by_age(data, min_age):
    df = pd.DataFrame(data)
    # TODO: min_age 이상인 사람의 '이름' 컬럼 값을 리스트로 반환하세요
    pass
`,
    assertion: `result = filter_by_age({'이름': ['민준', '서연', '하은'], '나이': [17, 16, 17]}, 17)
assert list(result) == ['민준', '하은'], f"결과: {list(result)}"`,
    hint: "df[df['나이'] >= min_age] 로 조건에 맞는 행만 걸러낸 뒤, ['이름'] 컬럼을 리스트로 바꿔보세요 (.tolist()).",
    solutionCode: `import pandas as pd

def filter_by_age(data, min_age):
    df = pd.DataFrame(data)
    return df[df['나이'] >= min_age]['이름'].tolist()
`,
    solutionExplain: "조건식 df['나이'] >= min_age 은 True/False로 이루어진 조건을 만들고, df[조건]으로 그 조건에 맞는 행만 걸러냅니다.",
  },
  {
    key: 'advanced',
    label: '고급',
    prompt: '나이 데이터에 결측치(비어있는 값)가 있을 수 있습니다. 결측치를 제외하고 평균 나이를 구하는 함수를 완성하세요.',
    starterCode: `import pandas as pd

def average_age_excluding_missing(data):
    df = pd.DataFrame(data)
    # TODO: '나이' 컬럼의 결측치를 제외하고 평균을 반환하세요
    pass
`,
    assertion: `result = average_age_excluding_missing({'나이': [17, 16, None, 17]})
assert abs(result - 16.666666666666668) < 0.01, f"결과: {result}"`,
    hint: 'df["나이"].mean()은 기본적으로 결측치(NaN)를 자동으로 제외하고 평균을 계산해줘요.',
    solutionCode: `import pandas as pd

def average_age_excluding_missing(data):
    df = pd.DataFrame(data)
    return df['나이'].mean()
`,
    solutionExplain: 'pandas의 mean()은 기본값으로 결측치를 자동으로 제외(skipna=True)하고 평균을 계산합니다.',
  },
] as const

function Chapter1() {
  const user = useUser()
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [passed, setPassed] = useState<Record<string, boolean>>({})
  const [exampleOutput, setExampleOutput] = useState('')
  // Editor의 onMount는 마운트 시점에 한 번만 호출되므로, 항상 최신 runExample을
  // 실행할 수 있게 ref를 하나 만들어둡니다. (Hooks 규칙상 조건부 return보다 위에 있어야 함)
  const runExampleRef = useRef<() => void>(() => {})

  // 파이썬 + pandas 환경을 한 번만 불러옵니다.
  useEffect(() => {
    getPyodide(['pandas']).then(setPyodide)
  }, [])

  // 이 챕터의 기존 진행률을 Supabase에서 불러와, 이미 통과한 단계는 통과 표시해둡니다.
  useEffect(() => {
    if (!user) return
    supabase
      .from('progress')
      .select('tier, completed')
      .eq('user_id', user.id)
      .eq('module_id', MODULE_ID)
      .eq('chapter_id', CHAPTER_ID)
      .then(({ data }) => {
        if (!data) return
        const next: Record<string, boolean> = {}
        for (const row of data as { tier: string; completed: boolean }[]) {
          if (row.completed) next[row.tier] = true
        }
        setPassed(next)
      })
  }, [user])

  async function handlePass(tierKey: string) {
    setPassed((prev) => ({ ...prev, [tierKey]: true }))
    if (!user) return
    await supabase.from('progress').upsert(
      {
        user_id: user.id,
        module_id: MODULE_ID,
        chapter_id: CHAPTER_ID,
        tier: tierKey,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id,chapter_id,tier' },
    )
  }

  async function runExample() {
    if (!pyodide) return
    const { output, error } = await runCapturingOutput(pyodide, EXAMPLE_CODE)
    setExampleOutput(error ? `❌ ${error}` : output)
  }

  if (!user) {
    return <p style={{ fontSize: 13, color: '#666' }}>이 챕터를 보려면 먼저 로그인해주세요.</p>
  }

  if (!pyodide) {
    return <p style={{ fontSize: 13, color: '#666' }}>⏳ 파이썬 + pandas 환경을 불러오는 중... (처음 한 번은 몇 초 걸려요)</p>
  }

  runExampleRef.current = runExample

  const handleExampleEditorMount: OnMount = (editor, monacoInstance) => {
    editor.addCommand(monacoInstance.KeyMod.Shift | monacoInstance.KeyCode.Enter, () => {
      runExampleRef.current()
    })
  }

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>
        1. PANDAS 데이터 분석 · CHAPTER 1
      </div>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>DataFrame이란?</h1>
      <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
        여러 개의 행(row)과 열(column)로 이루어진, 표 형태의 데이터 구조예요. 우리가 엑셀에서 늘 보던 표와 똑같이 생겼어요.
      </p>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>예제 코드</div>
        <Editor
          height="140px"
          defaultLanguage="python"
          value={EXAMPLE_CODE}
          onMount={handleExampleEditorMount}
          options={{ readOnly: true, fontSize: 13, minimap: { enabled: false } }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <button onClick={runExample}>▶ 실행해보기</button>
          <span style={{ fontSize: 11, color: '#999' }}>Shift+Enter로도 실행돼요</span>
        </div>
        {exampleOutput && (
          <pre
            style={{
              marginTop: 8,
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: 12,
              borderRadius: 8,
              fontSize: 12.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {exampleOutput}
          </pre>
        )}
      </div>

      <hr style={{ margin: '24px 0' }} />

      {TIERS.map((tier, idx) => {
        const prevPassed = idx === 0 || passed[TIERS[idx - 1].key]
        return (
          <TierExercise
            key={tier.key}
            pyodide={pyodide}
            label={tier.label}
            prompt={tier.prompt}
            starterCode={tier.starterCode}
            assertion={tier.assertion}
            hint={tier.hint}
            solutionCode={tier.solutionCode}
            solutionExplain={tier.solutionExplain}
            locked={!prevPassed}
            initiallyPassed={!!passed[tier.key]}
            onPass={() => handlePass(tier.key)}
          />
        )
      })}
    </div>
  )
}

export default Chapter1
