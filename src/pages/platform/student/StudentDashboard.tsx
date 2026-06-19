import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { Home, BookOpen, GraduationCap, FileText, Award, Calendar, Sparkles, Bell, Trophy, MessageSquare, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Placeholder from "@/pages/platform/Placeholder";

const items = [
  { label: "الرئيسية", path: "/platform/student", icon: Home },
  { label: "جميع الدورات", path: "/platform/student/courses", icon: BookOpen },
  { label: "دوراتي", path: "/platform/student/my-courses", icon: GraduationCap },
  { label: "الواجبات", path: "/platform/student/assignments", icon: FileText },
  { label: "الشهادات", path: "/platform/student/certificates", icon: Award },
  { label: "التقويم", path: "/platform/student/calendar", icon: Calendar },
  { label: "المساعد الذكي", path: "/platform/student/ai", icon: Sparkles },
  { label: "الإنجازات", path: "/platform/student/achievements", icon: Trophy },
  { label: "الرسائل", path: "/platform/student/messages", icon: MessageSquare },
  { label: "الإشعارات", path: "/platform/student/notifications", icon: Bell },
  { label: "الملف الشخصي", path: "/platform/student/profile", icon: User },
];

function Home_() {
  const [stats, setStats] = useState({ enrolled: 0, lessons: 0 });
  useEffect(() => { (async () => {
    const { count: e } = await supabase.from("enrollments").select("*", { count: "exact", head: true });
    const { count: l } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("status", "approved");
    setStats({ enrolled: e || 0, lessons: l || 0 });
  })(); }, []);
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5"><div className="text-sm text-muted-foreground">دوراتي</div><div className="text-3xl font-bold mt-1">{stats.enrolled}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted-foreground">دروس متاحة</div><div className="text-3xl font-bold mt-1">{stats.lessons}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted-foreground">نقاط XP</div><div className="text-3xl font-bold mt-1">0</div></Card>
      </div>
      <Card className="p-6">
        <h3 className="font-semibold mb-2">مرحبًا بك في منصة Acwad التعليمية</h3>
        <p className="text-sm text-muted-foreground">تصفح الدورات، تابع تقدمك، واحصل على الشهادات.</p>
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
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.length === 0 && <Card className="p-6 text-muted-foreground">لا توجد دورات معتمدة بعد.</Card>}
      {list.map((c) => (
        <Card key={c.id} className="p-5">
          <div className="text-xs text-primary">{c.category || "عام"}</div>
          <div className="font-semibold mt-1">{c.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{c.description}</div>
          <div className="mt-3 text-sm">{c.price > 0 ? `${c.price} جنيه` : "مجاني"}</div>
        </Card>
      ))}
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <DashboardLayout title="لوحة الطالب" badge="Student" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="courses" element={<Courses />} />
        <Route path="my-courses" element={<Placeholder title="دوراتي" />} />
        <Route path="assignments" element={<Placeholder title="الواجبات" />} />
        <Route path="certificates" element={<Placeholder title="الشهادات" />} />
        <Route path="calendar" element={<Placeholder title="التقويم الدراسي" />} />
        <Route path="ai" element={<Placeholder title="المساعد الذكي AI Tutor" />} />
        <Route path="achievements" element={<Placeholder title="الإنجازات والمتصدرين" />} />
        <Route path="messages" element={<Placeholder title="الرسائل" />} />
        <Route path="notifications" element={<Placeholder title="الإشعارات" />} />
        <Route path="profile" element={<Placeholder title="الملف الشخصي" />} />
      </Routes>
    </DashboardLayout>
  );
}
