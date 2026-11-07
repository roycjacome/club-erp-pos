// Design: "Prestige Dashboard" — Swiss Luxury
// Module: Pádel — Canchas, reservaciones, clases, ranking
// Connected to tRPC backend with fallback to mock data

import StatusBadge from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { IMAGES, PADEL_CANCHAS, PADEL_RESERVACIONES } from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import {
  CircleDot,
  Calendar,
  Users,
  DollarSign,
  PlusCircle,
  Trophy,
  Clock,
  Star,
  Loader2,
  AlertCircle,
  X,
  Sparkles,
  Upload,
  CreditCard,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import BulkLoadModal from "@/components/BulkLoadModal";
import TournamentBracketModal from "@/components/TournamentBracketModal";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(val);

// Fallback mock data when DB is empty
const MOCK_RANKING = [
  { pos: 1, nombre: "Carlos Mendoza R.", categoria: "A", puntos: 2450, partidos: 48, victorias: 38 },
  { pos: 2, nombre: "Roberto Sánchez V.", categoria: "A", puntos: 2280, partidos: 52, victorias: 39 },
  { pos: 3, nombre: "Javier Hernández M.", categoria: "A", puntos: 2150, partidos: 45, victorias: 32 },
  { pos: 4, nombre: "Fernando Torres V.", categoria: "B", puntos: 1890, partidos: 40, victorias: 26 },
  { pos: 5, nombre: "Gabriela Ramírez S.", categoria: "B", puntos: 1750, partidos: 35, victorias: 22 },
];

const MOCK_CLASES = [
  { instructor: "Pro. Alejandro Vega", horario: "Lun-Vie 7:00-12:00", alumnos: 18, tipo: "Grupal", precio: 650 },
  { instructor: "Pro. Daniela Soto", horario: "Mar-Sáb 8:00-13:00", alumnos: 10, tipo: "Individual", precio: 950 },
  { instructor: "Pro. Ricardo Mora", horario: "Lun-Jue 16:00-20:00", alumnos: 14, tipo: "Grupal", precio: 650 },
];

const MOCK_TORNEOS = [
  { id: 101, nombre: "Torneo Interno Febrero", fecha: "2026-02-22", inscritos: 24, max: 32, cuota: 1500, status: "Inscripciones Abiertas" },
  { id: 102, nombre: "Copa Demo Club Pádel", fecha: "2026-03-08", inscritos: 32, max: 32, cuota: 2500, status: "Lleno" },
  { id: 103, nombre: "Torneo Mixto Primavera", fecha: "2026-03-22", inscritos: 12, max: 24, cuota: 1800, status: "Inscripciones Abiertas" },
];

// ─── Reservation Modal ───────────────────────────────────────────────────────

interface ReservationModalProps {
  canchaId: number;
  canchaNombre: string;
  precioHora: string;
  fecha: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ReservationModal({ canchaId, canchaNombre, precioHora, fecha, onClose, onSuccess }: ReservationModalProps) {
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("09:00");
  const [socioId, setSocioId] = useState<number>(1);
  const [tipoPago, setTipoPago] = useState<string>("tarjeta");
  const [notas, setNotas] = useState("");

  const disponibilidad = trpc.padel.canchas.disponibilidad.useQuery({ canchaId, fecha });
  const socios = trpc.padel.socios.list.useQuery();
  const createReservacion = trpc.padel.reservaciones.create.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Reservación creada para ${canchaNombre}`, {
          description: "Se ha enviado confirmación por WhatsApp al socio.",
        });
        onSuccess();
        onClose();
      } else {
        toast.error("Error al crear reservación", {
          description: data.error,
        });
      }
    },
    onError: (error) => {
      toast.error("Error al crear reservación", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReservacion.mutate({
      canchaId,
      socioId,
      fecha,
      horaInicio: `${horaInicio}:00`,
      horaFin: `${horaFin}:00`,
      tipoPago: tipoPago as any,
      monto: precioHora,
      notas: notas || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-card rounded-xl border shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">Nueva Reservación</h4>
            <p className="text-xs text-muted-foreground">{canchaNombre} — {fecha}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Socio</label>
            <select
              value={socioId}
              onChange={(e) => setSocioId(Number(e.target.value))}
              className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground"
            >
              {socios.data?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} ({s.numeroSocio ?? `ID-${s.id}`})
                </option>
              ))}
              {(!socios.data || socios.data.length === 0) && (
                <option value={1}>Socio Demo (ID-1)</option>
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Hora Inicio</label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground"
              >
                {Array.from({ length: 15 }, (_, i) => i + 7).map((h) => {
                  const time = `${h.toString().padStart(2, "0")}:00`;
                  const slot = disponibilidad.data?.find((s) => s.horaInicio === `${time}:00`);
                  return (
                    <option key={h} value={time} disabled={slot ? !slot.disponible : false}>
                      {time} {slot && !slot.disponible ? "(Ocupado)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Hora Fin</label>
              <select
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground"
              >
                {Array.from({ length: 15 }, (_, i) => i + 8).map((h) => (
                  <option key={h} value={`${h.toString().padStart(2, "0")}:00`}>
                    {h.toString().padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Método de Cobro (Terminal Virtual)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "stripe", label: "Link Stripe" },
                { id: "mercado_pago", label: "Link M. Pago" },
                { id: "paypal", label: "Link PayPal" },
                { id: "apple_pay_nfc", label: "NFC / Apple Pay" },
                { id: "tarjeta", label: "Terminal Física" },
                { id: "cargo_cuenta", label: "Cargo a Cuenta" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTipoPago(m.id)}
                  className={`h-8 rounded-lg text-[10px] font-bold border transition-all ${tipoPago === m.id
                    ? "border-amber-400 bg-amber-50 text-amber-900"
                    : "border-border bg-muted/30 text-muted-foreground"
                    }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Notas (opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground resize-none"
              rows={2}
              placeholder="Notas adicionales..."
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Precio: <span className="font-bold text-foreground">{formatCurrency(parseFloat(precioHora))}/hr</span>
            </p>
            <button
              type="submit"
              disabled={createReservacion.isPending}
              className="h-9 px-5 rounded-lg text-xs font-medium text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              style={{ background: "oklch(0.45 0.12 160)" }}
            >
              {createReservacion.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Confirmar Reservación"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Padel() {
  const [location, setLocation] = useLocation();
  
  const [showReservationModal, setShowReservationModal] = useState<{
    canchaId: number;
    canchaNombre: string;
    precioHora: string;
  } | null>(null);

  const [showBulkLoadModal, setShowBulkLoadModal] = useState<{
    torneoId: number;
    torneoNombre: string;
  } | null>(null);

  const [showBracketModal, setShowBracketModal] = useState<{
    torneoId: number;
    torneoNombre: string;
  } | null>(null);

  const [selectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  const stripeMutation = trpc.padel.pagos.createStripeSession.useMutation({
    onSuccess: (data) => {
      if (data?.url) {
        window.location.assign(data.url);
      }
    },
    onError: (err) => {
      toast.error("Error Stripe: " + err.message);
    }
  });

  // Handle Stripe Success Callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const sessionId = params.get('session_id');

    if (status === 'success' && sessionId) {
      toast.success("Pago completado con éxito vía Stripe", {
        description: "El sistema está procesando la confirmación (Webhooks pendientes)."
      });
      // Clear URL params
      setLocation('/padel', { replace: true });
    } else if (status === 'cancel') {
        toast.warning("Pago cancelado", {
            description: "No se realizó ningún cargo."
        });
        setLocation('/padel', { replace: true });
    }
  }, [location, setLocation]);

  // tRPC queries
  const statsQuery = trpc.padel.stats.useQuery();
  const canchasQuery = trpc.padel.canchas.list.useQuery();
  const reservacionesQuery = trpc.padel.reservaciones.list.useQuery({ fecha: selectedDate });
  const rankingQuery = trpc.padel.ranking.list.useQuery();
  const torneosQuery = trpc.padel.torneos.list.useQuery();

  // Use real data or fallback to mock
  const stats = statsQuery.data;
  const canchasData = canchasQuery.data;
  const rankingData = rankingQuery.data;
  const torneosData = torneosQuery.data;

  const hasCanchasDB = canchasData && canchasData.length > 0;
  const hasRankingDB = rankingData && rankingData.length > 0;
  const hasTorneosDB = torneosData && torneosData.length > 0;

  // Map DB canchas to display format
  const displayCanchas = useMemo(() => {
    if (!hasCanchasDB) return PADEL_CANCHAS;
    return canchasData.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      status: c.estado === "disponible" ? "Disponible" : c.estado === "ocupada" ? "Ocupada" : "Mantenimiento",
      precioHora: c.precioHora,
      reserva: "",
      jugadores: "",
    }));
  }, [canchasData, hasCanchasDB]);

  // Map DB ranking to display format
  const displayRanking = useMemo(() => {
    if (!hasRankingDB) return MOCK_RANKING;
    return rankingData.map((r, i) => ({
      pos: i + 1,
      nombre: r.socioNombre ?? `Socio #${r.socioId}`,
      categoria: r.categoria === "principiante" ? "C" : r.categoria === "intermedio" ? "B" : r.categoria === "avanzado" ? "A" : "Pro",
      puntos: r.puntos,
      partidos: r.partidosJugados,
      victorias: r.victorias,
    }));
  }, [rankingData, hasRankingDB]);

  // Map DB torneos to display format
  const displayTorneos = useMemo(() => {
    if (!hasTorneosDB) return MOCK_TORNEOS as any[];
    return torneosData.map((t) => ({
      nombre: t.nombre,
      fecha: t.fechaInicio instanceof Date ? t.fechaInicio.toISOString().split("T")[0] : String(t.fechaInicio),
      inscritos: t.inscripcionesActuales,
      max: t.maxParticipantes,
      cuota: parseFloat(t.costoInscripcion ?? "0"),
      status: t.estado === "inscripciones_abiertas"
        ? "Inscripciones Abiertas"
        : t.estado === "en_curso"
          ? "En Curso"
          : t.estado === "finalizado"
            ? "Finalizado"
            : t.estado === "cancelado"
              ? "Cancelado"
              : "Próximo",
      id: t.id, // Added id to the mapped object
    }));
  }, [torneosData, hasTorneosDB]);

  const handleReservar = (cancha: any) => {
    if (hasCanchasDB) {
      setShowReservationModal({
        canchaId: cancha.id,
        canchaNombre: cancha.nombre,
        precioHora: cancha.precioHora,
      });
    } else {
      toast.success(`Reservación creada para ${cancha.nombre}`, {
        description: "Se ha enviado confirmación por WhatsApp al socio.",
      });
    }
  };

  const isLoading = statsQuery.isLoading || canchasQuery.isLoading;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl overflow-hidden h-36">
        <img src={IMAGES.padel} alt="Canchas de Pádel" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.14 0.04 155 / 0.80), oklch(0.14 0.04 155 / 0.3))",
          }}
        />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-1">Centro de Pádel</h3>
            <p className="text-sm" style={{ color: "oklch(0.82 0.02 90)" }}>
              {hasCanchasDB
                ? `${canchasData.length} canchas profesionales · Iluminación LED · Cristal panorámico`
                : "4 canchas profesionales · Iluminación LED · Cristal panorámico"}
            </p>
          </div>
          {/* Data source indicator */}
          <div className="ml-auto">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
              style={{
                background: hasCanchasDB ? "oklch(0.45 0.12 160 / 0.3)" : "oklch(0.75 0.15 85 / 0.3)",
                color: "white",
              }}
            >
              {hasCanchasDB ? (
                <>
                  <CircleDot size={10} /> Datos en vivo
                </>
              ) : (
                <>
                  <AlertCircle size={10} /> Datos demo
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Reservaciones Hoy"
          value={stats ? String(stats.reservacionesHoy) : "18"}
          change={15}
          icon={<Calendar size={18} />}
          accent
        />
        <KpiCard
          label="Ingresos Pádel"
          value={stats ? formatCurrency(stats.ingresosMes) : formatCurrency(312000)}
          change={22}
          icon={<DollarSign size={18} />}
          accent
        />
        <KpiCard
          label="Canchas Activas"
          value={stats ? String(stats.totalCanchas) : "4"}
          change={0}
          icon={<CircleDot size={18} />}
        />
        <KpiCard
          label="Socios Activos"
          value={stats ? String(stats.sociosActivos) : "24"}
          change={10}
          icon={<Users size={18} />}
        />
      </div>

      {/* Logros Financieros y Metas Operativas (Contexto: Padel project V1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-display text-sm font-bold text-foreground">Metas de Ocupación (Escenario Meta)</h4>
              <p className="text-[10px] text-muted-foreground">Proyección anual vs Realidad operativa</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-display font-bold text-amber-600">64%</span>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Ocupación Promedio</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Temporada Alta (Nov-Mar)", meta: 80, actual: 78, color: "oklch(0.65 0.15 155)" },
              { label: "Temporada Media (Abr-Jun)", meta: 65, actual: 62, color: "oklch(0.75 0.15 85)" },
              { label: "Temporada Baja (Jul-Oct)", meta: 45, actual: 48, color: "oklch(0.55 0.14 160)" },
            ].map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wide">
                  <span>{m.label}</span>
                  <span className="text-muted-foreground">{m.actual}% / {m.meta}% (META)</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(m.actual / m.meta) * 100}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign size={16} />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-foreground">Distribución de Ingresos Academy</h4>
              <p className="text-[10px] text-muted-foreground">Modelo de Negocio: 50% Club / 50% Pro</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Fondo del Club</p>
              <h5 className="text-lg font-display font-bold text-foreground">{formatCurrency(156000)}</h5>
              <p className="text-[9px] text-emerald-600 font-bold">+12% vs meta baja</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/30 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">Comisiones Pros</p>
              <h5 className="text-lg font-display font-bold text-foreground">{formatCurrency(156000)}</h5>
              <p className="text-[9px] text-muted-foreground">Distribución automatizada</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-dashed">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground font-medium">ROI Estimado Anual (Socio 25%):</span>
                <span className="font-bold text-foreground">18.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Court status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-4 flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          displayCanchas.map((cancha, i) => (
            <div key={i} className="bg-card rounded-xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-bold text-foreground">{cancha.nombre}</h5>
                <StatusBadge status={cancha.status} />
              </div>
              <div
                className="w-full h-24 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                style={{
                  background:
                    cancha.status === "Ocupada"
                      ? "oklch(0.55 0.14 160 / 0.08)"
                      : cancha.status === "Disponible"
                        ? "oklch(0.55 0.14 160 / 0.04)"
                        : "oklch(0.50 0.02 155 / 0.05)",
                }}
              >
                {/* Mini court visualization */}
                <div
                  className="w-20 h-14 border-2 rounded-sm relative"
                  style={{
                    borderColor:
                      cancha.status === "Mantenimiento"
                        ? "oklch(0.50 0.02 155 / 0.2)"
                        : "oklch(0.45 0.12 160 / 0.3)",
                  }}
                >
                  <div
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l border-dashed"
                    style={{ borderColor: "oklch(0.45 0.12 160 / 0.2)" }}
                  />
                  <div
                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0 border-t"
                    style={{ borderColor: "oklch(0.45 0.12 160 / 0.2)" }}
                  />
                </div>
              </div>
              {cancha.status === "Ocupada" && cancha.reserva && (
                <>
                  <p className="text-xs text-muted-foreground mb-1">Reserva: {cancha.reserva}</p>
                  <p className="text-[11px] text-foreground leading-tight">{cancha.jugadores}</p>
                </>
              )}
              {cancha.status === "Disponible" && (
                <button
                  onClick={() => handleReservar(cancha)}
                  className="w-full h-8 rounded-lg text-xs font-medium text-white mt-1 hover:opacity-90 active:scale-95 transition-all"
                  style={{ background: "oklch(0.45 0.12 160)" }}
                >
                  <PlusCircle size={14} className="inline-block mr-1" /> Reservar
                </button>
              )}
              {cancha.status === "Mantenimiento" && (
                <p className="text-xs text-muted-foreground">En mantenimiento programado</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reservation schedule */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border">
          <h4 className="font-display text-sm font-bold text-foreground">
            Calendario de Reservaciones — {selectedDate}
          </h4>
          <p className="text-xs text-muted-foreground">Vista de disponibilidad por cancha</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Hora
                </th>
                {hasCanchasDB
                  ? canchasData.map((c) => (
                    <th
                      key={c.id}
                      className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3"
                    >
                      {c.nombre}
                    </th>
                  ))
                  : ["Cancha 1", "Cancha 2", "Cancha 3", "Cancha 4"].map((name) => (
                    <th
                      key={name}
                      className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3"
                    >
                      {name}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {hasCanchasDB
                ? // Real data: generate time slots from 7:00 to 21:00
                Array.from({ length: 15 }, (_, i) => i + 7).map((h) => {
                  const hora = `${h.toString().padStart(2, "0")}:00`;
                  return (
                    <tr key={h} className="border-b border-border last:border-0">
                      <td className="px-5 py-2.5 text-xs font-medium text-foreground tabular-nums">
                        {hora}
                      </td>
                      {canchasData.map((cancha) => {
                        const reserva = reservacionesQuery.data?.data?.find(
                          (r) =>
                            r.canchaId === cancha.id &&
                            r.horaInicio <= `${hora}:00` &&
                            r.horaFin > `${hora}:00` &&
                            r.estado !== "cancelada"
                        );
                        return (
                          <td key={cancha.id} className="px-5 py-2.5 text-center">
                            {reserva ? (
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700">
                                Reservado
                              </span>
                            ) : cancha.estado === "mantenimiento" ? (
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500">
                                Mant.
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                                Libre
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
                : // Mock data fallback
                PADEL_RESERVACIONES.map((slot, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-5 py-2.5 text-xs font-medium text-foreground tabular-nums">
                      {slot.hora}
                    </td>
                    {[slot.cancha1, slot.cancha2, slot.cancha3, slot.cancha4].map((cell, j) => (
                      <td key={j} className="px-5 py-2.5 text-center">
                        {cell === "Libre" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                            Libre
                          </span>
                        ) : cell === "Mant." ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500">
                            Mant.
                          </span>
                        ) : cell === "Clase" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700">
                            {cell}
                          </span>
                        ) : cell.includes("Torneo") ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700">
                            {cell}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700">
                            {cell}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trazabilidad de Cobros (IA vs ERP) */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">Trazabilidad de Cobros Recientes</h4>
            <p className="text-xs text-muted-foreground">Comparativa de ingresos: Agente IA vs Terminal ERP</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              WhatsApp IA: 45%
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Terminal ERP: 55%
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase">Socio / Concepto</th>
                <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase">Canal de Venta</th>
                <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase">Método</th>
                <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { socio: "Carlos Mendoza", canal: "whatsapp_ia", metodo: "Stripe", monto: 850, hora: "14:20" },
                { socio: "Roberto Sánchez", canal: "erp", metodo: "NFC / Apple Pay", monto: 1200, hora: "13:45" },
                { socio: "Ana Patricia López", canal: "whatsapp_ia", metodo: "Mercado Pago", monto: 850, hora: "12:10" },
                { socio: "Javier Hernández", canal: "web_socio", metodo: "PayPal", monto: 950, hora: "10:30" },
              ].map((p, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">{p.socio}</p>
                    <p className="text-[10px] text-muted-foreground">Reserva Cancha 1 · {p.hora}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${p.canal === "whatsapp_ia"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : p.canal === "erp"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}>
                      {p.canal === "whatsapp_ia" ? <Sparkles size={10} className="mr-1" /> : null}
                      {p.canal.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-medium text-muted-foreground">
                    {p.metodo}
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-bold text-foreground">
                    {formatCurrency(p.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ranking */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <Trophy size={16} style={{ color: "oklch(0.75 0.15 85)" }} />
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">Ranking Interno de Pádel</h4>
            <p className="text-xs text-muted-foreground">
              Clasificación por puntos acumulados
              {!hasRankingDB && " (datos demo)"}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Pos
                </th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Jugador
                </th>
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Cat.
                </th>
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Puntos
                </th>
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Partidos
                </th>
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  Victorias
                </th>
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  % Vic.
                </th>
              </tr>
            </thead>
            <tbody>
              {displayRanking.map((jugador) => (
                <tr key={jugador.pos} className="border-b border-border last:border-0">
                  <td className="px-5 py-2.5 text-center">
                    {jugador.pos <= 3 ? (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold"
                        style={{
                          background:
                            jugador.pos === 1
                              ? "oklch(0.85 0.15 85 / 0.2)"
                              : jugador.pos === 2
                                ? "oklch(0.70 0.02 260 / 0.15)"
                                : "oklch(0.65 0.10 55 / 0.15)",
                          color:
                            jugador.pos === 1
                              ? "oklch(0.55 0.15 85)"
                              : jugador.pos === 2
                                ? "oklch(0.50 0.02 260)"
                                : "oklch(0.50 0.10 55)",
                        }}
                      >
                        {jugador.pos}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{jugador.pos}</span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-xs font-medium text-foreground">{jugador.nombre}</td>
                  <td className="px-5 py-2.5 text-center">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[11px] font-medium"
                      style={{
                        background:
                          jugador.categoria === "A" || jugador.categoria === "Pro"
                            ? "oklch(0.45 0.12 160 / 0.1)"
                            : "oklch(0.55 0.14 160 / 0.08)",
                        color:
                          jugador.categoria === "A" || jugador.categoria === "Pro"
                            ? "oklch(0.35 0.10 160)"
                            : "oklch(0.45 0.10 160)",
                      }}
                    >
                      {jugador.categoria}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-center text-xs font-bold tabular-nums" style={{ color: "oklch(0.45 0.12 160)" }}>
                    {jugador.puntos.toLocaleString()}
                  </td>
                  <td className="px-5 py-2.5 text-center text-xs text-muted-foreground tabular-nums">
                    {jugador.partidos}
                  </td>
                  <td className="px-5 py-2.5 text-center text-xs text-muted-foreground tabular-nums">
                    {jugador.victorias}
                  </td>
                  <td
                    className="px-5 py-2.5 text-center text-xs font-medium tabular-nums"
                    style={{ color: "oklch(0.45 0.12 160)" }}
                  >
                    {jugador.partidos > 0
                      ? ((jugador.victorias / jugador.partidos) * 100).toFixed(0)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Torneos y Clases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Torneos */}
        <div className="bg-card rounded-xl border">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <Trophy size={16} style={{ color: "oklch(0.75 0.15 85)" }} />
            <div>
              <h4 className="font-display text-sm font-bold text-foreground">Torneos Próximos</h4>
              <p className="text-xs text-muted-foreground">
                Inscripciones y eventos
                {!hasTorneosDB && " (datos demo)"}
              </p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {displayTorneos.map((torneo, i) => (
              <div key={i} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-foreground">{torneo.nombre}</h5>
                  <StatusBadge status={torneo.status} />
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {torneo.fecha}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {torneo.inscritos}/{torneo.max}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={12} /> {formatCurrency(torneo.cuota)}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(torneo.inscritos / torneo.max) * 100}%`,
                      background:
                        torneo.inscritos >= torneo.max
                          ? "oklch(0.55 0.15 85)"
                          : "oklch(0.45 0.12 160)",
                    }}
                  />
                </div>
                {torneo.id && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => setShowBulkLoadModal({ torneoId: torneo.id, torneoNombre: torneo.nombre })}
                      className="h-7 rounded-lg text-[10px] font-bold text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-all flex items-center justify-center gap-2"
                    >
                      <Upload size={12} /> Carga
                    </button>
                    <button
                      onClick={() => setShowBracketModal({ torneoId: torneo.id, torneoNombre: torneo.nombre })}
                      className="h-7 rounded-lg text-[10px] font-bold text-white border-none transition-all flex items-center justify-center gap-2"
                      style={{ background: "oklch(0.22 0.05 155)" }}
                    >
                      <Trophy size={12} /> Brackets
                    </button>
                    <button
                      onClick={() => stripeMutation.mutate({
                          torneoId: torneo.id,
                          monto: torneo.cuota,
                          concepto: `Inscripción: ${torneo.nombre}`,
                          socioId: 1 // Demo
                      })}
                      disabled={stripeMutation.isPending}
                      className="h-7 rounded-lg text-[10px] font-bold text-white border-none transition-all flex items-center justify-center gap-2 col-span-2"
                      style={{ background: "oklch(0.60 0.15 250)" }}
                    >
                      {stripeMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CreditCard size={12} />}
                      Cobrar con Stripe (Demo)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clases */}
        <div className="bg-card rounded-xl border">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <Star size={16} style={{ color: "oklch(0.75 0.15 85)" }} />
            <div>
              <h4 className="font-display text-sm font-bold text-foreground">Clases de Pádel</h4>
              <p className="text-xs text-muted-foreground">Instructores certificados (datos demo)</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {MOCK_CLASES.map((clase, i) => (
              <div key={i} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-foreground">{clase.instructor}</h5>
                  <span className="text-xs font-bold tabular-nums" style={{ color: "oklch(0.55 0.15 85)" }}>
                    {formatCurrency(clase.precio)}/hr
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {clase.horario}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {clase.alumnos} alumnos
                  </span>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      background:
                        clase.tipo === "Individual"
                          ? "oklch(0.55 0.14 160 / 0.08)"
                          : "oklch(0.45 0.12 160 / 0.1)",
                      color:
                        clase.tipo === "Individual"
                          ? "oklch(0.45 0.10 160)"
                          : "oklch(0.35 0.10 160)",
                    }}
                  >
                    {clase.tipo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <ReservationModal
          canchaId={showReservationModal.canchaId}
          canchaNombre={showReservationModal.canchaNombre}
          precioHora={showReservationModal.precioHora}
          fecha={selectedDate}
          onClose={() => setShowReservationModal(null)}
          onSuccess={() => {
            reservacionesQuery.refetch();
            canchasQuery.refetch();
            statsQuery.refetch();
          }}
        />
      )}

      {/* Bulk Load Modal */}
      {showBulkLoadModal && (
        <BulkLoadModal
          torneoId={showBulkLoadModal.torneoId}
          torneoNombre={showBulkLoadModal.torneoNombre}
          onClose={() => setShowBulkLoadModal(null)}
          onSuccess={() => {
            torneosQuery.refetch();
            statsQuery.refetch();
          }}
        />
      )}

      {/* Bracket Modal */}
      {showBracketModal && (
        <TournamentBracketModal
          torneoId={showBracketModal.torneoId}
          torneoNombre={showBracketModal.torneoNombre}
          onClose={() => setShowBracketModal(null)}
        />
      )}
    </div>
  );
}
