import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { Home, Users, BookOpen, Video, Tag, CreditCard, RefreshCcw, Award, Bell, FileText, MessageSquare, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import VideoReview from "./VideoReview";
import Placeholder from "@/pages/platform/Placeholder";

const items = [
  { label: "الرئيسية", path: "/platform/admin", icon: Home },
  { label: "إدارة المستخدمين", path: "/platform/admin/users", icon: Users },
  { label: "إدارة الدورات", path: "/platform/admin/courses", icon: BookOpen },
  { label: "مراجعة الفيديوهات", path: "/platform/admin/videos", icon: Video },
  { label: "التصنيفات", path: "/platform/admin/categories", icon: Tag },
  { label: "المدفوعات", path: "/platform/admin/payments", icon: CreditCard },
  { label: "الاستردادات", path: "/platform/admin/refunds", icon: RefreshCcw },
  { label: "الشهادات", path: "/platform/admin/certificates", icon: Award },
  { label: "الإشعارات", path: "/platform/admin/notifications", icon: Bell },
  { label: "التقارير", path: "/platform/admin/reports", icon: FileText },
  { label: "التقييمات", path: "/platform/admin/reviews", icon: MessageSquare },
  { label: "الحملات", path: "/platform/admin/campaigns", icon: Megaphone },
];

function Home_() {
  const [s, setS] = useState({ users: 0, courses: 0, pending: 0 });
  useEffect(() => { (async () => {
    const { count: u } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: c } = await supabase.from("courses").select("*", { count: "exact", head: true });
    const { count: p } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("status", "pending");
    setS({ users: u || 0, courses: c || 0, pending: p || 0 });
  })(); }, []);
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="p-5"><div className="text-sm text-muted-foreground">المستخدمين</div><div className="text-3xl font-bold mt-1">{s.users}</div></Card>
      <Card className="p-5"><div className="text-sm text-muted-foreground">الدورات</div><div className="text-3xl font-bold mt-1">{s.courses}</div></Card>
      <Card className="p-5"><div className="text-sm text-muted-foreground">فيديوهات بانتظار المراجعة</div><div className="text-3xl font-bold mt-1 text-amber-500">{s.pending}</div></Card>
    </div>
  );
}

function Courses() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setList(data || []);
  })(); }, []);
  return (
    <div className="space-y-2">
      {list.map((c) => (
        <Card key={c.id} className="p-4 flex items-center justify-between">
          <div><div className="font-medium">{c.title}</div><div className="text-xs text-muted-foreground">{c.category}</div></div>
          <span className="text-xs px-2 py-1 rounded bg-muted">{c.status}</span>
        </Card>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout title="لوحة الإدارة" badge="Admin" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="users" element={<Placeholder title="إدارة المستخدمين" />} />
        <Route path="courses" element={<Courses />} />
        <Route path="videos" element={<VideoReview />} />
        <Route path="categories" element={<Placeholder title="التصنيفات" />} />
        <Route path="payments" element={<Placeholder title="المدفوعات" />} />
        <Route path="refunds" element={<Placeholder title="الاستردادات" />} />
        <Route path="certificates" element={<Placeholder title="الشهادات" />} />
        <Route path="notifications" element={<Placeholder title="إرسال الإشعارات" />} />
        <Route path="reports" element={<Placeholder title="التقارير" />} />
        <Route path="reviews" element={<Placeholder title="التقييمات" />} />
        <Route path="campaigns" element={<Placeholder title="الحملات التسويقية" />} />
      </Routes>
    </DashboardLayout>
  );
}
