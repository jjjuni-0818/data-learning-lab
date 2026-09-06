import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useUser } from './hooks/useUser'
import AuthScreen from './pages/AuthScreen'
import ChapterPage from './pages/ChapterPage'
import ChapterPlaceholder from './pages/ChapterPlaceholder'
import CurriculumSidebar from './components/CurriculumSidebar'
import { DEFAULT_CHAPTER_ID, findChapter } from './curriculum'
import { dataframeBasics } from './chapters/dataframeBasics'
import { dataLoadingCleaning } from './chapters/dataLoadingCleaning'
import { dataExploration } from './chapters/dataExploration'
import { dataVisualization } from './chapters/dataVisualization'
import { projectBasedLearning } from './chapters/projectBasedLearning'
import { vectorsMatrices } from './chapters/vectorsMatrices'
import { weightedSum } from './chapters/weightedSum'
import { functionsGraphs } from './chapters/functionsGraphs'
import { dataSummaryStats } from './chapters/dataSummaryStats'
import { dbConcepts } from './chapters/dbConcepts'
import { sqlBasics } from './chapters/sqlBasics'
import { pythonDbIntegration } from './chapters/pythonDbIntegration'
import type { ChapterContent } from './types/chapter'
import './App.css'

// 실제로 콘텐츠(데이터)가 만들어진 챕터만 여기에 등록합니다.
// 나머지 챕터는 curriculum.ts에서 built: false 로 표시되어 있고,
// 여기 등록이 없으면 자동으로 ChapterPlaceholder("준비중")가 보입니다.
const CHAPTER_CONTENT: Record<string, ChapterContent> = {
  '01_vectors_matrices': vectorsMatrices,
  '02_weighted_sum': weightedSum,
  '03_functions_graphs': functionsGraphs,
  '04_data_summary_stats': dataSummaryStats,
  '01_dataframe_basics': dataframeBasics,
  '02_data_loading_cleaning': dataLoadingCleaning,
  '03_data_exploration': dataExploration,
  '04_data_visualization': dataVisualization,
  '05_project_based_learning': projectBasedLearning,
  '01_db_concepts': dbConcepts,
  '02_sql_basics': sqlBasics,
  '03_python_db_integration': pythonDbIntegration,
}

function ChapterRoute() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const found = chapterId ? findChapter(chapterId) : undefined

  if (!found) {
    return <Navigate to={`/chapter/${DEFAULT_CHAPTER_ID}`} replace />
  }

  const content = CHAPTER_CONTENT[found.chapter.id]
  if (!content) {
    // key={found.chapter.id}: 챕터가 바뀔 때마다 ChapterPlaceholder를
    // 완전히 새로 만들어서, 이전 챕터의 흔적이 안 남게 합니다.
    return <ChapterPlaceholder key={found.chapter.id} label={found.chapter.label} />
  }
  // key={content.chapterId}: React Router는 경로만 바뀌면 같은 위치의
  // 컴포넌트를 재사용하려고 해서, key 없이는 챕터를 이동해도 이전 챕터의
  // 실행 결과/채점 상태가 그대로 남아있는 버그가 있었습니다.
  // key를 다르게 주면 React가 컴포넌트를 통째로 새로 만들어(state 초기화)
  // 이 문제가 해결됩니다.
  return <ChapterPage key={content.chapterId} {...content} />
}

function App() {
  const user = useUser()

  if (!user) {
    return <AuthScreen />
  }

  return (
    <BrowserRouter>
      <div>
        <header className="app-header">
          <div className="logo">
            <span className="logo-dot" />
            Data Learning Lab
          </div>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="logout-button" onClick={() => supabase.auth.signOut()}>
              로그아웃
            </button>
          </div>
        </header>

        <div className="app-body">
          <CurriculumSidebar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to={`/chapter/${DEFAULT_CHAPTER_ID}`} replace />} />
              <Route path="/chapter/:chapterId" element={<ChapterRoute />} />
              <Route path="*" element={<Navigate to={`/chapter/${DEFAULT_CHAPTER_ID}`} replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
