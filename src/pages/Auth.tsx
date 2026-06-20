import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/logo.png";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: language === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email address",
      });
      return;
    }

    // Validate password
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: language === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters",
      });
      return;
    }

    // Check password match for signup
    if (!isLogin && password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          variant: "destructive",
          title: t("error"),
          description: isLogin
            ? (language === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password")
            : (language === "ar" ? "حدث خطأ، يرجى المحاولة مجدداً" : "An error occurred, please try again"),
        });
      } else {
        toast({
          title: isLogin ? t("loginSuccess") : t("signupSuccess"),
        });
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="Acwad Technology" className="h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">
              {isLogin ? t("login") : t("signup")}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("emailAddress")}
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-10 bg-muted/50 border-border"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-10 pe-10 bg-muted/50 border-border"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("confirmPassword")}
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="ps-10 bg-muted/50 border-border"
                    dir="ltr"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>{language === "ar" ? "جاري التحميل..." : "Loading..."}</span>
              ) : (
                <>
                  {isLogin ? t("login") : t("signup")}
                  <Arrow className="w-5 h-5 ms-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              {isLogin ? t("noAccount") : t("haveAccount")}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? t("signup") : t("login")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
