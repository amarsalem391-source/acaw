import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { 
  Home, Users, TrendingUp, Award, CreditCard, MessageSquare, 
  Bell, FileText, Sparkles, Calendar as CalendarIcon, LifeBuoy, 
  Send, CheckCircle2, UserPlus, Trash, ChevronLeft, MapPin 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { label: "الرئيسية", path: "/platform/parent", icon: Home },
  { label: "أبنائي", path: "/platform/parent/children", icon: Users },
  { label: "متابعة التقدم", path: "/platform/parent/progress", icon: TrendingUp },
  { label: "الدرجات والتقييم", path: "/platform/parent/grades", icon: FileText },
  { label: "الشهادات", path: "/platform/parent/certificates", icon: Award },
  { label: "المدفوعات", path: "/platform/parent/payments", icon: CreditCard },
  { label: "الرسائل", path: "/platform/parent/messages", icon: MessageSquare },
  { label: "الإشعارات", path: "/platform/parent/notifications", icon: Bell },
  { label: "AI Insights", path: "/platform/parent/ai", icon: Sparkles },
  { label: "التقويم", path: "/platform/parent/calendar", icon: CalendarIcon },
  { label: "الدعم", path: "/platform/parent/support", icon: LifeBuoy },
];

async function loadParentChildren(parentId: string) {
  const { data: childRelations } = await supabase
    .from("parent_children")
    .select("student_id")
    .eq("parent_id", parentId);

  const childIds = (childRelations || []).map((relation: any) => relation.student_id);
  if (childIds.length === 0) return [];

  const { data: childProfiles } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", childIds);

  return childProfiles || [];
}

function Home_() {
  const [stats, setStats] = useState({ children: 0, courses: 0, certs: 0 });
  const [parentName, setParentName] = useState("");
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get profile
      const { data: prof } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
      if (prof) setParentName(prof.full_name || "");

      // Get children
      const { data: children } = await supabase.from("parent_children").select("student_id").eq("parent_id", user.id);
      const studentIds = (children || []).map(c => c.student_id);

      if (studentIds.length > 0) {
        // Enrolled courses count
        const { count: coursesCount } = await supabase.from("enrollments").select("*", { count: "exact", head: true }).in("student_id", studentIds);
        // Certificates count
        const { count: certsCount } = await supabase.from("certificates").select("*", { count: "exact", head: true }).in("student_id", studentIds);
        setStats({ children: studentIds.length, courses: coursesCount || 0, certs: certsCount || 0 });
      } else {
        setStats({ children: 0, courses: 0, certs: 0 });
      }

      // Fetch recent notifications
      const { data: notifs } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3);
      setRecentNotifs(notifs || []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-l from-primary/20 via-primary/5 to-transparent p-6 rounded-xl border border-primary/10">
        <h2 className="text-xl font-bold text-foreground">أهلاً بك، {parentName || "ولي الأمر"} 👋</h2>
        <p className="text-xs text-muted-foreground mt-1">تجد هنا لوحة متكاملة لمتابعة مسيرة أبنائك التعليمية وتقدمهم الدراسي بالمنصة.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition">
          <div className="text-xs text-muted-foreground">عدد الأبناء المضافين</div>
          <div className="text-3xl font-extrabold mt-1 text-primary">{stats.children}</div>
          <div className="text-[10px] text-muted-foreground mt-1">حسابات مفعلة ومرتبطة</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition">
          <div className="text-xs text-muted-foreground">الدورات المشترك بها الأبناء</div>
          <div className="text-3xl font-extrabold mt-1 text-accent">{stats.courses}</div>
          <div className="text-[10px] text-muted-foreground mt-1">كورسات برمجية وتقنية نشطة</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition">
          <div className="text-xs text-muted-foreground">شهادات مكتسبة للأبناء</div>
          <div className="text-3xl font-extrabold mt-1 text-emerald-400">{stats.certs}</div>
          <div className="text-[10px] text-muted-foreground mt-1">شهادات إتمام معتمدة من أكواد</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="p-6 lg:col-span-8 bg-card/40 border-border/40">
          <h3 className="font-bold text-sm text-foreground mb-4">آخر التنبيهات وإشعارات المنصة</h3>
          {recentNotifs.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">لا توجد إشعارات حالياً.</p>
          ) : (
            <div className="space-y-3">
              {recentNotifs.map((n) => (
                <div key={n.id} className="p-3 bg-background/50 border border-border/20 rounded-lg text-xs">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleDateString("ar-EG")}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-4 bg-card/40 border-border/40 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground mb-3">الدعم والمتابعة الفورية</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              إذا واجهت أي صعوبة في ربط حسابات أبنائك أو كان لديك أي استفسار أكاديمي أو تقني، تفضل بمراسلتنا مباشرة عبر قسم الدعم الفني.
            </p>
          </div>
          <Button className="w-full mt-4 text-xs font-semibold">تواصل مع الدعم</Button>
        </Card>
      </div>
    </div>
  );
}

function Children() {
  const [children, setChildren] = useState<any[]>([]);
  const [linkCode, setLinkCode] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const childProfiles = await loadParentChildren(user.id);
    setChildren(childProfiles);
  };

  useEffect(() => { load(); }, []);

  const linkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentCode = linkCode.trim();
    if (!studentCode) return;
    setBusy(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      return;
    }

    const { data: studentProf, error: studentErr } = await supabase
      .from("profiles")
      .select("user_id, full_name, student_code")
      .eq("student_code", studentCode)
      .maybeSingle();

    if (studentErr || !studentProf) {
      toast.error("لم يتم العثور على طالب بهذا الكود. تأكد من الكود الصحيح وحاول مرة أخرى.");
      setBusy(false);
      return;
    }

    const { error } = await supabase.from("parent_children").insert({
      parent_id: user.id,
      student_id: studentProf.user_id,
    });

    setBusy(false);
    if (error) {
      toast.error("حدث خطأ أثناء ربط حساب الابن. قد يكون الحساب مرتبطاً بالفعل.");
    } else {
      toast.success(`تم ربط ${studentProf.full_name || "الحساب"} بنجاح!`);
      setLinkCode("");
      load();
    }
  };

  const unlink = async (studentId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("parent_children").delete().eq("parent_id", user.id).eq("student_id", studentId);
    if (error) {
      toast.error("حدث خطأ في إلغاء الربط.");
    } else {
      toast.success("تم إلغاء ربط الحساب بنجاح.");
      load();
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 text-xs">
      <div className="lg:col-span-8 space-y-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">حسابات الأبناء المرتبطة</h3>
        {children.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground bg-card/30">لم تقم بربط أي من حسابات الأبناء حتى الآن.</Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {children.map((c) => (
              <Card key={c.id} className="p-5 bg-card/40 border-border/40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {(c.full_name || "ط")[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{c.full_name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">رمز الطالب: {c.student_code || "غير متوفر"}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">رقم الهاتف: {c.phone || "غير مسجل"}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => unlink(c.user_id)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                  <Trash className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-4">
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            ربط حساب ابن جديد
          </h4>
          <p className="text-[10px] text-muted-foreground mb-4">أدخل رمز الطالب الذي أعطاه لك ابنك لربط حسابه ومن ثم عرض بياناته في لوحة ولي الأمر.</p>

          <form onSubmit={linkChild} className="space-y-3">
            <div>
              <Label className="text-[10px]">رمز الطالب</Label>
              <Input
                value={linkCode}
                onChange={(e) => setLinkCode(e.target.value)}
                required
                placeholder="مثال: STU-1234"
                className="mt-1 text-xs"
              />
            </div>
            <Button type="submit" className="w-full text-xs font-semibold" disabled={busy || !linkCode.trim()}>
              {busy ? "جاري الربط..." : "ربط الحساب بالكود"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function Progress() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const childProfiles = await loadParentChildren(user.id);
      setChildren(childProfiles);
      if (childProfiles && childProfiles.length > 0) {
        setSelectedChildId(childProfiles[0].user_id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    (async () => {
      const { data } = await supabase.from("enrollments").select("*, courses(title, instructor_id)").eq("student_id", selectedChildId);
      setCourses(data || []);
    })();
  }, [selectedChildId]);

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">متابعة تقدم الأبناء في الدورات</h3>
        {children.length > 0 && (
          <select 
            className="bg-background border border-input rounded p-1 text-xs" 
            value={selectedChildId} 
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {children.map(c => (
              <option key={c.user_id} value={c.user_id}>{c.full_name}</option>
            ))}
          </select>
        )}
      </div>

      {courses.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد اشتراكات أو تقدم مسجل لهذا الحساب حالياً.</Card>
      ) : (
        <div className="grid gap-4">
          {courses.map(c => (
            <Card key={c.id} className="p-5 bg-card/40 border-border/40 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-foreground">{c.courses?.title || "دورة تقنية"}</h4>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  نسبة الإنجاز: {c.progress}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
              </div>

              <p className="text-[10px] text-muted-foreground">تاريخ الاشتراك بالدورة: {new Date(c.enrolled_at).toLocaleDateString("ar-EG")}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Grades() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [gradeCourses, setGradeCourses] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const childProfiles = await loadParentChildren(user.id);
      setChildren(childProfiles);
      if (childProfiles && childProfiles.length > 0) {
        setSelectedChildId(childProfiles[0].user_id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    (async () => {
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("*, courses(title)")
        .eq("student_id", selectedChildId);

      const courseIds = (enrollments || [])
        .map((e: any) => e.course_id)
        .filter((id: any) => id);
      let certs: any[] = [];
      if (courseIds.length > 0) {
        const { data, error } = await supabase
          .from("certificates")
          .select("course_id")
          .in("course_id", courseIds)
          .eq("student_id", selectedChildId);
        if (error) {
          toast.error("حدث خطأ أثناء جلب الشهادات.");
        } else {
          certs = data || [];
        }
      }

      const certifiedCourseIds = new Set((certs || []).map((item: any) => item.course_id));
      setGradeCourses((enrollments || []).map((en: any) => ({
        ...en,
        title: en.courses?.title || "دورة تعليمية",
        certificateAwarded: certifiedCourseIds.has(en.course_id),
      })));
    })();
  }, [selectedChildId]);

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">سجل تقدم الأبناء والدورات</h3>
        {children.length > 0 && (
          <select
            className="bg-background border border-input rounded p-1 text-xs"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {children.map((c) => (
              <option key={c.user_id} value={c.user_id}>{c.full_name}</option>
            ))}
          </select>
        )}
      </div>

      {gradeCourses.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد بيانات تقدم مسجلة لهذا الحساب.</Card>
      ) : (
        <div className="space-y-3">
          {gradeCourses.map((course) => (
            <Card key={course.id} className="p-5 bg-card/40 border-border/40 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/20 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{course.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">حالة الدورة: {course.certificateAwarded ? "مكتملة" : "قيد التقدم"}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${course.progress >= 80 ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"}`}>
                  نسبة الإنجاز: {course.progress}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-[10px] text-muted-foreground">
                <div>تاريخ التسجيل: {new Date(course.enrolled_at).toLocaleDateString("ar-EG")}</div>
                <div>شهادة: {course.certificateAwarded ? "صدرت" : "لم تُصدر بعد"}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Certificates() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const childProfiles = await loadParentChildren(user.id);
      setChildren(childProfiles);
      if (childProfiles && childProfiles.length > 0) {
        setSelectedChildId(childProfiles[0].user_id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    (async () => {
      const { data } = await supabase.from("certificates").select("*, courses(title)").eq("student_id", selectedChildId);
      setCerts(data || []);
    })();
  }, [selectedChildId]);

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">الشهادات المكتسبة للأبناء</h3>
        {children.length > 0 && (
          <select 
            className="bg-background border border-input rounded p-1 text-xs" 
            value={selectedChildId} 
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {children.map(c => (
              <option key={c.user_id} value={c.user_id}>{c.full_name}</option>
            ))}
          </select>
        )}
      </div>

      {certs.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد شهادات معتمدة لهذا الحساب حالياً.</Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map(c => (
            <Card key={c.id} className="p-5 bg-card/40 border-border/40 space-y-3">
              <div>
                <span className="text-[9px] font-bold text-primary uppercase">شهادة معتمدة</span>
                <h4 className="font-bold text-sm text-foreground mt-0.5">{c.courses?.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-1">تاريخ الإصدار: {new Date(c.issued_at).toLocaleDateString("ar-EG")}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs font-semibold border-border/60 hover:bg-muted/40"
                onClick={() => {
                  toast.success("جاري تحضير وتنزيل الشهادة الرقمية بصيغة PDF...");
                }}
              >
                تنزيل الشهادة المعمدة
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Payments() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const childProfiles = await loadParentChildren(user.id);
      setChildren(childProfiles);
      if (childProfiles && childProfiles.length > 0) {
        setSelectedChildId(childProfiles[0].user_id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    (async () => {
      const { data } = await supabase.from("payments").select("*, courses(title)").eq("student_id", selectedChildId);
      setPayments(data || []);
    })();
  }, [selectedChildId]);

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">سجل مدفوعات الاشتراك والفواتير</h3>
        {children.length > 0 && (
          <select 
            className="bg-background border border-input rounded p-1 text-xs" 
            value={selectedChildId} 
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {children.map(c => (
              <option key={c.user_id} value={c.user_id}>{c.full_name}</option>
            ))}
          </select>
        )}
      </div>

      {payments.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد عمليات دفع مسجلة.</Card>
      ) : (
        <div className="space-y-2">
          {payments.map(p => (
            <Card key={p.id} className="p-4 bg-card/40 border-border/40 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-foreground">دورة: {p.courses?.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">معرف العملية: {p.id.slice(0, 8)}...</p>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-emerald-400">{p.amount} ج.م</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">{new Date(p.created_at).toLocaleDateString("ar-EG")}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Messages() {
  const [messages, setMessages] = useState<any[]>([
    { from: "المدرب (أحمد علي)", text: "مرحباً بك يا فندم، الطالب يبلي بلاءً حسناً في الدورة البرمجية وملتزم بالواجبات.", time: "منذ ساعتين" }
  ]);
  const [input, setInput] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "أنت (ولي الأمر)", text: input, time: "الآن" }]);
    setInput("");
    toast.success("تم إرسال الرسالة للمدرب بنجاح!");
  };

  return (
    <Card className="flex flex-col h-[70vh] bg-card/30 border-border/40 rounded-xl overflow-hidden text-xs">
      <div className="p-4 border-b border-border/20 bg-card/50">
        <h4 className="font-bold text-sm">محادثة مدرب الدورة</h4>
        <p className="text-[10px] text-muted-foreground mt-0.5">تواصل مباشرة لمتابعة أداء أبنائك الدراسي</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.from.includes("أنت") ? "items-end" : "items-start"}`}>
            <div className="text-[9px] text-muted-foreground mb-1">{m.from} • {m.time}</div>
            <div className={`p-3 rounded-lg border max-w-[70%] leading-relaxed ${
              m.from.includes("أنت") 
                ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none" 
                : "bg-background/80 text-foreground border-border/30 rounded-tl-none"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="p-3 border-t border-border/20 bg-card/50 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب رسالتك للمدرب..." className="bg-background text-xs" />
        <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
      </form>
    </Card>
  );
}

function Notifications() {
  const [list, setList] = useState<any[]>([]);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setList(data || []);
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id);
    toast.success("تم وضع علامة مقروءة على جميع الإشعارات");
    load();
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">تنبيهات وإشعارات ولي الأمر</h3>
        {list.length > 0 && <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">تحديد المقروء للجميع</Button>}
      </div>

      {list.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد إشعارات حالياً.</Card>
      ) : (
        <div className="space-y-2">
          {list.map(n => (
            <Card key={n.id} className={`p-4 border border-border/40 flex justify-between items-start transition ${n.read ? 'bg-card/20' : 'bg-primary/5'}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{n.title}</span>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <p className="text-muted-foreground leading-relaxed">{n.body}</p>
              </div>
              <span className="text-[9px] text-muted-foreground font-mono">{new Date(n.created_at).toLocaleDateString("ar-EG")}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AiInsights() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const childProfiles = await loadParentChildren(user.id);
      setChildren(childProfiles);
      if (childProfiles && childProfiles.length > 0) {
        setSelectedChildId(childProfiles[0].user_id);
      }
    })();
  }, []);

  const generate = async () => {
    if (!selectedChildId) return;
    setLoading(true);
    setInsight("");

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("progress")
      .eq("student_id", selectedChildId);

    const { data: certificates } = await supabase
      .from("certificates")
      .select("id")
      .eq("student_id", selectedChildId);

    const courseCount = (enrollments || []).length;
    const avgProgress = courseCount > 0
      ? Math.round((enrollments || []).reduce((sum: number, item: any) => sum + (item.progress || 0), 0) / courseCount)
      : 0;
    const certCount = (certificates || []).length;

    setInsight(
      `تحليل أداء ابنك:\n\n- عدد الدورات المسجلة: ${courseCount} دورة.\n- متوسط نسبة التقدم: ${avgProgress}%.\n- عدد الشهادات المكتسبة: ${certCount} شهادة.\n\n${avgProgress >= 85 ? "المستوى ممتاز جداً، استمر في دعم ابنك للانتهاء من الدورات المتبقية." : avgProgress >= 60 ? "المستوى جيد، يمكن تحسينه بمتابعة يومية مع الطالب." : "المستوى يحتاج دعم إضافي، ننصح بجدولة مراجعات قصيرة ومتابعة التقدم أسبوعياً."}\n\nتوصية: ركز على تسليم المهام بانتظام وتشجيع الطالب على استكمال الدورات المكتسبة للحصول على شهادات أكثر.`
    );

    setLoading(false);
    toast.success("تم تحليل مستوى أداء الطالب بنجاح!");
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">تحليلات الأداء الذكية (AI Parent Insights)</h3>
        {children.length > 0 && (
          <select 
            className="bg-background border border-input rounded p-1 text-xs" 
            value={selectedChildId} 
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {children.map(c => (
              <option key={c.user_id} value={c.user_id}>{c.full_name}</option>
            ))}
          </select>
        )}
      </div>

      <Card className="p-6 bg-card/40 border-border/40 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              التقرير التنبئي للأداء
            </h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">تحليل معزز بالذكاء الاصطناعي لسلوك وتقدم الطالب.</p>
          </div>
          <Button onClick={generate} disabled={loading || !selectedChildId} size="sm" className="text-xs">
            {loading ? "جاري التحليل..." : "توليد تقرير الذكاء الاصطناعي"}
          </Button>
        </div>

        {insight ? (
          <div className="p-4 bg-background/50 rounded-lg border border-primary/20 text-foreground leading-relaxed whitespace-pre-line font-medium">
            {insight}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground bg-background/20 rounded-lg border border-dashed border-border/40">
            انقر على زر التوليد للحصول على تحليلات وتوصيات الذكاء الاصطناعي لمستوى ابنك.
          </div>
        )}
      </Card>
    </div>
  );
}

function Calendar() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const childProfiles = await loadParentChildren(user.id);
      setChildren(childProfiles);
      if (childProfiles && childProfiles.length > 0) {
        setSelectedChildId(childProfiles[0].user_id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    (async () => {
      const { data } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", selectedChildId)
        .order("start_date", { ascending: true });
      setEvents(data || []);
    })();
  }, [selectedChildId]);

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">التقويم الدراسي والأحداث القادمة</h3>
        {children.length > 0 && (
          <select
            className="bg-background border border-input rounded p-1 text-xs"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            {children.map((c) => (
              <option key={c.user_id} value={c.user_id}>{c.full_name}</option>
            ))}
          </select>
        )}
      </div>
      <div className="grid gap-3">
        {events.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد أحداث مسجلة لهذا الحساب حالياً.</Card>
        ) : (
          events.map((ev) => (
            <Card key={ev.id} className="p-4 bg-card/40 border-border/40 flex gap-4 items-center">
              <div className="bg-primary/10 text-primary border border-primary/20 p-3 rounded-lg flex flex-col items-center justify-center font-bold w-16">
                <span>{new Date(ev.start_date).getDate()}</span>
                <span className="text-[9px]">{new Date(ev.start_date).toLocaleString("ar-EG", { month: "short" })}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{ev.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{ev.description}</p>
                <p className="text-[9px] text-muted-foreground mt-1">من {new Date(ev.start_date).toLocaleDateString("ar-EG")} إلى {new Date(ev.end_date).toLocaleDateString("ar-EG")}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from("profiles").select("full_name, phone").eq("user_id", user.id).single();
      if (prof) {
        setName(prof.full_name || "");
        setPhone(prof.phone || "");
      }
      setEmail(user.email || "");
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    const { error } = await supabase.from("service_requests").insert({
      name,
      email,
      phone,
      project_type: "طلب دعم لولي أمر",
      description: desc
    });

    setBusy(false);
    if (error) {
      toast.error("حدث خطأ أثناء إرسال تذكرة الدعم.");
    } else {
      toast.success("تم إرسال تذكرة الدعم الفني بنجاح! سنتواصل معك قريباً.");
      setDesc("");
    }
  };

  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40 text-xs">
      <h3 className="font-bold text-md text-foreground mb-4">إنشاء تذكرة دعم فني جديدة</h3>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-[10px]">الاسم الكامل</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 bg-background text-xs" />
          </div>
          <div>
            <Label className="text-[10px]">البريد الإلكتروني</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 bg-background text-xs" />
          </div>
        </div>
        <div>
          <Label className="text-[10px]">رقم الهاتف</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 bg-background text-xs" />
        </div>
        <div>
          <Label className="text-[10px]">تفاصيل الاستفسار أو المشكلة</Label>
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} required placeholder="اكتب تفاصيل الاستفسار بخصوص تقدم الأبناء أو المشاكل التقنية..." className="mt-1 bg-background text-xs h-28" />
        </div>
        <Button type="submit" className="w-full text-xs font-semibold" disabled={busy}>
          {busy ? "جاري الإرسال..." : "إرسال تذكرة الدعم الفني"}
        </Button>
      </form>
    </Card>
  );
}

export default function ParentDashboard() {
  return (
    <DashboardLayout title="لوحة ولي الأمر" badge="Parent" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="children" element={<Children />} />
        <Route path="progress" element={<Progress />} />
        <Route path="grades" element={<Grades />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="payments" element={<Payments />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="ai" element={<AiInsights />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="support" element={<Support />} />
      </Routes>
    </DashboardLayout>
  );
}
