import { createBrowserClient } from '@supabase/ssr';

// Create a singleton instance with a more robust implementation
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

// Use a global variable to track if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export function createClient() {
  // Only create a singleton in browser environments
  if (isBrowser) {
    // If we already have a client instance, return it
    if (supabaseClient) {
      return supabaseClient;
    }
    
    // Otherwise create a new instance and store it
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    return supabaseClient;
  }
  
  // In non-browser environments, create a new client each time
  // This is safe because server-side code runs in isolation
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
