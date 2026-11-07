// Design: "Prestige Dashboard" — Swiss Luxury
// Component: BulkLoadModal for Tournament Participants

import React, { useState } from "react";
import { X, Upload, Loader2, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface BulkLoadModalProps {
    torneoId: number;
    torneoNombre: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BulkLoadModal({ torneoId, torneoNombre, onClose, onSuccess }: BulkLoadModalProps) {
    const [rawData, setRawData] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<{ nombre: string; success: boolean; error?: string }[] | null>(null);

    const bulkInscribir = trpc.padel.torneos.bulkInscribir.useMutation({
        onSuccess: (data) => {
            setResults(data);
            setIsProcessing(false);
            toast.success("Carga masiva completada");
            onSuccess();
        },
        onError: (err) => {
            toast.error("Error en la carga masiva", { description: err.message });
            setIsProcessing(false);
        }
    });

    const handleProcess = () => {
        const lines = rawData.split("\n").filter(l => l.trim().length > 0);
        if (lines.length === 0) {
            toast.error("No hay datos para procesar");
            return;
        }

        setIsProcessing(true);

        // Parse lines: "Nombre, email, telefono" or just "Nombre"
        const participaciones = lines.map(line => {
            const parts = line.split(",").map(p => p.trim());
            return {
                nombre: parts[0],
                email: parts[1] || undefined,
                telefono: parts[2] || undefined,
            };
        });

        bulkInscribir.mutate({ torneoId, participaciones });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-card rounded-xl border shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
                    <div>
                        <h4 className="font-display text-sm font-bold text-foreground">Carga Masiva: {torneoNombre}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Módulo Administrativo Padel</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {!results ? (
                        <>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                                <AlertCircle size={18} className="text-amber-600 shrink-0" />
                                <div className="text-[11px] text-amber-900 leading-relaxed">
                                    <p className="font-bold mb-1">Instrucciones de Carga:</p>
                                    <p>Pega tu lista de participantes. El sistema buscará socios existentes o creará nuevos "Invitados" automáticamente.</p>
                                    <p className="mt-1 font-mono bg-white/50 p-1 rounded border border-amber-200 inline-block">Formato: Nombre, Email, Teléfono (uno por línea)</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Paste Data (CSV / Text)</label>
                                <textarea
                                    value={rawData}
                                    onChange={e => setRawData(e.target.value)}
                                    className="w-full h-48 rounded-xl border border-border bg-background p-4 text-xs font-mono focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder:text-muted-foreground/30"
                                    placeholder="Juan Perez, juan@gmail.com, 9381234567&#10;Maria Lopez, maria@outlook.com&#10;Carlos Ruiz"
                                    disabled={isProcessing}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <h5 className="text-xs font-bold text-foreground flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-emerald-500" /> Resultados del Procesamiento
                            </h5>
                            <div className="border rounded-xl divide-y bg-muted/10 overflow-hidden">
                                {results.map((res, i) => (
                                    <div key={i} className="p-3 flex items-center justify-between text-xs">
                                        <span className="font-medium text-foreground">{res.nombre}</span>
                                        {res.success ? (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Registrado
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-100 flex items-center gap-1">
                                                <AlertCircle size={10} /> Error: {res.error}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-border bg-muted/30 flex justify-end gap-3">
                    {results ? (
                        <button
                            onClick={onClose}
                            className="h-10 px-6 rounded-lg text-xs font-bold text-white transition-all bg-emerald-600 hover:bg-emerald-700"
                        >
                            Finalizar
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="h-10 px-4 rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleProcess}
                                disabled={isProcessing || !rawData.trim()}
                                className="h-10 px-6 rounded-lg text-xs font-bold text-white flex items-center gap-2 transition-all disabled:opacity-50"
                                style={{ background: "oklch(0.22 0.05 155)" }}
                            >
                                {isProcessing ? (
                                    <> <Loader2 size={14} className="animate-spin" /> Procesando... </>
                                ) : (
                                    <> <FileSpreadsheet size={14} /> Iniciar Carga Masiva </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
