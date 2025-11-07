import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ubkzspjdkjdlvuomlduz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3pzcGpka2pkbHZ1b21sZHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDEzMjgsImV4cCI6MjA3ODA3NzMyOH0.WijUvQtOwM3i9U7niKrUqQipK4jPBpgpLLWVAOZzg4M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
