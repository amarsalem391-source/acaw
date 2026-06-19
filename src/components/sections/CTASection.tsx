import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">ابدأ مشروعك اليوم</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            هل لديك <span className="gradient-text">فكرة مشروع</span>؟
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            تواصل معنا الآن ودعنا نساعدك في تحويل فكرتك إلى منتج رقمي ناجح. فريقنا جاهز للاستماع إليك!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                طلب خدمة
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="tel:+966501234567">اتصل بنا</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
