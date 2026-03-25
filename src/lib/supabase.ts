import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qmcqqikyrwxwlzdwbxwv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rPfpgqFiym13_G5o4huyDA_KGYt6DDa';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
