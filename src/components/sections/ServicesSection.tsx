import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Smartphone, Database, Cloud, Palette, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardDetailsDialog, { CardDetails } from "@/components/CardDetailsDialog";

const services = [
  {
    icon: Globe,
    title: "تطوير المواقع",
    description: "نصمم ونطور مواقع ويب احترافية وسريعة وآمنة تتوافق مع جميع الأجهزة باستخدام أحدث التقنيات مثل React و Next.js لضمان أفضل أداء وتجربة مستخدم.",
    features: ["تصميم متجاوب", "SEO محسّن", "سرعة عالية", "إدارة محتوى"],
  },
  {
    icon: Smartphone,
    title: "تطبيقات الموبايل",
    description: "نطور تطبيقات iOS و Android بتجربة مستخدم استثنائية باستخدام Flutter و React Native، مع التركيز على الأداء والتصميم الجذاب.",
    features: ["iOS & Android", "واجهة جذابة", "أداء عالي", "تحديثات مستمرة"],
  },
  {
    icon: Database,
    title: "أنظمة إدارة",
    description: "أنظمة ERP و CRM مخصصة لإدارة أعمالك بكفاءة. من إدارة المخزون إلى العملاء والمبيعات والتقارير المتقدمة.",
    features: ["إدارة مخزون", "إدارة عملاء", "تقارير ذكية", "تكامل كامل"],
  },
  {
    icon: Cloud,
    title: "الحلول السحابية",
    description: "استضافة وخدمات سحابية عالية الأداء والأمان. حلول مرنة وآمنة تضمن توفر خدماتك على مدار الساعة.",
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
    description: "استراتيجيات تسويقية فعالة لزيادة وصولك للعملاء. من تحسين محركات البحث إلى الإعلانات المدفوعة.",
    features: ["SEO", "إعلانات مدفوعة", "سوشيال ميديا", "تحليلات"],
  },
];

const ServicesSection = () => {
  const [selected, setSelected] = useState<CardDetails | null>(null);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm mb-4 block">خدماتنا</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            حلول تقنية <span className="gradient-text">متكاملة</span>
          </h2>
          <p className="text-muted-foreground">
            نقدم مجموعة شاملة من الخدمات التقنية لمساعدتك في تحقيق أهدافك الرقمية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="group glass-card rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 text-right"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed line-clamp-3">{service.description}</p>
                <span className="inline-block mt-4 text-primary text-sm font-medium">عرض التفاصيل ←</span>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/services" className="flex items-center gap-2">
              جميع الخدمات
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CardDetailsDialog details={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </section>
  );
};

export default ServicesSection;
