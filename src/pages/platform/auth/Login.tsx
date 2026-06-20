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
  const [selectedRole, setSelectedRole] = useState<"student" | "instructor" | "parent" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [childCode, setChildCode] = useState("");
  const [busy, setBusy] = useState(false);

  const { signIn, user } = useAuth();
  const { role, loading } = usePlatformRole();
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
<<<<<<< HEAD
      const { data, error } = await supabase.auth.signInWithOAuth({
=======
      const { error } = await supabase.auth.signInWithOAuth({
>>>>>>> 2ab3519afb635d773e3f1ec3d80b06c5512f63a7
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/platform/login`,
        }
      });
      if (error) throw error;
<<<<<<< HEAD
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      toast.error(e.message || "حدث خطأ أثناء تسجيل الدخول باستخدام Google");
=======
    } catch (e: any) {
      toast.error(e.message);
>>>>>>> 2ab3519afb635d773e3f1ec3d80b06c5512f63a7
    }
  };

  useEffect(() => {
    if (user && !loading && role) navigate(dashboardPathFor(role), { replace: true });
  }, [user, role, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    let loginEmail = "";
    let loginPassword = password;

    if (selectedRole === "admin") {
      const code = adminCode.trim();
      if (code === "admin2026") {
        loginEmail = "admin2026@gmail.com";
        loginPassword = "AdminPassword2026!";
      } else if (code === "super2026") {
        loginEmail = "acwadtechnology2026@gmail.com";
        loginPassword = "SuperPassword2026!";
      } else {
        toast.error("رمز الدخول للمسؤول غير صحيح!");
        setBusy(false);
        return;
      }
    } else {
      const inputVal = email.trim();
      if (!inputVal) {
        toast.error("يرجى إدخال رقم الهاتف أو الكود الخاص بك!");
        setBusy(false);
        return;
      }

      // Check if it's a student code
      const isStudentCode = inputVal.toUpperCase().startsWith("STU-") || (selectedRole === "student" && isNaN(Number(inputVal)));

      if (isStudentCode) {
        try {
          const { data, error } = await supabase.rpc("get_profile_by_student_code", {
            p_student_code: inputVal
          });
          if (error || !data || data.length === 0) {
            toast.error("كود الطالب غير صحيح أو غير مسجل!");
            setBusy(false);
            return;
          }
          loginEmail = data[0].email;
        } catch (err) {
          toast.error("خطأ أثناء الاتصال بقاعدة البيانات!");
          setBusy(false);
          return;
        }
      } else {
        loginEmail = `${inputVal}@acwad.com`;
      }
    }

    const isSuperAdminEmail = loginEmail === "acwadtechnology2026@gmail.com";
    const isAdminEmail = loginEmail === "admin2026@gmail.com";

    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      if (error.message.includes("Invalid login credentials") && (isSuperAdminEmail || isAdminEmail)) {
        toast.info("جاري تهيئة حساب المسؤول لأول مرة في النظام الجديد...");
        const role = isSuperAdminEmail ? "super_admin" : "admin";
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: loginEmail,
          password: loginPassword,
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
      
      // If parent logs in and supplied a child code, link it on the fly
      if (selectedRole === "parent" && childCode.trim()) {
        try {
          const studentCode = childCode.trim();
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            const { data: studentProf } = await supabase
              .from("profiles")
              .select("user_id")
              .eq("student_code", studentCode)
              .maybeSingle();
            
            if (studentProf) {
              const { error: linkErr } = await supabase.from("parent_children").insert({
                parent_id: currentUser.id,
                student_id: studentProf.user_id
              });
              if (!linkErr) {
                toast.success("تم ربط كود الابن بنجاح أثناء تسجيل الدخول!");
              }
            } else {
              toast.warning("لم يتم العثور على طالب بالكود المدخل.");
            }
          }
        } catch (linkErr) {
          console.error("Error linking child code during login:", linkErr);
        }
      }
    }
    setBusy(false);
  };

  const getRoleLabel = () => {
    switch (selectedRole) {
      case "student": return "تسجيل دخول الطلاب";
      case "instructor": return "تسجيل دخول المدربين";
      case "parent": return "تسجيل دخول أولياء الأمور";
      case "admin": return "بوابة المسؤولين والإدارة";
      default: return "تسجيل الدخول";
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 relative">
      <AnimatedBackground />
      <Card className="relative z-10 w-full max-w-md p-8 bg-card/60 backdrop-blur-xl border-border/40">
        <h1 className="text-2xl font-bold mb-1">تسجيل الدخول</h1>
        <p className="text-sm text-muted-foreground mb-6">منصة Acwad التعليمية</p>
        
        {/* Role Tabs */}
        <div className="flex bg-muted/60 p-1 rounded-lg gap-1 mb-6">
          {( [
            { id: "student", label: "طالب" },
            { id: "instructor", label: "مدرب" },
            { id: "parent", label: "ولي أمر" },
            { id: "admin", label: "مسؤول" },
          ] as const).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setSelectedRole(r.id);
                setEmail("");
                setPassword("");
                setAdminCode("");
                setChildCode("");
              }}
              className={`flex-1 text-center py-1.5 px-2 rounded-md text-xs font-semibold transition ${
                selectedRole === r.id
                  ? "bg-primary text-primary-foreground shadow"
                  : "hover:bg-muted-foreground/10 text-muted-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <h2 className="text-md font-semibold text-primary mb-4 border-r-2 border-primary pr-2">
          {getRoleLabel()}
        </h2>

        <form onSubmit={submit} className="space-y-4">
          {selectedRole === "admin" ? (
            <div>
              <Label>رمز الدخول للمسؤول</Label>
              <Input type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required placeholder="أدخل رمز الدخول الخاص بالمسؤول" />
            </div>
          ) : (
            <>
              <div>
                <Label>{selectedRole === "student" ? "رقم الهاتف أو كود الطالب" : "رقم الهاتف"}</Label>
                <Input 
                  type="text" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder={selectedRole === "student" ? "مثال: 01XXXXXXXXX أو STU-XXXX" : "مثال: 01XXXXXXXXX"} 
                />
              </div>
              <div>
                <Label>كلمة المرور</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {selectedRole === "parent" && (
                <div>
                  <Label>كود الابن الخاص بالطالب (اختياري)</Label>
                  <Input type="text" value={childCode} onChange={(e) => setChildCode(e.target.value)} placeholder="مثال: STU-XXXX" />
                </div>
              )}
            </>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "..." : "دخول"}
          </Button>
        </form>

        {selectedRole !== "admin" && (
          <>
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <span className="relative bg-card px-2 text-xs text-muted-foreground">أو</span>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border border-border/60 hover:bg-muted-foreground/10"
              onClick={signInWithGoogle}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              الدخول باستخدام Google
            </Button>
          </>
        )}
        
        <div className="mt-4 text-sm text-center text-muted-foreground">
          ليس لديك حساب؟ <Link to="/platform/signup" className="text-primary underline">إنشاء حساب</Link>
        </div>
      </Card>
    </div>
  );
}
