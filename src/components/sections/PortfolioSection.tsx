import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardDetailsDialog, { CardDetails } from "@/components/CardDetailsDialog";

const projects = [
  {
    title: "متجر إلكتروني",
    category: "تجارة إلكترونية",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    description: "متجر إلكتروني متكامل بسلة شراء، نظام دفع آمن، إدارة منتجات، ودعم متعدد العملات لتوفير تجربة تسوق سلسة للعملاء.",
    features: ["سلة شراء", "بوابات دفع", "إدارة منتجات", "تقارير مبيعات"],
  },
  {
    title: "تطبيق توصيل",
    category: "تطبيقات موبايل",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    description: "تطبيق توصيل احترافي للعملاء والكباتن مع تتبع الطلبات في الوقت الفعلي، خرائط ذكية، وإشعارات فورية.",
    features: ["تتبع مباشر", "خرائط GPS", "إشعارات", "محفظة إلكترونية"],
  },
  {
    title: "نظام إدارة مستشفى",
    category: "أنظمة إدارة",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    description: "نظام شامل لإدارة المستشفيات يشمل ملفات المرضى، حجز المواعيد، الفواتير، والتقارير الطبية.",
    features: ["ملفات المرضى", "حجز مواعيد", "فواتير", "تقارير طبية"],
  },
  {
    title: "منصة تعليمية",
    category: "منصات تعليمية",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
    description: "منصة تعليم إلكتروني تفاعلية مع دروس فيديو، اختبارات، شهادات، ولوحة تحكم للطلاب والمعلمين.",
    features: ["دروس فيديو", "اختبارات", "شهادات", "لوحة تحكم"],
  },
];

const PortfolioSection = () => {
  const [selected, setSelected] = useState<CardDetails | null>(null);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm mb-4 block">أعمالنا</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            مشاريع <span className="gradient-text">نفتخر بها</span>
          </h2>
          <p className="text-muted-foreground">
            نماذج من المشاريع التي قمنا بتنفيذها لعملائنا بنجاح
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <button
              key={index}
              onClick={() => setSelected(project)}
              className="group relative overflow-hidden rounded-2xl glass-card text-right"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-primary text-sm font-medium">{project.category}</span>
                <h3 className="text-xl font-bold mt-1">{project.title}</h3>
                <span className="inline-block mt-2 text-primary text-sm">عرض التفاصيل ←</span>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/portfolio" className="flex items-center gap-2">
              جميع المشاريع
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CardDetailsDialog details={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </section>
  );
};

export default PortfolioSection;
