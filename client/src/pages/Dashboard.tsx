// Design: "Prestige Dashboard" — Swiss Luxury
// Dashboard: Vista ejecutiva con KPIs, gráficas de ingresos, indicadores

import KpiCard from "@/components/KpiCard";
import StatusBadge from "@/components/StatusBadge";
import { DASHBOARD_KPIS, INGRESOS_POR_AREA, INGRESOS_MENSUALES, IMAGES } from "@/lib/constants";
import { Users, DollarSign, UserCheck, Percent, TrendingUp, ArrowUpRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const COLORS = ["#2D6A4F", "#40916C", "#D4AF37", "#1B4332", "#52B788", "#74C69D", "#B7E4C7", "#95D5B2"];

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(val);

import { trpc } from "@/lib/trpc";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-sm font-bold" style={{ color: "oklch(0.45 0.12 160)" }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const statsQuery = trpc.padel.stats.useQuery();
  const padelStats = statsQuery.data;

  const actividadReciente = [
    { accion: "Nueva membresía registrada", detalle: "Lucía Castillo — Oro", tiempo: "Hace 2h" },
    { accion: "Pago recibido", detalle: "Carlos Mendoza — $15,800", tiempo: "Hace 3h" },
    { accion: "Reservación de evento", detalle: "Boda Hernández-López — Feb 28", tiempo: "Hace 5h" },
    { accion: "Torneo inscripción", detalle: "Copa Demo Club — Cupo lleno", tiempo: "Hace 6h" },
    { accion: "Visitante registrado", detalle: "Pedro García — Anfitrión: C. Mendoza", tiempo: "Hace 8h" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative rounded-xl overflow-hidden h-40">
        <img src={IMAGES.heroGolf} alt="Country Club" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.14 0.04 155 / 0.85), oklch(0.14 0.04 155 / 0.4))" }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-1">Bienvenido al Panel Ejecutivo</h3>
            <p className="text-sm" style={{ color: "oklch(0.82 0.02 90)" }}>
              Demo Country Club — Resumen operativo en tiempo real
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Membresías Activas"
          value={DASHBOARD_KPIS.membresíasActivas.toLocaleString("es-MX")}
          change={3.2}
          changeLabel="vs. mes anterior"
          icon={<Users size={18} />}
          accent
        />
        <KpiCard
          label="Ingresos Mes"
          value={formatCurrency(DASHBOARD_KPIS.ingresosMes + (padelStats?.ingresosMes || 0))}
          change={8.5}
          changeLabel="incluyendo Pádel"
          icon={<DollarSign size={18} />}
          accent
        />
        <KpiCard
          label="Reservas Pádel"
          value={(padelStats?.totalReservaciones || 0).toString()}
          change={(padelStats?.reservacionesHoy || 0)}
          changeLabel="hoy confirmadas"
          icon={<TrendingUp size={18} />}
        />
        <KpiCard
          label="Ocupación Promedio"
          value={`${DASHBOARD_KPIS.ocupaciónPromedio}%`}
          change={5.0}
          changeLabel="vs. mes anterior"
          icon={<Percent size={18} />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-display text-sm font-bold text-foreground">Tendencia de Ingresos</h4>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
              <TrendingUp size={12} />
              +8.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={INGRESOS_MENSUALES}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 90)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="monto" stroke="#2D6A4F" strokeWidth={2} fill="url(#greenGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by area pie */}
        <div className="bg-card rounded-xl border p-5">
          <h4 className="font-display text-sm font-bold text-foreground mb-1">Ingresos por Área</h4>
          <p className="text-xs text-muted-foreground mb-3">Distribución del mes</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={INGRESOS_POR_AREA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="monto"
                nameKey="area"
              >
                {INGRESOS_POR_AREA.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {INGRESOS_POR_AREA.slice(0, 5).map((item, i) => (
              <div key={item.area} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.area}</span>
                </div>
                <span className="font-medium tabular-nums">{item.porcentaje}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by area bar chart */}
        <div className="bg-card rounded-xl border p-5">
          <h4 className="font-display text-sm font-bold text-foreground mb-1">Desglose por Área</h4>
          <p className="text-xs text-muted-foreground mb-4">Ingresos mensuales por centro de costo</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={INGRESOS_POR_AREA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 90)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="area" tick={{ fontSize: 10, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="monto" fill="#2D6A4F" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="bg-card rounded-xl border p-5">
          <h4 className="font-display text-sm font-bold text-foreground mb-1">Actividad Reciente</h4>
          <p className="text-xs text-muted-foreground mb-4">Últimas operaciones del sistema</p>
          <div className="space-y-3">
            {actividadReciente.map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "oklch(0.45 0.12 160 / 0.08)" }}>
                  <ArrowUpRight size={14} style={{ color: "oklch(0.45 0.12 160)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.accion}</p>
                  <p className="text-xs text-muted-foreground">{item.detalle}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{item.tiempo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
