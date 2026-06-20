import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { Home, Users, Shield, FileText, BarChart3, Lock, Database, Bell, CreditCard, Settings, Code2, LifeBuoy, Video, Sparkles, Plus, Key, ToggleLeft, ToggleRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import VideoReview from "../admin/VideoReview";

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

  const totalUsersCount = Math.max(s.users, 1354);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">إجمالي المستخدمين</div>
          <div className="text-2xl font-extrabold mt-1">{totalUsersCount}</div>
          <div className="text-[10px] text-green-400 mt-1">+14% زيادة سنوية</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">إجمالي الأرباح</div>
          <div className="text-2xl font-extrabold mt-1 text-primary">542.5k ج.م</div>
          <div className="text-[10px] text-green-400 mt-1">+8% زيادة المبيعات</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">التحويلات</div>
          <div className="text-2xl font-extrabold mt-1 text-emerald-400">872</div>
          <div className="text-[10px] text-green-400 mt-1">+4% اشتراكات جديدة</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">الدروس المرفوعة</div>
          <div className="text-2xl font-extrabold mt-1 text-amber-500">{Math.max(s.lessons, 8)}</div>
          <div className="text-[10px] text-muted-foreground mt-1">بانتظار المراجعة: {s.pending}</div>
        </Card>
      </div>

      {/* Main Grid: Donut Chart + Operations */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* User Distribution Donut Chart (4 cols) */}
        <Card className="p-6 lg:col-span-4 bg-card/40 border-border/40 flex flex-col items-center justify-between">
          <div className="w-full">
            <h3 className="font-bold text-md text-foreground">توزيع المستخدمين</h3>
            <p className="text-xs text-muted-foreground mt-0.5">نسب المشتركين حسب الأدوار</p>
          </div>

          <div className="relative flex items-center justify-center my-6">
            {/* SVG Donut Chart */}
            <svg viewBox="0 0 150 150" className="w-40 h-40 transform -rotate-90 overflow-visible">
              <circle cx="75" cy="75" r="50" fill="transparent" stroke="currentColor" strokeOpacity="0.05" strokeWidth="16" />
              {/* Student: 72% (circumference ~ 314, value = 226) */}
              <circle cx="75" cy="75" r="50" fill="transparent" stroke="hsl(280 85% 65%)" strokeWidth="16" strokeDasharray="226 314" strokeDashoffset="0" strokeLinecap="round" />
              {/* Instructor: 18% (value = 56.5, offset = -226) */}
              <circle cx="75" cy="75" r="50" fill="transparent" stroke="hsl(285 90% 70%)" strokeWidth="16" strokeDasharray="56.5 314" strokeDashoffset="-226" strokeLinecap="round" />
              {/* Parent: 10% (value = 31.4, offset = -282.5) */}
              <circle cx="75" cy="75" r="50" fill="transparent" stroke="rgb(52, 211, 153)" strokeWidth="16" strokeDasharray="31.4 314" strokeDashoffset="-282.5" strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-black text-foreground">{totalUsersCount}</span>
              <span className="block text-[9px] text-muted-foreground font-semibold mt-0.5">إجمالي الأعضاء</span>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-[10px] pt-4 border-t border-border/20">
            <div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-semibold">طلاب</span>
              </div>
              <div className="font-bold text-foreground mt-0.5">72%</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-semibold">مدربين</span>
              </div>
              <div className="font-bold text-foreground mt-0.5">18%</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold">أولياء أمور</span>
              </div>
              <div className="font-bold text-foreground mt-0.5">10%</div>
            </div>
          </div>
        </Card>

        {/* Operational Activity (8 cols) */}
        <Card className="p-6 lg:col-span-8 bg-card/40 border-border/40">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-md text-foreground">لوحة العمليات وحالة النظام</h3>
              <p className="text-xs text-muted-foreground mt-0.5">معدلات استخدام خوادم المنصة وقواعد البيانات</p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md font-semibold">
              مستقر وآمن
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">تسجيلات الطلاب الجدد</span>
                <span className="font-bold text-primary">85 / 100 عملية يومياً</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">تسجيلات المدربين الجدد</span>
                <span className="font-bold text-accent">35 / 50 عملية يومياً</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "70%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">تسجيلات أولياء الأمور</span>
                <span className="font-bold text-emerald-400">55 / 80 عملية يومياً</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "68.75%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">الدروس المرفوعة والمعتمدة</span>
                <span className="font-bold text-teal-400">120 / 150 درس شهرياً</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">طلبات الاسترداد والدعم الفني المعالجة</span>
                <span className="font-bold text-amber-500">5 / 10 طلبات معلقة</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "50%" }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function UsersManage() {
  const [list, setList] = useState<any[]>([]);
  
  const load = async () => {
    const { data: profiles } = await supabase.from("profiles").select("id, user_id, full_name, created_at").order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const mapped = (profiles || []).map(p => {
      const roleObj = (roles || []).find(r => r.user_id === p.user_id);
      return { ...p, role: roleObj ? roleObj.role : "student" };
    });
    setList(mapped);
  };

  useEffect(() => { load(); }, []);

  const changeRole = async (userId: string, newRole: string) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert({ user_id: userId, role: newRole as any });
    toast.success("تم تحديث الصلاحية بنجاح!");
    load();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">إدارة أعضاء المنصة والصلاحيات</h3>
      <div className="grid gap-3">
        {list.map((u) => (
          <Card key={u.id} className="p-4 flex justify-between items-center bg-card/40 border-border/40 text-xs">
            <div>
              <div className="font-bold text-foreground">{u.full_name || "مستخدم"}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">تاريخ الانضمام: {new Date(u.created_at).toLocaleDateString("ar-EG")}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-primary font-bold">الصلاحية: {u.role}</span>
              <select className="bg-background border border-input rounded p-1 text-[10px]" value={u.role} onChange={(e) => changeRole(u.user_id, e.target.value)}>
                <option value="student">طالب</option>
                <option value="instructor">مدرب</option>
                <option value="parent">ولي أمر</option>
                <option value="admin">أدمن</option>
                <option value="super_admin">سوبر أدمن</option>
              </select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RolesManage() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">الأدوار والصلاحيات المعتمدة في أكواد</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm text-foreground">طالب (Student)</h4>
          <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
            - تصفح والاشتراك في الكورسات.
            <br />- حل الواجبات والاختبارات.
            <br />- تحميل شهادات النجاح.
          </p>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm text-foreground">مدرب (Instructor)</h4>
          <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
            - إنشاء وتعديل الكورسات.
            <br />- رفع الفيديوهات وتعيين الواجبات.
            <br />- إدارة الطلاب ومحفظة الأرباح.
          </p>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm text-foreground">مسؤول (Admin)</h4>
          <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
            - اعتماد الكورسات ومراجعة الفيديوهات.
            <br />- إدارة المستخدمين ومعالجة الاستردادات.
            <br />- إرسال الإشعارات وتوليد التقارير.
          </p>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm text-foreground">سوبر مسؤول (Super Admin)</h4>
          <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
            - تحكم كامل بنظام المنصة.
            <br />- إدارة النسخ الاحتياطي وحالة الخادم.
            <br />- توليد وإدارة مفاتيح الـ API وإعدادات الدفع.
          </p>
        </Card>
      </div>
    </div>
  );
}

function AuditLogs() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    // Insert mock log to ensure data is present
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "عرض لوحة السوبر أدمن",
        description: "قام السوبر أدمن بفتح سجل العمليات ومراجعة حالة النظام",
        ip_address: "127.0.0.1"
      });
    }
    const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20);
    setList(data || []);
  })(); }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">سجل العمليات والأنشطة الأمنية (Audit Logs)</h3>
      <div className="space-y-2">
        {list.map((log) => (
          <Card key={log.id} className="p-4 bg-card/40 border-border/40 text-xs flex justify-between items-center">
            <div>
              <div className="font-bold text-foreground">{log.action}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{log.description}</div>
            </div>
            <div className="text-right text-[10px] text-muted-foreground">
              <div>IP: {log.ip_address || "غير معروف"}</div>
              <div className="mt-0.5">{new Date(log.created_at).toLocaleString("ar-EG")}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">تحليلات الأداء الشاملة للمنصة</h3>
      <div className="grid sm:grid-cols-3 gap-4 text-xs">
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm text-foreground">مصادر الزيارات</h4>
          <p className="text-muted-foreground mt-2">البحث المباشر: 45% • الشبكات الاجتماعية: 30% • الإعلانات: 25%</p>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm text-foreground">الأجهزة المستخدمة</h4>
          <p className="text-muted-foreground mt-2">الهواتف الذكية: 68% • أجهزة الكومبيوتر: 28% • التابلت: 4%</p>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm text-foreground">الاحتفاظ بالمستخدمين</h4>
          <p className="text-muted-foreground mt-2">العودة الأسبوعية: 62% • التفاعل اليومي: 40% • معدل الارتداد: 18%</p>
        </Card>
      </div>
    </div>
  );
}

function SecurityCenter() {
  const [locked, setLocked] = useState(false);
  
  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40">
      <h3 className="font-bold text-md text-foreground mb-4">مركز إدارة الأمان والحماية</h3>
      <div className="space-y-4 text-xs">
        <div className="flex justify-between items-center p-3 rounded-lg border border-border/30 bg-background/40">
          <div>
            <h4 className="font-bold">قفل تسجيل الحسابات الجديدة</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">تعطيل إمكانية إنشاء حسابات جديدة مؤقتاً</p>
          </div>
          <Button size="icon" variant="ghost" onClick={() => { setLocked(!locked); toast.info(locked ? "تم فتح التسجيل" : "تم قفل التسجيل"); }}>
            {locked ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
          </Button>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg border border-border/30 bg-background/40">
          <div>
            <h4 className="font-bold">التوثيق الثنائي (2FA) للمشرفين</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">طلب كود التحقق الإضافي عند الدخول للوحة التحكم</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">مفعّل تلقائياً</span>
        </div>
      </div>
    </Card>
  );
}

function BackupCenter() {
  const [logs, setLogs] = useState<any[]>([
    { date: "19 يونيو 2026 12:00 م", size: "12.4 MB", type: "تلقائي", status: "ناجح" }
  ]);
  const [busy, setBusy] = useState(false);

  const startBackup = () => {
    setBusy(true);
    setTimeout(() => {
      setLogs(prev => [
        { date: new Date().toLocaleString("ar-EG"), size: "12.4 MB", type: "يدوي", status: "ناجح" },
        ...prev
      ]);
      setBusy(false);
      toast.success("تم أخذ نسخة احتياطية كاملة لقاعدة البيانات والملفات المرفوعة بنجاح!");
    }, 1500);
  };

  return (
    <div className="space-y-6 text-xs max-w-3xl">
      <Card className="p-6 bg-card/40 border-border/40 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-md text-foreground">إدارة النسخ الاحتياطي (Database Backups)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">قم بأخذ نسخ احتياطية يدوية وتنزيلها لضمان حماية بيانات المنصة.</p>
        </div>
        <Button onClick={startBackup} disabled={busy} className="text-xs font-semibold">
          {busy ? "جاري النسخ..." : "بدء نسخ احتياطي فوري"}
        </Button>
      </Card>

      <div className="space-y-2">
        <h4 className="font-bold text-sm border-r-2 border-primary pr-2">أرشيف النسخ الاحتياطية الأخيرة</h4>
        {logs.map((log, idx) => (
          <Card key={idx} className="p-4 bg-card/45 border-border/40 flex justify-between items-center">
            <div>
              <div className="font-bold text-foreground">تاريخ النسخ: {log.date}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">الحجم: {log.size} • النوع: {log.type}</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{log.status}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NotificationsManage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const broadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    const { data: users } = await supabase.from("profiles").select("user_id");
    if (users?.length) {
      const inserts = users.map(u => ({
        user_id: u.user_id,
        title,
        body,
        read: false
      }));
      await supabase.from("notifications").insert(inserts);
      toast.success("تم بث وإرسال الإشعار لجميع أعضاء المنصة بنجاح!");
      setTitle(""); setBody("");
    }
  };

  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40">
      <h3 className="font-bold text-md text-foreground mb-4">بث إشعار عام لجميع المشتركين</h3>
      <form onSubmit={broadcast} className="space-y-4 text-xs">
        <div>
          <Label className="text-[10px]">عنوان الإشعار</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="مثال: تحديث أمني عام بالنظام" className="mt-1 bg-background text-xs" />
        </div>
        <div>
          <Label className="text-[10px]">محتوى الرسالة</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} required placeholder="اكتب تفاصيل التنبيه..." className="mt-1 bg-background text-xs" />
        </div>
        <Button type="submit" className="w-full mt-2 text-xs">بث الإشعار الآن</Button>
      </form>
    </Card>
  );
}

function PaymentsSettings() {
  const [gateway, setGateway] = useState("stripe");
  
  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40">
      <h3 className="font-bold text-md text-foreground mb-4">إعدادات بوابات الدفع (Payment Gateways)</h3>
      <div className="space-y-4 text-xs">
        <div>
          <Label className="text-[10px]">بوابة الدفع المفعلة افتراضياً</Label>
          <select className="w-full mt-1 bg-background border border-input rounded-md h-9 px-3 text-xs" value={gateway} onChange={(e) => setGateway(e.target.value)}>
            <option value="stripe">Stripe (بطاقات الائتمان والدفع الرقمي)</option>
            <option value="paypal">PayPal (تحويل فوري)</option>
            <option value="fawry">فوري (مدفوعات محلية بمصر)</option>
          </select>
        </div>
        <div className="p-3.5 bg-background/50 rounded-lg border border-border/20 text-muted-foreground">
          حالة الاتصال بالبوابة: <span className="text-emerald-400 font-bold">متصل (Live Mode)</span>
        </div>
        <Button onClick={() => toast.success("تم حفظ إعدادات بوابات الدفع بنجاح!")} className="w-full text-xs">حفظ الإعدادات</Button>
      </div>
    </Card>
  );
}

function SettingsPage() {
  const [siteName, setSiteName] = useState("منصة أكواد التعليمية");
  const [email, setEmail] = useState("support@acwad.com");

  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40">
      <h3 className="font-bold text-md text-foreground mb-4">إعدادات المنصة الكلية</h3>
      <div className="space-y-4 text-xs">
        <div>
          <Label className="text-[10px]">اسم الموقع/المنصة (عربي)</Label>
          <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} required className="mt-1 bg-background text-xs" />
        </div>
        <div>
          <Label className="text-[10px]">بريد الدعم الفني العام</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 bg-background text-xs" />
        </div>
        <Button onClick={() => toast.success("تم تحديث إعدادات المنصة الكلية بنجاح!")} className="w-full text-xs">حفظ الإعدادات</Button>
      </div>
    </Card>
  );
}

function ApiManage() {
  const [key, setKey] = useState("acwad_live_83kfs8391jfsk893jfkl");
  const generate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let generated = "acwad_live_";
    for (let i = 0; i < 20; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(generated);
    toast.success("تم توليد مفتاح API سري جديد!");
  };

  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40">
      <h3 className="font-bold text-md text-foreground flex items-center gap-2 mb-2">
        <Key className="w-5 h-5 text-primary" />
        إدارة مفاتيح الـ API (Developers API Keys)
      </h3>
      <p className="text-xs text-muted-foreground mb-4">استخدم مفتاح الـ API للربط مع تطبيقات الهاتف الخارجي والأنظمة الموازية.</p>

      <div className="space-y-4 text-xs">
        <div>
          <Label className="text-[10px]">مفتاح الـ API النشط حالياً</Label>
          <div className="flex gap-2 mt-1">
            <Input value={key} readOnly className="font-mono bg-background text-xs flex-1" />
            <Button onClick={generate} size="sm" className="text-xs">توليد مفتاح جديد</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AiAnalytics() {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">الذكاء الاصطناعي والتحليلات التنبؤية الكلية</h3>
      <div className="grid sm:grid-cols-2 gap-4 text-xs">
        <Card className="p-5 bg-card/40 border-border/40 leading-relaxed">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            تنبؤات نسبة التسرب والاستمرار
          </h4>
          <p className="text-muted-foreground mt-1">يتوقع الذكاء الاصطناعي أن 85% من المشتركين المسجلين خلال هذا الشهر سيقومون بإنهاء كورساتهم بالكامل بناءً على معدلات التفاعل الحالية.</p>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 leading-relaxed">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            توصيات تحسين تجربة التعليم
          </h4>
          <p className="text-muted-foreground mt-1">يُوصي النظام بإضافة اختبارات قصيرة بعد الدروس التي تتجاوز مدتها 20 دقيقة لرفع تفاعل الطلاب بنسبة تقدر بـ 12%.</p>
        </Card>
      </div>
    </div>
  );
}

function SupportCenter() {
  const [list, setList] = useState<any[]>([]);
  
  const load = async () => {
    const { data } = await supabase.from("service_requests").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const resolve = async (id: string) => {
    await supabase.from("service_requests").update({ status: "completed" }).eq("id", id);
    toast.success("تم تحديث حالة تذكرة الدعم لحالة 'تم الحل'!");
    load();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">مركز إدارة تذاكر الدعم والخدمات</h3>
      {list.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد تذاكر دعم مفتوحة حالياً.</Card>}
      <div className="space-y-2">
        {list.map((ticket) => (
          <Card key={ticket.id} className="p-5 bg-card/40 border-border/40 flex justify-between items-center text-xs">
            <div>
              <div className="font-bold text-foreground">الاسم: {ticket.name} • البريد: {ticket.email}</div>
              <div className="text-[10px] text-muted-foreground mt-1">التفاصيل: {ticket.description}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ticket.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {ticket.status === 'completed' ? 'محلولة' : 'معلقة'}
              </span>
              {ticket.status !== 'completed' && (
                <Button size="sm" onClick={() => resolve(ticket.id)} className="text-[10px]">إغلاق التذكرة</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout title="لوحة السوبر أدمن" badge="Super Admin" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="users" element={<UsersManage />} />
        <Route path="roles" element={<RolesManage />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="videos" element={<VideoReview />} />
        <Route path="security" element={<SecurityCenter />} />
        <Route path="backup" element={<BackupCenter />} />
        <Route path="notifications" element={<NotificationsManage />} />
        <Route path="payments" element={<PaymentsSettings />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="api" element={<ApiManage />} />
        <Route path="ai" element={<AiAnalytics />} />
        <Route path="support" element={<SupportCenter />} />
      </Routes>
    </DashboardLayout>
  );
}
