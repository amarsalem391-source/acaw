import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const VoiceAssistantSection = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const pickMaleVoice = (lang: string) => {
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.split("-")[0];
    const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
    const maleKeywords = ["male", "rajul", "majed", "hamed", "tarik", "naayf", "salim", "wael", "khalid", "amir", "david", "daniel", "mark", "alex", "fred", "google عربي", "google arabic"];
    const isMale = (v: SpeechSynthesisVoice) => {
      const n = v.name.toLowerCase();
      if (n.includes("female") || n.includes("woman") || /\b(zira|samantha|victoria|tessa|fiona|karen|moira|susan|allison|ava|serena|salma|laila|hoda|amira)\b/.test(n)) return false;
      return maleKeywords.some((k) => n.includes(k));
    };
    return (
      langVoices.find(isMale) ||
      langVoices.find((v) => !/female|woman|zira|samantha|salma|laila|hoda/i.test(v.name)) ||
      langVoices[0] ||
      voices.find(isMale) ||
      null
    );
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const lang = language === "ar" ? "ar-SA" : "en-US";
    const voice = pickMaleVoice(lang);
    const clean = text.replace(/\*\*/g, "").replace(/[#_`]/g, "");
    const sentences = clean.split(/(?<=[.!?؟])\s+/).filter((s) => s.trim().length > 0);

    sentences.forEach((sentence, i) => {
      const u = new SpeechSynthesisUtterance(sentence.trim());
      u.lang = lang;
      if (voice) u.voice = voice;
      u.pitch = 0.85;
      u.rate = language === "ar" ? 0.9 : 0.95;
      u.volume = 1;
      if (i === 0) u.onstart = () => setSpeaking(true);
      if (i === sentences.length - 1) u.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    });
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Preload voices (some browsers load async)
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const askAI = async (userText: string) => {
    setThinking(true);
    setReply("");
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: userText }],
          sessionId: `voice_${Date.now()}`,
        }),
      });
      if (!resp.ok || !resp.body) throw new Error("AI error");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) {
              full += c;
              setReply(full);
            }
          } catch {}
        }
      }
      if (full) speak(full);
    } catch (e) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "تعذر الاتصال بالمساعد" : "Failed to connect to assistant",
      });
    } finally {
      setThinking(false);
    }
  };

  const startListening = () => {
    if (!isSupported) {
      toast({
        variant: "destructive",
        title: language === "ar" ? "غير مدعوم" : "Not supported",
        description:
          language === "ar"
            ? "متصفحك لا يدعم التعرف الصوتي، جرب Chrome"
            : "Your browser doesn't support voice recognition, try Chrome",
      });
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = language === "ar" ? "ar-SA" : "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      askAI(text);
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {}
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm mb-3 block">
              {language === "ar" ? "مساعد صوتي ذكي" : "AI Voice Assistant"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {language === "ar" ? (
                <>تحدث مع <span className="gradient-text">المساعد الذكي</span></>
              ) : (
                <>Talk to Our <span className="gradient-text">AI Assistant</span></>
              )}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === "ar"
                ? "اضغط على الميكروفون واسأل عن خدماتنا أو احصل على تقدير سعر مشروعك"
                : "Press the microphone and ask about our services or get a project estimate"}
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <div className="relative flex flex-col items-center gap-8">
              <div className="relative">
                {listening && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    <span
                      className="absolute -inset-4 rounded-full bg-primary/20 animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </>
                )}
                <button
                  onClick={listening ? stopListening : startListening}
                  disabled={thinking}
                  className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-[var(--shadow-button)] ${
                    listening
                      ? "bg-destructive text-destructive-foreground scale-110"
                      : "bg-primary text-primary-foreground hover:scale-105"
                  }`}
                >
                  {thinking ? (
                    <Loader2 className="w-12 h-12 animate-spin" />
                  ) : listening ? (
                    <MicOff className="w-12 h-12" />
                  ) : (
                    <Mic className="w-12 h-12" />
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground min-h-[1.5rem]">
                {listening
                  ? language === "ar"
                    ? "أنا أستمع إليك..."
                    : "I'm listening..."
                  : thinking
                  ? language === "ar"
                    ? "أفكر في الإجابة..."
                    : "Thinking..."
                  : speaking
                  ? language === "ar"
                    ? "أتحدث..."
                    : "Speaking..."
                  : language === "ar"
                  ? "اضغط للتحدث"
                  : "Tap to talk"}
              </p>

              {transcript && (
                <div className="w-full p-4 rounded-2xl bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">
                    {language === "ar" ? "أنت قلت:" : "You said:"}
                  </p>
                  <p className="text-foreground">{transcript}</p>
                </div>
              )}

              {reply && (
                <div className="w-full p-4 rounded-2xl bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 mb-1 text-xs text-primary font-semibold">
                    <Volume2 className="w-3 h-3" /> {language === "ar" ? "المساعد:" : "Assistant:"}
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{reply}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">
                    <MessageSquare className="w-4 h-4" />
                    {language === "ar" ? "أرسل طلب مشروع" : "Submit Project Request"}
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to="/booking">
                    {language === "ar" ? "احجز اجتماع" : "Book a Meeting"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceAssistantSection;
