import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const faqs = ar
    ? [
        { q: "ما هي الخدمات التي تقدمها أكواد تيكنولوجي؟", a: "نقدم تطوير المواقع وتطبيقات الموبايل وأنظمة الإدارة والحلول السحابية والتسويق الرقمي." },
        { q: "ما هي مدة تنفيذ المشروع؟", a: "تختلف المدة حسب حجم المشروع، عادة من 2 إلى 12 أسبوعاً. سنقدم لك جدول زمني واضح بعد الاتفاق." },
        { q: "هل تقدمون دعماً فنياً بعد التسليم؟", a: "نعم، نوفر دعماً فنياً مستمراً وضمان لمدة محددة بعد التسليم لضمان عمل المشروع بشكل مثالي." },
        { q: "كيف يتم تحديد سعر المشروع؟", a: "السعر يعتمد على متطلبات المشروع والوقت والتقنيات المستخدمة. تواصل معنا للحصول على عرض سعر مخصص." },
        { q: "هل يمكنني تعديل المشروع أثناء التطوير؟", a: "نعم، نتيح مرونة كبيرة للتعديلات ضمن نطاق العمل المتفق عليه." },
        { q: "ما طرق الدفع المتاحة؟", a: "نقبل التحويلات البنكية والدفع الإلكتروني، ويتم الدفع على دفعات حسب مراحل المشروع." },
      ]
    : [
        { q: "What services does Acwad Technology offer?", a: "Web development, mobile apps, management systems, cloud solutions, and digital marketing." },
        { q: "How long does a project take?", a: "Depends on scope, usually 2 to 12 weeks. We'll provide a clear timeline after agreement." },
        { q: "Do you offer post-delivery support?", a: "Yes, we provide ongoing technical support and a warranty period after delivery." },
        { q: "How is project pricing determined?", a: "Pricing depends on requirements, time, and technologies. Contact us for a custom quote." },
        { q: "Can I request changes during development?", a: "Yes, we accommodate changes within the agreed scope of work." },
        { q: "What payment methods are available?", a: "Bank transfers and online payments, in installments tied to project milestones." },
      ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm mb-3 block">FAQ</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {ar ? (
                <>الأسئلة <span className="gradient-text">الشائعة</span></>
              ) : (
                <>Frequently <span className="gradient-text">Asked</span></>
              )}
            </h1>
            <p className="text-muted-foreground">
              {ar ? "إجابات على أكثر الأسئلة شيوعاً" : "Answers to the most common questions"}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-start hover:text-primary">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
