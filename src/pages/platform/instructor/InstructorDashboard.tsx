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
    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="p-5"><div className="text-sm text-muted-foreground">دوراتي</div><div className="text-3xl font-bold mt-1">{s.c}</div></Card>
      <Card className="p-5"><div className="text-sm text-muted-foreground">إجمالي الدروس</div><div className="text-3xl font-bold mt-1">{s.l}</div></Card>
      <Card className="p-5"><div className="text-sm text-muted-foreground">بانتظار الموافقة</div><div className="text-3xl font-bold mt-1 text-amber-500">{s.p}</div></Card>
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

export default function InstructorDashboard() {
  return (
    <DashboardLayout title="لوحة المدرب" badge="Instructor" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="new-course" element={<NewCourse />} />
        <Route path="videos" element={<Videos />} />
        <Route path="assignments" element={<Placeholder title="الواجبات" />} />
        <Route path="students" element={<Placeholder title="الطلاب" />} />
        <Route path="certificates" element={<Placeholder title="الشهادات" />} />
        <Route path="analytics" element={<Placeholder title="التحليلات" />} />
        <Route path="earnings" element={<Placeholder title="الأرباح" />} />
        <Route path="messages" element={<Placeholder title="الرسائل" />} />
        <Route path="ai" element={<Placeholder title="أدوات الذكاء الاصطناعي" />} />
        <Route path="support" element={<Placeholder title="الدعم الفني" />} />
      </Routes>
    </DashboardLayout>
  );
}
