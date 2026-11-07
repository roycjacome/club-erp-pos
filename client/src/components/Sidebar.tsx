// Design: "Prestige Dashboard" — Swiss Luxury
// Sidebar: Verde oscuro profundo con gradiente sutil, iconos dorados al activarse
// Barra lateral dorada como indicador de selección

import { NAV_ITEMS } from "@/lib/constants";
import {
  LayoutDashboard, Users, CreditCard, ShoppingCart, Flag,
  CircleDot, QrCode, Dumbbell, Sparkles, CalendarDays, BarChart3,
  ChevronLeft, ChevronRight, LogOut, Settings, Bell
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Users, CreditCard, ShoppingCart, Flag,
  Volleyball: CircleDot, QrCode, Dumbbell, Sparkles, CalendarDays, BarChart3,
};

interface SidebarProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
  userRole: string;
  onRoleChange: (role: string) => void;
}

export default function Sidebar({ activeModule, onModuleChange, userRole, onRoleChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = NAV_ITEMS.filter(item =>
    item.roles.includes(userRole as any)
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 z-50 ${collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      style={{
        background: "linear-gradient(180deg, oklch(0.16 0.04 155) 0%, oklch(0.11 0.035 155) 100%)",
      }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 h-[72px] border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, oklch(0.72 0.12 85), oklch(0.62 0.10 85))" }}>
          <span className="text-sm font-bold" style={{ color: "oklch(0.15 0.03 155)" }}>PP</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-sm font-bold leading-tight" style={{ color: "oklch(0.92 0.01 85)" }}>
              Demo Club
            </h1>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: "oklch(0.55 0.04 155)" }}>
              Country Club
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className={`px-4 mb-3 ${collapsed ? "hidden" : ""}`}>
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "oklch(0.45 0.03 155)" }}>
            Módulos
          </span>
        </div>
        <ul className="space-y-0.5 px-2">
          {filteredNavItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = activeModule === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onModuleChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group ${collapsed ? "justify-center" : ""
                    }`}
                  style={{
                    background: isActive
                      ? "oklch(0.22 0.05 155)"
                      : "transparent",
                    color: isActive
                      ? "oklch(0.92 0.01 85)"
                      : "oklch(0.62 0.03 155)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "oklch(0.19 0.045 155)";
                      e.currentTarget.style.color = "oklch(0.82 0.02 90)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "oklch(0.62 0.03 155)";
                    }
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ background: "oklch(0.72 0.12 85)" }}
                    />
                  )}
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? "oklch(0.72 0.12 85)" : "inherit",
                    }}
                  />
                  {!collapsed && <span>{item.label}</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                      style={{ background: "oklch(0.22 0.05 155)", color: "oklch(0.92 0.01 85)" }}>
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Quick Switch (DEMO ONLY) */}
      {!collapsed && (
        <div className="px-5 py-3 border-t border-sidebar-border mx-2 my-2 rounded-xl bg-black/20">
          <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-2">Simulador de Rol</p>
          <select
            value={userRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full bg-transparent text-[10px] font-bold text-sidebar-foreground border-none outline-none cursor-pointer"
            style={{ color: "oklch(0.85 0.01 85)" }}
          >
            <option value="admin_super" className="bg-sidebar">Admin Super</option>
            <option value="admin_padel" className="bg-sidebar">Admin Padel</option>
            <option value="admin_golf" className="bg-sidebar">Admin Golf</option>
            <option value="guardia" className="bg-sidebar">Guardia (Visitantes)</option>
            <option value="user" className="bg-sidebar">Socio Estándar</option>
          </select>
        </div>
      )}

      {/* Bottom section */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${collapsed ? "justify-center" : ""}`}
          style={{ color: "oklch(0.55 0.03 155)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "oklch(0.82 0.02 90)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "oklch(0.55 0.03 155)"; }}
        >
          <Bell size={16} />
          {!collapsed && <span>Notificaciones</span>}
        </button>
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${collapsed ? "justify-center" : ""}`}
          style={{ color: "oklch(0.55 0.03 155)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "oklch(0.82 0.02 90)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "oklch(0.55 0.03 155)"; }}
        >
          <Settings size={16} />
          {!collapsed && <span>Configuración</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center border shadow-md z-50"
        style={{
          background: "oklch(0.22 0.05 155)",
          borderColor: "oklch(0.30 0.05 155)",
          color: "oklch(0.72 0.12 85)",
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* User section */}
      <div className={`border-t border-sidebar-border p-3 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.25 0.05 155)" }}>
          <span className="text-xs font-semibold" style={{ color: "oklch(0.72 0.12 85)" }}>{userRole === 'admin_super' ? 'AG' : 'AP'}</span>
        </div>
        {!collapsed && (
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate" style={{ color: "oklch(0.85 0.01 85)" }}>
              {userRole === 'admin_super' ? 'Admin General' : userRole === 'admin_padel' ? 'Admin Padel' : 'Colaborador'}
            </p>
            <p className="text-[10px] truncate" style={{ color: "oklch(0.50 0.03 155)" }}>{userRole}@playapalmas.club</p>
          </div>
        )}
        {!collapsed && (
          <LogOut size={14} style={{ color: "oklch(0.45 0.03 155)" }} className="flex-shrink-0" />
        )}
      </div>
    </aside>
  );
}
