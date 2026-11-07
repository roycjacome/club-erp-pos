// Design: "Prestige Dashboard" — Swiss Luxury
// Salón de Uñas: Citas, servicios

import StatusBadge from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { SALON_CITAS } from "@/lib/constants";
import { Sparkles, Calendar, DollarSign, Clock, Plus } from "lucide-react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(val);

export default function Salon() {
  const servicios = [
    { nombre: "Manicure Gel", precio: 450, duracion: "45 min", popular: true },
    { nombre: "Pedicure Spa", precio: 550, duracion: "60 min", popular: true },
    { nombre: "Uñas Acrílicas", precio: 850, duracion: "90 min", popular: false },
    { nombre: "Manicure + Pedicure", precio: 750, duracion: "90 min", popular: true },
    { nombre: "Manicure Express", precio: 350, duracion: "30 min", popular: false },
    { nombre: "Diseño Artístico", precio: 250, duracion: "30 min", popular: false },
    { nombre: "Retiro de Gel", precio: 200, duracion: "20 min", popular: false },
    { nombre: "Tratamiento Hidratante", precio: 300, duracion: "30 min", popular: false },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Citas Hoy" value="12" icon={<Calendar size={18} />} accent />
        <KpiCard label="Ingresos del Día" value={formatCurrency(4_850)} change={15} icon={<DollarSign size={18} />} />
        <KpiCard label="Ingresos del Mes" value={formatCurrency(98_600)} change={12.5} icon={<Sparkles size={18} />} />
        <KpiCard label="Próxima Disponible" value="12:30" icon={<Clock size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's appointments */}
        <div className="lg:col-span-2 bg-card rounded-xl border">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h4 className="font-display text-sm font-bold text-foreground">Agenda del Día</h4>
              <p className="text-xs text-muted-foreground">Citas programadas — 15 de febrero</p>
            </div>
            <button className="h-8 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5"
              style={{ background: "oklch(0.45 0.12 160)" }}>
              <Plus size={12} /> Nueva Cita
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Hora</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Cliente</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Servicio</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Estilista</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Duración</th>
                  <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Precio</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {SALON_CITAS.map((cita, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-3 text-xs font-mono tabular-nums text-muted-foreground">{cita.hora}</td>
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{cita.cliente}</td>
                    <td className="px-5 py-3 text-xs text-foreground">{cita.servicio}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{cita.estilista}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{cita.duracion}</td>
                    <td className="px-5 py-3 text-sm font-medium text-foreground text-right tabular-nums">{formatCurrency(cita.precio)}</td>
                    <td className="px-5 py-3"><StatusBadge status={cita.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Services catalog */}
        <div className="bg-card rounded-xl border">
          <div className="p-5 border-b border-border">
            <h4 className="font-display text-sm font-bold text-foreground">Catálogo de Servicios</h4>
            <p className="text-xs text-muted-foreground">Precios y duración</p>
          </div>
          <div className="p-4 space-y-2">
            {servicios.map((s) => (
              <div key={s.nombre} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "oklch(0.72 0.12 85 / 0.08)" }}>
                    <Sparkles size={12} style={{ color: "oklch(0.72 0.12 85)" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-foreground">{s.nombre}</p>
                      {s.popular && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">Popular</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{s.duracion}</p>
                  </div>
                </div>
                <p className="text-xs font-bold tabular-nums" style={{ color: "oklch(0.45 0.12 160)" }}>
                  {formatCurrency(s.precio)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
