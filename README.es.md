# 🏌️ Demo Country Club - Sistema ERP/POS

Sistema integral de gestión empresarial (ERP) y punto de venta (POS) para Demo Country Club, diseñado para centralizar todas las operaciones del club en una única plataforma.

> **📍 MVP Inicial:** Este proyecto es un **Mínimo Producto Viable (MVP)** desarrollado específicamente para **Demo Country Club, Ciudad del Carmen**.
>
> **🔄 Escalable y Replicable:** La arquitectura está diseñada para ser **escalable, replicable y reutilizable** por otros condominios y clubs similares.
>
> **📱 Punto de Contacto Principal:** El sistema integra **WhatsApp + ManyChat/Eleven Labs** como punto de contacto principal para clientes, miembros e invitados, permitiendo comunicación automática y atención al cliente 24/7.

## 📋 Descripción General

Este proyecto es un **sistema modular de gestión empresarial** que integra múltiples áreas de operación de un country club de lujo, incluyendo:

- 🏠 **Membresías**: Gestión de socios, altas, bajas y renovaciones
- 💰 **Cobros Recurrentes**: Cuotas de mantenimiento y mensualidades diferidas
- 🍽️ **Punto de Venta (POS)**: Sistema de ventas para restaurantes, snack bars y cafeterías
- ⛳ **Golf**: Gestión de clases, cuotas, torneos e inscripciones
- 🎾 **Pádel**: Gestión de canchas, reservaciones y clases
- 👥 **Visitantes**: Sistema de acceso con código QR
- 💪 **Gimnasio**: Control de accesos, membresías y clases
- 💅 **Salón de Uñas**: Gestión de citas y servicios
- 🎉 **Eventos**: Renta de espacios y organización de eventos
- 📊 **Reportes Financieros**: Análisis de ingresos por área

## 🎨 Diseño Visual

El sistema utiliza una filosofía de diseño **"Prestige Dashboard — Swiss Luxury"** con:

- **Paleta de colores**: Verde oscuro (#0D2818), dorado champagne (#D4AF37), blanco puro
- **Tipografía**: Libre Baskerville (títulos) + Source Sans 3 (contenido)
- **Estilo**: Elegante, profesional, orientado a ejecutivos
- **Componentes**: Gráficas interactivas, tablas profesionales, KPI cards

## 🚀 Tecnología

### Stack Frontend
- **React 19** - Framework UI
- **Tailwind CSS 4** - Utilidades de estilos
- **shadcn/ui** - Componentes reutilizables
- **Recharts** - Gráficas interactivas
- **Wouter** - Enrutamiento cliente-side
- **TypeScript** - Tipado estático

### Stack Backend
- **Node.js 20** - Runtime
- **Express.js** - Framework web
- **Vite** - Bundler y dev server

### Infraestructura
- **Google Cloud Run** - Hosting serverless
- **Cloud SQL** - Base de datos relacional (PostgreSQL/MySQL)
- **Cloud Storage** - Almacenamiento de archivos
- **Docker** - Contenerización

## 📦 Instalación Local

### Requisitos
- Node.js 20+
- pnpm 10+
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/roycjacome/club-erp-pos.git
cd club-erp-pos

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Ejecutar en desarrollo
pnpm run dev

# 5. Abrir en navegador
# http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
cc-playa-palmas-erp/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Módulos principales
│   │   ├── components/       # Componentes reutilizables
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilidades
│   │   ├── App.tsx           # Enrutamiento principal
│   │   └── index.css         # Estilos globales
│   └── public/               # Activos estáticos
├── server/                    # Backend Express
│   └── index.ts              # Servidor principal
├── shared/                    # Código compartido
├── Dockerfile                # Configuración Docker
├── package.json              # Dependencias
└── README.md                 # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm run dev          # Inicia servidor de desarrollo

# Producción
pnpm run build        # Construye la aplicación
pnpm run start        # Ejecuta en producción

# Utilidades
pnpm run check        # Verifica tipos TypeScript
pnpm run format       # Formatea código con Prettier
pnpm run preview      # Vista previa de build
```

## 📱 Módulos Principales

### 1. Dashboard Ejecutivo
- KPIs en tiempo real
- Gráficas de ingresos por área
- Indicadores de membresías activas
- Resumen de actividad reciente

### 2. Gestión de Membresías
- Directorio de socios
- Tipos de membresía
- Altas, bajas y renovaciones
- Historial de cambios

### 3. Cobros Recurrentes
- Cuotas de mantenimiento
- Mensualidades diferidas
- Historial de pagos
- Pendientes de cobro

### 4. Punto de Venta (POS)
- Carrito de compras interactivo
- Menú de productos por área
- Cálculo de totales
- Historial de ventas

### 5. Golf
- Gestión de torneos
- Clases y profesionales
- Inscripciones
- Calendario de eventos

### 6. Pádel
- Reservación de canchas
- Gestión de clases
- Disponibilidad en tiempo real
- Historial de reservas

### 7. Visitantes
- Generador de códigos QR
- Registro de accesos
- Control de entrada/salida
- Historial de visitas

### 8. Gimnasio
- Control de accesos
- Membresías de gimnasio
- Gestión de clases
- Asistencia

### 9. Salón de Uñas
- Reservación de citas
- Catálogo de servicios
- Disponibilidad de profesionales
- Historial de servicios

### 10. Eventos
- Renta de espacios
- Calendario de eventos
- Organización de torneos
- Disponibilidad de salones

### 11. Reportes Financieros
- Análisis de ingresos por área
- Comparativas mensuales
- Gráficas de tendencias
- Exportación de datos

## 🐳 Despliegue en Google Cloud Run

### Requisitos
- Cuenta de Google Cloud
- Cloud Run habilitado
- Cloud Build habilitado

### Pasos

1. **Conectar repositorio a Cloud Build**
   ```bash
   gcloud builds connect --repository=github_roycjacome_cc-playa-palmas-erp
   ```

2. **Crear trigger de despliegue automático**
   - Rama: `main`
   - Dockerfile: `./Dockerfile`
   - Región: `northamerica-south1`

3. **Configurar variables de entorno en Cloud Run**
   ```
   PORT=8080
   NODE_ENV=production
   DB_HOST=<tu-cloud-sql-host>
   DB_USER=<tu-usuario>
   DB_PASSWORD=<tu-contraseña>
   DB_NAME=ccc_playa_palmas
   ```

4. **Desplegar manualmente**
   ```bash
   gcloud run deploy erpplayapalmas \
     --source . \
     --platform managed \
     --region northamerica-south1 \
     --allow-unauthenticated
   ```

## 📊 Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=ccc_playa_palmas

# Servidor
PORT=3000
NODE_ENV=development

# API (opcional)
API_KEY=tu_api_key
API_URL=https://api.ejemplo.com
```

## 🔐 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ HTTPS en producción
- ✅ Validación de entrada de datos
- ✅ Protección contra CSRF
- ✅ Sanitización de SQL queries

## 📱 Integración WhatsApp (Punto de Contacto Principal)

El sistema incluye integración con **WhatsApp** como canal principal de comunicación:

- **ManyChat** - Chatbot inteligente para consultas automáticas
- **Eleven Labs** - IA para respuestas de voz natural
- **Notificaciones automáticas** - Confirmaciones de reservas, recordatorios, promociones
- **Atención al cliente 24/7** - Respuestas inmediatas a consultas comunes

### Branch POC (Proof of Concept)
La integración WhatsApp se está desarrollando en el branch `poc-padel` como prueba inicial en el módulo de Pádel.

## 📈 Roadmap

### Fase 1: MVP Actual (Demo Country Club)
- [x] 11 módulos funcionales
- [x] Dashboard ejecutivo
- [x] Punto de Venta
- [ ] Integración WhatsApp + ManyChat/Eleven Labs
- [ ] Autenticación de usuarios

### Fase 2: Escalabilidad
- [ ] Multi-tenant (múltiples condominios)
- [ ] Integración con sistemas POS existentes
- [ ] Sincronización automática de ventas
- [ ] Sistema de inventario avanzado

### Fase 3: Avanzado
- [ ] Autenticación multi-usuario con roles
- [ ] Notificaciones en tiempo real
- [ ] Aplicación móvil
- [ ] Reportes avanzados con BI

## 📋 Requisitos Específicos del Cliente

Ver [REQUISITOS_CLIENTE.md](./REQUISITOS_CLIENTE.md) para detalles completos sobre:
- Solicitudes específicas del cliente
- Funcionalidades por módulo
- Integración WhatsApp
- Timeline de implementación
- Estimación de recursos

## 🤝 Contribución

Este es un proyecto privado. Para cambios, contacta al equipo de desarrollo.

## 📞 Soporte

Para problemas o preguntas:
- 📧 Email: <owner-email>
- 🐛 Issues: [GitHub Issues](https://github.com/roycjacome/cc-playa-palmas-erp/issues)

## 📄 Licencia

MIT License - Todos los derechos reservados para Demo Country Club

---

## 📚 Documentación Adicional

- [REQUISITOS_CLIENTE.md](./REQUISITOS_CLIENTE.md) - Solicitudes específicas del cliente
- [GOOGLE_CLOUD_RUN_FIX.md](./GOOGLE_CLOUD_RUN_FIX.md) - Configuración de despliegue
- [ANALISIS_COMPLEJIDAD_ERP.md](./ANALISIS_COMPLEJIDAD_ERP.md) - Análisis técnico y estimación de créditos

---

**Última actualización:** Febrero 2026  
**Versión:** 1.0.0-beta  
**Estado:** MVP en desarrollo  
**Ubicación:** Demo Country Club, Ciudad del Carmen  
**Escalabilidad:** Diseñado para replicación en otros condominios
