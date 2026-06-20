import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  const { t, language } = useLanguage();

  const quickLinks = [
    { name: t("home"), path: "/" },
    { name: t("aboutUs"), path: "/about" },
    { name: t("services"), path: "/services" },
    { name: t("portfolio"), path: "/portfolio" },
    { name: language === "ar" ? "التوظيف" : "Careers", path: "/careers" },
    { name: language === "ar" ? "حجز اجتماع" : "Book Meeting", path: "/booking" },
    { name: language === "ar" ? "الأسئلة الشائعة" : "FAQ", path: "/faq" },
    { name: language === "ar" ? "سياسة الخصوصية" : "Privacy", path: "/privacy" },
    { name: language === "ar" ? "الشروط والأحكام" : "Terms", path: "/terms" },
  ];

  const services = language === "ar"
    ? ["تطوير المواقع", "تطبيقات الموبايل", "أنظمة إدارة", "حلول سحابية", "التسويق الرقمي"]
    : ["Web Development", "Mobile Apps", "Management Systems", "Cloud Solutions", "Digital Marketing"];

  const contact = language === "ar"
    ? { address: "مصر، الإسكندرية، العجمي، الدخيلة، شارع الرضوان، الهانوفيل" }
    : { address: "Egypt, Alexandria, El-Agamy, El-Dekheila, El-Radwan Street, Hanoville" };

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <img src={logo} alt="Acwad Technology" className="h-14 w-auto" />
            <p className="text-muted-foreground leading-relaxed">
              {t("footerDescription")}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t("quickLinks")}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t("ourServices")}</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-muted-foreground">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t("contactUs")}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <span>acwadtechnology3@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <span dir="ltr">015 03500549</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {language === "ar" ? "أكواد تيكنولوجي" : "Acwad Technology"}. {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
