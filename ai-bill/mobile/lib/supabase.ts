import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ucdcsackovojolzwwevs.supabase.co'
const supabasePublishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZGNzYWNrb3Zvam9send3ZXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTY2OTcsImV4cCI6MjA3NDUzMjY5N30.kdQ-dhS72A8nW-wo0m88f7oa5V-Iz3eZDPwJEpsjWEY'

// 检查是否在浏览器环境中
const isBrowser = typeof window !== 'undefined'

// 动态导入AsyncStorage，只在浏览器环境中使用
let storageConfig = {}

if (isBrowser) {
  // 在浏览器环境中使用AsyncStorage
  import('@react-native-async-storage/async-storage').then(({ default: AsyncStorage }) => {
    storageConfig = {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    }
  }).catch(() => {
    // 如果导入失败，使用内存存储作为备选
    storageConfig = {
      autoRefreshToken: false,
      persistSession: false,
    }
  })
} else {
  // 在服务器端禁用持久化存储
  storageConfig = {
    autoRefreshToken: false,
    persistSession: false,
  }
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: storageConfig,
})