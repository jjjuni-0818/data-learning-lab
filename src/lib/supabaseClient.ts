import { createClient } from '@supabase/supabase-js'

// .env 파일에서 Supabase 프로젝트 URL과 공개용(publishable) 키를 읽어옵니다.
// Vite에서는 VITE_ 로 시작하는 환경변수만 브라우저 코드에서 사용할 수 있습니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase 환경변수가 설정되지 않았습니다. 프로젝트 루트의 .env 파일을 확인해주세요.',
  )
}

// 앱 전체에서 이 supabase 객체 하나로 회원가입/로그인, 데이터 조회 등을 처리합니다.
export const supabase = createClient(supabaseUrl, supabaseKey)
