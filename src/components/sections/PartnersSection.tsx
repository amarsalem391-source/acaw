import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import CardDetailsDialog, { CardDetails } from "@/components/CardDetailsDialog";
import fisGoldLogo from "@/assets/fis-gold-logo.png";
import fisInvestmentLogo from "@/assets/fis-investment-logo.png";
import fisFashionLogo from "@/assets/fis-fashion-logo.png";
import smartlineLogo from "@/assets/smartline-logo.webp";

const partners = [
  {
    name: "FIS Gold",
    logo: "FG",
    color: "from-yellow-500 to-amber-600",
    image: fisGoldLogo,
    imageBg: "bg-[#0d0d0d]",
    description: "FIS Gold متخصصة في تجارة الذهب والمجوهرات، نوفر لها منصة إلكترونية متكاملة لعرض المنتجات وإدارة المبيعات.",
    url: "https://www.fis-gold.com/",
  },
  {
    name: "FIS Investment",
    logo: "FI",
    color: "from-primary to-accent",
    image: fisInvestmentLogo,
    imageBg: "bg-white",
    description: "FIS Investment تقدم حلول استثمارية ومالية متقدمة، طورنا لها موقع احترافي يعكس مصداقيتها وخبرتها.",
    url: "https://fis-investment.com/",
  },
  {
    name: "FIS Fashion",
    logo: "FF",
    color: "from-pink-500 to-rose-600",
    image: fisFashionLogo,
    imageBg: "bg-white",
    description: "FIS Fashion علامة تجارية للأزياء العصرية، صممنا لها متجر إلكتروني عصري وسهل الاستخدام.",
    url: "https://www.fis-fashion.com/",
  },
  {
    name: "Smart Line",
    logo: "SL",
    color: "from-purple-400 to-purple-700",
    image: smartlineLogo,
    imageBg: "bg-[#3a1d8a]",
    description: "Smart Line منصة توصيل احترافية، طورنا لها تطبيقات موبايل للعملاء والكباتن متاحة على Google Play.",
    url: "https://play.google.com/store/apps/details?id=com.smartlineuser.app&hl=ar",
  },
];

const PartnersSection = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<CardDetails | null>(null);

  return (
    <section className="py-20 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm mb-4 block">{t("partnersSubtitle")}</span>
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="gradient-text">{t("partnersTitle")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            {t("partnersDescription")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <button
              key={index}
              onClick={() =>
                setSelected({
                  title: partner.name,
                  description: partner.description,
                  image: partner.image,
                  imageBg: partner.imageBg,
                  url: partner.url,
                })
              }
              className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-transform mb-3`}>
                {partner.logo}
              </div>
              <span className="font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center">
                {partner.name}
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          {t("joinClients")}
        </p>
      </div>

      <CardDetailsDialog details={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </section>
  );
};

export default PartnersSection;
