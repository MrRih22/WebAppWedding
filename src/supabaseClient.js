import { createClient } from '@supabase/supabase-js'

// GANTI DENGAN URL & ANON KEY MILIK ANDA DARI SUPABASE
const supabaseUrl = 'https://snkskyrphjxqyoxcagld.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNua3NreXJwaGp4cXlveGNhZ2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5OTA5ODEsImV4cCI6MjEwMzU2Njk4MX0.2AdJZ7exaVAF1ndASsVPYiMcbAvKlqQNsRXrJJrMQ5o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)