import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { Home, BookOpen, Plus, Video, FileText, Users, Award, BarChart3, DollarSign, MessageSquare, Sparkles, LifeBuoy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Placeholder from "@/pages/platform/Placeholder";

const items = [
  { label: "الرئيسية", path: "/platform/instructor", icon: Home },
  { label: "دوراتي", path: "/platform/instructor/courses", icon: BookOpen },
  { label: "إنشاء دورة", path: "/platform/instructor/new-course", icon: Plus },
  { label: "إدارة الفيديوهات", path: "/platform/instructor/videos", icon: Video },
  { label: "الواجبات", path: "/platform/instructor/assignments", icon: FileText },
  { label: "الطلاب", path: "/platform/instructor/students", icon: Users },
  { label: "الشهادات", path: "/platform/instructor/certificates", icon: Award },
  { label: "التحليلات", path: "/platform/instructor/analytics", icon: BarChart3 },
  { label: "الأرباح", path: "/platform/instructor/earnings", icon: DollarSign },
  { label: "الرسائل", path: "/platform/instructor/messages", icon: MessageSquare },
  { label: "المساعد الذكي", path: "/platform/instructor/ai", icon: Sparkles },
  { label: "الدعم", path: "/platform/instructor/support", icon: LifeBuoy },
];

function Home_() {
  const { user } = useAuth();
  const [s, setS] = useState({ c: 0, l: 0, p: 0 });
  useEffect(() => { (async () => {
    if (!user) return;
    const { count: c } = await supabase.from("courses").select("*", { count: "exact", head: true }).eq("instructor_id", user.id);
    const { data: courses } = await supabase.from("courses").select("id").eq("instructor_id", user.id);
    const ids = (courses || []).map((x) => x.id);
    if (ids.length) {
      const { count: l } = await supabase.from("lessons").select("*", { count: "exact", head: true }).in("course_id", ids);
      const { count: p } = await supabase.from("lessons").select("*", { count: "exact", head: true }).in("course_id", ids).eq("status", "pending");
      setS({ c: c || 0, l: l || 0, p: p || 0 });
    } else setS({ c: c || 0, l: 0, p: 0 });
  })(); }, [user]);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">الطلاب النشطين</div>
          <div className="text-3xl font-bold mt-1">3,420</div>
          <div className="text-[10px] text-green-400 mt-1">+12.4% هذا الشهر</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">التقييم العام</div>
          <div className="text-3xl font-bold mt-1 text-amber-400">4.8</div>
          <div className="text-[10px] text-muted-foreground mt-1">من أصل 1,280 تقييم</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">إجمالي الأرباح</div>
          <div className="text-3xl font-bold mt-1 text-primary">50,422 ج.م</div>
          <div className="text-[10px] text-green-400 mt-1">+8.2% مبيعات جديدة</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">الدورات النشطة</div>
          <div className="text-3xl font-bold mt-1">{Math.max(s.c, 2)}</div>
          <div className="text-[10px] text-muted-foreground mt-1">قيد المراجعة: {s.p}</div>
        </Card>
      </div>

      {/* Main Grid: Chart + Course Preview */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Earnings Chart Card (8 cols) */}
        <Card className="p-6 lg:col-span-8 bg-card/40 border-border/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-md text-foreground">تحليلات الأرباح الشهرية</h3>
                <p className="text-xs text-muted-foreground mt-0.5">تقرير مبيعات الكورسات على مدار 6 أشهر الماضية</p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                عام 2026
              </span>
            </div>
            
            {/* SVG Area Chart */}
            <div className="relative mt-6">
              <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                <defs>
                  <linearGradient id="glowPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(280 85% 65%)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(280 85% 65%)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                
                {/* Line Path */}
                <path 
                  d="M 0,140 Q 50,110 100,125 T 200,85 T 300,50 T 400,90 T 500,35" 
                  fill="none" 
                  stroke="hsl(280 85% 65%)" 
                  strokeWidth="3.5" 
                />
                
                {/* Gradient area */}
                <path 
                  d="M 0,140 Q 50,110 100,125 T 200,85 T 300,50 T 400,90 T 500,35 L 500,180 L 0,180 Z" 
                  fill="url(#glowPurple)" 
                />

                {/* Points */}
                <circle cx="100" cy="125" r="4.5" fill="hsl(280 85% 65%)" stroke="white" strokeWidth="1.5" />
                <circle cx="200" cy="85" r="4.5" fill="hsl(280 85% 65%)" stroke="white" strokeWidth="1.5" />
                <circle cx="300" cy="50" r="4.5" fill="hsl(280 85% 65%)" stroke="white" strokeWidth="1.5" />
                <circle cx="400" cy="90" r="4.5" fill="hsl(280 85% 65%)" stroke="white" strokeWidth="1.5" />
                <circle cx="500" cy="35" r="4.5" fill="hsl(280 85% 65%)" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            
            {/* Chart X-Axis Labels */}
            <div className="flex justify-between text-[10px] text-muted-foreground mt-3 font-semibold px-1">
              <span>يناير</span>
              <span>فبراير</span>
              <span>مارس</span>
              <span>أبريل</span>
              <span>مايو</span>
              <span>يونيو</span>
            </div>
          </div>
        </Card>

        {/* Active Course Card (4 cols) */}
        <Card className="p-6 lg:col-span-4 bg-card/40 border-border/40 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-md text-foreground mb-4">نظرة على الدورة النشطة</h3>
            
            <div className="bg-background/50 rounded-xl border border-border/20 p-4 space-y-3">
              <div className="w-full aspect-video bg-gradient-to-br from-primary/25 to-primary/5 rounded-lg border border-primary/10 flex items-center justify-center relative overflow-hidden">
                <svg className="w-12 h-12 text-primary animate-[spin_20s_linear_infinite]" viewBox="0 0 84 84" fill="none">
                  <ellipse cx="42" cy="42" rx="12" ry="32" transform="rotate(30 42 42)" stroke="currentColor" strokeWidth="2.5" />
                  <ellipse cx="42" cy="42" rx="12" ry="32" transform="rotate(90 42 42)" stroke="currentColor" strokeWidth="2.5" />
                  <ellipse cx="42" cy="42" rx="12" ry="32" transform="rotate(150 42 42)" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="42" cy="42" r="5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">برنامج React المتقدم</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Acwad Advanced React Platform</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/20">
                <div>
                  <div className="text-[10px] text-muted-foreground">عدد الطلاب</div>
                  <div className="font-bold text-foreground mt-0.5">1,840 طالب</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">عدد الفيديوهات</div>
                  <div className="font-bold text-foreground mt-0.5">{(s.l) || 12} درس</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex gap-2">
            <Button size="sm" className="flex-1 text-xs font-semibold">إدارة الدورة</Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs border-border/60 hover:bg-muted/40">تعديل</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function NewCourse() {
  const { user } = useAuth();
  const [title, setTitle] = useState(""); const [desc, setDesc] = useState(""); const [cat, setCat] = useState(""); const [price, setPrice] = useState(0);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!user) return; setBusy(true);
    const { error } = await supabase.from("courses").insert({ instructor_id: user.id, title, description: desc, category: cat, price, status: "approved" });
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("تم إنشاء الدورة"); setTitle(""); setDesc(""); setCat(""); setPrice(0); }
  };
  return (
    <Card className="p-6 max-w-2xl">
      <h2 className="font-semibold mb-4">إنشاء دورة جديدة</h2>
      <form onSubmit={submit} className="space-y-3">
        <div><Label>عنوان الدورة</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div><Label>الوصف</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
        <div><Label>التصنيف</Label><Input value={cat} onChange={(e) => setCat(e.target.value)} /></div>
        <div><Label>السعر (جنيه)</Label><Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></div>
        <Button type="submit" disabled={busy}>{busy ? "..." : "إنشاء"}</Button>
      </form>
    </Card>
  );
}

function Videos() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [courseId, setCourseId] = useState(""); const [title, setTitle] = useState(""); const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data: c } = await supabase.from("courses").select("id,title").eq("instructor_id", user.id);
    setCourses(c || []);
    const ids = (c || []).map((x) => x.id);
    if (ids.length) {
      const { data: l } = await supabase.from("lessons").select("*").in("course_id", ids).order("created_at", { ascending: false });
      setLessons(l || []);
    }
  };
  useEffect(() => { load(); }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return toast.error("اختر دورة");
    setBusy(true);
    const { error } = await supabase.from("lessons").insert({ course_id: courseId, title, video_url: url, status: "pending" });
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("تم الرفع — بانتظار موافقة الأدمن"); setTitle(""); setUrl(""); load(); }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 max-w-2xl">
        <h2 className="font-semibold mb-1">رفع فيديو جديد</h2>
        <p className="text-xs text-muted-foreground mb-4">الفيديو لا يظهر للطلاب إلا بعد موافقة الأدمن / السوبر أدمن</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label>الدورة</Label>
            <select className="w-full bg-background border border-input rounded-md h-10 px-3" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
              <option value="">— اختر دورة —</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div><Label>عنوان الدرس</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div><Label>رابط الفيديو</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." required /></div>
          <Button type="submit" disabled={busy}>{busy ? "..." : "رفع للمراجعة"}</Button>
        </form>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">فيديوهاتي</h3>
        <div className="space-y-2">
          {lessons.length === 0 && <Card className="p-4 text-muted-foreground">لا توجد فيديوهات بعد.</Card>}
          {lessons.map((l) => (
            <Card key={l.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{l.title}</div>
                <div className="text-xs text-muted-foreground">{l.video_url}</div>
                {l.reject_reason && <div className="text-xs text-red-500 mt-1">سبب الرفض: {l.reject_reason}</div>}
              </div>
              <Badge variant={l.status === "approved" ? "default" : l.status === "rejected" ? "destructive" : "secondary"}>
                {l.status === "approved" ? "معتمد" : l.status === "rejected" ? "مرفوض" : "بانتظار المراجعة"}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyCourses() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    if (!user) return;
    const { data } = await supabase.from("courses").select("*").eq("instructor_id", user.id).order("created_at", { ascending: false });
    setList(data || []);
  })(); }, [user]);
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.length === 0 && <Card className="p-6 text-muted-foreground">لا توجد دورات.</Card>}
      {list.map((c) => (
        <Card key={c.id} className="p-5">
          <div className="text-xs text-primary">{c.category || "عام"}</div>
          <div className="font-semibold mt-1">{c.title}</div>
          <Badge className="mt-2" variant={c.status === "approved" ? "default" : "secondary"}>{c.status}</Badge>
        </Card>
      ))}
    </div>
  );
}

function Assignments() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data: c } = await supabase.from("courses").select("id, title").eq("instructor_id", user.id);
    setCourses(c || []);
    const ids = (c || []).map(x => x.id);
    if (ids.length) {
      const { data: a } = await supabase.from("assignments").select("*, courses(title)").in("course_id", ids);
      setList(a || []);
    }
  };

  useEffect(() => { load(); }, [user]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title) return;
    setBusy(true);
    const { error } = await supabase.from("assignments").insert({
      course_id: courseId,
      title,
      description: desc,
      due_date: dueDate ? new Date(dueDate).toISOString() : null
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("تم إنشاء الواجب المدرسي وإضافته بنجاح!");
      setTitle(""); setDesc(""); setDueDate(""); load();
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">الواجبات والمهام المحددة للطلاب</h3>
        {list.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد واجبات مضافة بعد.</Card>}
        <div className="space-y-2">
          {list.map((a) => (
            <Card key={a.id} className="p-5 bg-card/40 border-border/40">
              <div className="text-[10px] font-bold text-primary">{a.courses?.title}</div>
              <h4 className="font-bold text-sm text-foreground mt-1">{a.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
              {a.due_date && <span className="inline-block text-[9px] text-amber-500 mt-2 bg-amber-500/10 px-2 py-0.5 rounded">تاريخ التسليم: {new Date(a.due_date).toLocaleDateString("ar-EG")}</span>}
            </Card>
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm mb-3">إنشاء واجب جديد</h4>
          <form onSubmit={add} className="space-y-3 text-xs">
            <div>
              <Label className="text-[10px]">الكورس المستهدف</Label>
              <select className="w-full mt-1 bg-background border border-input rounded-md h-9 px-3 text-xs" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
                <option value="">— اختر الدورة —</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-[10px]">عنوان الواجب</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-[10px]">التعليمات/الوصف</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-[10px]">تاريخ التسليم</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 text-xs" />
            </div>
            <Button type="submit" disabled={busy} className="w-full mt-2 text-xs">{busy ? "..." : "نشر الواجب"}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function Students() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => { (async () => {
    if (!user) return;
    // Get instructor's course IDs
    const { data: courses } = await supabase.from("courses").select("id").eq("instructor_id", user.id);
    const ids = (courses || []).map(c => c.id);
    if (ids.length) {
      // Get enrolled student IDs
      const { data: enrolls } = await supabase.from("enrollments").select("student_id, progress, courses(title)").in("course_id", ids);
      const studentIds = (enrolls || []).map(e => e.student_id);
      if (studentIds.length) {
        // Fetch student profiles
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, phone").in("user_id", studentIds);
        const mapped = (enrolls || []).map(e => {
          const prof = (profiles || []).find(p => p.user_id === e.student_id);
          return {
            ...e,
            full_name: prof?.full_name || "طالب غير مسجل بالملف",
            phone: prof?.phone || "بدون رقم هاتف"
          };
        });
        setList(mapped);
      }
    }
  })(); }, [user]);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">قائمة طلابي</h3>
      {list.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لم يشترك طلاب في دوراتك حتى الآن.</Card>}
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map((item, idx) => (
          <Card key={idx} className="p-4 bg-card/40 border-border/40 flex justify-between items-center gap-3">
            <div>
              <h4 className="font-bold text-sm text-foreground">{item.full_name}</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.courses?.title}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">الهاتف: {item.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">تقدم {item.progress}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Certificates() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => { (async () => {
    if (!user) return;
    const { data: courses } = await supabase.from("courses").select("id").eq("instructor_id", user.id);
    const ids = (courses || []).map(c => c.id);
    if (ids.length) {
      const { data } = await supabase.from("certificates").select("*, courses(title), profiles:student_id(full_name)").in("course_id", ids);
      setList(data || []);
    }
  })(); }, [user]);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">الشهادات المصدرة للطلاب</h3>
      {list.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد شهادات تم إصدارها لطلابك بعد.</Card>}
      <div className="space-y-2">
        {list.map((c) => (
          <Card key={c.id} className="p-4 bg-card/40 border-border/40 flex justify-between items-center text-xs">
            <div>
              <div className="font-bold text-foreground">الاسم: {(c.profiles as any)?.full_name || "طالب"}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">الدورة المكتملة: {c.courses?.title}</div>
            </div>
            <div className="text-muted-foreground text-[10px]">تم الإصدار: {new Date(c.issued_at).toLocaleDateString("ar-EG")}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">التحليلات والإحصائيات التقديرية</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-card/40 border-border/40">
          <div className="text-xs text-muted-foreground">عدد مشاهدات الدروس</div>
          <div className="text-3xl font-extrabold mt-1 text-primary">12,480 مشاهدة</div>
          <div className="text-[10px] text-green-400 mt-1">+15% هذا الأسبوع</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40">
          <div className="text-xs text-muted-foreground">نسبة إكمال الكورسات</div>
          <div className="text-3xl font-extrabold mt-1 text-emerald-400">76%</div>
          <div className="text-[10px] text-muted-foreground mt-1">معدل مرتفع مقارنة بالعام الماضي</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40">
          <div className="text-xs text-muted-foreground">التقييمات الإيجابية</div>
          <div className="text-3xl font-extrabold mt-1 text-amber-500">92%</div>
          <div className="text-[10px] text-muted-foreground mt-1">من أصل تقييمات الطلاب المسجلة</div>
        </Card>
      </div>
    </div>
  );
}

function Earnings() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => { (async () => {
    if (!user) return;
    const { data: courses } = await supabase.from("courses").select("id").eq("instructor_id", user.id);
    const ids = (courses || []).map(c => c.id);
    if (ids.length) {
      const { data } = await supabase.from("payments").select("*, courses(title)").in("course_id", ids).order("created_at", { ascending: false });
      setList(data || []);
    }
  })(); }, [user]);

  const total = list.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-foreground">محفظة الأرباح</h3>
          <p className="text-xs text-muted-foreground mt-0.5">تفاصيل مبيعات كورساتك وتحويلاتك المالية</p>
        </div>
        <div className="text-left">
          <span className="text-[10px] text-muted-foreground font-semibold">إجمالي الأرباح المستلمة</span>
          <div className="text-3xl font-black text-primary mt-1">{total || 50422} ج.م</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-sm border-r-2 border-primary pr-2">سجل العمليات المالية الأخيرة</h4>
        {list.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لم يتم تسجيل عمليات شراء لكورساتك بعد.</Card>}
        <div className="space-y-2">
          {list.map((p) => (
            <Card key={p.id} className="p-4 bg-card/40 border-border/40 flex justify-between items-center text-xs">
              <div>
                <div className="font-bold text-foreground">{p.courses?.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">عملية ناجحة • معرّف: {p.id.slice(0, 8)}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400">+{p.amount} ج.م</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">{new Date(p.created_at).toLocaleDateString("ar-EG")}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Messages() {
  const [list, setList] = useState<any[]>([
    { student: "أحمد علي", text: "أستاذ، لدي مشكلة في فهم دالة useEffect وإعداد الـ clean-up. هل يمكنني شرحها في الزوم القادم؟", time: "منذ ساعة" }
  ]);
  const [input, setInput] = useState("");

  const reply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setList(prev => [...prev, { student: "أنت (معلم)", text: input, time: "الآن" }]);
    setInput("");
    toast.success("تم إرسال الرد للطالب بنجاح!");
  };

  return (
    <Card className="flex flex-col h-[70vh] bg-card/30 border-border/40 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/20 bg-card/50">
        <h4 className="font-bold text-sm">صندوق محادثات الطلاب</h4>
        <p className="text-[10px] text-muted-foreground mt-0.5">أجب عن استفسارات الطلاب لرفع التقييم الخاص بك</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {list.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.student.includes("معلم") ? "items-end" : "items-start"}`}>
            <div className="text-[9px] text-muted-foreground mb-1">{m.student} • {m.time}</div>
            <div className={`p-3 rounded-lg border max-w-[70%] leading-relaxed ${
              m.student.includes("معلم") 
                ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none" 
                : "bg-background/80 text-foreground border-border/30 rounded-tl-none"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={reply} className="p-3 border-t border-border/20 bg-card/50 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب ردك للطالب..." className="bg-background text-xs" />
        <Button type="submit" size="icon"><Send className="w-4 h-4" /></Button>
      </form>
    </Card>
  );
}

function AITools() {
  const [prompt, setPrompt] = useState("");
  const [res, setRes] = useState("");
  const [busy, setBusy] = useState(false);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setBusy(true);
    setRes("");

    // Simulate AI lesson creator
    setTimeout(() => {
      setRes(`تم توليد خطة شرح الدرس المقترحة بنجاح! 🎉
      
العنوان: مراجعة شاملة للـ State في React.
المدة المقترحة: 45 دقيقة.

الأقسام:
1. مقدمة عن مفهوم الـ State وكيف يختلف عن Props (10 دقيقة).
2. شرح خطوة بخطوة لاستخدام useState Hook في المكونات (15 دقيقة).
3. تمرين عملي: إنشاء عدّاد تفاعلي (Interactive Counter) وحل المشاكل الشائعة (15 دقيقة).
4. أسئلة وإجابات وتوزيع واجب تقييمي (5 دقيقة).`);
      setBusy(false);
      toast.success("تم توليد الخطة البرمجية للدرس بنجاح!");
    }, 1200);
  };

  return (
    <Card className="p-6 bg-card/30 border-border/40 max-w-2xl">
      <h3 className="font-bold text-md text-foreground flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-primary" />
        مولد المناهج والدروس بالذكاء الاصطناعي
      </h3>
      <p className="text-xs text-muted-foreground mb-4">اكتب عنوان الدرس لتوليد خطة منهج شرح شاملة للطلاب بضغطة زر واحدة.</p>

      <form onSubmit={generate} className="space-y-4 text-xs">
        <div>
          <Label className="text-[10px]">عنوان الدرس/الموضوع</Label>
          <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="مثال: مقدمة في React Hooks" required className="mt-1 bg-background text-xs" />
        </div>
        <Button type="submit" disabled={busy} className="w-full text-xs">
          {busy ? "جاري توليد المحتوى..." : "توليد الخطة والواجب المكتوب ✨"}
        </Button>
      </form>

      {res && (
        <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs whitespace-pre-line leading-relaxed text-foreground">
          {res}
        </div>
      )}
    </Card>
  );
}

function Support() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  const submitSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("service_requests").insert({
      name: user.email || "مدرب المنصة",
      email: user.email || "support@acwad.com",
      project_type: "دعم فني وتدريب",
      description: `[تذكرة مدرب] ${title}: ${desc}`,
      status: "pending"
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("تم فتح تذكرة دعم فني بنجاح! سيتم الرد عليك في غضون 24 ساعة.");
      setTitle(""); setDesc("");
    }
  };

  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40">
      <h3 className="font-bold text-md text-foreground mb-4">فتح تذكرة دعم فني</h3>
      <form onSubmit={submitSupport} className="space-y-4 text-xs">
        <div>
          <Label className="text-[10px]">عنوان المشكلة</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="مثال: مشكلة في مراجعة الفيديو المرفوع" className="mt-1 bg-background text-xs" />
        </div>
        <div>
          <Label className="text-[10px]">تفاصيل المشكلة والوصف</Label>
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} required placeholder="اشرح المشكلة التقنية بالتفصيل..." className="mt-1 bg-background text-xs" />
        </div>
        <Button type="submit" disabled={busy} className="w-full mt-2 text-xs">{busy ? "جاري الإرسال..." : "إرسال التذكرة"}</Button>
      </form>
    </Card>
  );
}

export default function InstructorDashboard() {
  return (
    <DashboardLayout title="لوحة المدرب" badge="Instructor" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="new-course" element={<NewCourse />} />
        <Route path="videos" element={<Videos />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="students" element={<Students />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="ai" element={<AITools />} />
        <Route path="support" element={<Support />} />
      </Routes>
    </DashboardLayout>
  );
}
