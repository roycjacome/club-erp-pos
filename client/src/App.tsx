// Design: "Prestige Dashboard" — Swiss Luxury
// App: Navegación principal, layout con sidebar y contenido

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { NAV_ITEMS } from "@/lib/constants";
import { useState } from "react";

// Import all pages
import Dashboard from "./pages/Dashboard";
import Membresias from "./pages/Membresias";
import Cobros from "./pages/Cobros";
import POS from "./pages/POS";
import Golf from "./pages/Golf";
import Padel from "./pages/Padel";
import Visitantes from "./pages/Visitantes";
import Gimnasio from "./pages/Gimnasio";
import Salon from "./pages/Salon";
import Eventos from "./pages/Eventos";
import Reportes from "./pages/Reportes";
import Personal from "./pages/Personal";
const moduleConfig: Record<string, { title: string; subtitle: string; component: React.ComponentType }> = {
  dashboard: { title: "Dashboard Ejecutivo", subtitle: "Resumen operativo en tiempo real", component: Dashboard },
  membresias: { title: "Gestión de Membresías", subtitle: "Directorio de socios y tipos de membresía", component: Membresias },
  cobros: { title: "Cobros Recurrentes", subtitle: "Cuotas de mantenimiento y mensualidades diferidas", component: Cobros },
  pos: { title: "Punto de Venta", subtitle: "Sistema POS para restaurantes y snack bars", component: POS },
  golf: { title: "Módulo Golf", subtitle: "Clases, cuotas, torneos e inscripciones", component: Golf },
  padel: { title: "Módulo Pádel", subtitle: "Canchas, reservaciones y clases", component: Padel },
  visitantes: { title: "Sistema de Visitantes", subtitle: "Acceso con QR y registro de visitantes", component: Visitantes },
  gimnasio: { title: "Centro de Fitness", subtitle: "Accesos, membresías y clases", component: Gimnasio },
  salon: { title: "Salón de Uñas", subtitle: "Citas, servicios y estilistas", component: Salon },
  eventos: { title: "Centro de Eventos", subtitle: "Renta de espacios y organización de eventos", component: Eventos },
  reportes: { title: "Reportes Financieros", subtitle: "Análisis de ingresos, gastos y rentabilidad", component: Reportes },
  personal: { title: "Ajustes de Personal", subtitle: "Gestión de roles y permisos del sistema", component: Personal },
};

function App() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [userRole, setUserRole] = useState("admin_super");

  // Ensure user has access to active module when role changes
  const config = moduleConfig[activeModule];
  const navItem = NAV_ITEMS.find(item => item.id === activeModule);

  if (navItem && !navItem.roles.includes(userRole as any)) {
    // Redirect to first available module
    const firstAvailable = NAV_ITEMS.find(item => item.roles.includes(userRole as any));
    if (firstAvailable) {
      setActiveModule(firstAvailable.id);
    }
  }

  const PageComponent = config?.component || Dashboard;

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <Sidebar
              activeModule={activeModule}
              onModuleChange={setActiveModule}
              userRole={userRole}
              onRoleChange={setUserRole}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: "260px" }}>
              {/* Top bar */}
              <TopBar title={config?.title || "Dashboard"} subtitle={config?.subtitle || ""} />

              {/* Page content */}
              <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <PageComponent />
                </div>
              </main>
            </div>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
