import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { Home, Users, Shield, FileText, BarChart3, Lock, Database, Bell, CreditCard, Settings, Code2, LifeBuoy, Video, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import VideoReview from "../admin/VideoReview";
import Placeholder from "@/pages/platform/Placeholder";

const items = [
  { label: "الرئيسية", path: "/platform/super-admin", icon: Home },
  { label: "إدارة المستخدمين", path: "/platform/super-admin/users", icon: Users },
  { label: "الأدوار والصلاحيات", path: "/platform/super-admin/roles", icon: Shield },
  { label: "سجل العمليات", path: "/platform/super-admin/audit", icon: FileText },
  { label: "تحليلات المنصة", path: "/platform/super-admin/analytics", icon: BarChart3 },
  { label: "مراجعة الفيديوهات", path: "/platform/super-admin/videos", icon: Video },
  { label: "مركز الأمان", path: "/platform/super-admin/security", icon: Lock },
  { label: "النسخ الاحتياطي", path: "/platform/super-admin/backup", icon: Database },
  { label: "الإشعارات", path: "/platform/super-admin/notifications", icon: Bell },
  { label: "إعدادات الدفع", path: "/platform/super-admin/payments", icon: CreditCard },
  { label: "إعدادات المنصة", path: "/platform/super-admin/settings", icon: Settings },
  { label: "إدارة API", path: "/platform/super-admin/api", icon: Code2 },
  { label: "الذكاء الاصطناعي", path: "/platform/super-admin/ai", icon: Sparkles },
  { label: "مركز الدعم", path: "/platform/super-admin/support", icon: LifeBuoy },
];

function Home_() {
  const [s, setS] = useState({ users: 0, courses: 0, lessons: 0, pending: 0, enrollments: 0 });
  useEffect(() => { (async () => {
    const [u, c, l, p, e] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase.from("lessons").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("enrollments").select("*", { count: "exact", head: true }),
    ]);
    setS({ users: u.count || 0, courses: c.count || 0, lessons: l.count || 0, pending: p.count || 0, enrollments: e.count || 0 });
  })(); }, []);
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5"><div className="text-xs text-muted-foreground">المستخدمين</div><div className="text-2xl font-bold mt-1">{s.users}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">الدورات</div><div className="text-2xl font-bold mt-1">{s.courses}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">الدروس</div><div className="text-2xl font-bold mt-1">{s.lessons}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">بانتظار المراجعة</div><div className="text-2xl font-bold mt-1 text-amber-500">{s.pending}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">التسجيلات</div><div className="text-2xl font-bold mt-1">{s.enrollments}</div></Card>
      </div>
      <Card className="p-6">
        <h3 className="font-semibold mb-2">تحكم كامل في المنصة</h3>
        <p className="text-sm text-muted-foreground">السوبر أدمن لديه صلاحيات على جميع الأقسام: المستخدمين، الأدوار، الأمان، والإعدادات.</p>
      </Card>
    </div>
  );
}

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout title="لوحة السوبر أدمن" badge="Super Admin" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="users" element={<Placeholder title="إدارة المستخدمين" />} />
        <Route path="roles" element={<Placeholder title="الأدوار والصلاحيات" />} />
        <Route path="audit" element={<Placeholder title="سجل العمليات" />} />
        <Route path="analytics" element={<Placeholder title="تحليلات المنصة" />} />
        <Route path="videos" element={<VideoReview />} />
        <Route path="security" element={<Placeholder title="مركز الأمان" />} />
        <Route path="backup" element={<Placeholder title="النسخ الاحتياطي" />} />
        <Route path="notifications" element={<Placeholder title="إدارة الإشعارات" />} />
        <Route path="payments" element={<Placeholder title="إعدادات الدفع" />} />
        <Route path="settings" element={<Placeholder title="إعدادات المنصة" />} />
        <Route path="api" element={<Placeholder title="إدارة API" />} />
        <Route path="ai" element={<Placeholder title="الذكاء الاصطناعي والتحليلات" />} />
        <Route path="support" element={<Placeholder title="مركز الدعم" />} />
      </Routes>
    </DashboardLayout>
  );
}
