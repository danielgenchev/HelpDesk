import { createClient } from '@supabase/supabase-js'

// Тук ще сложиш твоите данни от Supabase
const supabaseUrl = 'https://oswsuzebufxkvdzzhddf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zd3N1emVidWZ4a3ZkenpoZGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzUzNjUsImV4cCI6MjA4NTc1MTM2NX0.UeMavSWjfy2WHAwJ7DtkeoTsiteH2-fBBurZfFKMP58'

export const supabase = createClient(supabaseUrl, supabaseKey)