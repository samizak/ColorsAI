"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/superbase/client';

// Create a singleton instance of the Supabase client
const supabaseClient = createClient();

type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabaseClient.auth.getSession();

        if (error) {
          console.error("Error getting initial session:", error);
          return;
        }

        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (mounted) {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.user) {
            setSession(session);
            setUser(session.user);
          }
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          // Force navigation to auth page on sign out
          router.push("/auth");
        } else if (event === "INITIAL_SESSION" && session?.user) {
          // Only update if we have a valid user
          setSession(session);
          setUser(session.user);
        }
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);

      // Then sign out from Supabase
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }

      router.push("/auth");
    } catch (err) {
      console.error("Exception during sign out:", err);
      router.push("/auth");
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);
