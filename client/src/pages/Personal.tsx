// Design: "Prestige Dashboard" — Swiss Luxury
// Personal: Sistema de Permisos y Roles (RBAC)

import React, { useState } from "react";
import { UserCog, Plus, ShieldAlert, Check, ShieldCheck, Mail, Save } from "lucide-react";
import KpiCard from "@/components/KpiCard";

const ROLES_DISPONIBLES = [
    { id: "admin_super", name: "Super Administrador", color: "oklch(0.72 0.12 85)", desc: "Acceso total al sistema y base de datos" },
    { id: "admin_padel", name: "Admin Pádel", color: "oklch(0.65 0.15 155)", desc: "Gestión de canchas, cobros, torneos y NLP WhatsApp" },
    { id: "admin_golf", name: "Admin Golf", color: "oklch(0.55 0.14 160)", desc: "Gestión del campo, salidas y torneos de golf" },
    { id: "admin_gym", name: "Admin Fitness/Gym", color: "oklch(0.68 0.16 260)", desc: "Gestión de clases de gimnasio y accesos" },
    { id: "admin_membresias", name: "Gestión Membresías", color: "oklch(0.62 0.18 330)", desc: "Control de socios y cuotas recurrentes" },
    { id: "admin_eventos", name: "Coord. Eventos", color: "oklch(0.70 0.14 10)", desc: "Reservas de salones y logística de eventos" },
    { id: "admin_pos", name: "Ventas y Restaurante", color: "oklch(0.60 0.10 40)", desc: "Punto de Venta" },
    { id: "guardia", name: "Guardia (Caseta)", color: "oklch(0.50 0.05 200)", desc: "Verificador de Accesos y QR" },
];

const MOCK_USERS = [
    { id: 1, name: "Roy Camacho", email: "admin@example.com", role: "admin_super", status: "Activo" },
    { id: 2, name: "Luis Entrenador", email: "luis.padel@playapalmas.club", role: "admin_padel", status: "Activo" },
    { id: 3, name: "Mario (Caseta Principal)", email: "caseta1@playapalmas.club", role: "guardia", status: "Activo" },
    { id: 4, name: "Ana Finanzas", email: "ana.caja@playapalmas.club", role: "admin_pos", status: "Pendiente" },
];

export default function Personal() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "admin_padel" });

    const handleAddUser = () => {
        if (newUser.name && newUser.email) {
            setUsers([...users, { id: Date.now(), ...newUser, status: "Invitado" }]);
            setIsAdding(false);
            setNewUser({ name: "", email: "", role: "admin_padel" });
        }
    };

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard label="Empleados Registrados" value={users.length.toString()} icon={<UserCog size={18} />} accent />
                <KpiCard label="Cuentas de Super Admin" value={users.filter(u => u.role === "admin_super").length.toString()} icon={<ShieldAlert size={18} />} />
                <KpiCard label="Roles de Seguridad (RBAC)" value={ROLES_DISPONIBLES.length.toString()} icon={<ShieldCheck size={18} />} />
            </div>

            <div className="flex justify-between items-center bg-card p-5 rounded-xl border">
                <div>
                    <h4 className="font-display text-sm font-bold text-foreground mb-1">Control de Acceso (RBAC)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Gestión de roles y permisos de los operadores del sistema ERP.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="h-9 px-4 rounded-lg text-xs font-medium text-white flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: "oklch(0.22 0.05 155)" }}>
                    <Plus size={14} /> Registrar Empleado
                </button>
            </div>

            {isAdding && (
                <div className="bg-muted p-5 rounded-xl border mb-4 slide-down mt-4">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: "oklch(0.22 0.05 155)" }}>Invitar Nuevo Colaborador</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Nombre</label>
                            <input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full h-9 px-3 rounded-lg text-xs bg-background border mt-1" placeholder="Ej: Juan Pérez" />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Correo <span className="text-xs text-red-500">*</span></label>
                            <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full h-9 px-3 rounded-lg text-xs bg-background border mt-1" placeholder="empleado@playapalmas.club" />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Rol de Sistema</label>
                            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full h-9 px-3 rounded-lg text-xs bg-background border mt-1 appearance-none cursor-pointer">
                                {ROLES_DISPONIBLES.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <button
                                onClick={handleAddUser}
                                className="w-full h-9 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                                style={{ background: "oklch(0.72 0.12 85)" }}>
                                <Mail size={14} /> Enviar Invitación
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de Usuarios */}
            <div className="bg-card rounded-xl border overflow-hidden mt-6">
                <div className="p-4 border-b border-border bg-muted/50">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Directorio de Entidades</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-card">
                                <th className="px-5 py-4 font-medium text-xs text-muted-foreground w-1/4">Empleado</th>
                                <th className="px-5 py-4 font-medium text-xs text-muted-foreground w-1/4">Cuenta de Acceso (Email)</th>
                                <th className="px-5 py-4 font-medium text-xs text-muted-foreground w-1/4">Rol Interno</th>
                                <th className="px-5 py-4 font-medium text-xs text-muted-foreground text-right">Estatus</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => {
                                const roleData = ROLES_DISPONIBLES.find(r => r.id === user.role);
                                return (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                                    style={{ background: roleData ? roleData.color : "gray" }}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-foreground text-sm">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-muted-foreground">
                                            {user.email}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                                                style={{
                                                    background: roleData ? `${roleData.color.slice(0, -1)} / 0.15)` : "gray",
                                                    color: roleData ? roleData.color : "black",
                                                }}>
                                                {roleData ? roleData.name : user.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${user.status === "Activo" ? "bg-green-100 text-green-700" :
                                                user.status === "Invitado" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {user.status === "Activo" ? <Check size={10} className="mr-1" /> : null}
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
