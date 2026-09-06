// 챕터 콘텐츠(개념설명+예제+문제)의 공용 타입.
// 모든 챕터 데이터 파일(src/chapters/*.ts)이 이 형태를 따릅니다.

export interface Exercise {
  id: string
  prompt: string
  starterCode: string
  /** 학생 코드 뒤에 이어붙여 실행할 파이썬 검증 코드 (assert 문) */
  assertion: string
  hint: string
  solutionCode: string
  solutionExplain: string
}

export interface Tier {
  key: string
  label: string
  exercises: Exercise[]
}

export interface ChapterContent {
  /** curriculum.ts의 chapter id와 동일한 값 (Supabase progress 테이블의 chapter_id) */
  chapterId: string
  description: string
  exampleCode: string
  tiers: Tier[]
}
