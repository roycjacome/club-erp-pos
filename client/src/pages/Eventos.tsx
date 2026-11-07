// Design: "Prestige Dashboard" — Swiss Luxury
// Eventos: Renta de espacios, organización de eventos y torneos

import StatusBadge from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { EVENTOS_PROXIMOS, IMAGES } from "@/lib/constants";
import { CalendarDays, DollarSign, MapPin, Users, Plus } from "lucide-react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(val);

export default function Eventos() {
  const espacios = [
    { nombre: "Salón Principal", capacidad: 300, precioBase: 45_000, disponible: true },
    { nombre: "Salón Palmas", capacidad: 200, precioBase: 35_000, disponible: true },
    { nombre: "Terraza Sunset", capacidad: 120, precioBase: 25_000, disponible: false },
    { nombre: "Jardín Central", capacidad: 250, precioBase: 40_000, disponible: true },
    { nombre: "Sala de Juntas", capacidad: 30, precioBase: 8_000, disponible: true },
    { nombre: "Palapa de Playa", capacidad: 80, precioBase: 20_000, disponible: true },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36">
        <img src={IMAGES.clubhouse} alt="Eventos" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.14 0.04 155 / 0.80), oklch(0.14 0.04 155 / 0.3))" }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-1">Centro de Eventos</h3>
            <p className="text-sm" style={{ color: "oklch(0.82 0.02 90)" }}>6 espacios exclusivos · Bodas · Corporativos · Sociales</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Eventos del Mes" value="5" icon={<CalendarDays size={18} />} accent />
        <KpiCard label="Ingresos Eventos" value={formatCurrency(285_000)} change={18} icon={<DollarSign size={18} />} accent />
        <KpiCard label="Espacios Disponibles" value="5/6" icon={<MapPin size={18} />} />
        <KpiCard label="Asistentes Esperados" value="732" icon={<Users size={18} />} />
      </div>

      {/* Upcoming events */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">Eventos Próximos</h4>
            <p className="text-xs text-muted-foreground">Calendario de eventos confirmados y en planeación</p>
          </div>
          <button className="h-8 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5"
            style={{ background: "oklch(0.45 0.12 160)" }}>
            <Plus size={12} /> Nuevo Evento
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Evento</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Fecha</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Espacio</th>
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Personas</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Monto</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {EVENTOS_PROXIMOS.map((evento, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{evento.nombre}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground tabular-nums">{evento.fecha}</td>
                  <td className="px-5 py-3 text-xs text-foreground">{evento.espacio}</td>
                  <td className="px-5 py-3 text-xs text-center tabular-nums">{evento.personas}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground text-right tabular-nums">{formatCurrency(evento.monto)}</td>
                  <td className="px-5 py-3"><StatusBadge status={evento.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spaces */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border">
          <h4 className="font-display text-sm font-bold text-foreground">Espacios Disponibles</h4>
          <p className="text-xs text-muted-foreground">Catálogo de espacios para renta</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {espacios.map((espacio) => (
            <div key={espacio.nombre} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="w-full h-24 rounded-lg mb-3 flex items-center justify-center"
                style={{ background: "oklch(0.45 0.12 160 / 0.04)" }}>
                <MapPin size={24} style={{ color: "oklch(0.45 0.12 160 / 0.3)" }} />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-bold text-foreground">{espacio.nombre}</h5>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  espacio.disponible ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                }`}>
                  {espacio.disponible ? "Disponible" : "Reservado"}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Capacidad: {espacio.capacidad} personas</span>
                <span className="font-medium tabular-nums">{formatCurrency(espacio.precioBase)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
