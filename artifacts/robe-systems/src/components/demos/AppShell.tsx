import { ReactNode, useState } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface AppShellProps {
  title: string;
  subtitle: string;
  appIcon: React.ElementType;
  navItems: NavItem[];
  activeView: string;
  onNavigate: (view: string) => void;
  children: ReactNode;
  headerRight?: ReactNode;
  topBarTitle?: string;
}

export function DarkSelect({ value, onChange, children, className }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`bg-zinc-900 text-white/80 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/25 cursor-pointer ${className ?? ""}`}
    >
      {children}
    </select>
  );
}

export function DarkOption({ value, children }: { value: string; children: ReactNode }) {
  return (
    <option value={value} style={{ backgroundColor: "#18181b", color: "white" }}>
      {children}
    </option>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────
export default function AppShell({
  title, subtitle, appIcon: AppIcon, navItems, activeView, onNavigate, children, headerRight, topBarTitle
}: AppShellProps) {
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
        <a href="/#projetos" className="inline-flex items-center gap-1.5 text-white/35 hover:text-white/60 text-xs mb-5 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Voltar ao site
        </a>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
            <AppIcon className="w-4 h-4 text-white/60" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{title}</p>
            <p className="text-[10px] text-white/30">{subtitle}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        <p className="px-3 pt-3 pb-1.5 text-[10px] uppercase tracking-widest text-white/20 font-semibold">Menu</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 text-left ${
                active ? "bg-white/8 text-white font-medium" : "text-white/45 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-white/35"}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="text-[10px] bg-white/15 text-white/70 rounded-full px-1.5 py-0.5 leading-none">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/8 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-[10px] text-white/40 font-semibold">RS</div>
          <div className="min-w-0">
            <p className="text-xs text-white/50 truncate">Demo · Robe Systems</p>
            <p className="text-[10px] text-white/25">robesystems.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 bg-zinc-950 border-r border-white/8 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <aside className="w-56 bg-zinc-950 border-r border-white/8 flex flex-col h-full">
            <SidebarContent />
          </aside>
          <button className="flex-1 bg-black/60 cursor-default" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-3 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/8 flex-shrink-0">
          <button className="md:hidden text-white/40 hover:text-white transition-colors p-1" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-white/80 flex-1">{topBarTitle ?? title}</h1>
          {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
        </header>

        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
              exit={{   opacity: 0, y: -6,  filter: "blur(2px)" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
