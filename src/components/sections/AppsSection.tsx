import { useLanguage } from "@/contexts/LanguageContext";

const AppsSection = () => {
  const { t, language } = useLanguage();

  const apps = [
    {
      name: language === "ar" ? "سمارت لاين - العميل" : "Smart Line User",
      subtitle: language === "ar" ? "تطبيقات موبايل" : "Mobile App",
      description: language === "ar" 
        ? "اطلب خدمتك بسهولة من خلال هاتفك" 
        : "Request your service easily from your phone",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-800",
      logoColor: "text-white",
      dark: true,
    },
    {
      name: language === "ar" ? "سمارت لاين - الكابتن" : "Smart Line Captain",
      subtitle: language === "ar" ? "تطبيقات موبايل" : "Mobile App",
      description: language === "ar" 
        ? "منصة توصيل احترافية على Google Play" 
        : "Professional delivery platform on Google Play",
      bgColor: "bg-white",
      logoColor: "text-purple-700",
      dark: false,
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">تطبيقاتنا المتخصصة</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "ar"
              ? "تطبيقات ذكية وسهلة الاستخدام لتحسين تجربتك"
              : "Smart and easy-to-use applications to enhance your experience"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {apps.map((app, index) => (
            <div
              key={index}
              className={`rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 ${
                app.dark ? "border-2 border-purple-400" : "border-2 border-gray-200"
              }`}
            >
              {/* App Header with Logo */}
              <div className={`${app.bgColor} h-64 flex items-center justify-center relative`}>
                <div className={`text-6xl font-bold ${app.logoColor}`}>
                  SL
                </div>
              </div>

              {/* App Info */}
              <div className={`p-8 ${app.dark ? "bg-purple-900/60" : "bg-gray-50"}`}>
                <p className={`text-sm font-semibold mb-2 ${app.dark ? "text-purple-300" : "text-purple-600"}`}>
                  {app.subtitle}
                </p>
                <h3 className={`text-2xl font-bold mb-3 ${app.dark ? "text-white" : "text-gray-900"}`}>
                  {app.name}
                </h3>
                <p className={`text-base mb-6 ${app.dark ? "text-gray-200" : "text-gray-700"}`}>
                  {app.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppsSection;
