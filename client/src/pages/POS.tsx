// Design: "Prestige Dashboard" — Swiss Luxury
// POS: Punto de venta para restaurantes, snack bar, cafetería

import KpiCard from "@/components/KpiCard";
import { POS_ITEMS, POS_VENTAS_RECIENTES, IMAGES } from "@/lib/constants";
import { ShoppingCart, DollarSign, Receipt, TrendingUp, Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(val);

const areas = ["Todos", "Restaurante Principal", "Snack Bar", "Cafetería", "Snack Hoyo 16"];

export default function POS() {
  const [selectedArea, setSelectedArea] = useState("Todos");
  const [cart, setCart] = useState<{ id: number; nombre: string; precio: number; qty: number }[]>([
    { id: 1, nombre: "Hamburguesa Angus", precio: 285, qty: 2 },
    { id: 4, nombre: "Margarita", precio: 165, qty: 3 },
    { id: 2, nombre: "Ensalada César", precio: 195, qty: 1 },
  ]);

  const filteredItems = selectedArea === "Todos" ? POS_ITEMS : POS_ITEMS.filter(i => i.area === selectedArea);
  const cartTotal = cart.reduce((sum, item) => sum + item.precio * item.qty, 0);

  const addToCart = (item: typeof POS_ITEMS[0]) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { id: item.id, nombre: item.nombre, precio: item.precio, qty: 1 }]);
    }
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter(c => c.id !== id));
    } else {
      setCart(cart.map(c => c.id === id ? { ...c, qty } : c));
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Ventas del Día" value={formatCurrency(48_750)} change={12.3} icon={<DollarSign size={18} />} accent />
        <KpiCard label="Tickets del Día" value="67" change={8.5} icon={<Receipt size={18} />} />
        <KpiCard label="Ticket Promedio" value={formatCurrency(728)} change={3.5} icon={<TrendingUp size={18} />} />
        <KpiCard label="Items Vendidos" value="234" icon={<ShoppingCart size={18} />} />
      </div>

      {/* POS Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Menu items */}
        <div className="lg:col-span-2 bg-card rounded-xl border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedArea === area ? "text-white" : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                  style={selectedArea === area ? { background: "oklch(0.45 0.12 160)" } : {}}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-muted/50 rounded-lg p-3 text-left hover:bg-muted transition-colors border border-transparent hover:border-border group active:scale-95"
              >
                <div className="w-full h-16 rounded-md mb-2 flex items-center justify-center"
                  style={{ background: "oklch(0.45 0.12 160 / 0.06)" }}>
                  <ShoppingCart size={20} style={{ color: "oklch(0.45 0.12 160 / 0.4)" }} />
                </div>
                <p className="text-xs font-medium text-foreground leading-tight">{item.nombre}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.categoria}</p>
                <p className="text-sm font-bold mt-1 tabular-nums" style={{ color: "oklch(0.45 0.12 160)" }}>
                  {formatCurrency(item.precio)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-card rounded-xl border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm font-bold text-foreground">Ticket Actual</h4>
              <span className="text-xs text-muted-foreground">T-4522</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Socio: Carlos Mendoza Ríos</p>
          </div>
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{item.nombre}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{formatCurrency(item.precio)} c/u</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded flex items-center justify-center bg-muted hover:bg-accent transition-colors active:scale-90">
                    <Minus size={10} />
                  </button>
                  <span className="text-xs font-medium w-5 text-center tabular-nums">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded flex items-center justify-center bg-muted hover:bg-accent transition-colors active:scale-90">
                    <Plus size={10} />
                  </button>
                </div>
                <p className="text-xs font-bold tabular-nums w-16 text-right">{formatCurrency(item.precio * item.qty)}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors active:scale-90">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>IVA (16%)</span>
              <span className="tabular-nums">{formatCurrency(cartTotal * 0.16)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="tabular-nums" style={{ color: "oklch(0.45 0.12 160)" }}>{formatCurrency(cartTotal * 1.16)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="h-9 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors">
                Cargo a Cuenta
              </button>
              <button className="h-9 rounded-lg text-xs font-medium text-white"
                style={{ background: "oklch(0.45 0.12 160)" }}>
                Cobrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent sales */}
      <div className="bg-card rounded-xl border">
        <div className="p-5 border-b border-border">
          <h4 className="font-display text-sm font-bold text-foreground">Ventas Recientes</h4>
          <p className="text-xs text-muted-foreground">Últimos tickets del día</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Ticket</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Hora</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Área</th>
                <th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Items</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Total</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Método</th>
              </tr>
            </thead>
            <tbody>
              {POS_VENTAS_RECIENTES.map((venta) => (
                <tr key={venta.ticket} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono font-medium" style={{ color: "oklch(0.45 0.12 160)" }}>{venta.ticket}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground tabular-nums">{venta.hora}</td>
                  <td className="px-5 py-3 text-xs text-foreground">{venta.area}</td>
                  <td className="px-5 py-3 text-xs text-center tabular-nums">{venta.items}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground text-right tabular-nums">{formatCurrency(venta.total)}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{venta.metodo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
