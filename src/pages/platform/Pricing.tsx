import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

const PlatformPricing = () => {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      name: ar ? "مجاني" : "Free",
      desc: ar ? "ابدأ رحلتك التعليمية" : "Start your journey",
      monthly: 0, yearly: 0,
      features: ar
        ? ["وصول لـ 10 دورات مجانية", "ملف شخصي أساسي", "منتديات المجتمع", "شهادات إتمام مجانية"]
        : ["Access to 10 free courses", "Basic profile", "Community forums", "Free completion certificates"],
      cta: ar ? "ابدأ مجاناً" : "Start Free",
      featured: false,
    },
    {
      name: ar ? "الطالب" : "Student",
      desc: ar ? "للطلاب الجادين" : "For serious learners",
      monthly: 19, yearly: 190,
      features: ar
        ? ["كل الدورات المتاحة", "AI Tutor مساعد ذكي", "شهادات معتمدة", "تحميل الفيديوهات", "دعم فني سريع", "متابعة التقدم"]
        : ["All courses included", "AI Tutor assistant", "Verified certificates", "Download videos", "Priority support", "Progress tracking"],
      cta: ar ? "اشترك الآن" : "Subscribe Now",
      featured: true,
    },
    {
      name: ar ? "العائلة" : "Family",
      desc: ar ? "للعائلات وأولياء الأمور" : "For parents & families",
      monthly: 39, yearly: 390,
      features: ar
        ? ["حتى 5 حسابات أبناء", "لوحة ولي أمر", "تقارير شهرية", "كل مميزات خطة الطالب", "AI Parent Insights", "دعم مخصص 24/7"]
        : ["Up to 5 child accounts", "Parent dashboard", "Monthly reports", "All Student features", "AI Parent Insights", "24/7 dedicated support"],
      cta: ar ? "ابدأ الآن" : "Get Started",
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <span className="text-primary font-semibold text-sm mb-3 block">Acwad Learning</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {ar ? (<>أسعار <span className="gradient-text">مرنة</span> للجميع</>) : (<>Flexible <span className="gradient-text">Pricing</span> for All</>)}
            </h1>
            <p className="text-muted-foreground text-lg">
              {ar ? "اختر الخطة المناسبة لك ولأسرتك" : "Choose the plan that fits you and your family"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={!yearly ? "font-semibold" : "text-muted-foreground"}>{ar ? "شهري" : "Monthly"}</span>
            <button
              onClick={() => setYearly(!yearly)}
              className="relative w-14 h-7 rounded-full bg-primary/20 transition-colors"
            >
              <span className={`absolute top-1 ${yearly ? "left-1" : "left-8"} w-5 h-5 rounded-full bg-primary transition-all`} />
            </button>
            <span className={yearly ? "font-semibold" : "text-muted-foreground"}>
              {ar ? "سنوي" : "Yearly"} <Badge variant="secondary" className="ms-1">-17%</Badge>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 ${
                  plan.featured
                    ? "bg-gradient-to-br from-primary/20 via-primary/10 to-background border-2 border-primary shadow-2xl scale-105"
                    : "glass-card"
                }`}
              >
                {plan.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1">
                    <Sparkles className="w-3 h-3" /> {ar ? "الأكثر شعبية" : "Most Popular"}
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${yearly ? plan.yearly : plan.monthly}</span>
                  <span className="text-muted-foreground">/{yearly ? (ar ? "سنة" : "yr") : (ar ? "شهر" : "mo")}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.featured ? "default" : "outline"} size="lg">
                  <Link to="/platform/login">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-12">
            {ar ? "جميع الخطط تشمل ضمان استرداد المبلغ خلال 14 يوماً" : "All plans include a 14-day money-back guarantee"}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlatformPricing;
