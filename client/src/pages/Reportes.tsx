// Design: "Prestige Dashboard" — Swiss Luxury
// Reportes: Análisis financiero, dónde está el dinero, ganancias por área

import KpiCard from "@/components/KpiCard";
import { REPORTES_AREAS } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { BarChart3, TrendingUp, DollarSign, Percent } from "lucide-react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(val);

const COLORS = ["#2D6A4F", "#40916C", "#D4AF37", "#1B4332", "#52B788", "#74C69D", "#B7E4C7", "#95D5B2", "#D8F3DC", "#52B788"];

const rentabilidadData = [
  { area: "Membresías", margen: 93.5, utilidad: 1_730_000 },
  { area: "Pádel", margen: 70.0, utilidad: 218_400 },
  { area: "Visitantes", margen: 80.0, utilidad: 37_600 },
  { area: "Golf", margen: 55.0, utilidad: 354_750 },
  { area: "Salón Uñas", margen: 60.0, utilidad: 59_160 },
  { area: "Eventos", margen: 50.0, utilidad: 142_500 },
  { area: "Restaurante", margen: 40.0, utilidad: 232_000 },
  { area: "Gimnasio", margen: 50.0, utilidad: 78_000 },
  { area: "Snack Bar", margen: 50.0, utilidad: 92_500 },
  { area: "Cafetería", margen: 50.0, utilidad: 63_500 },
];

const distribucionIngresos = [
  { area: "Membresías", ingresos: 1_850_000, porcentaje: 43.2 },
  { area: "Restaurante", ingresos: 892_000, porcentaje: 20.8 },
  { area: "Golf", ingresos: 645_000, porcentaje: 15.1 },
  { area: "Pádel", ingresos: 312_000, porcentaje: 7.3 },
  { area: "Eventos", ingresos: 285_000, porcentaje: 6.7 },
  { area: "Otros", ingresos: 301_600, porcentaje: 7.0 },
];

const tendenciaUtilidad = [
  { mes: "Sep", utilidad: 2_850_000 },
  { mes: "Oct", utilidad: 3_120_000 },
  { mes: "Nov", utilidad: 2_980_000 },
  { mes: "Dic", utilidad: 3_650_000 },
  { mes: "Ene", utilidad: 3_150_000 },
  { mes: "Feb", utilidad: 3_285_600 },
];

export default function Reportes() {
  const totalIngresos = REPORTES_AREAS.reduce((sum, a) => sum + a.ingresos, 0);
  const totalGastos = REPORTES_AREAS.reduce((sum, a) => sum + a.gastos, 0);
  const totalUtilidad = REPORTES_AREAS.reduce((sum, a) => sum + a.utilidad, 0);
  const margenPromedio = (totalUtilidad / totalIngresos) * 100;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Ingresos Totales" value={formatCurrency(totalIngresos)} change={8.5} icon={<DollarSign size={18} />} accent />
        <KpiCard label="Gastos Operativos" value={formatCurrency(totalGastos)} change={-3.2} icon={<TrendingUp size={18} />} />
        <KpiCard label="Utilidad Neta" value={formatCurrency(totalUtilidad)} change={12.3} icon={<BarChart3 size={18} />} accent />
        <KpiCard label="Margen Promedio" value={`${margenPromedio.toFixed(1)}%`} change={2.1} icon={<Percent size={18} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Rentabilidad por área */}
        <div className="bg-card rounded-xl border p-5">
          <h4 className="font-display text-sm font-bold text-foreground mb-1">Rentabilidad por Área</h4>
          <p className="text-xs text-muted-foreground mb-4">Margen de utilidad — Mes actual</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={rentabilidadData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 90)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <YAxis type="category" dataKey="area" tick={{ fontSize: 9, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Bar dataKey="margen" fill="#2D6A4F" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de ingresos */}
        <div className="bg-card rounded-xl border p-5">
          <h4 className="font-display text-sm font-bold text-foreground mb-1">Distribución de Ingresos</h4>
          <p className="text-xs text-muted-foreground mb-4">Composición de ingresos totales</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={distribucionIngresos}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="ingresos"
                nameKey="area"
              >
                {distribucionIngresos.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tendencia de utilidad */}
      <div className="bg-card rounded-xl border p-5">
        <h4 className="font-display text-sm font-bold text-foreground mb-1">Tendencia de Utilidad Neta</h4>
        <p className="text-xs text-muted-foreground mb-4">Últimos 6 meses</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={tendenciaUtilidad}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 90)" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Line type="monotone" dataKey="utilidad" stroke="#2D6A4F" strokeWidth={3} dot={{ fill: "#2D6A4F", r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed table */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border">
          <h4 className="font-display text-sm font-bold text-foreground">Análisis Detallado por Área</h4>
          <p className="text-xs text-muted-foreground">Ingresos, gastos, utilidad y margen de cada departamento</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Área</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Ingresos</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Gastos</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Utilidad</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Margen</th>
              </tr>
            </thead>
            <tbody>
              {REPORTES_AREAS.map((area, i) => (
                <tr key={area.area} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{area.area}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground text-right tabular-nums">{formatCurrency(area.ingresos)}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground text-right tabular-nums">{formatCurrency(area.gastos)}</td>
                  <td className="px-5 py-3 text-sm font-bold text-right tabular-nums" style={{ color: "oklch(0.45 0.12 160)" }}>
                    {formatCurrency(area.utilidad)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: area.margen >= 70 ? "oklch(0.55 0.14 160 / 0.08)" : area.margen >= 50 ? "oklch(0.72 0.12 85 / 0.08)" : "oklch(0.50 0.02 155 / 0.08)",
                        color: area.margen >= 70 ? "oklch(0.45 0.12 160)" : area.margen >= 50 ? "oklch(0.60 0.10 85)" : "oklch(0.50 0.02 155)",
                      }}>
                      {area.margen.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-border font-bold">
                <td className="px-5 py-3 text-sm text-foreground">TOTAL</td>
                <td className="px-5 py-3 text-sm text-foreground text-right tabular-nums">{formatCurrency(totalIngresos)}</td>
                <td className="px-5 py-3 text-sm text-foreground text-right tabular-nums">{formatCurrency(totalGastos)}</td>
                <td className="px-5 py-3 text-sm text-right tabular-nums" style={{ color: "oklch(0.45 0.12 160)" }}>
                  {formatCurrency(totalUtilidad)}
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: "oklch(0.55 0.14 160 / 0.08)",
                      color: "oklch(0.45 0.12 160)",
                    }}>
                    {margenPromedio.toFixed(1)}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
