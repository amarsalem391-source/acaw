import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";

const blogPosts = [
  {
    title: "أهمية تطوير تطبيقات الموبايل للشركات الناشئة",
    excerpt: "تعرف على كيف يمكن لتطبيقات الموبايل أن تساعد شركتك الناشئة في الوصول لعملاء أكثر وزيادة المبيعات.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    author: "أحمد محمد",
    date: "15 يناير 2024",
    category: "تطوير التطبيقات",
  },
  {
    title: "أفضل ممارسات أمان المواقع الإلكترونية في 2024",
    excerpt: "دليل شامل لحماية موقعك الإلكتروني من التهديدات الأمنية وضمان سلامة بيانات عملائك.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    author: "سارة أحمد",
    date: "10 يناير 2024",
    category: "الأمان",
  },
  {
    title: "كيف تختار شركة البرمجة المناسبة لمشروعك",
    excerpt: "نصائح مهمة لاختيار شريكك التقني ومعايير يجب مراعاتها عند التعاقد مع شركة برمجة.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    author: "خالد عبدالله",
    date: "5 يناير 2024",
    category: "نصائح",
  },
  {
    title: "مستقبل الذكاء الاصطناعي في تطوير البرمجيات",
    excerpt: "كيف يغير الذكاء الاصطناعي طريقة تطوير البرمجيات وما هي الفرص المتاحة للشركات.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    author: "نورة السعيد",
    date: "1 يناير 2024",
    category: "الذكاء الاصطناعي",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm mb-4 block">المدونة</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                مقالات <span className="gradient-text">تقنية مفيدة</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                نشارك معكم خبراتنا ومعرفتنا في عالم التقنية والبرمجة
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <article
                  key={index}
                  className="group glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-1 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <button className="flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all">
                      اقرأ المزيد
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
