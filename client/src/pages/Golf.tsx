// Design: "Prestige Dashboard" — Swiss Luxury
// Golf: Clases, cuotas, torneos, inscripciones

import StatusBadge from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { GOLF_TORNEOS, GOLF_CLASES, IMAGES } from "@/lib/constants";
import { Flag, Trophy, GraduationCap, Users, Calendar } from "lucide-react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(val);

export default function Golf() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36">
        <img src={IMAGES.heroGolf} alt="Campo de Golf" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.14 0.04 155 / 0.80), oklch(0.14 0.04 155 / 0.3))" }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-1">Campo de Golf — 18 Hoyos</h3>
            <p className="text-sm" style={{ color: "oklch(0.82 0.02 90)" }}>Par 72 · Diseño Championship · 7,200 yardas</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Rondas del Mes" value="486" change={5.2} icon={<Flag size={18} />} accent />
        <KpiCard label="Ingresos Golf" value={formatCurrency(645_000)} change={7.8} icon={<Trophy size={18} />} accent />
        <KpiCard label="Alumnos Activos" value="35" change={12} icon={<GraduationCap size={18} />} />
        <KpiCard label="Torneos del Mes" value="3" icon={<Calendar size={18} />} />
      </div>

      {/* Tournaments */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border">
          <h4 className="font-display text-sm font-bold text-foreground">Torneos Próximos</h4>
          <p className="text-xs text-muted-foreground">Calendario de competencias</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {GOLF_TORNEOS.map((torneo) => (
            <div key={torneo.nombre} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.72 0.12 85 / 0.12)" }}>
                  <Trophy size={16} style={{ color: "oklch(0.72 0.12 85)" }} />
                </div>
                <StatusBadge status={torneo.status} />
              </div>
              <h5 className="text-sm font-bold text-foreground mb-1">{torneo.nombre}</h5>
              <p className="text-xs text-muted-foreground mb-3">{torneo.fecha}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Inscritos</span>
                  <span className="font-medium tabular-nums">{torneo.inscritos}/{torneo.maxJugadores}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${(torneo.inscritos / torneo.maxJugadores) * 100}%`,
                    background: torneo.inscritos >= torneo.maxJugadores ? "oklch(0.72 0.12 85)" : "oklch(0.45 0.12 160)",
                  }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cuota de inscripción</span>
                  <span className="font-medium tabular-nums">{formatCurrency(torneo.cuota)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classes */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border">
          <h4 className="font-display text-sm font-bold text-foreground">Clases y Profesionales</h4>
          <p className="text-xs text-muted-foreground">Instructores certificados PGA</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Instructor</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Horario</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tipo</th>
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Alumnos</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Precio/Clase</th>
              </tr>
            </thead>
            <tbody>
              {GOLF_CLASES.map((clase) => (
                <tr key={clase.instructor} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "oklch(0.45 0.12 160 / 0.08)" }}>
                        <GraduationCap size={14} style={{ color: "oklch(0.45 0.12 160)" }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{clase.instructor}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{clase.horario}</td>
                  <td className="px-5 py-3 text-xs text-foreground">{clase.tipo}</td>
                  <td className="px-5 py-3 text-xs text-center tabular-nums">{clase.alumnos}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground text-right tabular-nums">{formatCurrency(clase.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
