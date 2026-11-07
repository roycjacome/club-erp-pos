// Design: "Prestige Dashboard" — Swiss Luxury
// Gimnasio: Accesos, membresías, clases

import KpiCard from "@/components/KpiCard";
import { GIMNASIO_CLASES, IMAGES } from "@/lib/constants";
import { Dumbbell, Users, Clock, TrendingUp } from "lucide-react";

export default function Gimnasio() {
  const accesosHoy = [
    { hora: "06:15", socio: "Roberto Sánchez Villa", tipo: "Acceso Gym" },
    { hora: "06:30", socio: "Javier Hernández Mora", tipo: "Clase Spinning" },
    { hora: "07:00", socio: "Gabriela Ramírez Solís", tipo: "Clase Yoga" },
    { hora: "07:05", socio: "Lucía Castillo Peña", tipo: "Clase Yoga" },
    { hora: "07:15", socio: "Carlos Mendoza Ríos", tipo: "Acceso Gym" },
    { hora: "08:00", socio: "Ana Patricia López", tipo: "Clase Spinning" },
    { hora: "08:30", socio: "María Elena Gutiérrez", tipo: "Acceso Gym" },
    { hora: "09:00", socio: "Fernando Torres Vega", tipo: "Clase Pilates" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36">
        <img src={IMAGES.gym} alt="Gimnasio" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.14 0.04 155 / 0.80), oklch(0.14 0.04 155 / 0.3))" }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-1">Centro de Fitness & Wellness</h3>
            <p className="text-sm" style={{ color: "oklch(0.82 0.02 90)" }}>Equipamiento Technogym · Salas de clase · Área funcional</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Accesos Hoy" value="47" change={5} icon={<Dumbbell size={18} />} accent />
        <KpiCard label="Membresías Gym" value="312" change={3.8} icon={<Users size={18} />} />
        <KpiCard label="Clases Hoy" value="6" icon={<Clock size={18} />} />
        <KpiCard label="Ingresos Gym" value="$156,000" change={8.2} icon={<TrendingUp size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Classes */}
        <div className="bg-card rounded-xl border">
          <div className="p-5 border-b border-border">
            <h4 className="font-display text-sm font-bold text-foreground">Clases del Día</h4>
            <p className="text-xs text-muted-foreground">Horario y disponibilidad</p>
          </div>
          <div className="p-4 space-y-3">
            {GIMNASIO_CLASES.map((clase) => (
              <div key={clase.clase} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.45 0.12 160 / 0.08)" }}>
                  <Dumbbell size={16} style={{ color: "oklch(0.45 0.12 160)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{clase.clase}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{clase.sala}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{clase.instructor} · {clase.horario}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium tabular-nums">{clase.inscritos}/{clase.capacidad}</p>
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                    <div className="h-full rounded-full" style={{
                      width: `${(clase.inscritos / clase.capacidad) * 100}%`,
                      background: clase.inscritos >= clase.capacidad ? "oklch(0.72 0.12 85)" : "oklch(0.45 0.12 160)",
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access log */}
        <div className="bg-card rounded-xl border">
          <div className="p-5 border-b border-border">
            <h4 className="font-display text-sm font-bold text-foreground">Registro de Accesos</h4>
            <p className="text-xs text-muted-foreground">Entradas del día al gimnasio</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Hora</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Socio</th>
                  <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {accesosHoy.map((acceso, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-2.5 text-xs font-mono tabular-nums text-muted-foreground">{acceso.hora}</td>
                    <td className="px-5 py-2.5 text-sm font-medium text-foreground">{acceso.socio}</td>
                    <td className="px-5 py-2.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        acceso.tipo.includes("Clase") ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        {acceso.tipo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
