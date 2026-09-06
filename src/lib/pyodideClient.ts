// Pyodide(브라우저에서 Python을 실행하는 엔진)를 앱 전체에서 한 번만 불러오고,
// 이후에는 이미 불러온 인스턴스를 재사용하기 위한 공용 모듈입니다.

export interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  loadPackage: (packages: string | string[]) => Promise<void>
  setStdout: (opts: { batched: (msg: string) => void }) => void
  setStderr: (opts: { batched: (msg: string) => void }) => void
  pyimport: (name: string) => { install: (name: string) => Promise<void> }
}

// index.html의 CDN 스크립트가 전역으로 등록해주는 함수입니다.
declare global {
  interface Window {
    loadPyodide: (opts?: { indexURL?: string }) => Promise<PyodideInterface>
  }
}

let pyodidePromise: Promise<PyodideInterface> | null = null
// 이미 불러온 패키지 이름을 기록해서, 같은 패키지를 중복으로 다시 불러오지 않게 합니다.
const loadedPackages = new Set<string>()
// 패키지 불러오기 요청을 순서대로 처리하기 위한 대기열 (동시에 여러 챕터가
// 서로 다른 패키지를 요청해도 겹치지 않게 순차 실행합니다).
let packageQueue: Promise<void> = Promise.resolve()

/**
 * Pyodide를 불러옵니다. 이미 불러오는 중이거나 불러온 적이 있으면 그 결과를 재사용합니다.
 * Pyodide 런타임 자체는 앱 전체에서 딱 한 번만 불러오지만, 파이썬 패키지는
 * 챕터마다 필요한 게 다를 수 있어서 (예: pandas만 필요한 챕터 vs matplotlib도
 * 필요한 챕터) 호출할 때마다 "아직 안 불러온 패키지만" 추가로 불러옵니다.
 * @param packages 함께 불러올 파이썬 패키지 (예: ['pandas'])
 */
export function getPyodide(packages: string[] = []): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = window.loadPyodide()
  }

  const missing = packages.filter((p) => !loadedPackages.has(p))
  if (missing.length > 0) {
    packageQueue = packageQueue.then(async () => {
      const pyodide = await pyodidePromise!
      const stillMissing = missing.filter((p) => !loadedPackages.has(p))
      if (stillMissing.length > 0) {
        await pyodide.loadPackage(stillMissing)
        stillMissing.forEach((p) => loadedPackages.add(p))
      }
    })
  }

  return packageQueue.then(() => pyodidePromise!)
}

// micropip(PyPI에서 패키지를 설치하는 도구)으로 설치한 패키지 이름을 기록해서,
// 같은 패키지를 중복 설치하지 않게 합니다. (SQLAlchemy, mongomock처럼
// Pyodide 기본 패키지 목록에 없는 라이브러리는 loadPackage가 아니라
// micropip으로 설치해야 합니다)
const installedMicropipPackages = new Set<string>()
let micropipQueue: Promise<void> = Promise.resolve()

/**
 * Pyodide 기본 패키지 목록에 없는 라이브러리(예: sqlalchemy, mongomock)를
 * micropip으로 설치합니다. 이미 설치한 패키지는 다시 설치하지 않습니다.
 */
export function ensureMicropipPackages(pyodide: PyodideInterface, packageNames: string[]): Promise<void> {
  const missing = packageNames.filter((p) => !installedMicropipPackages.has(p))
  if (missing.length === 0) return micropipQueue

  micropipQueue = micropipQueue.then(async () => {
    const stillMissing = missing.filter((p) => !installedMicropipPackages.has(p))
    if (stillMissing.length === 0) return
    await pyodide.loadPackage('micropip')
    const micropip = pyodide.pyimport('micropip')
    for (const name of stillMissing) {
      await micropip.install(name)
      installedMicropipPackages.add(name)
    }
  })

  return micropipQueue
}

/**
 * 파이썬 코드를 실행하고, print() 등으로 출력된 내용을 문자열로 모아서 반환합니다.
 */
export async function runCapturingOutput(
  pyodide: PyodideInterface,
  code: string,
): Promise<{ output: string; error: string | null }> {
  const lines: string[] = []
  pyodide.setStdout({ batched: (msg) => lines.push(msg) })
  pyodide.setStderr({ batched: (msg) => lines.push(msg) })

  try {
    await pyodide.runPythonAsync(code)
    return { output: lines.join('\n'), error: null }
  } catch (err) {
    return { output: lines.join('\n'), error: String(err) }
  }
}
