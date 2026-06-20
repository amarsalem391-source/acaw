# Acwad Learning Platform — Build Plan

سأبني المنصة على الموقع الحالي تحت مسار `/platform` باستخدام Lovable Cloud (Supabase) + React + Tailwind + shadcn.

## 1. قاعدة البيانات (Migration واحد)

جداول جديدة:

- `profiles` (user_id, full_name, avatar_url, phone)
- توسيع `app_role` enum: `student`, `instructor`, `parent`, `admin`, `super_admin` (مع الإبقاء على الموجود)
- `courses` (instructor_id, title, description, category, price, thumbnail, status: draft/pending/approved/rejected)
- `lessons` (course_id, title, order, video_url, status: pending/approved/rejected, reviewed_by, reject_reason)
- `enrollments` (student_id, course_id, progress)
- `assignments` (course_id, title, due_date)
- `parent_children` (parent_id, student_id) — ربط ولي الأمر بأبنائه
- `notifications` (user_id, title, body, read)

كل جدول: GRANT + RLS + سياسات حسب الدور باستخدام `has_role()`.
Trigger على `auth.users` ينشئ profile تلقائياً.

## 2. التسجيل والدخول

**صفحة `/platform/signup`:**

- خطوة 1: اختيار نوع الحساب (طالب / مدرب / ولي أمر / أدمن / سوبر أدمن) — بطاقات بصرية
- خطوة 2: إيميل + كلمة سر + اسم
- إذا اختار أدمن أو سوبر أدمن → حقل إضافي **"رمز التفعيل"** يجب أن يساوي `acwadtechnology2026@gmail.com` (يُتحقق منه في Edge Function آمنة، ليس client-side) — وإلا الحساب يُرفض
- بعد إنشاء الحساب → Edge Function `assign-role` تُدخل الدور في `user_roles` بعد التحقق من الرمز السري (السر مخزّن في `ADMIN_SIGNUP_CODE` secret)

**صفحة `/platform/login`:**

- إيميل + كلمة سر + Google OAuth
- بعد الدخول: hook يقرأ دور المستخدم ويوجّه:
  - student → `/platform/student`
  - instructor → `/platform/instructor`
  - parent → `/platform/parent`
  - admin → `/platform/admin`
  - super_admin → `/platform/super-admin`

Google OAuth أول مرة → شاشة اختيار النوع (طالب/مدرب/ولي أمر فقط، بدون أدمن).

`ProtectedRoute` يحرس كل dashboard ويرفض من ليس له الدور المناسب.

## 3. الخمس Dashboards

كل dashboard له layout موحّد: Sidebar + Topbar + محتوى. تصميم SaaS عصري، glassmorphism، dark/light، RTL.

**Student** (`/platform/student/*`): الرئيسية، كل الدورات، دوراتي، الدروس (يشاهد فقط الفيديوهات المعتمدة `status=approved`)، الواجبات، الاختبارات، الشهادات، التقدم، AI Tutor، الإشعارات.

**Instructor** (`/platform/instructor/*`): الرئيسية، دوراتي، إنشاء دورة، إدارة الدروس، **رفع فيديو** (يُحفظ بحالة `pending` ولا يظهر للطالب)، الواجبات، الاختبارات، الطلاب، الأرباح، الإحصائيات.

**Parent** (`/platform/parent/*`): الرئيسية، أبنائي، التقدم، الدرجات، الحضور، الشهادات، الفواتير، AI Insights.

**Admin** (`/platform/admin/*`): إدارة المستخدمين (طالب/مدرب/ولي أمر فقط)، إدارة الدورات، **مراجعة الفيديوهات** (Approve/Reject مع سبب)، التصنيفات، المدفوعات، الشهادات، التقارير، أكواد الخصم.

**Super Admin** (`/platform/super-admin/*`): كل ما سبق + إدارة الأدوار والصلاحيات + إنشاء/حذف Admins + إعدادات المنصة + Security Center + سجل العمليات + النسخ الاحتياطي + إعدادات الدفع + API.

## 4. سير عمل الفيديو (Video Approval)

1. المدرب يرفع لينك  فيديو في درس → `lessons.status = 'pending'`
2. يظهر في صفحة **"مراجعة الفيديوهات"** عند Admin/Super Admin
3. Approve → `status='approved'` → يظهر للطلاب المسجلين
4. Reject → `status='rejected'` + سبب → إشعار للمدرب
5. RLS: الطالب يقرأ الدروس فقط حيث `status='approved'`  
`الادمين او السوبر ادمين تروح الدرس الي رفعه المدرب الدمين او السوبر ادمين يعمل ابروف او رجيكت` 

## 5. الملفات الجديدة (مختصر)

- `supabase/functions/assign-role/index.ts` — تحقق سرّي من رمز الأدمن
- `src/contexts/PlatformAuthContext.tsx` — يقرأ دور المستخدم
- `src/components/platform/RoleGuard.tsx`, `DashboardLayout.tsx`, `Sidebar.tsx`
- `src/pages/platform/auth/Login.tsx`, `Signup.tsx`, `RoleSelect.tsx`
- `src/pages/platform/student/*` (10+ صفحة)
- `src/pages/platform/instructor/*` (10+ صفحة)
- `src/pages/platform/parent/*` (8+ صفحة)
- `src/pages/platform/admin/*` (10+ صفحة) — تشمل `VideoReview.tsx`
- `src/pages/platform/super-admin/*` (12+ صفحة)
- تحديث `src/App.tsx` بكل المسارات

## ملاحظات تقنية

- الرمز السري للأدمن `acwadtechnology2026@gmail.com` سيُخزَّن كـ secret اسمه `ADMIN_SIGNUP_CODE` في Lovable Cloud، ولا يظهر أبداً في كود الواجهة الأمامية.
- منع التسجيل المجهول، تفعيل HIBP، Google OAuth مُفعَّل.
- 2FA و Session Management في هذه المرحلة UI فقط (placeholders) لتجنّب نفخ الـ scope.
- الدفعات (Stripe/PayPal) و AI Tutor الفعلي يُجهَّز كـ UI placeholder ويُربَط لاحقاً.

## نطاق هذه الجولة

بسبب حجم المشروع الضخم، سأنفّذ في هذه الجولة:

1. الـ migration كاملاً
2. Auth (signup مع اختيار الدور + رمز الأدمن السري + login + redirect)
3. الخمس layouts و sidebars
4. صفحة "إدارة الفيديوهات" للمدرب (رفع) + صفحة "مراجعة" للأدمن (approve/reject) — السير الكامل
5. الصفحة الرئيسية لكل dashboard مع بطاقات stats حقيقية

بقية الصفحات التفصيلية (assignments, certificates, AI tutor…) تُبنى في جولات تالية بنفس النمط.

موافق أبدأ؟