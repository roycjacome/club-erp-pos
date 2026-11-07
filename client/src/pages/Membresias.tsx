// Design: "Prestige Dashboard" — Swiss Luxury
// Membresías: Gestión de socios con tabla elegante

import StatusBadge from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { SOCIOS } from "@/lib/constants";
import { Users, UserPlus, UserMinus, RefreshCw, Search, Filter, Download, Plus } from "lucide-react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(val);

export default function Membresias() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Socios Activos" value="847" change={3.2} changeLabel="vs. mes anterior" icon={<Users size={18} />} accent />
        <KpiCard label="Altas del Mes" value="12" change={20} changeLabel="vs. mes anterior" icon={<UserPlus size={18} />} />
        <KpiCard label="Bajas del Mes" value="3" change={-25} changeLabel="vs. mes anterior" icon={<UserMinus size={18} />} />
        <KpiCard label="Renovaciones Pendientes" value="28" icon={<RefreshCw size={18} />} />
      </div>

      {/* Membership distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { tipo: "Platino", count: 245, color: "oklch(0.72 0.12 85)" },
          { tipo: "Oro", count: 312, color: "oklch(0.45 0.12 160)" },
          { tipo: "Familiar", count: 198, color: "oklch(0.55 0.14 160)" },
          { tipo: "Diferida", count: 92, color: "oklch(0.35 0.08 155)" },
        ].map((m) => (
          <div key={m.tipo} className="bg-card rounded-xl border p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
              <Users size={18} style={{ color: m.color }} />
            </div>
            <div>
              <p className="kpi-number text-xl" style={{ color: "oklch(0.18 0.03 155)" }}>{m.count}</p>
              <p className="text-xs text-muted-foreground">Membresía {m.tipo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">Directorio de Socios</h4>
            <p className="text-xs text-muted-foreground">Gestión integral de membresías</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Buscar socio..." className="h-8 pl-8 pr-3 rounded-lg text-xs bg-muted border-0 w-48 text-foreground placeholder:text-muted-foreground" />
            </div>
            <button className="h-8 px-3 rounded-lg text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1.5 hover:bg-accent transition-colors">
              <Filter size={12} /> Filtros
            </button>
            <button className="h-8 px-3 rounded-lg text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1.5 hover:bg-accent transition-colors">
              <Download size={12} /> Exportar
            </button>
            <button className="h-8 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5"
              style={{ background: "oklch(0.45 0.12 160)" }}>
              <Plus size={12} /> Nuevo Socio
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">ID</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Socio</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tipo</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Desde</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Cuota Mensual</th>
              </tr>
            </thead>
            <tbody>
              {SOCIOS.map((socio, i) => (
                <tr key={socio.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{socio.id}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{socio.nombre}</p>
                      <p className="text-xs text-muted-foreground">{socio.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: socio.tipo === "Platino" ? "oklch(0.72 0.12 85 / 0.12)" : "oklch(0.45 0.12 160 / 0.08)",
                        color: socio.tipo === "Platino" ? "oklch(0.60 0.10 85)" : "oklch(0.45 0.12 160)",
                      }}>
                      {socio.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={socio.status} /></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground tabular-nums">{socio.desde}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground text-right tabular-nums">{formatCurrency(socio.cuota)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Mostrando 1-8 de 847 socios</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 106].map((p, i) => (
              <button key={i} className={`w-7 h-7 rounded text-xs font-medium ${p === 1 ? "text-white" : "text-muted-foreground hover:bg-muted"}`}
                style={p === 1 ? { background: "oklch(0.45 0.12 160)" } : {}}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
