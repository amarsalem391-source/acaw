import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_NUMBER = "201503500549";
const TARGET_EMAIL = "acwadtechnology3@gmail.com";

const Contact = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    description: "",
  });

  const contactInfo = [
    {
      icon: Mail,
      title: t("email"),
      value: "acwadtechnology3@gmail.com",
      href: "mailto:acwadtechnology3@gmail.com",
    },
    {
      icon: Phone,
      title: t("phone"),
      value: "015 03500549",
      href: "tel:01503500549",
    },
    {
      icon: MapPin,
      title: t("address"),
      value: language === "ar" ? "مصر، الإسكندرية، العجمي، الدخيلة، شارع الرضوان، الهانوفيل" : "Egypt, Alexandria, El-Agamy, El-Dekheila, El-Radwan Street, Hanoville",
      href: "https://www.google.com/maps/place/Acwad+Technology/data=!4m2!3m1!1s0x0:0x62c8f65e6de0130?sa=X&ved=1t:2428&ictx=111&cshid=1779220881246945",
      isExternal: true,
    },
  ];

  const projectTypes = language === "ar"
    ? [
        { value: "موقع إلكتروني", label: "موقع إلكتروني" },
        { value: "تطبيق موبايل", label: "تطبيق موبايل" },
        { value: "نظام إدارة", label: "نظام إدارة" },
        { value: "متجر إلكتروني", label: "متجر إلكتروني" },
        { value: "حلول سحابية", label: "حلول سحابية" },
        { value: "أخرى", label: "أخرى" },
      ]
    : [
        { value: "Website", label: "Website" },
        { value: "Mobile App", label: "Mobile App" },
        { value: "Management System", label: "Management System" },
        { value: "E-commerce", label: "E-commerce" },
        { value: "Cloud Solutions", label: "Cloud Solutions" },
        { value: "Other", label: "Other" },
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const messageLines = [
      "طلب خدمة جديد من موقع Acwad Technology",
      "",
      `الاسم: ${formData.name.trim()}`,
      `البريد: ${formData.email.trim()}`,
      `الجوال: ${formData.phone.trim() || "-"}`,
      `نوع المشروع: ${formData.projectType}`,
      "",
      "تفاصيل المشروع:",
      formData.description.trim(),
    ];
    const messageText = messageLines.join("\n");

    try {
      const { error } = await supabase.from("service_requests").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        project_type: formData.projectType,
        description: formData.description.trim(),
      });

      if (error) throw error;

      // Open WhatsApp with prefilled message
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      // Open mail client to the target email
      const subject = `طلب خدمة جديد - ${formData.name.trim()}`;
      const mailUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageText)}`;
      window.location.href = mailUrl;

      toast({
        title: t("requestSentSuccess"),
        description: t("willContactYou"),
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: t("errorOccurred"),
        description: t("tryAgain"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4">
        {/* Hero */}
        <section className="py-24 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm mb-4 block">{t("contactUs")}</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {language === "ar" ? (
                  <>نحن هنا <span className="gradient-text">لمساعدتك</span></>
                ) : (
                  <>We're Here <span className="gradient-text">to Help</span></>
                )}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("contactDescription")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-8">{t("contactInfo")}</h2>
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.href}
                    className="flex items-start gap-4 p-6 glass-card rounded-2xl hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-muted-foreground" dir={info.title === t("phone") ? "ltr" : undefined}>
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="glass-card rounded-3xl p-8 md:p-12">
                  <h2 className="text-2xl font-bold mb-8">{t("requestService")}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t("fullName")}</label>
                        <Input
                          required
                          placeholder={t("enterName")}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-muted/50 border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t("emailAddress")}</label>
                        <Input
                          required
                          type="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-muted/50 border-border"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t("mobileNumber")}</label>
                        <Input
                          placeholder="+966 5X XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-muted/50 border-border"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t("projectType")}</label>
                        <select
                          required
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                          <option value="">{t("selectProjectType")}</option>
                          {projectTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t("projectDescription")}</label>
                      <Textarea
                        required
                        placeholder={t("writeDetails")}
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-muted/50 border-border resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="xl"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>{t("sending")}</>
                      ) : (
                        <>
                          {t("sendRequest")}
                          <Send className="w-5 h-5 ms-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
