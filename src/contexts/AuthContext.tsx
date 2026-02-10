import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { storage } from "@/lib/storage";
import { logAuthEvent } from "@/lib/platform/auth-logger";

interface DemoProfile {
  id: string;
  user_id: string;
  email: string;
  username: string;
  full_name: string;
  is_creator: boolean;
  plan: string;
  subscription_tier: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: DemoProfile | null;
  isAdmin: boolean;
  isDemoMode: boolean;
  loading: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  signOut: () => Promise<void>;
}

const DEMO_PROFILE: DemoProfile = {
  id: "42868229-15fe-46ac-8771-44d3bba82181",
  user_id: "90fd360d-88cc-46fd-85f0-c80651a40bc1",
  email: "info@supaviewtv.co.za",
  username: "destiny",
  full_name: "Destiny",
  is_creator: true,
  plan: "Studio Pro",
  subscription_tier: "studio_zenstream",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let previousUserIdRef: string | null = null;

    const enableDemo = () => {
      setIsDemoMode(true);
      setProfile(DEMO_PROFILE);
      setIsAdmin(true);
      setLoading(false);
    };

    const disableDemo = () => {
      setIsDemoMode(false);
      setProfile(null);
      setIsAdmin(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AuthContext] onAuthStateChange:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN") {
        logAuthEvent("user_login", session?.user?.id, { email: session?.user?.email });
      } else if (event === "SIGNED_OUT") {
        logAuthEvent("user_logout", previousUserIdRef);
      }

      if (session?.user) {
        previousUserIdRef = session.user.id;
        storage.setItem("supaview_demo_mode", "false");
        setIsDemoMode(false);
        setTimeout(() => {
          fetchProfile(session.user.id);
          checkAdminRole(session.user.id);
        }, 0);
        return;
      }

      const demoFlag = storage.getItem("supaview_demo_mode");
      if (demoFlag === "true") enableDemo();
      else {
        disableDemo();
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        storage.setItem("supaview_demo_mode", "false");
        setIsDemoMode(false);
        fetchProfile(session.user.id);
        checkAdminRole(session.user.id);
        return;
      }

      const demoFlag = storage.getItem("supaview_demo_mode");
      if (demoFlag === "true") enableDemo();
      else {
        disableDemo();
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // profiles table may not exist yet — gracefully handle
      const { data, error } = await supabase
        .from("profiles" as any)
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (!error && data) setProfile(data as unknown as DemoProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin role:", error);
    }
  };

  const enableDemoMode = () => {
    storage.setItem("supaview_demo_mode", "true");
    setIsDemoMode(true);
    setProfile(DEMO_PROFILE);
    setIsAdmin(true);
    setLoading(false);
  };

  const disableDemoMode = () => {
    storage.removeItem("supaview_demo_mode");
    setIsDemoMode(false);
    setProfile(null);
    setIsAdmin(false);
  };

  const signOut = async () => {
    if (isDemoMode) {
      disableDemoMode();
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, isAdmin, isDemoMode, loading, enableDemoMode, disableDemoMode, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
