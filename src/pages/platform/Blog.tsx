import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";

const PlatformBlog = () => {
  const { language } = useLanguage();
  const ar = language === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const posts = [
    {
      title: ar ? "كيف تبدأ مسيرتك كمطور Front-End في 2026" : "How to Start as a Front-End Dev in 2026",
      cat: ar ? "تطوير الويب" : "Web Dev",
      date: "2026-06-10", read: 7, color: "from-blue-500/30 to-cyan-500/30",
      excerpt: ar ? "خطوات عملية ومسار واضح للمبتدئين في تطوير الواجهات الأمامية." : "Practical steps and a clear roadmap for front-end beginners.",
    },
    {
      title: ar ? "الذكاء الاصطناعي وأثره على التعليم" : "AI's Impact on Modern Education",
      cat: ar ? "ذكاء اصطناعي" : "AI",
      date: "2026-06-05", read: 9, color: "from-purple-500/30 to-pink-500/30",
      excerpt: ar ? "كيف تعيد نماذج الذكاء الاصطناعي تشكيل تجربة التعلم." : "How AI models are reshaping the learning experience.",
    },
    {
      title: ar ? "أفضل ممارسات تطوير تطبيقات الموبايل" : "Mobile Development Best Practices",
      cat: ar ? "الموبايل" : "Mobile",
      date: "2026-05-28", read: 6, color: "from-emerald-500/30 to-teal-500/30",
      excerpt: ar ? "نصائح من خبراء لتحسين أداء تطبيقاتك." : "Expert tips to boost your app's performance.",
    },
    {
      title: ar ? "دليلك لاحتراف UI/UX Design" : "Your Guide to Mastering UI/UX",
      cat: ar ? "تصميم" : "Design",
      date: "2026-05-20", read: 8, color: "from-orange-500/30 to-red-500/30",
      excerpt: ar ? "أساسيات ومبادئ التصميم الحديث للواجهات." : "Modern UI design principles and fundamentals.",
    },
    {
      title: ar ? "5 مهارات يبحث عنها أصحاب العمل" : "5 Skills Employers Are Looking For",
      cat: ar ? "وظائف" : "Careers",
      date: "2026-05-12", read: 5, color: "from-amber-500/30 to-yellow-500/30",
      excerpt: ar ? "مهارات تقنية وشخصية تميزك في سوق العمل." : "Technical and soft skills to stand out in the job market.",
    },
    {
      title: ar ? "مقدمة في الحوسبة السحابية AWS" : "Intro to Cloud Computing with AWS",
      cat: ar ? "سحابي" : "Cloud",
      date: "2026-05-01", read: 10, color: "from-cyan-500/30 to-blue-500/30",
      excerpt: ar ? "ابدأ مع AWS وتعلم الأساسيات خطوة بخطوة." : "Get started with AWS and learn the essentials step by step.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-primary font-semibold text-sm mb-3 block">Acwad Learning Blog</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {ar ? (<>أحدث <span className="gradient-text">المقالات</span></>) : (<>Latest <span className="gradient-text">Articles</span></>)}
            </h1>
            <p className="text-muted-foreground text-lg">
              {ar ? "مقالات تقنية وتعليمية من خبراء أكواد" : "Tech & educational articles from Acwad experts"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <article key={i} className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group cursor-pointer">
                <div className={`h-48 bg-gradient-to-br ${p.color} relative flex items-end p-4`}>
                  <Badge className="bg-background/80 text-foreground backdrop-blur-sm">{p.cat}</Badge>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.read} {ar ? "د" : "min"}</span>
                    </div>
                    <Arrow className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlatformBlog;
