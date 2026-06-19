import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";

const TestimonialsSection = () => {
  const { language } = useLanguage();

  const testimonials = language === "ar"
    ? [
        {
          image: t1,
          name: "أحمد المنصوري",
          company: "FIS Investment",
          text: "تعامل احترافي وخدمة في منتهى الجودة، فريق أكواد تيكنولوجي حول فكرتنا إلى منصة استثمار متكاملة في وقت قياسي.",
        },
        {
          image: t2,
          name: "سارة عبد الرحمن",
          company: "FIS Fashion",
          text: "صفحات سريعة، تصميم أنيق، ودعم فني مستمر. أنصح بهم بشدة لأي شركة تبحث عن جودة حقيقية.",
        },
        {
          image: t3,
          name: "محمد كابتن",
          company: "Smart Line",
          text: "نفذوا تطبيقنا بدقة عالية وبأقل التكاليف، وفهموا متطلباتنا من أول لقاء. شراكة ناجحة بكل المقاييس.",
        },
      ]
    : [
        {
          image: t1,
          name: "Ahmed Al-Mansouri",
          company: "FIS Investment",
          text: "Highly professional service. The Acwad team turned our idea into a fully integrated investment platform in record time.",
        },
        {
          image: t2,
          name: "Sarah Abdelrahman",
          company: "FIS Fashion",
          text: "Fast pages, elegant design, and continuous support. I strongly recommend them to any company seeking real quality.",
        },
        {
          image: t3,
          name: "Mohamed Captain",
          company: "Smart Line",
          text: "They built our application with high precision at the best cost, and understood our needs from the first meeting.",
        },
      ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm mb-3 block">
            {language === "ar" ? "آراء العملاء" : "Testimonials"}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {language === "ar" ? (
              <>ماذا يقول <span className="gradient-text">عملاؤنا</span></>
            ) : (
              <>What Our <span className="gradient-text">Clients Say</span></>
            )}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "ar"
              ? "ثقة عملائنا هي شهادتنا الحقيقية على جودة ما نقدمه"
              : "Our clients' trust is the real testament to the quality of what we deliver"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass-card rounded-3xl p-8 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative animate-slide-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <Quote className="w-10 h-10 text-primary/30 mb-4" />
              <p className="text-foreground/90 leading-relaxed mb-6">{t.text}</p>
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/40"
                />
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
