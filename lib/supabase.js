import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/*
 * Database schema — tables to create in the Supabase dashboard
 *
 * users
 *   id            uuid          primary key, references auth.users(id)
 *   username      text          not null
 *   created_at    timestamptz   default now()
 *
 *   Stores the public profile for each authenticated user. Row-level
 *   security should restrict reads to the owner only.
 *
 * progress
 *   id            uuid          primary key, default gen_random_uuid()
 *   user_id       uuid          references users(id), not null
 *   module_id     text          not null  (e.g. '1', '2', '3', 'aws-1')
 *   xp_earned     integer       not null, default 0
 *   completed_at  timestamptz   default now()
 *
 *   One row per module completion. Use this to rebuild completedModules
 *   and moduleXP on sign-in rather than syncing from AsyncStorage.
 *   RLS: users can only read/write their own rows.
 *
 * streaks
 *   id              uuid    primary key, default gen_random_uuid()
 *   user_id         uuid    references users(id), not null, unique
 *   current_streak  integer not null, default 0
 *   longest_streak  integer not null, default 0
 *   last_active     date    not null
 *
 *   One row per user. last_active drives the increment/reset logic
 *   (same logic currently in App.js). longest_streak lets us show
 *   an all-time best on a future profile screen.
 *   RLS: users can only read/write their own row.
 */
