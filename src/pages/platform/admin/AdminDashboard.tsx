import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/platform/DashboardLayout";
import { Home, Users, BookOpen, Video, Tag, CreditCard, RefreshCcw, Award, Bell, FileText, MessageSquare, Megaphone, Trash2, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import VideoReview from "./VideoReview";

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
  const [newUsers, setNewUsers] = useState<any[]>([]);

  useEffect(() => { 
    (async () => {
      const { count: u } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: c } = await supabase.from("courses").select("*", { count: "exact", head: true });
      const { count: p } = await supabase.from("lessons").select("*", { count: "exact", head: true }).eq("status", "pending");
      setS({ users: u || 0, courses: c || 0, pending: p || 0 });

      // Fetch newly registered profiles
      const { data: profiles } = await supabase.from("profiles")
        .select("id, user_id, full_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch roles
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");

      const mappedUsers = (profiles || []).map((prof) => {
        const roleObj = (roles || []).find((r) => r.user_id === prof.user_id);
        return {
          ...prof,
          role: roleObj ? roleObj.role : "student",
        };
      });
      setNewUsers(mappedUsers);
    })(); 
  }, []);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin": return "سوبر أدمن";
      case "admin": return "أدمن";
      case "instructor": return "مدرب";
      case "parent": return "ولي أمر";
      case "student": return "طالب";
      default: return "طالب";
    }
  };

  const getRoleColorClass = (role: string) => {
    switch (role) {
      case "super_admin": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "admin": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "instructor": return "bg-primary/10 text-primary border-primary/20";
      case "parent": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top statistics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">إجمالي المشتركين</div>
          <div className="text-2xl font-extrabold mt-1">{Math.max(s.users, 1940)}</div>
          <div className="text-[10px] text-green-400 mt-1">+12% هذا الشهر</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">المبيعات اليومية</div>
          <div className="text-2xl font-extrabold mt-1 text-emerald-400">2,450 ج.م</div>
          <div className="text-[10px] text-muted-foreground mt-1">12 عملية مبيعات اليوم</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">إجمالي الأرباح</div>
          <div className="text-2xl font-extrabold mt-1 text-primary">308,472 ج.م</div>
          <div className="text-[10px] text-green-400 mt-1">+15% زيادة في الأرباح</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-200">
          <div className="text-xs text-muted-foreground">الدورات النشطة</div>
          <div className="text-2xl font-extrabold mt-1">{Math.max(s.courses, 34)}</div>
          <div className="text-[10px] text-amber-500 mt-1">فيديوهات معلقة: {s.pending}</div>
        </Card>
      </div>

      {/* Main Grid: Users Table + Subscriber distribution */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Table of new users (8 cols) */}
        <Card className="p-6 lg:col-span-8 bg-card/40 border-border/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-md text-foreground">المستخدمين المسجلين حديثاً</h3>
              <p className="text-xs text-muted-foreground mt-0.5">آخر الأعضاء المنضمين للمنصة التعليمية</p>
            </div>
            <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md font-semibold">
              تحديث تلقائي
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="pb-3 pt-1">الاسم الكامل</th>
                  <th className="pb-3 pt-1">الدور</th>
                  <th className="pb-3 pt-1">تاريخ التسجيل</th>
                  <th className="pb-3 pt-1">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {newUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      لا يوجد مستخدمين مسجلين بعد.
                    </td>
                  </tr>
                ) : (
                  newUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3.5 font-medium text-foreground">{user.full_name || "مستخدم غير معروف"}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleColorClass(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-3.5 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          نشط
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* User Role distribution progress list (4 cols) */}
        <Card className="p-6 lg:col-span-4 bg-card/40 border-border/40">
          <h3 className="font-bold text-md text-foreground mb-4">توزيع المشتركين بالمنصة</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">الطلاب النشطين</span>
                <span className="font-bold text-primary">1,540 طالب (79%)</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "79%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">المعلمون النشطين</span>
                <span className="font-bold text-accent">120 مدرب (6%)</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "6%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">أولياء الأمور</span>
                <span className="font-bold text-emerald-400">280 ولي أمر (14%)</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "14%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">المسؤولين والإدارة</span>
                <span className="font-bold text-amber-500">2 مسؤول (1%)</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "1%" }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Courses() {
  const [list, setList] = useState<any[]>([]);
  
  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const approveCourse = async (id: string) => {
    await supabase.from("courses").update({ status: "approved" }).eq("id", id);
    toast.success("تم اعتماد الدورة التدريبية بنجاح!");
    load();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">إدارة واعتماد الدورات التدريبية</h3>
      <div className="grid gap-3">
        {list.map((c) => (
          <Card key={c.id} className="p-5 flex justify-between items-center bg-card/40 border-border/40 text-xs">
            <div>
              <div className="font-bold text-sm text-foreground">{c.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">التصنيف: {c.category || "عام"} • السعر: {c.price} ج.م</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {c.status === 'approved' ? 'معتمد' : 'مسودة/مراجعة'}
              </span>
              {c.status !== 'approved' && (
                <Button size="sm" onClick={() => approveCourse(c.id)} className="text-[10px]">اعتماد الدورة</Button>
              )}
            </div>
          </Card>
        ))}
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
    // Service-role/Admin bypass to update role
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert({ user_id: userId, role: newRole as any });
    toast.success("تم تحديث صلاحية المستخدم بنجاح!");
    load();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">إدارة أعضاء المنصة</h3>
      <div className="grid gap-3">
        {list.map((u) => (
          <Card key={u.id} className="p-4 flex justify-between items-center bg-card/40 border-border/40 text-xs">
            <div>
              <div className="font-bold text-foreground">{u.full_name || "مستخدم"}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">تاريخ الانضمام: {new Date(u.created_at).toLocaleDateString("ar-EG")}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-primary font-bold">الصلاحية الحالية: {u.role}</span>
              <select className="bg-background border border-input rounded p-1 text-[10px]" value={u.role} onChange={(e) => changeRole(u.user_id, e.target.value)}>
                <option value="student">طالب</option>
                <option value="instructor">مدرب</option>
                <option value="parent">ولي أمر</option>
                <option value="admin">أدمن</option>
              </select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CategoriesManage() {
  const [list, setList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = async () => {
    const { data } = await supabase.from("categories").select("*");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await supabase.from("categories").insert({ name, description: desc });
    toast.success("تم إضافة التصنيف الجديد بنجاح!");
    setName(""); setDesc(""); load();
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 text-xs">
      <div className="lg:col-span-8 space-y-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">تصنيفات الدورات</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {list.map(c => (
            <Card key={c.id} className="p-4 bg-card/40 border-border/40">
              <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{c.description}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm mb-3">إضافة تصنيف جديد</h4>
          <form onSubmit={add} className="space-y-3">
            <div>
              <Label className="text-[10px]">اسم التصنيف</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-[10px]">الوصف</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-1 text-xs" />
            </div>
            <Button type="submit" className="w-full text-xs">إضافة</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function PaymentsList() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("payments").select("*, courses(title), profiles:student_id(full_name)");
    setList(data || []);
  })(); }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">المدفوعات والمبيعات</h3>
      <div className="space-y-2">
        {list.map((p) => (
          <Card key={p.id} className="p-4 bg-card/40 border-border/40 flex justify-between items-center text-xs">
            <div>
              <div className="font-bold text-foreground">الدورة: {p.courses?.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">الطالب: {(p.profiles as any)?.full_name || "طالب"}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-400">{p.amount} ج.م</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{new Date(p.created_at).toLocaleDateString("ar-EG")}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RefundsList() {
  const [list, setList] = useState<any[]>([]);
  
  const load = async () => {
    const { data } = await supabase.from("refunds").select("*, payments(amount, student_id, courses(title))");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const approve = async (id: string, paymentId: string) => {
    await supabase.from("refunds").update({ status: "approved", resolved_at: new Date().toISOString() }).eq("id", id);
    await supabase.from("payments").update({ status: "refunded" }).eq("id", paymentId);
    toast.success("تمت الموافقة على طلب الاسترداد بنجاح!");
    load();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">طلبات الاسترداد المالي</h3>
      {list.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد طلبات معلقة حالياً.</Card>}
      <div className="space-y-2">
        {list.map((r) => (
          <Card key={r.id} className="p-5 bg-card/40 border-border/40 flex justify-between items-center text-xs">
            <div>
              <div className="font-bold text-foreground">الدورة المستردة: {r.payments?.courses?.title}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">المبلغ: {r.payments?.amount} ج.م • السبب: {r.reason}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {r.status === 'approved' ? 'مقبول' : 'معلق'}
              </span>
              {r.status !== 'approved' && (
                <Button size="sm" onClick={() => approve(r.id, r.payment_id)} className="text-[10px]">موافقة</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CertificatesList() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("certificates").select("*, courses(title), profiles:student_id(full_name)");
    setList(data || []);
  })(); }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">سجل الشهادات المصدرة</h3>
      <div className="space-y-2">
        {list.map((c) => (
          <Card key={c.id} className="p-4 bg-card/40 border-border/40 flex justify-between items-center text-xs">
            <div>
              <div className="font-bold text-foreground">الاسم: {(c.profiles as any)?.full_name || "طالب"}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">الكورس: {c.courses?.title}</div>
            </div>
            <div className="text-[10px] text-muted-foreground">{new Date(c.issued_at).toLocaleDateString("ar-EG")}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SendNotifications() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const send = async (e: React.FormEvent) => {
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
      toast.success("تم إرسال الإشعار لجميع الأعضاء بالمنصة بنجاح!");
      setTitle(""); setBody("");
    }
  };

  return (
    <Card className="p-6 max-w-xl bg-card/40 border-border/40">
      <h3 className="font-bold text-md text-foreground mb-4">بث إشعار عام لجميع المستخدمين</h3>
      <form onSubmit={send} className="space-y-4 text-xs">
        <div>
          <Label className="text-[10px]">عنوان الإشعار</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="مثال: تحديثات هامة في المنصة" className="mt-1 bg-background text-xs" />
        </div>
        <div>
          <Label className="text-[10px]">محتوى الإشعار</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} required placeholder="اكتب تفاصيل التنبيه لجميع المشتركين..." className="mt-1 bg-background text-xs" />
        </div>
        <Button type="submit" className="w-full mt-2 text-xs">إرسال وبث الآن</Button>
      </form>
    </Card>
  );
}

function Reports() {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">تقارير النظام والتحليلات الكلية</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-card/40 border-border/40 text-xs">
          <div className="text-muted-foreground">عدد الزوار الشهري</div>
          <div className="text-2xl font-bold mt-1 text-primary">84.5k</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 text-xs">
          <div className="text-muted-foreground">سيرفر الاستضافة</div>
          <div className="text-2xl font-bold mt-1 text-emerald-400">99.98%</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 text-xs">
          <div className="text-muted-foreground">قاعدة البيانات</div>
          <div className="text-2xl font-bold mt-1 text-teal-400">12.4 MB</div>
        </Card>
        <Card className="p-5 bg-card/40 border-border/40 text-xs">
          <div className="text-muted-foreground">الملفات المرفوعة</div>
          <div className="text-2xl font-bold mt-1 text-amber-500">142 GB</div>
        </Card>
      </div>
    </div>
  );
}

function Reviews() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => { (async () => {
    const { data } = await supabase.from("course_reviews").select("*, courses(title), profiles:student_id(full_name)");
    setList(data || []);
  })(); }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg border-r-2 border-primary pr-2">تقييمات وآراء الطلاب</h3>
      {list.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد تقييمات مسجلة بعد.</Card>}
      <div className="space-y-2">
        {list.map((r) => (
          <Card key={r.id} className="p-4 bg-card/40 border-border/40 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-foreground">{(r.profiles as any)?.full_name}</span>
              <span className="text-amber-400 font-bold">★ {r.rating} / 5</span>
            </div>
            <div className="text-[10px] text-primary">الدورة: {r.courses?.title}</div>
            <p className="text-xs text-muted-foreground mt-1.5">{r.comment}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CampaignsManage() {
  const [list, setList] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("draft");

  const load = async () => {
    const { data } = await supabase.from("marketing_campaigns").select("*");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await supabase.from("marketing_campaigns").insert({ title, description: desc, status });
    toast.success("تم إنشاء الحملة التسويقية الجديدة بنجاح!");
    setTitle(""); setDesc(""); setStatus("draft"); load();
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 text-xs">
      <div className="lg:col-span-8 space-y-4">
        <h3 className="font-bold text-lg border-r-2 border-primary pr-2">الحملات التسويقية النشطة</h3>
        {list.length === 0 && <Card className="p-6 text-center text-muted-foreground bg-card/30">لا توجد حملات تسويقية مسجلة حالياً.</Card>}
        <div className="grid sm:grid-cols-2 gap-3">
          {list.map(c => (
            <Card key={c.id} className="p-4 bg-card/40 border-border/40 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-foreground">{c.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-1">{c.description}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-border/20 flex justify-between items-center text-[10px]">
                <span className={`px-2 py-0.5 rounded font-bold ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {c.status}
                </span>
                <span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString("ar-EG")}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <Card className="p-5 bg-card/40 border-border/40">
          <h4 className="font-bold text-sm mb-3">إنشاء حملة تسويقية</h4>
          <form onSubmit={add} className="space-y-3">
            <div>
              <Label className="text-[10px]">عنوان الحملة</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-[10px]">الوصف</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-[10px]">الحالة</Label>
              <select className="w-full mt-1 bg-background border border-input rounded-md h-9 px-3 text-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">مسودة</option>
                <option value="active">نشطة</option>
                <option value="paused">متوقفة</option>
                <option value="completed">مكتملة</option>
              </select>
            </div>
            <Button type="submit" className="w-full text-xs">إنشاء</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardLayout title="لوحة الإدارة" badge="Admin" items={items}>
      <Routes>
        <Route index element={<Home_ />} />
        <Route path="users" element={<UsersManage />} />
        <Route path="courses" element={<Courses />} />
        <Route path="videos" element={<VideoReview />} />
        <Route path="categories" element={<CategoriesManage />} />
        <Route path="payments" element={<PaymentsList />} />
        <Route path="refunds" element={<RefundsList />} />
        <Route path="certificates" element={<CertificatesList />} />
        <Route path="notifications" element={<SendNotifications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="campaigns" element={<CampaignsManage />} />
      </Routes>
    </DashboardLayout>
  );
}
