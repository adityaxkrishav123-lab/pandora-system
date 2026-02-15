import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbpitqvzsbogtvgsxdaz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icGl0cXZ6c2JvZ3R2Z3N4ZGF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTMxMzUsImV4cCI6MjA4NjYyOTEzNX0.OeHa4T7lE1YimE3LuAwlU2pa_FoQlr_Aqce8FaoNmMI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This forces the app to use the live URL for all auth flows
    redirectTo: window.location.origin, 
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
