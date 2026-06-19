import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "فريق من المطورين المحترفين بخبرة عالية",
  "استخدام أحدث التقنيات والأدوات",
  "التزام تام بالجودة والمواعيد",
  "دعم فني متواصل على مدار الساعة",
  "أسعار تنافسية وخطط مرنة",
  "حلول مخصصة حسب احتياجاتك",
];

const AboutSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm mb-4 block">من نحن</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              شركاء نجاحك في <span className="gradient-text">العالم الرقمي</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              أكواد تيكنولوجي شركة سعودية متخصصة في تطوير البرمجيات والحلول التقنية المبتكرة. 
              نسعى لتحويل أفكار عملائنا إلى منتجات رقمية ناجحة تساهم في نمو أعمالهم وتحقيق أهدافهم.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" asChild>
              <Link to="/about" className="flex items-center gap-2">
                اعرف المزيد
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              <div className="glass-card rounded-3xl p-8 glow-effect">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 rounded-2xl bg-muted/50">
                    <div className="text-4xl font-bold gradient-text mb-2">+150</div>
                    <div className="text-muted-foreground text-sm">مشروع منجز</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-muted/50">
                    <div className="text-4xl font-bold gradient-text mb-2">+50</div>
                    <div className="text-muted-foreground text-sm">عميل راضي</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-muted/50">
                    <div className="text-4xl font-bold gradient-text mb-2">+10</div>
                    <div className="text-muted-foreground text-sm">سنوات خبرة</div>
                  </div>
                  <div className="text-center p-6 rounded-2xl bg-muted/50">
                    <div className="text-4xl font-bold gradient-text mb-2">+20</div>
                    <div className="text-muted-foreground text-sm">مطور محترف</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-full h-full bg-primary/5 rounded-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
