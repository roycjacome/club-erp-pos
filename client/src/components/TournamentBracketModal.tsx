import React from "react";
import {
    Trophy,
    X,
    Plus,
    ArrowRight,
    Loader2,
    AlertCircle,
    Users,
    Calendar,
    Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface TournamentBracketModalProps {
    torneoId: number;
    torneoNombre: string;
    onClose: () => void;
}

export default function TournamentBracketModal({
    torneoId,
    torneoNombre,
    onClose,
}: TournamentBracketModalProps) {
    const partidosQuery = trpc.padel.torneos.listPartidos.useQuery({ torneoId });
    const generateMutation = trpc.padel.torneos.generateBrackets.useMutation({
        onSuccess: () => {
            toast.success("Brackets generados con éxito");
            partidosQuery.refetch();
        },
        onError: (err) => {
            toast.error("Error al generar brackets: " + err.message);
        },
    });

    const partidos = partidosQuery.data || [];
    const hasPartidos = partidos.length > 0;

    // Group by round
    const rounds: Record<number, any[]> = {};
    partidos.forEach((p) => {
        if (!rounds[p.ronda!]) rounds[p.ronda!] = [];
        rounds[p.ronda!].push(p);
    });

    const numRounds = Object.keys(rounds).length;

    const handleGenerate = () => {
        generateMutation.mutate({ torneoId });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-background border border-border w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-card">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                            style={{
                                background:
                                    "linear-gradient(135deg, oklch(0.75 0.15 85), oklch(0.65 0.15 85))",
                            }}
                        >
                            <Trophy size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">
                                Brackets / Competición
                            </h3>
                            <p className="text-xs text-muted-foreground">{torneoNombre}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    >
                        <X size={18} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 bg-muted/30">
                    {!hasPartidos && !partidosQuery.isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                                <Zap size={32} className="text-amber-500" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                Brackets No Generados
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                                Aún no se ha definido el cuadro de competición para este torneo.
                                Al generarlos, se barajarán los participantes inscritos.
                            </p>
                            <button
                                onClick={handleGenerate}
                                disabled={generateMutation.isLoading}
                                className="px-6 h-11 rounded-xl font-bold text-white flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg"
                                style={{ background: "oklch(0.72 0.12 85)" }}
                            >
                                {generateMutation.isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Zap size={18} />
                                )}
                                Generar Cuadro de Competición
                            </button>
                        </div>
                    ) : partidosQuery.isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 size={32} className="animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="flex flex-nowrap gap-8 min-w-max pb-4">
                            {Object.keys(rounds)
                                .sort((a, b) => Number(a) - Number(b))
                                .map((r) => (
                                    <div key={r} className="flex flex-col gap-6 w-[280px]">
                                        <div className="text-center py-2 px-4 rounded-lg bg-card border border-border shadow-sm sticky top-0 z-10">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                {Number(r) === numRounds
                                                    ? "Gran Final"
                                                    : Number(r) === numRounds - 1
                                                        ? "Semifinales"
                                                        : `Ronda ${r}`}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-around flex-1 gap-4">
                                            {rounds[Number(r)].map((match, idx) => {
                                                const equipo1 = JSON.parse(match.equipo1 || "[]");
                                                const equipo2 = JSON.parse(match.equipo2 || "[]");

                                                return (
                                                    <div
                                                        key={match.id}
                                                        className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                                                    >
                                                        <div className="px-3 py-2 border-b border-border bg-muted/20 flex justify-between items-center">
                                                            <span className="text-[9px] font-bold text-muted-foreground">
                                                                MATCH #{match.matchNumero + 1}
                                                            </span>
                                                            <span
                                                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${match.estado === "finalizado"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-blue-100 text-blue-700"
                                                                    }`}
                                                            >
                                                                {match.estado.toUpperCase()}
                                                            </span>
                                                        </div>

                                                        <div className="p-3 space-y-2">
                                                            {/* Equipo 1 */}
                                                            <div
                                                                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${match.ganador === "equipo1"
                                                                    ? "bg-green-500/10 border-green-500/20"
                                                                    : "bg-muted/50"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <div className="w-6 h-6 rounded-full bg-card border flex items-center justify-center flex-shrink-0">
                                                                        <Users size={12} className="text-muted-foreground" />
                                                                    </div>
                                                                    <span className="text-xs font-medium truncate">
                                                                        {equipo1.length > 0 ? `Equipo A (${equipo1.length})` : "TBD"}
                                                                    </span>
                                                                </div>
                                                                {match.marcadorEquipo1 && (
                                                                    <span className="font-bold text-xs">{match.marcadorEquipo1}</span>
                                                                )}
                                                            </div>

                                                            <div className="flex justify-center -my-1">
                                                                <span className="text-[10px] font-bold text-muted-foreground/30 italic">VS</span>
                                                            </div>

                                                            {/* Equipo 2 */}
                                                            <div
                                                                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${match.ganador === "equipo2"
                                                                    ? "bg-green-500/10 border-green-500/20"
                                                                    : "bg-muted/50"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <div className="w-6 h-6 rounded-full bg-card border flex items-center justify-center flex-shrink-0">
                                                                        <Users size={12} className="text-muted-foreground" />
                                                                    </div>
                                                                    <span className="text-xs font-medium truncate">
                                                                        {equipo2.length > 0 ? `Equipo B (${equipo2.length})` : "TBD"}
                                                                    </span>
                                                                </div>
                                                                {match.marcadorEquipo2 && (
                                                                    <span className="font-bold text-xs">{match.marcadorEquipo2}</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Decorative connector */}
                                                        {match.siguientePartidoId && (
                                                            <div className="absolute top-1/2 -right-4 w-4 h-px bg-border z-0" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-card flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Programado
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-green-500" /> Finalizado
                        </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                        * Los ganadores avanzan automáticamente al siguiente partido enlazado.
                    </p>
                </div>
            </div>
        </div>
    );
}
