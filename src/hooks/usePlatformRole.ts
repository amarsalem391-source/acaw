import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PlatformRole = "student" | "instructor" | "parent" | "admin" | "super_admin" | null;

export function usePlatformRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<PlatformRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (authLoading) return;

    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    (async () => {
      // 1) Get role from DB
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (!active) return;

      const roles = (data || []).map((r: any) => String(r.role).toLowerCase());
      const priority = ["super_admin", "admin", "instructor", "parent", "student"] as const;

      let found = priority.find((p) => roles.includes(p)) as PlatformRole | undefined;

      // 2) Optional auto-assign from metadata (if role not found)
      if (!found && user.user_metadata?.role) {
        try {
          const requestedRole = String(user.user_metadata.role).toLowerCase();
          const requestedCode = String(user.user_metadata.role_code || "");

          const { data: res } = await supabase.functions.invoke("assign-role", {
            body: {
              role: requestedRole,
              code: requestedCode,
            },
          });

          if (res && !(res as any).error) {
            found = requestedRole as PlatformRole;
          }
        } catch (err) {
          console.error("Error auto-assigning role:", err);
        }
      }

      setRole(found ?? null);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return { role, loading: loading || authLoading };
}

export function dashboardPathFor(role: PlatformRole): string {
  switch (role) {
    case "super_admin":
      return "/platform/super-admin";
    case "admin":
      return "/platform/super-admin"; // admins should live under super-admin
    case "instructor":
      return "/platform/instructor";
    case "parent":
      return "/platform/parent";
    case "student":
      return "/platform/student";
    default:
      return "/platform/login";
  }
}

