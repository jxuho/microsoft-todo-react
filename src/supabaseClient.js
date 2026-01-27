import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 설정에서 복사한 URL과 Anon Key를 넣으세요.
const supabaseUrl = 'https://msltntatsbwdiihanqkb.supabase.co'
const supabaseKey = 'sb_publishable_-6YQG71QYrpUb6kcCADxDA_zYu1PQ9L'

// 초기화된 클라이언트를 export하여 다른 파일에서 사용할 수 있게 합니다.
export const supabase = createClient(supabaseUrl, supabaseKey)