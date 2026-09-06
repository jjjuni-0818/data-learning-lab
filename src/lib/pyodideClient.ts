// Pyodide(브라우저에서 Python을 실행하는 엔진)를 앱 전체에서 한 번만 불러오고,
// 이후에는 이미 불러온 인스턴스를 재사용하기 위한 공용 모듈입니다.

export interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  loadPackage: (packages: string | string[]) => Promise<void>
  setStdout: (opts: { batched: (msg: string) => void }) => void
  setStderr: (opts: { batched: (msg: string) => void }) => void
}

// index.html의 CDN 스크립트가 전역으로 등록해주는 함수입니다.
declare global {
  interface Window {
    loadPyodide: (opts?: { indexURL?: string }) => Promise<PyodideInterface>
  }
}

let pyodidePromise: Promise<PyodideInterface> | null = null

/**
 * Pyodide를 불러옵니다. 이미 불러오는 중이거나 불러온 적이 있으면 그 결과를 재사용합니다.
 * @param packages 함께 불러올 파이썬 패키지 (예: ['pandas'])
 */
export function getPyodide(packages: string[] = []): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = window.loadPyodide().then(async (pyodide) => {
      if (packages.length > 0) {
        await pyodide.loadPackage(packages)
      }
      return pyodide
    })
  }
  return pyodidePromise
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
