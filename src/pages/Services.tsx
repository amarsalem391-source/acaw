import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { Link } from "react-router-dom";
import { Globe, Smartphone, Database, Cloud, Palette, TrendingUp, Server, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardDetailsDialog, { CardDetails } from "@/components/CardDetailsDialog";

const services = [
  {
    icon: Globe,
    title: "تطوير المواقع",
    description: "نصمم ونطور مواقع ويب احترافية وسريعة ومتوافقة مع جميع الأجهزة. نستخدم أحدث التقنيات مثل React و Next.js لضمان أفضل أداء وتجربة مستخدم.",
    features: ["تصميم متجاوب", "SEO محسّن", "سرعة عالية", "إدارة محتوى"],
  },
  {
    icon: Smartphone,
    title: "تطبيقات الموبايل",
    description: "نطور تطبيقات موبايل لنظامي iOS و Android باستخدام Flutter و React Native. تطبيقات سلسة وجذابة تقدم تجربة مستخدم استثنائية.",
    features: ["iOS & Android", "واجهة جذابة", "أداء عالي", "تحديثات مستمرة"],
  },
  {
    icon: Database,
    title: "أنظمة إدارة الأعمال",
    description: "نبني أنظمة ERP و CRM مخصصة لإدارة أعمالك بكفاءة. من إدارة المخزون إلى العملاء والمبيعات والتقارير المتقدمة.",
    features: ["إدارة مخزون", "إدارة عملاء", "تقارير ذكية", "تكامل كامل"],
  },
  {
    icon: Cloud,
    title: "الحلول السحابية",
    description: "نقدم خدمات الاستضافة السحابية والنقل إلى السحابة. حلول مرنة وآمنة تضمن توفر خدماتك على مدار الساعة.",
    features: ["استضافة آمنة", "نسخ احتياطي", "توسع مرن", "دعم 24/7"],
  },
  {
    icon: Palette,
    title: "تصميم UI/UX",
    description: "نصمم واجهات مستخدم جذابة وتجارب استخدام سلسة. نهتم بكل تفصيل لضمان رضا المستخدمين وتحقيق أهدافك.",
    features: ["بحث مستخدمين", "نماذج أولية", "اختبار A/B", "تصميم تفاعلي"],
  },
  {
    icon: TrendingUp,
    title: "التسويق الرقمي",
    description: "استراتيجيات تسويقية متكاملة لزيادة وصولك للعملاء المستهدفين. من تحسين محركات البحث إلى الإعلانات المدفوعة.",
    features: ["SEO", "إعلانات مدفوعة", "سوشيال ميديا", "تحليلات"],
  },
  {
    icon: Server,
    title: "التكامل والـ APIs",
    description: "نبني واجهات برمجية APIs قوية ونربط أنظمتك المختلفة ببعضها. تكامل سلس مع الخدمات الخارجية وبوابات الدفع.",
    features: ["REST APIs", "تكامل أنظمة", "بوابات دفع", "توثيق شامل"],
  },
  {
    icon: ShieldCheck,
    title: "الأمن السيبراني",
    description: "نحمي أنظمتك وبياناتك من التهديدات الإلكترونية. فحص أمني شامل وتطبيق أفضل ممارسات الأمان.",
    features: ["فحص ثغرات", "تشفير البيانات", "جدران حماية", "مراقبة أمنية"],
  },
];

const Services = () => {
  const [selected, setSelected] = useState<CardDetails | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4">
        <section className="py-24 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm mb-4 block">خدماتنا</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                حلول تقنية <span className="gradient-text">شاملة ومتكاملة</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                نقدم مجموعة واسعة من الخدمات التقنية لتلبية جميع احتياجاتك الرقمية
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <button
                    key={index}
                    onClick={() =>
                      setSelected({
                        title: service.title,
                        description: service.description,
                        features: service.features,
                        icon: <Icon className="w-6 h-6 text-primary" />,
                      })
                    }
                    className="glass-card rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 text-right"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{service.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <span className="inline-block mt-4 text-primary text-sm font-medium">عرض التفاصيل ←</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center mt-16">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  طلب خدمة
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <CardDetailsDialog details={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
};

export default Services;
