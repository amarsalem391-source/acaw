import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const ar = language === "ar";

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative text-center px-4">
        <h1 className="text-[10rem] md:text-[14rem] leading-none font-black gradient-text">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {ar ? "الصفحة غير موجودة" : "Page Not Found"}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {ar
            ? "الصفحة التي تبحث عنها قد تكون حُذفت أو غُيّر عنوانها."
            : "The page you're looking for may have been removed or its address changed."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/">
              <Home className="w-4 h-4" />
              {ar ? "العودة للرئيسية" : "Back to Home"}
            </Link>
          </Button>
          <Button variant="heroOutline" size="lg" asChild>
            <Link to="/contact">
              <Search className="w-4 h-4" />
              {ar ? "تواصل معنا" : "Contact Us"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
