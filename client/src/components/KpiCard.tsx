// Design: "Prestige Dashboard" — Swiss Luxury
// KPI Cards: Número grande estilo reloj de lujo, label pequeño, sombra sutil

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  accent?: boolean;
}

export default function KpiCard({ label, value, change, changeLabel, icon, accent }: KpiCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div
      className="bg-card rounded-xl p-5 border transition-shadow duration-200 hover:shadow-lg relative overflow-hidden group"
      style={{
        borderColor: accent ? "oklch(0.72 0.12 85 / 0.25)" : undefined,
      }}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, oklch(0.72 0.12 85), oklch(0.62 0.10 85))" }} />
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: accent ? "oklch(0.72 0.12 85 / 0.12)" : "oklch(0.955 0.005 90)",
            color: accent ? "oklch(0.72 0.12 85)" : "oklch(0.45 0.12 160)",
          }}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            isPositive ? "bg-emerald-50 text-emerald-700" : isNegative ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"
          }`}>
            {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="kpi-number text-2xl leading-none mb-1" style={{ color: "oklch(0.18 0.03 155)" }}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      {changeLabel && (
        <p className="text-[10px] text-muted-foreground mt-1">{changeLabel}</p>
      )}
    </div>
  );
}
