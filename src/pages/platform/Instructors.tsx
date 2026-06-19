import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Users, Linkedin, Twitter, Globe } from "lucide-react";

const PlatformInstructors = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const instructors = [
    {
      name: ar ? "د. محمد عادل" : "Dr. Mohamed Adel",
      role: ar ? "خبير ذكاء اصطناعي" : "AI Expert",
      bio: ar ? "أستاذ بجامعة القاهرة و باحث في تعلم الآلة." : "Professor at Cairo Univ. & ML researcher.",
      courses: 8, students: 12400, rating: 4.9, color: "from-blue-500/30 to-purple-500/30",
    },
    {
      name: ar ? "م. أحمد سامي" : "Eng. Ahmed Samy",
      role: ar ? "Full Stack Developer" : "Full Stack Developer",
      bio: ar ? "خبرة 10 سنوات في React و Node.js" : "10 years building with React & Node.js",
      courses: 12, students: 9800, rating: 4.8, color: "from-emerald-500/30 to-teal-500/30",
    },
    {
      name: ar ? "م. سارة خالد" : "Eng. Sara Khaled",
      role: ar ? "Mobile Developer" : "Mobile Developer",
      bio: ar ? "متخصصة Flutter و React Native" : "Specialist in Flutter & React Native",
      courses: 6, students: 7300, rating: 4.9, color: "from-pink-500/30 to-orange-500/30",
    },
    {
      name: ar ? "أ. ليلى حسن" : "Layla Hassan",
      role: ar ? "UI/UX Designer" : "UI/UX Designer",
      bio: ar ? "صممت منتجات لشركات عالمية" : "Designed products for global brands",
      courses: 5, students: 6200, rating: 4.7, color: "from-purple-500/30 to-pink-500/30",
    },
    {
      name: ar ? "م. كريم فؤاد" : "Eng. Karim Fouad",
      role: ar ? "Cloud Architect" : "Cloud Architect",
      bio: ar ? "خبير AWS و DevOps" : "AWS & DevOps expert",
      courses: 7, students: 5400, rating: 4.8, color: "from-cyan-500/30 to-blue-500/30",
    },
    {
      name: ar ? "أ. هاني عمر" : "Hany Omar",
      role: ar ? "Agile Coach" : "Agile Coach",
      bio: ar ? "مدرب معتمد PMP و Scrum" : "Certified PMP & Scrum coach",
      courses: 4, students: 3200, rating: 4.6, color: "from-amber-500/30 to-red-500/30",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-primary font-semibold text-sm mb-3 block">Acwad Learning</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {ar ? (<>تعرف على <span className="gradient-text">مدربينا</span></>) : (<>Meet Our <span className="gradient-text">Instructors</span></>)}
            </h1>
            <p className="text-muted-foreground text-lg">
              {ar ? "خبراء معتمدون يقودون رحلتك التعليمية" : "Certified experts guiding your learning journey"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((ins, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <div className={`h-32 bg-gradient-to-br ${ins.color} relative`}>
                  <div className="absolute -bottom-10 start-6 w-20 h-20 rounded-full bg-background border-4 border-background flex items-center justify-center text-3xl font-bold text-primary">
                    {ins.name.charAt(ar ? 0 : 0)}
                  </div>
                </div>
                <div className="p-6 pt-12 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold">{ins.name}</h3>
                    <Badge variant="secondary" className="mt-1">{ins.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{ins.bio}</p>
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-border text-center">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /></p>
                      <p className="font-bold">{ins.rating}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><BookOpen className="w-3 h-3" /></p>
                      <p className="font-bold">{ins.courses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Users className="w-3 h-3" /></p>
                      <p className="font-bold">{(ins.students / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition"><Linkedin size={14} /></a>
                      <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition"><Twitter size={14} /></a>
                      <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition"><Globe size={14} /></a>
                    </div>
                    <Button size="sm" variant="outline">{ar ? "الدورات" : "Courses"}</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlatformInstructors;
