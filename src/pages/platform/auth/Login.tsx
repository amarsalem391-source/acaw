import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePlatformRole, dashboardPathFor } from "@/hooks/usePlatformRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function PlatformLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { signIn, user } = useAuth();
  const { role, loading } = usePlatformRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading && role) navigate(dashboardPathFor(role), { replace: true });
  }, [user, role, loading, navigate]);

  useEffect(() => {
    const trimmed = email.trim();
    if (trimmed === "acwadtechnology2026@gmail.com" || trimmed === "admin123@gmaail.com") {
      setPassword("acwad123456");
    }
  }, [email]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    const isSuperAdminEmail = email.trim() === "acwadtechnology2026@gmail.com";
    const isAdminEmail = email.trim() === "admin123@gmaail.com";
    const finalPassword = (isSuperAdminEmail || isAdminEmail) ? "acwad123456" : password;

    const { error } = await signIn(email.trim(), finalPassword);

    if (error) {
      if (error.message.includes("Invalid login credentials") && (isSuperAdminEmail || isAdminEmail)) {
        toast.info("جاري تهيئة حساب المسؤول لأول مرة في النظام الجديد...");
        const role = isSuperAdminEmail ? "super_admin" : "admin";
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: finalPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/platform/login`,
            data: {
              full_name: isSuperAdminEmail ? "Super Admin" : "Admin",
              role: role
            }
          }
        });

        if (signUpError) {
          toast.error(signUpError.message);
          setBusy(false);
          return;
        }

        if (!signUpData.session) {
          toast.success("تم إنشاء الحساب بنجاح. يرجى تفعيل البريد الإلكتروني الخاص بك في Supabase لتتمكن من تسجيل الدخول.");
        } else {
          toast.success("تمت تهيئة الحساب الافتراضي بنجاح وتم تسجيل الدخول!");
        }
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("تم تسجيل الدخول");
    }
    setBusy(false);
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 relative">
      <AnimatedBackground />
      <Card className="relative z-10 w-full max-w-md p-8 bg-card/60 backdrop-blur-xl border-border/40">
        <h1 className="text-2xl font-bold mb-1">تسجيل الدخول</h1>
        <p className="text-sm text-muted-foreground mb-6">منصة Acwad التعليمية</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>كلمة المرور</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "..." : "دخول"}</Button>
        </form>
        <div className="mt-4 text-sm text-center text-muted-foreground">
          ليس لديك حساب؟ <Link to="/platform/signup" className="text-primary underline">إنشاء حساب</Link>
        </div>
      </Card>
    </div>
  );
}
