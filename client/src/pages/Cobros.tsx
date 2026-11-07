// Design: "Prestige Dashboard" — Swiss Luxury
// Cobros: Cuotas de mantenimiento, mensualidades diferidas

import StatusBadge from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { COBROS_PENDIENTES } from "@/lib/constants";
import { CreditCard, AlertTriangle, CheckCircle, Clock, Send } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(val);

const cobranzaData = [
  { mes: "Sep", cobrado: 3_200_000, pendiente: 450_000 },
  { mes: "Oct", cobrado: 3_500_000, pendiente: 380_000 },
  { mes: "Nov", cobrado: 3_350_000, pendiente: 420_000 },
  { mes: "Dic", cobrado: 3_800_000, pendiente: 350_000 },
  { mes: "Ene", cobrado: 3_600_000, pendiente: 400_000 },
  { mes: "Feb", cobrado: 3_450_000, pendiente: 520_000 },
];

export default function Cobros() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Cobrado este Mes" value={formatCurrency(3_450_000)} change={4.2} icon={<CheckCircle size={18} />} accent />
        <KpiCard label="Pendiente de Cobro" value={formatCurrency(520_000)} change={-8.1} icon={<Clock size={18} />} />
        <KpiCard label="Cuentas Vencidas" value="15" icon={<AlertTriangle size={18} />} />
        <KpiCard label="Tasa de Cobro" value="86.9%" change={2.3} icon={<CreditCard size={18} />} />
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">Historial de Cobranza</h4>
            <p className="text-xs text-muted-foreground">Cobrado vs. Pendiente — Últimos 6 meses</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={cobranzaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 90)" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "oklch(0.50 0.02 155)" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="cobrado" fill="#2D6A4F" radius={[4, 4, 0, 0]} name="Cobrado" />
            <Bar dataKey="pendiente" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Pendiente" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pending table */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">Cobros Pendientes y Programados</h4>
            <p className="text-xs text-muted-foreground">Cuotas de mantenimiento y mensualidades diferidas</p>
          </div>
          <button className="h-8 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5"
            style={{ background: "oklch(0.45 0.12 160)" }}>
            <Send size={12} /> Enviar Recordatorios
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Socio</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Concepto</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Monto</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Vencimiento</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {COBROS_PENDIENTES.map((cobro, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{cobro.socio}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{cobro.concepto}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground text-right tabular-nums">{formatCurrency(cobro.monto)}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground tabular-nums">{cobro.vencimiento}</td>
                  <td className="px-5 py-3"><StatusBadge status={cobro.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-xs font-medium px-2 py-1 rounded hover:bg-muted transition-colors"
                      style={{ color: "oklch(0.45 0.12 160)" }}>
                      Registrar Pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
