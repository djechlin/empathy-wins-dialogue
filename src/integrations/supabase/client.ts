// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = 'https://qgwoqglzskblebqxlwgo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnd29xZ2x6c2tibGVicXhsd2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODQzNDIsImV4cCI6MjA2MjA2MDM0Mn0.QvIzTYEsUH51Lr97ngQOdftND1j9OabWRWYVaamwToQ';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
