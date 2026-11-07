// Design: "Prestige Dashboard" — Swiss Luxury
// Visitantes: Sistema de acceso con QR

import StatusBadge from "@/components/StatusBadge";
import KpiCard from "@/components/KpiCard";
import { VISITANTES_RECIENTES } from "@/lib/constants";
import { QrCode, UserCheck, Users, Clock, Plus, Download } from "lucide-react";
import React from "react";
import { useState } from "react";

export default function Visitantes() {
  const [showQR, setShowQR] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", socio: "", fecha: "2026-02-15" });

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Visitantes Hoy" value="23" change={8} icon={<Users size={18} />} accent />
        <KpiCard label="Dentro del Club" value="8" icon={<UserCheck size={18} />} />
        <KpiCard label="Visitantes del Mes" value="1,234" change={-2.1} icon={<QrCode size={18} />} />
        <KpiCard label="Tiempo Prom. Visita" value="4.2 hrs" icon={<Clock size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* QR Generator */}
        <div className="bg-card rounded-xl border p-5">
          <h4 className="font-display text-sm font-bold text-foreground mb-1">Generar Pase de Visitante</h4>
          <p className="text-xs text-muted-foreground mb-4">Se enviará un código QR al visitante</p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Nombre del Visitante</label>
              <input type="text" placeholder="Nombre completo" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full h-9 px-3 rounded-lg text-xs bg-muted border-0 mt-1 text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Socio Anfitrión</label>
              <input type="text" placeholder="Buscar socio..." value={formData.socio} onChange={(e) => setFormData({...formData, socio: e.target.value})} className="w-full h-9 px-3 rounded-lg text-xs bg-muted border-0 mt-1 text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fecha de Visita</label>
              <input type="date" value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} className="w-full h-9 px-3 rounded-lg text-xs bg-muted border-0 mt-1 text-foreground" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Áreas Autorizadas</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["Golf", "Pádel", "Restaurante", "Alberca", "Gimnasio"].map((area) => (
                  <label key={area} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <input type="checkbox" className="rounded" defaultChecked={area === "Restaurante" || area === "Alberca"} />
                    {area}
                  </label>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setShowQR(!showQR)}
              className="w-full h-9 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "oklch(0.45 0.12 160)" }}>
              <QrCode size={14} /> {showQR ? "Cancelar" : "Generar Pase QR"}
            </button>
          </div>
        </div>

        {/* QR Preview */}
        {showQR && (
        <div className="bg-card rounded-xl border p-5 flex flex-col items-center justify-center">
          <div className="w-48 h-48 rounded-xl border-2 border-dashed flex items-center justify-center mb-4"
            style={{ borderColor: "oklch(0.72 0.12 85 / 0.3)" }}>
            {/* Simulated QR code */}
            <div className="w-36 h-36 p-2">
              <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="rounded-[1px]"
                    style={{
                      background: Math.random() > 0.45 ? "oklch(0.18 0.03 155)" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs font-mono text-muted-foreground mb-1">VIS-20260215-004</p>
          <p className="text-sm font-medium text-foreground mb-0.5">{formData.nombre || "Visitante"}</p>
          <p className="text-xs text-muted-foreground mb-3">Anfitrión: {formData.socio || "Seleccionar"}</p>
          <div className="flex gap-2">
            <button onClick={() => alert("Descargando QR...")} className="h-8 px-3 rounded-lg text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1.5 hover:bg-accent transition-colors active:scale-95">
              <Download size={12} /> Descargar
            </button>
            <button onClick={() => alert("Abriendo WhatsApp...")} className="h-8 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "oklch(0.45 0.12 160)" }}>
              Enviar por WhatsApp
            </button>
          </div>
        </div>
        )}

        {/* Access log */}
        <div className="bg-card rounded-xl border">
          <div className="p-5 border-b border-border">
            <h4 className="font-display text-sm font-bold text-foreground">Registro de Accesos</h4>
            <p className="text-xs text-muted-foreground">Entradas y salidas del día</p>
          </div>
          <div className="p-4 space-y-3">
            {VISITANTES_RECIENTES.map((v) => (
              <div key={v.qr} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: v.status === "Dentro" ? "oklch(0.55 0.14 160 / 0.08)" : "oklch(0.50 0.02 155 / 0.08)",
                  }}>
                  <QrCode size={14} style={{
                    color: v.status === "Dentro" ? "oklch(0.45 0.12 160)" : "oklch(0.50 0.02 155)",
                  }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{v.nombre}</p>
                  <p className="text-xs text-muted-foreground">Anfitrión: {v.socioAnfitrion}</p>
                  <p className="text-[10px] text-muted-foreground">{v.fecha} · {v.hora}</p>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
