import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { Target, Eye, Award, Users, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "جودة عالية",
    description: "نلتزم بأعلى معايير الجودة في كل مشروع ننجزه",
  },
  {
    icon: Users,
    title: "فريق محترف",
    description: "نخبة من المطورين والمصممين ذوي الخبرة العالية",
  },
  {
    icon: Clock,
    title: "التزام بالمواعيد",
    description: "نحرص على تسليم المشاريع في الوقت المحدد",
  },
  {
    icon: Shield,
    title: "أمان وحماية",
    description: "نطبق أفضل معايير الأمان لحماية بياناتك",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4">
        {/* Hero */}
        <section className="py-24 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-semibold text-sm mb-4 block">من نحن</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                شركاء نجاحك في <span className="gradient-text">التحول الرقمي</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Acwad Technology is a leading software solutions company specializing in integrated systems tailored to a wide range of sectors, including education, healthcare, legal services, manufacturing, and more. We empower schools, hospitals, laboratories, lawyer offices, and industrial facilities with smart digital solutions designed to streamline operations, enhance productivity, and drive sustainable growth. Our mission is to bridge the gap between technology and real-world business needs, delivering reliable, scalable, and user-friendly systems that transform how organizations work.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  بدأت أكواد تيكنولوجي رحلتها بهدف واضح: تقديم حلول تقنية مبتكرة تساعد الشركات على النمو والتطور في العصر الرقمي. منذ تأسيسنا، عملنا مع العشرات من الشركات المحلية والإقليمية لتحويل أفكارهم إلى منتجات رقمية ناجحة.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  نؤمن بأن التقنية يجب أن تكون أداة لتمكين الأعمال وليست عائقاً أمامها. لذلك نحرص على تقديم حلول سهلة الاستخدام وقابلة للتطوير تلبي احتياجات عملائنا الحالية والمستقبلية.
                </p>
              </div>
              <div className="glass-card rounded-3xl p-8 glow-effect">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">رسالتنا</h3>
                      <p className="text-muted-foreground">تمكين الشركات من تحقيق أهدافها الرقمية من خلال حلول تقنية مبتكرة وموثوقة</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">رؤيتنا</h3>
                      <p className="text-muted-foreground">أن نكون الشريك التقني الأول للشركات الناشئة والمتوسطة في المنطقة العربية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">
                لماذا <span className="gradient-text">تختارنا</span>؟
              </h2>
              <p className="text-muted-foreground">
                مميزات تجعلنا الخيار الأمثل لمشروعك القادم
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="glass-card rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
