# Matriz de Trazabilidad de Requisitos (RTM)
## clubos ERP - Demo Country Club

**Fecha:** 26 de Febrero de 2026  
**Versión:** 1.0

---

## 1. Matriz de Trazabilidad Completa

### Leyenda
- ✅ Implementado
- ⚠️ Parcialmente implementado
- ❌ No implementado
- 🔄 En progreso

---

## 2. Módulo 1: Gestión de Reservas, Accesos y Competición

| ID | Requisito | Descripción | Estado | Componente Técnico | Fase | Prioridad |
|---|---|---|---|---|---|---|
| RF1.1 | Tiers de Usuario | Socios, Externos, Invitados | ✅ | `drizzle/schema.ts` - tabla `users` | 0 | Alta |
| RF1.2 | QRs Dinámicos JWT | Tokens encriptados con ID reserva | ❌ | `server/routers/padel.ts` - `generarQR()` | 1 | Alta |
| RF1.3 | Procesamiento Excel | Bulk load de participantes | ❌ | `server/routers/padel.ts` - `procesarExcelTorneo()` | 3 | Alta |
| RF1.4 | Algoritmo Seeding | Cabezas de serie por ELO | ❌ | `server/routers/padel.ts` - `generarSeeding()` | 3 | Alta |
| RF1.5 | Tipologías Torneo | Relámpago/Extendido | ⚠️ | `server/db.padel.ts` - `crearTorneo()` | 3 | Alta |
| RF1.6 | Generación Brackets | Single/Double/Round-Robin | ❌ | `server/routers/padel.ts` - `generarBracket()` | 3 | Alta |
| RF1.7 | Agendador Clases | Calendario dinámico instructores | ❌ | `server/routers/padel.ts` - `listarClasesDisponibles()` | 3 | Media |

---

## 3. Módulo 2: Agente de Inteligencia Artificial (WhatsApp)

| ID | Requisito | Descripción | Estado | Componente Técnico | Fase | Prioridad |
|---|---|---|---|---|---|---|
| RF2.1 | NLP Avanzado | Interpretación de reservas complejas | ❌ | n8n + GPT-4o-mini + LangGraph | 4 | Alta |
| RF2.2 | Checkout Multicanal | Mercado Pago/PayPal/SPEI | ❌ | `server/routers/padel.ts` - `crearCheckout()` | 4 | Alta |
| RF2.3 | Notificación Roles | Mensajes personalizados WhatsApp | ❌ | n8n + WhatsApp Business API | 4 | Alta |
| RF2.4 | Consultas Tiempo Real | "¿Cómo va mi grupo?" | ❌ | n8n + `consultarEstadoTorneo()` | 4 | Alta |
| RF2.5 | Publicación Resultados | Actualización de bracket en tiempo real | ❌ | n8n + WebSocket | 4 | Alta |
| RF2.6 | Felicitación + ELO | Actualización automática de ranking | ❌ | n8n + `actualizarELO()` | 4 | Alta |
| RF2.7 | Búsqueda Suplentes | Matchmaking de lista de espera | ❌ | n8n + CrewAI + `matchmakingSuplentes()` | 4 | Alta |

---

## 4. Módulo 3: Control de Acceso (Vigilancia/Caseta)

| ID | Requisito | Descripción | Estado | Componente Técnico | Fase | Prioridad |
|---|---|---|---|---|---|---|
| RF3.1 | PWA Caseta | Interfaz móvil para guardia | ❌ | `client/src/pages/Caseta.tsx` | 5 | Media |
| RF3.2 | Validación QR | Escaneo y trazabilidad | ❌ | `server/routers/padel.ts` - `validarAcceso()` | 5 | Media |

---

## 5. Módulo 4: Dashboard Administrativo

| ID | Requisito | Descripción | Estado | Componente Técnico | Fase | Prioridad |
|---|---|---|---|---|---|---|
| RF4.1 | Editor Brackets | Drag-and-drop visual | ❌ | `client/src/pages/AdminTorneos.tsx` | 6 | Alta |
| RF4.2 | Registro Resultados | Ingreso de sets/juegos | ❌ | `server/routers/padel.ts` - `registrarResultado()` | 6 | Alta |
| RF4.3 | Gestión Wallet | Control de saldos | ⚠️ | `server/routers/padel.ts` - `gestionarWallet()` | 2 | Media |
| RF4.4 | Reportes Financieros | Conciliación de pagos | ⚠️ | `server/routers/padel.ts` - `reportesFinancieros()` | 6 | Media |
| RF4.5 | Integración Cámaras IA | Análisis de ocupación | ❌ | n8n + Vision API | 7 | Baja |

---

## 6. Requisitos No-Funcionales

| ID | Requisito | Descripción | Estado | Componente Técnico | Fase |
|---|---|---|---|---|---|
| RNF5.1 | Infraestructura Serverless | 200 jugadores simultáneos | ✅ | Manus Cloud (AWS) | 0 |
| RNF5.2 | Procesamiento Documentos | Excel parsing | ❌ | `npm: xlsx` + `server/routers/padel.ts` | 3 |

---

## 7. Matriz de Trazabilidad Inversa (Componentes → Requisitos)

### Tabla: `users`
- RF1.1: Tiers de usuario

### Tabla: `reservaciones`
- RF1.1: Acceso a reservaciones
- RF1.2: Generación de QR

### Tabla: `torneos`
- RF1.3: Procesamiento Excel
- RF1.4: Seeding
- RF1.5: Tipologías
- RF1.6: Brackets

### Tabla: `ranking`
- RF1.4: Histórico ELO
- RF2.6: Actualización ELO

### Tabla: `clases`
- RF1.7: Agendador

### Tabla: `pagos`
- RF2.2: Checkout
- RF4.3: Wallet
- RF4.4: Reportes

### Tabla: `accesos`
- RF3.2: Trazabilidad

### n8n Workflows
- RF2.1: NLP + LangGraph
- RF2.2: Checkout
- RF2.3: Notificaciones
- RF2.4: Consultas
- RF2.5: Resultados
- RF2.6: Felicitación
- RF2.7: Matchmaking

### Frontend Components
- RF3.1: `client/src/pages/Caseta.tsx`
- RF4.1: `client/src/pages/AdminTorneos.tsx`

---

## 8. Dependencias Entre Requisitos

```
RF1.1 (Tiers)
  ├── RF1.2 (QR)
  ├── RF2.1 (NLP)
  └── RF3.2 (Validación)

RF1.3 (Excel)
  ├── RF1.4 (Seeding)
  └── RF1.6 (Brackets)

RF1.4 (Seeding)
  ├── RF1.5 (Tipologías)
  └── RF1.6 (Brackets)

RF1.6 (Brackets)
  ├── RF2.3 (Notificación)
  ├── RF2.4 (Consultas)
  └── RF4.1 (Editor)

RF2.1 (NLP)
  ├── RF2.2 (Checkout)
  ├── RF2.3 (Notificación)
  └── RF2.7 (Matchmaking)

RF2.6 (Felicitación)
  └── RF4.4 (Reportes)

RF3.1 (PWA)
  └── RF3.2 (Validación)

RF4.2 (Resultados)
  ├── RF2.5 (Publicación)
  └── RF2.6 (Felicitación)
```

---

## 9. Plan de Testing por Requisito

| RF | Tipo de Test | Criterio de Aceptación | Responsable |
|---|---|---|---|
| RF1.1 | Unit + Integration | Crear usuario con cada tier y validar permisos | QA |
| RF1.2 | Unit | JWT se genera, se valida, expira correctamente | QA |
| RF1.3 | Integration | Excel con 100 filas se procesa en <5s | QA |
| RF1.4 | Unit | Seeding distribuye cabezas de serie correctamente | QA |
| RF1.5 | Integration | Torneo relámpago genera horarios sin traslapes | QA |
| RF1.6 | Integration | Bracket se genera, exporta PDF, consulta en WhatsApp | QA |
| RF1.7 | Integration | Calendario muestra disponibilidad, permite reserva | QA |
| RF2.1 | E2E | Mensaje complejo se interpreta correctamente | QA |
| RF2.2 | Integration | Checkout genera links, webhook valida pago | QA |
| RF2.3 | Integration | Cada participante recibe mensaje personalizado | QA |
| RF2.4 | E2E | Consulta en WhatsApp retorna estado actual | QA |
| RF2.5 | Integration | Resultado actualiza bracket en <1s | QA |
| RF2.6 | Integration | Ganador recibe felicitación, ELO se actualiza | QA |
| RF2.7 | E2E | Suplente recibe oferta, acepta, se integra | QA |
| RF3.1 | E2E | Guardia escanea QR en móvil, registra entrada | QA |
| RF3.2 | Unit | QR validado, entrada registrada en DB | QA |
| RF4.1 | E2E | Admin arrastra jugador, bracket se actualiza | QA |
| RF4.2 | Integration | Admin ingresa resultado, ELO y bracket se actualizan | QA |
| RF4.3 | Unit | Saldo se incrementa/decrementa correctamente | QA |
| RF4.4 | Integration | Reporte muestra ingresos, egresos, conciliación | QA |
| RF4.5 | Integration | Cámara detecta ocupación, genera reporte | QA |

---

## 10. Cambios Respecto a DRF Original

| Sección | Cambio | Razón |
|---|---|---|
| RF1.2 | Agregado: JWT encriptado | Seguridad mejorada vs. QR estático |
| RF2.1 | Especificado: GPT-4o-mini | Optimización de costos (60% más barato) |
| RF2.2 | Agregado: SPEI | Soporte a pagos locales México |
| Módulo 4 | Agregado: RF4.5 Cámaras IA | Análisis de ocupación (del Análisis de Factibilidad) |
| Roadmap | Revisado: 20 semanas → 19 semanas | Optimización de parallelización |

---

## 11. Próximas Actualizaciones

- [ ] Agregar estimaciones de esfuerzo por RF
- [ ] Agregar matriz de cobertura de tests
- [ ] Agregar matriz de riesgos por RF
- [ ] Agregar matriz de performance (SLAs)

---

**Documento Preparado Por:** Asistente de Desarrollo (Manus)  
**Fecha:** 26 de Febrero de 2026  
**Versión:** 1.0
