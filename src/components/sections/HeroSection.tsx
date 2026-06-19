import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Code2, Zap, Shield, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t, language } = useLanguage();
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  const stats = language === "ar" 
    ? [
        { value: "+150", label: "مشروع منجز" },
        { value: "+50", label: "عميل سعيد" },
        { value: "+10", label: "سنوات خبرة" },
        { value: "24/7", label: "دعم فني" },
      ]
    : [
        { value: "+150", label: "Projects Completed" },
        { value: "+50", label: "Happy Clients" },
        { value: "+10", label: "Years Experience" },
        { value: "24/7", label: "Support" },
      ];

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              {language === "ar" ? "نحول أفكارك إلى واقع رقمي" : "We transform your ideas into digital reality"}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            {language === "ar" ? (
              <>
                نبني{" "}
                <span className="gradient-text">حلول تقنية</span>
                <br />
                تدفع نجاحك للأمام
              </>
            ) : (
              <>
                We Build{" "}
                <span className="gradient-text">Tech Solutions</span>
                <br />
                That Drive Your Success
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {language === "ar" 
              ? "شركة أكواد تيكنولوجي متخصصة في تطوير المواقع والتطبيقات والأنظمة البرمجية المتكاملة بأحدث التقنيات العالمية"
              : "Acwad Technology specializes in developing websites, applications, and integrated software systems using the latest global technologies"
            }
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                {t("startProject")}
                <Arrow className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/portfolio">
                {language === "ar" ? "شاهد أعمالنا" : "View Our Work"}
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild className="border-primary/50 hover:bg-primary/10 gap-2">
              <Link to="/platform/login" className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {language === "ar" ? "سجل دخول إلى منصتنا التعليمية" : "LMS Platform Login"}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/3 left-10 hidden lg:block animate-float">
          <div className="w-16 h-16 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 flex items-center justify-center shadow-lg">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="absolute top-1/2 right-10 hidden lg:block animate-float" style={{ animationDelay: "2s" }}>
          <div className="w-16 h-16 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
