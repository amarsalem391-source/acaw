import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { language } = useLanguage();
  const ar = language === "ar";
  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-6">
            {ar ? "سياسة الخصوصية" : "Privacy Policy"}
          </h1>
          <div className="glass-card rounded-2xl p-8 space-y-6 text-foreground/90 leading-relaxed">
            <p>
              {ar
                ? "نحن في أكواد تيكنولوجي نقدّر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نقوم بجمع واستخدام وحماية المعلومات التي تقدمها لنا."
                : "At Acwad Technology we value your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect the information you provide."}
            </p>
            <div>
              <h2 className="text-xl font-bold mb-2">{ar ? "البيانات التي نجمعها" : "Data We Collect"}</h2>
              <p>
                {ar
                  ? "الاسم، البريد الإلكتروني، رقم الجوال، وتفاصيل المشروع التي تقدمها عبر نماذج الموقع."
                  : "Name, email, phone number, and project details you submit through site forms."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{ar ? "استخدام البيانات" : "Use of Data"}</h2>
              <p>
                {ar
                  ? "تُستخدم بياناتك فقط للتواصل معك بخصوص استفساراتك أو طلباتك ولن نشاركها مع أي طرف ثالث دون إذنك."
                  : "Your data is only used to communicate with you regarding inquiries or requests and will not be shared with any third party without your consent."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{ar ? "حماية البيانات" : "Data Protection"}</h2>
              <p>
                {ar
                  ? "نستخدم أحدث معايير الأمان لحماية بياناتك من الوصول غير المصرّح به."
                  : "We use the latest security standards to protect your data from unauthorized access."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{ar ? "تواصل معنا" : "Contact"}</h2>
              <p>
                {ar
                  ? "لأي استفسار حول الخصوصية: acwadtechnology3@gmail.com"
                  : "For any privacy question: acwadtechnology3@gmail.com"}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
