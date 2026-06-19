import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Booking from "./pages/Booking";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import PlatformCourses from "./pages/platform/Courses";
import PlatformInstructors from "./pages/platform/Instructors";
import PlatformPricing from "./pages/platform/Pricing";
import PlatformBlog from "./pages/platform/Blog";
import PlatformLogin from "./pages/platform/auth/Login";
import PlatformSignup from "./pages/platform/auth/Signup";
import StudentDashboard from "./pages/platform/student/StudentDashboard";
import InstructorDashboard from "./pages/platform/instructor/InstructorDashboard";
import ParentDashboard from "./pages/platform/parent/ParentDashboard";
import AdminDashboard from "./pages/platform/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/platform/super-admin/SuperAdminDashboard";
import RoleGuard from "./components/platform/RoleGuard";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/chat/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedBackground />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/auth" element={<Navigate to="/platform/login" replace />} />
                <Route path="/platform/courses" element={<PlatformCourses />} />
                <Route path="/platform/instructors" element={<PlatformInstructors />} />
                <Route path="/platform/pricing" element={<PlatformPricing />} />
                <Route path="/platform/blog" element={<PlatformBlog />} />
                <Route path="/platform/login" element={<PlatformLogin />} />
                <Route path="/platform/signup" element={<PlatformSignup />} />
                <Route path="/platform/student/*" element={<RoleGuard allow={["student"]}><StudentDashboard /></RoleGuard>} />
                <Route path="/platform/instructor/*" element={<RoleGuard allow={["instructor"]}><InstructorDashboard /></RoleGuard>} />
                <Route path="/platform/parent/*" element={<RoleGuard allow={["parent"]}><ParentDashboard /></RoleGuard>} />
                <Route path="/platform/admin/*" element={<RoleGuard allow={["admin", "super_admin"]}><AdminDashboard /></RoleGuard>} />
                <Route path="/platform/super-admin/*" element={<RoleGuard allow={["super_admin"]}><SuperAdminDashboard /></RoleGuard>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatBot />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
