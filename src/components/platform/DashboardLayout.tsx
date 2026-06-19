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
      <aside className="w-64 border-l border-border/40 bg-card/40 backdrop-blur-xl flex flex-col">
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center gap-2"><Logo /></div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground">{badge ?? "Acwad Learning"}</div>
            <div className="font-semibold">{title}</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {items.map((it) => {
            const active = pathname === it.path || pathname.startsWith(it.path + "/");
            const Icon = it.icon;
            return (
              <NavLink key={it.path} to={it.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${active ? "bg-primary/15 text-primary" : "hover:bg-muted/50 text-foreground/80"}`}>
                <Icon className="w-4 h-4" />
                <span>{it.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border/40 text-xs text-muted-foreground truncate">{user?.email}</div>
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
