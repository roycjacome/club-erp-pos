// Design: "Prestige Dashboard" — Swiss Luxury
// TopBar: Limpio, con breadcrumbs, búsqueda y perfil

import { Search, Bell, Calendar } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-[64px] border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={14} />
          <span className="capitalize">{today}</span>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar socio, ticket..."
            className="h-8 pl-9 pr-4 rounded-lg text-xs bg-muted border-0 focus:ring-1 focus:ring-ring w-52 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
          <Bell size={16} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "oklch(0.72 0.12 85)" }} />
        </button>
      </div>
    </header>
  );
}
