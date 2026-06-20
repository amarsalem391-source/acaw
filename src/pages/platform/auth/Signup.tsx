import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { GraduationCap, User, Users, Shield, Crown } from "lucide-react";
import { dashboardPathFor } from "@/hooks/usePlatformRole";

const ROLES = [
  { id: "student", label: "طالب", desc: "تعلّم وادرس الدورات", icon: GraduationCap, needsCode: false },
  { id: "instructor", label: "مدرب", desc: "أنشئ ودرّس الدورات", icon: User, needsCode: false },
  { id: "parent", label: "ولي أمر", desc: "تابع أبناءك", icon: Users, needsCode: false },
] as const;

export default function PlatformSignup() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<typeof ROLES[number]["id"] | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [childCode, setChildCode] = useState("");
  const [studentCode] = useState(() => "STU-" + Math.floor(1000 + Math.random() * 9000));
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // Password criteria helper
  const passwordCriteria = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_+\-=\[\]]/.test(password),
  };

  const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);

  const signUpWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/platform/login`,
        }
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    if (!isPasswordStrong) {
      toast.error("يرجى التأكد من استيفاء جميع شروط كلمة المرور القوية");
      return;
    }
    setBusy(true);
    const signupEmail = `${phone.trim()}@acwad.com`;
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail, password,
        options: {
          emailRedirectTo: `${window.location.origin}/platform/login`,
          data: { 
            full_name: fullName,
            role: role,
            phone: phone.trim(),
            student_code: role === "student" ? studentCode : undefined,
            child_code: role === "parent" ? childCode : undefined,
          },
        },
      });
      if (error) throw error;
      
      toast.success("تم إنشاء الحساب بنجاح");
      if (!data.session) {
        // Since we auto-confirm on db level, session is usually generated.
        // But if email provider returns no session, redirect to login
        toast.info("جاري التوجه لصفحة تسجيل الدخول...");
        setBusy(false);
        navigate("/platform/login");
        return;
      }
      
      navigate(dashboardPathFor(role as any), { replace: true });
    } catch (e: any) {
      toast.error(e.message);
    } finally { setBusy(false); }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <AnimatedBackground />
      <Card className="relative z-10 w-full max-w-3xl p-8 bg-card/60 backdrop-blur-xl border-border/40">
        <h1 className="text-2xl font-bold mb-1">إنشاء حساب جديد</h1>
        <p className="text-sm text-muted-foreground mb-6">{step === 1 ? "اختر نوع الحساب" : "بياناتك"}</p>

        {step === 1 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = role === r.id;
                return (
                  <button key={r.id} type="button" onClick={() => setRole(r.id)}
                    className={`text-right p-4 rounded-xl border transition ${active ? "border-primary bg-primary/10" : "border-border/40 hover:border-primary/40"}`}>
                    <Icon className="w-6 h-6 text-primary mb-2" />
                    <div className="font-semibold">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </button>
                );
              })}
            </div>
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <span className="relative bg-card px-2 text-xs text-muted-foreground">أو</span>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border border-border/60 hover:bg-muted-foreground/10"
              onClick={signUpWithGoogle}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              التسجيل باستخدام Google
            </Button>

            <div className="mt-6 flex justify-between">
              <Link to="/platform/login" className="text-sm text-primary underline">لديك حساب؟</Link>
              <Button disabled={!role} onClick={() => setStep(2)}>التالي</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>الاسم الكامل</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
            </div>
            <div>
              <Label>رقم الهاتف</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="مثال: 01XXXXXXXXX" />
            </div>

            {role === "student" && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-xs space-y-1">
                <span className="font-bold text-primary">رمز الطالب الخاص بك (أعطه لولي أمرك ليربط الحساب):</span>
                <div className="font-mono font-bold text-sm bg-background/60 p-2 rounded text-center select-all border border-primary/10">
                  {studentCode}
                </div>
              </div>
            )}

            {role === "parent" && (
              <div>
                <Label>كود الابن الخاص بالطالب</Label>
                <Input value={childCode} onChange={(e) => setChildCode(e.target.value)} required placeholder="مثال: STU-XXXX" />
              </div>
            )}

            <div className="space-y-2">
              <Label>كلمة المرور</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              
              {/* Password feedback list */}
              <div className="bg-background/40 p-3 rounded-lg border border-border/20 space-y-1.5 text-xs">
                <p className="font-medium text-muted-foreground mb-1">شروط كلمة المرور القوية:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={passwordCriteria.length ? "text-green-500 font-bold" : "text-muted-foreground/60"}>
                      {passwordCriteria.length ? "✓" : "•"}
                    </span>
                    <span className={passwordCriteria.length ? "text-green-400" : "text-muted-foreground/70"}>8 أحرف على الأقل</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={passwordCriteria.hasUpper ? "text-green-500 font-bold" : "text-muted-foreground/60"}>
                      {passwordCriteria.hasUpper ? "✓" : "•"}
                    </span>
                    <span className={passwordCriteria.hasUpper ? "text-green-400" : "text-muted-foreground/70"}>حرف كبير (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={passwordCriteria.hasLower ? "text-green-500 font-bold" : "text-muted-foreground/60"}>
                      {passwordCriteria.hasLower ? "✓" : "•"}
                    </span>
                    <span className={passwordCriteria.hasLower ? "text-green-400" : "text-muted-foreground/70"}>حرف صغير (a-z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={passwordCriteria.hasNumber ? "text-green-500 font-bold" : "text-muted-foreground/60"}>
                      {passwordCriteria.hasNumber ? "✓" : "•"}
                    </span>
                    <span className={passwordCriteria.hasNumber ? "text-green-400" : "text-muted-foreground/70"}>رقم واحد على الأقل (0-9)</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2">
                    <span className={passwordCriteria.hasSpecial ? "text-green-500 font-bold" : "text-muted-foreground/60"}>
                      {passwordCriteria.hasSpecial ? "✓" : "•"}
                    </span>
                    <span className={passwordCriteria.hasSpecial ? "text-green-400" : "text-muted-foreground/70"}>رمز خاص واحد على الأقل (مثل @، $، !)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
              <Button type="submit" disabled={busy || !isPasswordStrong}>
                {busy ? "..." : "إنشاء الحساب"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
