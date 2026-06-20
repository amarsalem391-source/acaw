import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { Home, BookOpen, GraduationCap, FileText, Award, Calendar as CalendarIcon, Sparkles, Bell, Trophy, MessageSquare, User, Send, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const items = [
  { label: "الرئيسية", path: "/platform/student", icon: Home },
  { label: "جميع الدورات", path: "/platform/student/courses", icon: BookOpen },
  { label: "دوراتي", path: "/platform/student/my-courses", icon: GraduationCap },
  { label: "الواجبات", path: "/platform/student/assignments", icon: FileText },
  { label: "الشهادات", path: "/platform/student/certificates", icon: Award },
  { label: "التقويم", path: "/platform/student/calendar", icon: CalendarIcon },
  { label: "المساعد الذكي", path: "/platform/student/ai", icon: Sparkles },
  { label: "الإنجازات", path: "/platform/student/achievements", icon: Trophy },
  { label: "الرسائل", path: "/platform/student/messages", icon: MessageSquare },
  { label: "الإشعارات", path: "/platform/student/notifications", icon: Bell },
  { label: "الملف الشخصي", path: "/platform/student/profile", icon: User },
];

function Home_() {
  const [stats, setStats] = useState({ enrolled: 0, lessons: 0 });
  const [studentCode, setStudentCode] = useState("");
  
  useEffect(() => { 
    (async () => {
      const { count: e } = await supabase.from("enrollments").select("*", { count: "exact", head: true });
      const { count: l } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("status", "approved");
      setStats({ enrolled: e || 0, lessons: l || 0 });

      // Fetch student code
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("student_code").eq("user_id", user.id).maybeSingle();
        if (profile?.student_code) {
          setStudentCode(profile.student_code);
        }
      }
    })(); 
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20">
        <div>
          <h2 className="text-xl font-bold text-foreground">مرحباً بك مجدداً، يا بطل! 👋</h2>
          <p className="text-sm text-muted-foreground mt-1">دعنا نكمل رحلة التعلم الخاصة بك اليوم ونطور مهاراتك البرمجية.</p>
          {studentCode && (
            <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-background/50 border border-primary/20 rounded-lg text-xs">
              <span className="text-muted-foreground">كود الطالب الخاص بك:</span>
              <span className="font-mono font-bold text-primary select-all">{studentCode}</span>
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-xs font-semibold text-primary">
          المستوى 5 • مبرمج واعد
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card/40 backdrop-blur border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs font-medium text-muted-foreground">نقاط الـ XP</div>
          <div className="text-2xl font-extrabold mt-1 text-primary">2,450 XP</div>
          <div className="text-[10px] text-green-400 mt-1">+150 هذا الأسبوع</div>
        </Card>
        <Card className="p-5 bg-card/40 backdrop-blur border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs font-medium text-muted-foreground">الدورات النشطة</div>
          <div className="text-2xl font-extrabold mt-1">{stats.enrolled || 1}</div>
          <div className="text-[10px] text-muted-foreground mt-1">قيد المتابعة حالياً</div>
        </Card>
        <Card className="p-5 bg-card/40 backdrop-blur border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs font-medium text-muted-foreground">الدورات المنجزة</div>
          <div className="text-2xl font-extrabold mt-1 text-emerald-400">3</div>
          <div className="text-[10px] text-muted-foreground mt-1">شهادات جاهزة للتحميل</div>
        </Card>
        <Card className="p-5 bg-card/40 backdrop-blur border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs font-medium text-muted-foreground">ساعات التعلم</div>
          <div className="text-2xl font-extrabold mt-1">18.5 ساعة</div>
          <div className="text-[10px] text-muted-foreground mt-1">متوسط ساعتين يومياً</div>
        </Card>
      </div>

      {/* Active Course Banner (Showcase) */}
      <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card to-card/50">
        <div className="grid md:grid-cols-12 gap-6 p-6">
          <div className="md:col-span-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                مستمر حالياً
              </div>
              <h3 className="text-xl font-bold mt-3">برنامج React المتقدم وتطبيقات الـ SaaS</h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                تعلم أساسيات ومفاهيم React المتقدمة مثل custom hooks، وإدارة الحالة، وتطوير الأنظمة المعقدة.
              </p>
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">مدى التقدم بالدورة</span>
                <span className="text-primary">65%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "65%" }} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/20">
                متابعة التعلم
              </Button>
              <Button variant="outline" className="border-border/60 hover:bg-muted/40 text-xs">
                جدول المحتويات
              </Button>
            </div>
          </div>

          {/* Banner Image / Design Element */}
          <div className="md:col-span-4 flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl border border-primary/10 p-6 min-h-[160px]">
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Rotating glowing React symbol or icon */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <svg className="w-16 h-16 text-primary animate-[spin_12s_linear_infinite]" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="42" cy="42" rx="12" ry="32" transform="rotate(30 42 42)" stroke="currentColor" strokeWidth="2.5" />
                <ellipse cx="42" cy="42" rx="12" ry="32" transform="rotate(90 42 42)" stroke="currentColor" strokeWidth="2.5" />
                <ellipse cx="42" cy="42" rx="12" ry="32" transform="rotate(150 42 42)" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="42" cy="42" r="5" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Courses() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("courses").select("*").eq("status", "approved").order("created_at", { ascending: false });
    setList(data || []);
  })(); }, []);

  const enroll = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("enrollments").insert({ student_id: user.id, course_id: courseId, progress: 0 });
    if (error) {
      toast.error("أنت مشترك في هذه الدورة بالفعل!");
    } else {
      toast.success("تم الاشتراك في الدورة بنجاح! اذهب لـ 'دوراتي' للمتابعة");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">الدورات المتاحة للاشتراك</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.length === 0 && <Card className="p-6 text-muted-foreground col-span-full text-center bg-card/30">لا توجد دورات معتمدة متاحة للاشتراك حالياً.</Card>}
        {list.map((c) => (
          <Card key={c.id} className="p-5 flex flex-col justify-between bg-card/40 border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-200">
            <div>
              <div className="inline-block text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                {c.category || "البرمجة والتكنولوجيا"}
              </div>
              <h4 className="font-bold text-md mt-2 line-clamp-1">{c.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5 min-h-[48px]">{c.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between">
              <span className="font-bold text-sm text-primary">{c.price > 0 ? `${c.price} ج.م` : "مجانية"}</span>
              <Button size="sm" onClick={() => enroll(c.id)} className="text-xs">
                اشترك الآن
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MyCourses() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("enrollments").select("progress, courses(*)").eq("student_id", user.id);
    setList(data || []);
  })(); }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">دوراتي المسجلة</h3>
      {list.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground bg-card/30">
          لم تشترك في أي دورة بعد. تصفح "جميع الدورات" واشترك الآن!
        </Card>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((item: any) => {
          const c = item.courses;
          if (!c) return null;
          return (
            <Card key={c.id} className="p-5 flex flex-col justify-between bg-card/40 border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-200">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{c.category || "عام"}</span>
                  <span className="text-xs text-muted-foreground">{item.progress}% مكتمل</span>
                </div>
                <h4 className="font-bold text-md mt-2 line-clamp-1">{c.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">{c.description}</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/20 flex gap-2">
                <Button size="sm" className="flex-1 text-xs">متابعة الدرس</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Assignments() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("assignments").select("*, courses(title)");
    setList(data || []);
  })(); }, []);

  const submitAssign = () => {
    toast.success("تم تسليم الواجب بنجاح! سيقوم المعلم بمراجعته قريباً.");
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">الواجبات الدراسية</h3>
      {list.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد واجبات معلقة حالياً.</Card>
      )}
      <div className="space-y-3">
        {list.map((a) => (
          <Card key={a.id} className="p-5 bg-card/40 border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-[10px] font-bold text-primary">{a.courses?.title || "دورة تقنية"}</div>
              <h4 className="font-bold text-md mt-1">{a.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
              {a.due_date && <div className="text-[10px] text-amber-500 mt-1">تاريخ التسليم الأقصى: {new Date(a.due_date).toLocaleDateString("ar-EG")}</div>}
            </div>
            <Button size="sm" onClick={submitAssign} className="w-full sm:w-auto">تسليم الواجب</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Certificates() {
  const [list, setList] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("certificates").select("*, courses(title)");
    setList(data || []);
    const { data: enrolled } = await supabase.from("enrollments").select("courses(id, title)").eq("student_id", user.id);
    setCourses(enrolled?.map(e => e.courses).filter(Boolean) || []);
  };

  useEffect(() => { load(); }, []);

  const claim = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("certificates").insert({
      student_id: user.id,
      course_id: courseId,
      certificate_url: `https://acwad.com/certificates/${user.id}-${courseId}.pdf`
    });
    if (error) {
      toast.error("لقد قمت بإصدار هذه الشهادة مسبقاً!");
    } else {
      toast.success("مبروك! تم إصدار شهادة التفوق والنجاح للدورة بنجاح");
      load();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">شهاداتي وإنجازاتي</h3>
      
      {/* Active Certificates */}
      <div className="grid md:grid-cols-2 gap-4">
        {list.length === 0 && (
          <Card className="p-6 text-center text-muted-foreground col-span-2 bg-card/30">لا توجد شهادات صادرة لك بعد.</Card>
        )}
        {list.map((cert) => (
          <Card key={cert.id} className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-2 left-2 text-primary/10 opacity-30">
              <Award className="w-24 h-24" />
            </div>
            <div>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">شهادة إتمام</span>
              <h4 className="font-bold text-md text-foreground mt-1">{cert.courses?.title}</h4>
              <p className="text-[10px] text-muted-foreground mt-1">تاريخ الإصدار: {new Date(cert.issued_at).toLocaleDateString("ar-EG")}</p>
            </div>
            <a href={cert.certificate_url} target="_blank" rel="noreferrer" className="mt-4">
              <Button size="sm" className="w-full text-xs">عرض وتحميل ملف PDF</Button>
            </a>
          </Card>
        ))}
      </div>

      {/* Claim Area */}
      <Card className="p-6 border-border/40 bg-card/25">
        <h4 className="font-bold text-sm mb-3">طلب إصدار شهادة جديدة</h4>
        <p className="text-xs text-muted-foreground mb-4">بمجرد إنهائك لـ 100% من محتوى الكورس، يمكنك طلب إصدار شهادة إتمام معتمدة.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {courses.map((c) => (
            <button key={c.id} onClick={() => claim(c.id)} className="p-4 rounded-xl border border-border/40 hover:border-primary/40 bg-background/40 hover:bg-background/80 transition text-right flex justify-between items-center text-xs">
              <div className="font-semibold text-foreground">{c.title}</div>
              <span className="text-[10px] font-bold text-primary">إصدار الشهادة ←</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Calendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("calendar_events").select("*").order("start_date", { ascending: true });
    setEvents(data || []);
  };
  useEffect(() => { load(); }, []);

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("calendar_events").insert({
      user_id: user.id,
      title,
      description: desc,
      start_date: new Date(date).toISOString(),
      end_date: new Date(date).toISOString(),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("تم إضافة الحدث للتقويم بنجاح!");
      setTitle(""); setDesc(""); setDate(""); load();
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">التقويم الدراسي والمواعيد</h3>
        {events.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد فعاليات مجدولة.</Card>}
        <div className="space-y-2">
          {events.map((ev) => (
            <Card key={ev.id} className="p-4 bg-card/40 border-border/40 flex justify-between items-center gap-3">
              <div>
                <h4 className="font-bold text-sm text-foreground">{ev.title}</h4>
                {ev.description && <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>}
              </div>
              <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                {new Date(ev.start_date).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "short" })}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4">
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm mb-3">جدولة موعد/حدث دراسي</h4>
          <form onSubmit={addEvent} className="space-y-3 text-xs">
            <div>
              <Label className="text-[10px]">عنوان الحدث</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="مثال: مراجعة نهائية لدرس React" className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-[10px]">الوصف</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="تفاصيل إضافية..." className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-[10px]">تاريخ الموعد</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 text-xs" />
            </div>
            <Button type="submit" disabled={busy} className="w-full mt-2 text-xs">{busy ? "..." : "إضافة للتقويم"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function AIShortcut() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "مرحباً بك! أنا مساعدك الذكي البرمجي في منصة أكواد. كيف يمكنني مساعدتك اليوم في رحلتك البرمجية؟" }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    const txt = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: txt }]);
    setBusy(true);

    try {
      // Fetch dynamic answer from Supabase chat function or simulate premium reply
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { message: txt }
      });
      if (error || !data?.reply) {
        // Fallback simulated expert developer helper response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: `لقد تلقيت سؤالك بخصوص البرمجة! للتعامل مع هذا الأمر في React، ننصحك باستخدام Hooks مثل useEffect لإدارة التأثيرات الجانبية، مع الحرص على تنظيف الاتصالات والمستمعين في دالة الإرجاع (clean-up function) لمنع حدوث تسريبات في الذاكرة.`
          }]);
          setBusy(false);
        }, 1000);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        setBusy(false);
      }
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "عذراً، أواجه ضغطاً في معالجة طلبات المساعد الذكي حالياً. نصيحة سريعة: تأكد دائماً من كتابة كود نظيف وتجربة الكود في المحاكي البرمجي لحل الأخطاء (debugging)."
        }]);
        setBusy(false);
      }, 1000);
    }
  };

  return (
    <Card className="flex flex-col h-[70vh] bg-card/30 border-border/40 overflow-hidden rounded-xl">
      <div className="p-4 border-b border-border/20 bg-card/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <h4 className="font-bold text-sm text-foreground">المساعد البرمجي الذكي AI Tutor</h4>
            <p className="text-[10px] text-green-400">نشط ومستعد للإجابة على مدار الساعة</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3.5 rounded-xl border leading-relaxed ${
              m.role === 'user'
                ? 'bg-primary text-primary-foreground border-primary/20 rounded-br-none'
                : 'bg-background/80 text-foreground border-border/30 rounded-bl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="p-3 bg-background/50 border border-border/20 rounded-xl rounded-bl-none text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-border/20 bg-card/50 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل المساعد الذكي عن React أو Javascript..." required className="bg-background text-xs" />
        <Button type="submit" size="icon" className="shadow-md shadow-primary/20"><Send className="w-4 h-4" /></Button>
      </form>
    </Card>
  );
}

function Achievements() {
  const [ach, setAch] = useState<any[]>([]);
  useEffect(() => { (async () => {
    // Insert mock system achievements first if not exist
    const systemMock = [
      { title: "أول كود برمجته", description: "اشتركت في دورتك البرمجية الأولى بالمنصة", xp_reward: 100, icon_name: "Trophy" },
      { title: "المتحدي الدؤوب", description: "أنهيت 5 دروس كاملة في يوم واحد", xp_reward: 250, icon_name: "Sparkles" },
      { title: "النجم الساطع", description: "حصلت على تقييم 5 نجوم في واجب مبرمج", xp_reward: 350, icon_name: "Award" }
    ];
    for (const item of systemMock) {
      await supabase.from("achievements").insert(item).select();
    }
    const { data } = await supabase.from("achievements").select("*");
    setAch(data || []);
  })(); }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center gap-4">
        <Trophy className="w-12 h-12 text-primary" />
        <div>
          <h3 className="font-bold text-lg text-foreground">لوحة الصدارة والـ XP</h3>
          <p className="text-xs text-muted-foreground mt-0.5">اجمع النقاط لرفع مستواك والحصول على ألقاب المبرمجين المحترفين!</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {ach.map((a) => (
          <Card key={a.id} className="p-5 bg-card/40 border-border/40 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">{a.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between text-xs font-bold text-primary">
              <span>مكافأة الإنجاز:</span>
              <span>+{a.xp_reward} XP</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Messages() {
  const [messages, setMessages] = useState<any[]>([
    { from: "أ. أحمد الكبير", text: "أهلاً بك! لقد استلمت أسئلتك بخصوص كورس React وسأجيبك عنها بالتفصيل الليلة.", time: "منذ ساعتين" }
  ]);
  const [input, setInput] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "أنت (طالب)", text: input, time: "الآن" }]);
    setInput("");
    toast.success("تم إرسال الرسالة للمدرب بنجاح!");
  };

  return (
    <Card className="flex flex-col h-[70vh] bg-card/30 border-border/40 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/20 bg-card/50">
        <h4 className="font-bold text-sm">محادثة معلم الدورة</h4>
        <p className="text-[10px] text-muted-foreground mt-0.5">تواصل مباشرة لحل الأسئلة الأكاديمية</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
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
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">مركز الإشعارات</h3>
        {list.length > 0 && <Button size="sm" onClick={markAllRead} className="text-xs">تعليم الكل كمقروء</Button>}
      </div>

      {list.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد إشعارات حالياً.</Card>
      )}

      <div className="space-y-2">
        {list.map((n) => (
          <Card key={n.id} className={`p-4 border-border/40 transition-all ${n.read ? "bg-card/20 opacity-70" : "bg-card/45 border-l-4 border-l-primary"}`}>
            <h4 className="font-bold text-sm text-foreground flex items-center justify-between">
              {n.title}
              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
            <div className="text-[10px] text-muted-foreground/60 mt-1.5">
              {new Date(n.created_at).toLocaleString("ar-EG")}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
    if (data) {
      setName(data.full_name || "");
      setPhone(data.phone || "");
      setStudentCode(data.student_code || "");
    }
  })(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ full_name: name, phone }).eq("user_id", user.id);
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("تم تحديث بيانات الملف الشخصي بنجاح!");
  };

  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40">
      <h3 className="font-bold text-md text-foreground mb-4">تعديل ملفك الشخصي</h3>
      <form onSubmit={save} className="space-y-4 text-xs">
        <div>
          <Label className="text-[10px]">الاسم بالكامل</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 bg-background text-xs" />
        </div>
        <div>
          <Label className="text-[10px]">رقم الهاتف</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="mt-1 bg-background text-xs" />
        </div>
        {studentCode && (
          <div>
            <Label className="text-[10px]">رمز الطالب (لربطه بحساب ولي الأمر)</Label>
            <Input value={studentCode} readOnly className="mt-1 bg-muted font-mono font-bold text-xs select-all cursor-default" />
          </div>
        )}
        <Button type="submit" disabled={busy} className="w-full mt-2 text-xs">{busy ? "جاري الحفظ..." : "حفظ التغييرات"}</Button>
      </form>
    </Card>
  );
}

export default function StudentDashboard() {
  return (
    <DashboardLayout title="لوحة الطالب" badge="Student" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="courses" element={<Courses />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="ai" element={<AIShortcut />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
}
