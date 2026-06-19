import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import CardDetailsDialog, { CardDetails } from "@/components/CardDetailsDialog";
import smartlineLogo from "@/assets/smartline-logo.webp";
import smartlineUserLogo from "@/assets/smartline-user-logo.webp";
import fisGoldLogo from "@/assets/fis-gold-logo.png";
import fisInvestmentLogo from "@/assets/fis-investment-logo.png";
import fisFashionLogo from "@/assets/fis-fashion-logo.png";

const categories = ["الكل", "تطبيقات موبايل", "مواقع الكترونية"];

const projects = [
  {
    title: "Smart Line Captain",
    category: "تطبيقات موبايل",
    description: "تطبيق سمارت لاين للكباتن - منصة توصيل احترافية على Google Play",
    image: smartlineUserLogo,
    bg: "bg-white",
    url: "https://play.google.com/store/apps/details?id=com.smartlinecaptin.app&hl=ar",
  },
  {
    title: "Smart Line User",
    category: "تطبيقات موبايل",
    description: "تطبيق سمارت لاين للمستخدمين - اطلب خدمتك بسهولة من خلال هاتفك",
    image: smartlineLogo,
    bg: "bg-[#3a1d8a]",
    url: "https://play.google.com/store/apps/details?id=com.smartlineuser.app&hl=ar",
  },
  {
    title: "FIS Gold",
    category: "مواقع الكترونية",
    description: "موقع FIS Gold المتخصص في الذهب والمجوهرات",
    image: fisGoldLogo,
    bg: "bg-[#0d0d0d]",
    url: "https://www.fis-gold.com/",
  },
  {
    title: "FIS Investment",
    category: "مواقع الكترونية",
    description: "موقع FIS Investment للاستثمار والحلول المالية",
    image: fisInvestmentLogo,
    bg: "bg-white",
    url: "https://fis-investment.com/",
  },
  {
    title: "FIS Fashion",
    category: "مواقع الكترونية",
    description: "موقع FIS Fashion للأزياء والموضة العصرية",
    image: fisFashionLogo,
    bg: "bg-white",
    url: "https://www.fis-fashion.com/",
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selected, setSelected] = useState<CardDetails | null>(null);


  const filteredProjects = activeCategory === "الكل"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4">
        {/* Hero */}
        <section className="py-24 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm mb-4 block">أعمالنا</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                مشاريع <span className="gradient-text">نفتخر بها</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                نماذج من المشاريع الناجحة التي قمنا بتنفيذها لعملائنا
              </p>
            </div>
          </div>
        </section>

        {/* Filter */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelected({
                      title: project.title,
                      category: project.category,
                      description: project.description,
                      image: project.image,
                      imageBg: project.bg,
                      url: project.url,
                    })
                  }
                  className="group glass-card rounded-2xl overflow-hidden block text-right"
                >
                  <div className={`relative overflow-hidden ${project.bg}`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-56 object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-primary text-sm font-medium">{project.category}</span>
                    <h3 className="text-xl font-bold mt-2 mb-3">{project.title}</h3>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                    <span className="inline-block mt-3 text-primary text-sm font-medium">عرض التفاصيل ←</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <CardDetailsDialog details={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
};

export default Portfolio;
