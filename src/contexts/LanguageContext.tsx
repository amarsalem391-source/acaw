import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";

type Translations = {
  [key: string]: {
    ar: string;
    en: string;
  };
};

export const translations: Translations = {
  // Navbar
  home: { ar: "الرئيسية", en: "Home" },
  aboutUs: { ar: "من نحن", en: "About Us" },
  services: { ar: "خدماتنا", en: "Services" },
  portfolio: { ar: "أعمالنا", en: "Portfolio" },
  blog: { ar: "المدونة", en: "Blog" },
  contactUs: { ar: "تواصل معنا", en: "Contact Us" },
  requestService: { ar: "طلب خدمة", en: "Request Service" },
  login: { ar: "تسجيل الدخول", en: "Login" },
  logout: { ar: "تسجيل الخروج", en: "Logout" },
  signup: { ar: "إنشاء حساب", en: "Sign Up" },
  
  // Hero Section
  heroTitle1: { ar: "نحول أفكارك إلى", en: "We Transform Your Ideas Into" },
  heroTitle2: { ar: "واقع رقمي", en: "Digital Reality" },
  heroDescription: { 
    ar: "شريكك التقني لبناء حلول برمجية مبتكرة تدفع أعمالك نحو النجاح", 
    en: "Your tech partner for building innovative software solutions that drive your business to success" 
  },
  startProject: { ar: "ابدأ مشروعك", en: "Start Your Project" },
  exploreServices: { ar: "استكشف خدماتنا", en: "Explore Services" },
  
  // About Section
  aboutTitle: { ar: "عن أكواد تيكنولوجي", en: "About Acwad Technology" },
  aboutDescription: { 
    ar: "نحن شركة تقنية رائدة متخصصة في تقديم حلول برمجية متكاملة", 
    en: "We are a leading tech company specialized in providing integrated software solutions" 
  },
  yearsExperience: { ar: "سنوات خبرة", en: "Years Experience" },
  completedProjects: { ar: "مشروع منجز", en: "Completed Projects" },
  happyClients: { ar: "عميل سعيد", en: "Happy Clients" },
  teamMembers: { ar: "فريق العمل", en: "Team Members" },
  
  // Services Section
  servicesTitle: { ar: "خدماتنا", en: "Our Services" },
  servicesSubtitle: { ar: "ماذا نقدم لك؟", en: "What We Offer?" },
  servicesDescription: { 
    ar: "نقدم مجموعة شاملة من الخدمات التقنية المصممة لتلبية احتياجات أعمالك", 
    en: "We offer a comprehensive range of tech services designed to meet your business needs" 
  },
  
  // Portfolio Section
  portfolioTitle: { ar: "أعمالنا", en: "Our Work" },
  portfolioSubtitle: { ar: "مشاريع مميزة", en: "Featured Projects" },
  portfolioDescription: { 
    ar: "نفخر بتقديم مجموعة من المشاريع الناجحة التي نفذناها لعملائنا", 
    en: "We are proud to present a collection of successful projects we've delivered for our clients" 
  },
  all: { ar: "الكل", en: "All" },
  websites: { ar: "مواقع", en: "Websites" },
  apps: { ar: "تطبيقات", en: "Apps" },
  systems: { ar: "أنظمة", en: "Systems" },
  
  // Partners Section
  partnersTitle: { ar: "عملاء يثقون بنا", en: "Clients Who Trust Us" },
  partnersSubtitle: { ar: "شركاؤنا", en: "Our Partners" },
  partnersDescription: { 
    ar: "نفخر بثقة عملائنا الكرام ونسعى دائماً لتقديم أفضل الحلول التقنية", 
    en: "We are proud of our clients' trust and always strive to provide the best technical solutions" 
  },
  joinClients: { 
    ar: "انضم إلى قائمة عملائنا الناجحين واحصل على أفضل الحلول التقنية", 
    en: "Join our successful clients and get the best technical solutions" 
  },
  
  // Tech Section
  techTitle: { ar: "التقنيات", en: "Technologies" },
  techSubtitle: { ar: "التقنيات المستخدمة", en: "Technologies We Use" },
  techDescription: { 
    ar: "نستخدم أحدث التقنيات والأدوات لتطوير حلول برمجية عالية الجودة", 
    en: "We use the latest technologies and tools to develop high-quality software solutions" 
  },
  
  // CTA Section
  ctaTitle: { ar: "هل أنت مستعد لبدء مشروعك؟", en: "Ready to Start Your Project?" },
  ctaDescription: { 
    ar: "تواصل معنا اليوم ودعنا نساعدك في تحويل أفكارك إلى واقع", 
    en: "Contact us today and let us help you turn your ideas into reality" 
  },
  
  // Contact Page
  contactTitle: { ar: "نحن هنا لمساعدتك", en: "We're Here to Help" },
  contactDescription: { 
    ar: "راسلنا وسنرد عليك في أقرب وقت ممكن. نحن متحمسون للتعرف على مشروعك!", 
    en: "Message us and we'll get back to you as soon as possible. We're excited to learn about your project!" 
  },
  contactInfo: { ar: "معلومات التواصل", en: "Contact Information" },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  phone: { ar: "الهاتف", en: "Phone" },
  address: { ar: "العنوان", en: "Address" },
  fullName: { ar: "الاسم الكامل", en: "Full Name" },
  enterName: { ar: "أدخل اسمك", en: "Enter your name" },
  mobileNumber: { ar: "رقم الجوال", en: "Mobile Number" },
  projectType: { ar: "نوع المشروع", en: "Project Type" },
  selectProjectType: { ar: "اختر نوع المشروع", en: "Select project type" },
  projectDescription: { ar: "وصف المشروع", en: "Project Description" },
  writeDetails: { ar: "اكتب تفاصيل مشروعك هنا...", en: "Write your project details here..." },
  sendRequest: { ar: "إرسال الطلب", en: "Send Request" },
  sending: { ar: "جاري الإرسال...", en: "Sending..." },
  
  // Project Types
  website: { ar: "موقع إلكتروني", en: "Website" },
  mobileApp: { ar: "تطبيق موبايل", en: "Mobile App" },
  managementSystem: { ar: "نظام إدارة", en: "Management System" },
  ecommerce: { ar: "متجر إلكتروني", en: "E-commerce" },
  cloudSolutions: { ar: "حلول سحابية", en: "Cloud Solutions" },
  other: { ar: "أخرى", en: "Other" },
  
  // Auth
  emailAddress: { ar: "البريد الإلكتروني", en: "Email Address" },
  password: { ar: "كلمة المرور", en: "Password" },
  confirmPassword: { ar: "تأكيد كلمة المرور", en: "Confirm Password" },
  noAccount: { ar: "ليس لديك حساب؟", en: "Don't have an account?" },
  haveAccount: { ar: "لديك حساب؟", en: "Already have an account?" },
  loginSuccess: { ar: "تم تسجيل الدخول بنجاح!", en: "Login successful!" },
  signupSuccess: { ar: "تم إنشاء الحساب بنجاح!", en: "Account created successfully!" },
  error: { ar: "خطأ", en: "Error" },
  
  // Footer
  footerDescription: { 
    ar: "شركة تقنية رائدة متخصصة في تطوير البرمجيات وتقديم الحلول التقنية المبتكرة", 
    en: "A leading tech company specialized in software development and innovative technical solutions" 
  },
  quickLinks: { ar: "روابط سريعة", en: "Quick Links" },
  ourServices: { ar: "خدماتنا", en: "Our Services" },
  webDevelopment: { ar: "تطوير المواقع", en: "Web Development" },
  mobileApps: { ar: "تطبيقات الموبايل", en: "Mobile Apps" },
  erpSystems: { ar: "أنظمة ERP", en: "ERP Systems" },
  cloudComputing: { ar: "الحوسبة السحابية", en: "Cloud Computing" },
  allRightsReserved: { ar: "جميع الحقوق محفوظة", en: "All Rights Reserved" },
  
  // Messages
  requestSentSuccess: { ar: "تم إرسال طلبك بنجاح!", en: "Your request has been sent successfully!" },
  willContactYou: { ar: "سنتواصل معك في أقرب وقت ممكن.", en: "We will contact you as soon as possible." },
  errorOccurred: { ar: "حدث خطأ", en: "An error occurred" },
  tryAgain: { ar: "فشل في إرسال الطلب، يرجى المحاولة مرة أخرى.", en: "Failed to send request, please try again." },
  
  // Chatbot
  chatbotGreeting: { 
    ar: "مرحباً! أنا المساعد الذكي لشركة أكواد تيكنولوجي. كيف يمكنني مساعدتك اليوم؟", 
    en: "Hello! I'm the AI assistant for Acwad Technology. How can I help you today?" 
  },
  smartAssistant: { ar: "المساعد الذكي", en: "Smart Assistant" },
  acwadTech: { ar: "أكواد تيكنولوجي", en: "Acwad Technology" },
  writeMessage: { ar: "اكتب رسالتك...", en: "Write your message..." },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "ar";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
