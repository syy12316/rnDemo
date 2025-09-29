import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ucdcsackovojolzwwevs.supabase.co'
const supabasePublishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZGNzYWNrb3Zvam9send3ZXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NTY2OTcsImV4cCI6MjA3NDUzMjY5N30.kdQ-dhS72A8nW-wo0m88f7oa5V-Iz3eZDPwJEpsjWEY'
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})