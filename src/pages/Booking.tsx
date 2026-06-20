import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "201503500549";

const Booking = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", topic: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const lines = [
      language === "ar" ? "طلب حجز اجتماع - Acwad Technology" : "Meeting Booking Request - Acwad Technology",
      "",
      `${language === "ar" ? "الاسم" : "Name"}: ${form.name}`,
      `${language === "ar" ? "الجوال" : "Phone"}: ${form.phone}`,
      `${language === "ar" ? "التاريخ" : "Date"}: ${form.date}`,
      `${language === "ar" ? "الوقت" : "Time"}: ${form.time}`,
      "",
      `${language === "ar" ? "موضوع الاجتماع" : "Meeting Topic"}:`,
      form.topic,
    ];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast({
      title: language === "ar" ? "تم إرسال طلب الحجز" : "Booking sent",
      description: language === "ar" ? "سنؤكد الموعد قريباً" : "We'll confirm shortly",
    });
    setForm({ name: "", phone: "", date: "", time: "", topic: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />
      <main className="pt-4">
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <span className="text-primary font-semibold text-sm mb-3 block">
                {language === "ar" ? "حجز اجتماع" : "Book a Meeting"}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {language === "ar" ? (
                  <>احجز <span className="gradient-text">موعدك</span> معنا</>
                ) : (
                  <>Schedule a <span className="gradient-text">Meeting</span></>
                )}
              </h1>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "اختر الوقت المناسب لك وسنرد عليك بتأكيد الحجز"
                  : "Pick a time that works for you and we'll confirm the booking"}
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === "ar" ? "الاسم" : "Name"}
                    </label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === "ar" ? "رقم الجوال" : "Phone"}
                    </label>
                    <Input
                      required
                      dir="ltr"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {language === "ar" ? "التاريخ" : "Date"}
                    </label>
                    <Input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {language === "ar" ? "الوقت" : "Time"}
                    </label>
                    <Input
                      required
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ar" ? "موضوع الاجتماع" : "Meeting Topic"}
                  </label>
                  <Textarea
                    required
                    rows={4}
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="bg-muted/50 resize-none"
                  />
                </div>
                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={sending}>
                  {language === "ar" ? "تأكيد الحجز" : "Confirm Booking"}
                  <Send className="w-5 h-5 ms-2" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
