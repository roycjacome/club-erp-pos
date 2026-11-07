// Design: "Prestige Dashboard" — Swiss Luxury
// Status badges con colores semánticos sutiles

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  "Activa": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Suspendida": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Cancelada": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "Vencido": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "Pendiente": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Programado": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "Confirmada": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Confirmado": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "En proceso": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "En planeación": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  "Depósito pagado": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Inscripciones Abiertas": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Lleno": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Ocupada": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "Disponible": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Mantenimiento": { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  "Dentro": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Salió": { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const style = statusStyles[status] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${style.bg} ${style.text} ${
      size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
