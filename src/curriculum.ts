// 전체 커리큘럼(모듈/챕터) 목록. 사이드바 표시와 라우팅(주소 이동) 양쪽이
// 이 데이터 하나만 보고 동작하도록 공용 파일로 분리했습니다.

export interface CurriculumChapter {
  /** URL과 Supabase progress 테이블의 chapter_id로 함께 쓰이는 고유 식별자 */
  id: string
  label: string
  /** 실제 학습 콘텐츠(개념설명+문제)가 만들어졌는지 여부 */
  built: boolean
}

export interface CurriculumModule {
  /** Supabase progress 테이블의 module_id로 함께 쓰이는 고유 식별자 */
  id: string
  label: string
  chapters: CurriculumChapter[]
}

export const CURRICULUM: CurriculumModule[] = [
  {
    id: '1_data_representation',
    label: '1. 데이터 표현 이해',
    chapters: [
      { id: '01_vectors_matrices', label: '벡터와 행렬로 데이터 표현하기', built: false },
      { id: '02_weighted_sum', label: '가중합과 계산 이해하기', built: false },
      { id: '03_functions_graphs', label: '함수와 그래프 이해하기', built: false },
      { id: '04_data_summary_stats', label: '데이터 요약과 통계', built: false },
    ],
  },
  {
    id: '2_data_viz',
    label: '2. 데이터 시각화',
    chapters: [
      { id: '01_dataframe_basics', label: 'DataFrame이란?', built: true },
      { id: '02_data_loading_cleaning', label: '데이터 불러오기와 정제', built: true },
      { id: '03_data_exploration', label: '데이터 탐색과 분석', built: true },
      { id: '04_data_visualization', label: '데이터 시각화', built: false },
      { id: '05_project_based_learning', label: '프로젝트 기반 학습', built: false },
    ],
  },
  {
    id: '3_db_basics',
    label: '3. 데이터베이스(DB) 기초',
    chapters: [
      { id: '01_db_concepts', label: '데이터베이스 기본 개념 이해', built: false },
      { id: '02_sql_basics', label: 'SQL 기초 및 데이터 조회', built: false },
      { id: '03_python_db_integration', label: 'Python + DB 연동 경험', built: false },
      { id: '04_orm_sqlalchemy', label: 'ORM(SQLAlchemy)과 모델링', built: false },
      { id: '05_nosql_mongodb', label: 'NoSQL(MongoDB) 이해와 활용', built: false },
      { id: '06_project_based_practice', label: '프로젝트 기반 실습', built: false },
    ],
  },
]

/** 앱 첫 진입 시 기본으로 이동할 챕터 (지금은 유일하게 완성된 챕터) */
export const DEFAULT_CHAPTER_ID = '01_dataframe_basics'

export function findChapter(chapterId: string): { module: CurriculumModule; chapter: CurriculumChapter } | undefined {
  for (const mod of CURRICULUM) {
    const chapter = mod.chapters.find((ch) => ch.id === chapterId)
    if (chapter) return { module: mod, chapter }
  }
  return undefined
}
