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
  { id: "admin", label: "أدمن", desc: "إدارة المنصة", icon: Shield, needsCode: true },
  { id: "super_admin", label: "سوبر أدمن", desc: "تحكم كامل", icon: Crown, needsCode: true },
] as const;

export default function PlatformSignup() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<typeof ROLES[number]["id"] | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const needsCode = role === "admin" || role === "super_admin";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/platform/login`,
          data: { 
            full_name: fullName,
            role: role,
            role_code: code
          },
        },
      });
      if (error) throw error;
      if (!data.session) {
        toast.error("تحقق من بريدك لتأكيد الحساب ثم سجّل الدخول");
        setBusy(false);
        navigate("/platform/login");
        return;
      }
      const { data: res, error: fnErr } = await supabase.functions.invoke("assign-role", { body: { role, code } });
      if (fnErr || (res as any)?.error) {
        toast.error((res as any)?.error || fnErr?.message || "تعذر تعيين الدور");
        setBusy(false);
        return;
      }
      toast.success("تم إنشاء الحساب");
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
                    {r.needsCode && <div className="text-[10px] mt-1 text-amber-500">يحتاج رمز تفعيل</div>}
                  </button>
                );
              })}
            </div>
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
              <Label>البريد الإلكتروني</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>كلمة المرور</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            {needsCode && (
              <div>
                <Label>رمز التفعيل (للأدمن)</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} required placeholder="أدخل الرمز السري" />
                <p className="text-xs text-muted-foreground mt-1">يتم التحقق منه بشكل آمن على الخادم</p>
              </div>
            )}
            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
              <Button type="submit" disabled={busy}>{busy ? "..." : "إنشاء الحساب"}</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
