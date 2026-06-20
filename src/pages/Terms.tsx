import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { language } = useLanguage();
  const ar = language === "ar";
  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-6">
            {ar ? "الشروط والأحكام" : "Terms & Conditions"}
          </h1>
          <div className="glass-card rounded-2xl p-8 space-y-6 text-foreground/90 leading-relaxed">
            <p>
              {ar
                ? "باستخدامك لموقع أكواد تيكنولوجي فإنك توافق على الشروط التالية. يُرجى قراءتها بعناية."
                : "By using the Acwad Technology website you agree to the following terms. Please read them carefully."}
            </p>
            <div>
              <h2 className="text-xl font-bold mb-2">{ar ? "استخدام الخدمات" : "Use of Services"}</h2>
              <p>
                {ar
                  ? "تُقدَّم خدماتنا بناءً على اتفاقيات موقّعة بين الطرفين تحدد نطاق العمل والمواعيد والتكلفة."
                  : "Our services are provided based on signed agreements between both parties defining scope, timelines, and cost."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{ar ? "الملكية الفكرية" : "Intellectual Property"}</h2>
              <p>
                {ar
                  ? "جميع المحتويات والشعارات الموجودة في الموقع ملك حصري لأكواد تيكنولوجي ولا يجوز إعادة استخدامها دون إذن."
                  : "All content and logos on the website are exclusive property of Acwad Technology and may not be reused without permission."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{ar ? "المسؤولية" : "Liability"}</h2>
              <p>
                {ar
                  ? "نسعى لتقديم محتوى دقيق، لكننا غير مسؤولين عن أي خسائر ناتجة عن استخدام المعلومات في الموقع."
                  : "We strive for accurate content but are not liable for any losses arising from use of information on the site."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{ar ? "تعديلات" : "Modifications"}</h2>
              <p>
                {ar
                  ? "نحتفظ بحق تحديث هذه الشروط في أي وقت."
                  : "We reserve the right to update these terms at any time."}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
