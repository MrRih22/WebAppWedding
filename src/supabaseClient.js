import { createClient } from '@supabase/supabase-js'

// GANTI DENGAN URL & ANON KEY MILIK ANDA DARI SUPABASE
const supabaseUrl = 'https://snkskyrphjxqyoxcagld.supabase.co/rest/v1/'
const supabaseAnonKey = 'sb_publishable_EItKvGaI9OBQ0LTemwKB3g_LGIY1HUV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)