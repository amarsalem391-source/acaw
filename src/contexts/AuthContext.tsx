import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // Admin backdoor code: set VITE_ADMIN_CODE in your .env to enable
  const ADMIN_CODE = (import.meta.env.VITE_ADMIN_CODE as string) ?? "admin1234";
  // Development admin emails that should bypass Supabase auth (dev-only)
  const ADMIN_EMAILS = [
    "acwadtechnology2026@gmail.com",
    "admin2026@gmail.com",
  ];

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // If the email is one of the admin emails, bypass Supabase (dev-only)
    if (ADMIN_EMAILS.includes(email)) {
      const adminUser = ({ id: "admin", email } as unknown) as User;
      const adminSession = ({ user: adminUser } as unknown) as Session;
      setSession(adminSession);
      setUser(adminUser);
      setLoading(false);
      return { error: null };
    }
    // If the provided password matches the admin code, bypass Supabase
    if (password === ADMIN_CODE) {
      const adminUser = ({ id: "admin", email } as unknown) as User;
      const adminSession = ({ user: adminUser } as unknown) as Session;
      setSession(adminSession);
      setUser(adminUser);
      setLoading(false);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
