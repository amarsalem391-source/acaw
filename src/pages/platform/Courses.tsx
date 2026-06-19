import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Search, GraduationCap, PlayCircle } from "lucide-react";

const PlatformCourses = () => {
  const { language } = useLanguage();
  const ar = language === "ar";
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const categories = ar
    ? [
        { id: "all", name: "الكل" },
        { id: "web", name: "تطوير الويب" },
        { id: "mobile", name: "الموبايل" },
        { id: "ai", name: "الذكاء الاصطناعي" },
        { id: "design", name: "التصميم" },
        { id: "business", name: "أعمال" },
      ]
    : [
        { id: "all", name: "All" },
        { id: "web", name: "Web Dev" },
        { id: "mobile", name: "Mobile" },
        { id: "ai", name: "AI" },
        { id: "design", name: "Design" },
        { id: "business", name: "Business" },
      ];

  const courses = [
    {
      id: 1, cat: "web",
      title: ar ? "تطوير المواقع بـ React 19" : "Web Dev with React 19",
      instructor: ar ? "م. أحمد سامي" : "Eng. Ahmed Samy",
      price: 49, oldPrice: 99, rating: 4.9, students: 1240, hours: 28, lessons: 64, level: ar ? "متوسط" : "Intermediate",
    },
    {
      id: 2, cat: "mobile",
      title: ar ? "Flutter من الصفر للاحتراف" : "Flutter Zero to Hero",
      instructor: ar ? "م. سارة خالد" : "Eng. Sara Khaled",
      price: 59, oldPrice: 119, rating: 4.8, students: 980, hours: 36, lessons: 88, level: ar ? "مبتدئ" : "Beginner",
    },
    {
      id: 3, cat: "ai",
      title: ar ? "الذكاء الاصطناعي وتطبيقاته" : "AI & Real-World Applications",
      instructor: ar ? "د. محمد عادل" : "Dr. Mohamed Adel",
      price: 79, oldPrice: 149, rating: 5.0, students: 2150, hours: 42, lessons: 96, level: ar ? "متقدم" : "Advanced",
    },
    {
      id: 4, cat: "design",
      title: ar ? "UI/UX Design بـ Figma" : "UI/UX Design with Figma",
      instructor: ar ? "أ. ليلى حسن" : "Layla Hassan",
      price: 39, oldPrice: 89, rating: 4.7, students: 1560, hours: 22, lessons: 50, level: ar ? "مبتدئ" : "Beginner",
    },
    {
      id: 5, cat: "web",
      title: ar ? "Next.js و TypeScript للمحترفين" : "Next.js & TypeScript Pro",
      instructor: ar ? "م. كريم فؤاد" : "Eng. Karim Fouad",
      price: 69, oldPrice: 129, rating: 4.9, students: 870, hours: 32, lessons: 72, level: ar ? "متقدم" : "Advanced",
    },
    {
      id: 6, cat: "business",
      title: ar ? "إدارة المشاريع التقنية Agile" : "Agile Tech Project Management",
      instructor: ar ? "أ. هاني عمر" : "Hany Omar",
      price: 45, oldPrice: 95, rating: 4.6, students: 640, hours: 18, lessons: 40, level: ar ? "متوسط" : "Intermediate",
    },
  ];

  const filtered = courses.filter(
    (c) => (activeCat === "all" || c.cat === activeCat) && c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-3">
              <GraduationCap className="w-4 h-4" /> Acwad Learning
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {ar ? (<>استكشف <span className="gradient-text">دوراتنا</span></>) : (<>Explore Our <span className="gradient-text">Courses</span></>)}
            </h1>
            <p className="text-muted-foreground text-lg">
              {ar ? "دورات احترافية بإشراف خبراء لتطوير مهاراتك التقنية" : "Professional courses by expert instructors to grow your tech skills"}
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${ar ? "right-4" : "left-4"} w-5 h-5 text-muted-foreground`} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ar ? "ابحث عن دورة..." : "Search for a course..."}
              className={`h-14 ${ar ? "pr-12" : "pl-12"} text-base`}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((c) => (
              <Button
                key={c.id}
                variant={activeCat === c.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCat(c.id)}
              >
                {c.name}
              </Button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <div key={course.id} className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group">
                <div className="relative h-48 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-primary/70 group-hover:scale-110 transition-transform" />
                  <Badge className="absolute top-3 start-3">{course.level}</Badge>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold leading-snug line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {course.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.students}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.hours}h</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">${course.price}</span>
                      <span className="text-sm text-muted-foreground line-through">${course.oldPrice}</span>
                    </div>
                    <Button size="sm" asChild>
                      <Link to="/platform/login">{ar ? "اشترك" : "Enroll"}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{ar ? "لا توجد دورات مطابقة" : "No courses found"}</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlatformCourses;
