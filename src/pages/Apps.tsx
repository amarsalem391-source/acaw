import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppsSection from "@/components/sections/AppsSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Apps = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section for Apps */}
        <section className="relative min-h-[400px] flex items-center justify-center hero-gradient overflow-hidden pt-20">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">
                {language === "ar" ? "تطبيقاتنا الذكية" : "Our Smart Apps"}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "ar"
                ? "منصات متطورة مصممة لتحسين تجربتك"
                : "Advanced platforms designed to enhance your experience"}
            </p>
          </div>
        </section>

        <AppsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Apps;
