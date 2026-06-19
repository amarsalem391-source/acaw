import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const BackButton = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const Icon = language === "ar" ? ArrowRight : ArrowLeft;
  const label = language === "ar" ? "رجوع" : "Back";

  return (
    <div className="container mx-auto px-4 pt-24">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-2 text-foreground/80 hover:text-primary"
      >
        <Icon className="w-4 h-4" />
        {label}
      </Button>
    </div>
  );
};

export default BackButton;
