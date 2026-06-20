import { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Bell, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export interface SidebarItem { label: string; path: string; icon: any; }

export default function DashboardLayout({
  title, items, badge, children,
}: { title: string; items: SidebarItem[]; badge?: string; children: ReactNode; }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div dir="rtl" className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="w-64 border-l border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col shadow-xl z-20">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2"><Logo /></div>
          <div className="mt-4 bg-primary/10 p-2.5 rounded-lg border border-primary/20">
            <div className="text-[10px] uppercase tracking-wider text-primary font-bold">{badge ?? "Acwad Learning"}</div>
            <div className="font-bold text-sm text-sidebar-foreground mt-0.5">{title}</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {items.map((it) => {
            const active = pathname === it.path || pathname.startsWith(it.path + "/");
            const Icon = it.icon;
            return (
              <NavLink key={it.path} to={it.path}
                className={`flex items-center gap-3 py-2.5 text-sm transition-all duration-200 ${
                  active 
                    ? "bg-primary/15 text-primary border-r-4 border-primary pr-2 pl-3 rounded-l-lg rounded-r-none font-semibold shadow-sm" 
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground px-3 rounded-lg"
                }`}>
                <Icon className={`w-4.5 h-4.5 ${active ? "text-primary" : "text-sidebar-foreground/60"}`} />
                <span>{it.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50 truncate font-mono bg-sidebar-background/40">
          {user?.email}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/40 bg-card/30 backdrop-blur-xl flex items-center justify-between px-4">
          <h1 className="font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button size="icon" variant="ghost"><Bell className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" onClick={async () => { await signOut(); navigate("/platform/login"); }}>
              <LogOut className="w-4 h-4 ml-1" /> خروج
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
