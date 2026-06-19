import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { Home, Users, TrendingUp, Award, CreditCard, MessageSquare, Bell, FileText, Sparkles, Calendar, LifeBuoy } from "lucide-react";
import { Card } from "@/components/ui/card";
import Placeholder from "@/pages/platform/Placeholder";

const items = [
  { label: "الرئيسية", path: "/platform/parent", icon: Home },
  { label: "أبنائي", path: "/platform/parent/children", icon: Users },
  { label: "متابعة التقدم", path: "/platform/parent/progress", icon: TrendingUp },
  { label: "الدرجات", path: "/platform/parent/grades", icon: FileText },
  { label: "الشهادات", path: "/platform/parent/certificates", icon: Award },
  { label: "المدفوعات", path: "/platform/parent/payments", icon: CreditCard },
  { label: "الرسائل", path: "/platform/parent/messages", icon: MessageSquare },
  { label: "الإشعارات", path: "/platform/parent/notifications", icon: Bell },
  { label: "AI Insights", path: "/platform/parent/ai", icon: Sparkles },
  { label: "التقويم", path: "/platform/parent/calendar", icon: Calendar },
  { label: "الدعم", path: "/platform/parent/support", icon: LifeBuoy },
];

function Home_() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="p-5"><div className="text-sm text-muted-foreground">عدد الأبناء</div><div className="text-3xl font-bold mt-1">0</div></Card>
      <Card className="p-5"><div className="text-sm text-muted-foreground">الدورات</div><div className="text-3xl font-bold mt-1">0</div></Card>
      <Card className="p-5"><div className="text-sm text-muted-foreground">شهادات مكتسبة</div><div className="text-3xl font-bold mt-1">0</div></Card>
    </div>
  );
}

export default function ParentDashboard() {
  return (
    <DashboardLayout title="لوحة ولي الأمر" badge="Parent" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="children" element={<Placeholder title="أبنائي" />} />
        <Route path="progress" element={<Placeholder title="متابعة التقدم" />} />
        <Route path="grades" element={<Placeholder title="الدرجات" />} />
        <Route path="certificates" element={<Placeholder title="الشهادات" />} />
        <Route path="payments" element={<Placeholder title="المدفوعات والفواتير" />} />
        <Route path="messages" element={<Placeholder title="الرسائل" />} />
        <Route path="notifications" element={<Placeholder title="الإشعارات" />} />
        <Route path="ai" element={<Placeholder title="AI Parent Insights" />} />
        <Route path="calendar" element={<Placeholder title="التقويم الدراسي" />} />
        <Route path="support" element={<Placeholder title="الدعم الفني" />} />
      </Routes>
    </DashboardLayout>
  );
}
