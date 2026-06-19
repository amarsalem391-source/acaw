import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Code2, Server, Smartphone, Palette, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "201503500549";

const Careers = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cv: "", experience: "" });
  const [sending, setSending] = useState(false);

  const jobs = [
    {
      icon: Code2,
      key: "Frontend Developer",
      title: language === "ar" ? "مطور واجهات أمامية" : "Frontend Developer",
      desc:
        language === "ar"
          ? "React, TypeScript, Tailwind CSS - بناء واجهات حديثة وسريعة"
          : "React, TypeScript, Tailwind CSS - build modern fast UIs",
    },
    {
      icon: Server,
      key: "Backend Developer",
      title: language === "ar" ? "مطور خلفية" : "Backend Developer",
      desc:
        language === "ar"
          ? "Node.js, Supabase, PostgreSQL - تطوير أنظمة قوية وقابلة للتوسع"
          : "Node.js, Supabase, PostgreSQL - scalable backend systems",
    },
    {
      icon: Smartphone,
      key: "Flutter Developer",
      title: language === "ar" ? "مطور Flutter" : "Flutter Developer",
      desc:
        language === "ar"
          ? "بناء تطبيقات موبايل عبر المنصات بأداء عالي"
          : "Build cross-platform mobile apps with high performance",
    },
    {
      icon: Palette,
      key: "UI/UX Designer",
      title: language === "ar" ? "مصمم UI/UX" : "UI/UX Designer",
      desc:
        language === "ar"
          ? "Figma, Adobe XD - تصميم تجارب مستخدم استثنائية"
          : "Figma, Adobe XD - design exceptional user experiences",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast({ title: language === "ar" ? "اختر وظيفة أولاً" : "Choose a job first" });
      return;
    }
    setSending(true);
    const lines = [
      language === "ar" ? "طلب توظيف جديد - Acwad Technology" : "New Job Application - Acwad Technology",
      "",
      `${language === "ar" ? "الوظيفة" : "Position"}: ${selected}`,
      `${language === "ar" ? "الاسم" : "Name"}: ${form.name}`,
      `${language === "ar" ? "البريد" : "Email"}: ${form.email}`,
      `${language === "ar" ? "الجوال" : "Phone"}: ${form.phone}`,
      `${language === "ar" ? "رابط السيرة الذاتية" : "CV Link"}: ${form.cv}`,
      "",
      `${language === "ar" ? "الخبرات" : "Experience"}:`,
      form.experience,
    ];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast({
      title: language === "ar" ? "تم إرسال الطلب" : "Application sent",
      description: language === "ar" ? "سنتواصل معك قريباً" : "We'll be in touch soon",
    });
    setForm({ name: "", email: "", phone: "", cv: "", experience: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <span className="text-primary font-semibold text-sm mb-3 block">
              {language === "ar" ? "انضم إلينا" : "Join Us"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "ar" ? (
                <>الوظائف <span className="gradient-text">المتاحة</span></>
              ) : (
                <>Open <span className="gradient-text">Positions</span></>
              )}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === "ar"
                ? "نبحث عن مواهب تشاركنا الشغف ببناء منتجات تقنية متميزة"
                : "We're looking for talents who share our passion for building exceptional tech products"}
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {jobs.map((j) => {
                const Icon = j.icon;
                const active = selected === j.key;
                return (
                  <button
                    key={j.key}
                    onClick={() => setSelected(j.key)}
                    className={`glass-card text-start rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                      active ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{j.title}</h3>
                    <p className="text-sm text-muted-foreground">{j.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto glass-card rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-2">
                {language === "ar" ? "نموذج التقديم" : "Application Form"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {selected
                  ? `${language === "ar" ? "تتقدم لوظيفة" : "Applying for"}: ${selected}`
                  : language === "ar"
                  ? "اختر وظيفة أعلاه ثم املأ النموذج"
                  : "Select a position above then fill the form"}
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === "ar" ? "الاسم الكامل" : "Full Name"}
                    </label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === "ar" ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <Input
                      required
                      type="email"
                      dir="ltr"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === "ar" ? "رقم الجوال" : "Phone"}
                    </label>
                    <Input
                      required
                      dir="ltr"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === "ar" ? "رابط السيرة الذاتية (CV)" : "CV Link"}
                    </label>
                    <Input
                      required
                      dir="ltr"
                      placeholder="https://drive.google.com/..."
                      value={form.cv}
                      onChange={(e) => setForm({ ...form, cv: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "خبراتك ومهاراتك" : "Your Experience & Skills"}
                  </label>
                  <Textarea
                    required
                    rows={5}
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="bg-muted/50 resize-none"
                  />
                </div>
                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={sending}>
                  {language === "ar" ? "إرسال الطلب" : "Submit Application"}
                  <Send className="w-5 h-5 ms-2" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
