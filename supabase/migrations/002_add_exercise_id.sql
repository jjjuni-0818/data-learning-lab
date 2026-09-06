-- 002: 챕터당 문제(exercise)가 여러 개로 늘어나면서, 진행률을
-- "모듈+챕터+난이도" 단위가 아니라 "모듈+챕터+난이도+문제" 단위로 기록해야 합니다.
-- Supabase 대시보드 > SQL Editor 에서 이 파일 내용을 붙여넣고 실행하세요.

-- 1) exercise_id 컬럼 추가 (예: 'count_rows', 'get_columns' 등 문제 고유 id)
alter table progress
  add column if not exists exercise_id text not null default '';

-- 2) 기존 유니크 제약조건 삭제
--    (스키마를 처음 만들 때 이름을 따로 안 지었기 때문에,
--     Postgres가 자동으로 붙인 이름을 그대로 사용합니다)
alter table progress
  drop constraint if exists progress_user_id_module_id_chapter_id_tier_key;

-- 3) exercise_id를 포함한 새 유니크 제약조건 추가
alter table progress
  add constraint progress_user_module_chapter_tier_exercise_key
  unique (user_id, module_id, chapter_id, tier, exercise_id);
