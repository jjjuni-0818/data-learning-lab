-- Data Learning Lab: progress 테이블
-- 회원별로 어떤 모듈/챕터/난이도/문제를 완료했는지 기록합니다.
-- Supabase 대시보드 > SQL Editor 에서 이 파일 내용을 붙여넣고 실행하세요.
-- (이미 이 테이블을 만든 적이 있다면, 이 파일 대신 migrations/002_add_exercise_id.sql 을 실행하세요)

create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id text not null,       -- 예: '1_pandas'
  chapter_id text not null,      -- 예: '01_dataframe_basics'
  tier text not null check (tier in ('beginner', 'intermediate', 'advanced')), -- 초급/중급/고급
  exercise_id text not null,     -- 예: 'count_rows' (한 챕터의 한 난이도 안에 여러 문제가 있음)
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, module_id, chapter_id, tier, exercise_id)
);

-- Row Level Security 활성화: 기본적으로 아무도 접근 못 하게 잠그고,
-- 아래 정책(policy)으로 "본인 기록만" 허용합니다.
alter table progress enable row level security;

create policy "본인 진행률만 조회"
  on progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "본인 진행률만 생성"
  on progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "본인 진행률만 수정"
  on progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- "새 테이블 자동 노출"을 꺼둔 상태라, 로그인한 사용자(authenticated) 역할에
-- 이 테이블에 대한 API 접근 권한을 직접 부여합니다. (RLS가 실제 행 단위 제한을 담당)
grant select, insert, update on progress to authenticated;
