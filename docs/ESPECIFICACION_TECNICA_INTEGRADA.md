# Especificación Técnica Integrada: clubos ERP Demo Country Club

**Proyecto:** clubos - Sistema ERP para Demo Country Club  
**Cliente:** Diseño y Promoción PIXS S.A. de C.V.  
**Versión:** 2.0 (Integrada: DRF v1.7 + Análisis de Factibilidad)  
**Fecha:** 26 de Febrero de 2026  
**Estado:** Especificación Técnica en Construcción

---

## 1. Introducción y Contexto

Este documento integra dos fuentes de requisitos:

1. **DRF (Documento de Requisitos Funcionales) v1.7:** Especificación del cliente con 6 módulos principales
2. **Análisis de Factibilidad Arquitectónica:** Análisis técnico y económico de implementación

El resultado es una **especificación técnica unificada** que mapea requisitos del cliente a arquitectura, tecnologías y roadmap de implementación.

---

## 2. Matriz de Requisitos Funcionales vs. Estado Actual

### 2.1 Módulo 1: Gestión de Reservas, Accesos y Competición

| Requisito (RF) | Descripción | Estado Actual | Brecha | Prioridad |
|---|---|---|---|---|
| **RF1.1** | Tiers de usuario (Socios, Externos, Invitados) | ✅ Implementado | Ninguna | Alta |
| **RF1.2** | QRs dinámicos con JWT encriptado | ❌ No implementado | Crítica | Alta |
| **RF1.3** | Procesamiento de Excel (Bulk Load) | ❌ No implementado | Crítica | Alta |
| **RF1.4** | Algoritmo de Seeding (Cabezas de Serie) | ❌ No implementado | Crítica | Alta |
| **RF1.5** | Tipologías de Torneo (Relámpago/Extendido) | ⚠️ Parcial | Importante | Alta |
| **RF1.6** | Generación de Brackets (PDF/WhatsApp) | ❌ No implementado | Crítica | Alta |
| **RF1.7** | Agendador dinámico de clases | ❌ No implementado | Crítica | Media |

**Resumen Módulo 1:** 5 de 7 requisitos no implementados. Crítico para MVP.

---

### 2.2 Módulo 2: Agente de Inteligencia Artificial (WhatsApp)

| Requisito (RF) | Descripción | Estado Actual | Brecha | Prioridad |
|---|---|---|---|---|
| **RF2.1** | NLP avanzado para reservas complejas | ❌ No implementado | Crítica | Alta |
| **RF2.2** | Checkout multicanal (Mercado Pago/PayPal/SPEI) | ❌ No implementado | Crítica | Alta |
| **RF2.3** | Notificación de roles en WhatsApp | ❌ No implementado | Crítica | Alta |
| **RF2.4** | Consultas en tiempo real del torneo | ❌ No implementado | Crítica | Alta |
| **RF2.5** | Publicación de resultados en tiempo real | ❌ No implementado | Crítica | Alta |
| **RF2.6** | Felicitación y actualización de Ranking ELO | ❌ No implementado | Crítica | Alta |
| **RF2.7** | Búsqueda de suplentes (matchmaking) | ❌ No implementado | Crítica | Alta |

**Resumen Módulo 2:** 7 de 7 requisitos no implementados. **Crítico para diferenciación del producto.**

---

### 2.3 Módulo 3: Control de Acceso (Vigilancia/Caseta)

| Requisito (RF) | Descripción | Estado Actual | Brecha | Prioridad |
|---|---|---|---|---|
| **RF3.1** | PWA para guardia (escaneo de QR) | ❌ No implementado | Crítica | Media |
| **RF3.2** | Validación y trazabilidad de acceso | ❌ No implementado | Crítica | Media |

**Resumen Módulo 3:** 2 de 2 requisitos no implementados.

---

### 2.4 Módulo 4: Dashboard Administrativo y Gestión Deportiva

| Requisito (RF) | Descripción | Estado Actual | Brecha | Prioridad |
|---|---|---|---|---|
| **RF4.1** | Editor de Brackets Drag-and-Drop | ❌ No implementado | Crítica | Alta |
| **RF4.2** | Registro de resultados (sets/juegos) | ❌ No implementado | Crítica | Alta |
| **RF4.3** | Gestión de Wallet digital | ⚠️ Parcial | Importante | Media |
| **RF4.4** | Reportes financieros | ⚠️ Parcial | Importante | Media |
| **RF4.5** | Integración de cámaras IA | ❌ No implementado | Importante | Baja |

**Resumen Módulo 4:** 3 de 5 requisitos no implementados.

---

### 2.5 Requisitos No-Funcionales (RNF)

| Requisito | Descripción | Estado Actual | Brecha |
|---|---|---|---|
| **RNF5.1** | Infraestructura Serverless (200 jugadores simultáneos) | ✅ Manus Cloud | Ninguna |
| **RNF5.2** | Procesamiento de documentos (Excel parsing) | ❌ No implementado | Crítica |

---

## 3. Mapeo de Requisitos a Arquitectura Técnica

### 3.1 Arquitectura Propuesta (Integrada)

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPAS DE PRESENTACIÓN                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend Web (React 19)  │  WhatsApp Business API  │  PWA   │
│  - Dashboard Admin        │  - Agente IA (GPT-4o)  │ Caseta │
│  - Editor Brackets        │  - NLP + Checkout      │        │
│  - Reportes              │  - Notificaciones      │        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  CAPA DE ORQUESTACIÓN                        │
├─────────────────────────────────────────────────────────────┤
│  n8n (Low-Code Automation)                                  │
│  - LangGraph (Transacciones estrictas)                      │
│  - CrewAI (Matchmaking + Seeding)                           │
│  - Webhooks de WhatsApp                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE LÓGICA DE NEGOCIO                 │
├─────────────────────────────────────────────────────────────┤
│  tRPC Routers (Express Backend)                             │
│  - padel.reservaciones.*                                    │
│  - padel.torneos.*                                          │
│  - padel.clases.*                                           │
│  - padel.pagos.*                                            │
│  - padel.ranking.*                                          │
│  - padel.acceso.*                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE PERSISTENCIA                       │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Transaccional)  │  Qdrant/PGVector (Vectorial) │
│  - Socios                    │  - Embeddings de documentos  │
│  - Reservaciones             │  - RAG para soporte          │
│  - Torneos                   │                              │
│  - Ranking ELO               │                              │
│  - Pagos                     │                              │
│  - Accesos                   │                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Desglose de Requisitos Críticos por Módulo

### 4.1 Módulo 2: Agente IA (RF2.1 - RF2.7) - CRÍTICO

**Descripción:** El Agente de WhatsApp es el diferenciador clave del producto. Debe actuar como conserje 24/7, vendedor y juez deportivo.

**Componentes Técnicos:**

#### 4.1.1 NLP Avanzado (RF2.1)
```typescript
// n8n Workflow: Recibir mensaje de WhatsApp
// Entrada: "Reserva para 4 personas, dos invitados, mañana después de las 6"
// Salida: Estructura JSON con intención, parámetros y validaciones

const parseReservation = async (message: string) => {
  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Eres un asistente de reservas de pádel..." },
      { role: "user", content: message }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "reservation_intent",
        schema: {
          type: "object",
          properties: {
            intent: { type: "string", enum: ["reservar", "cancelar", "consultar"] },
            numPersonas: { type: "integer" },
            numInvitados: { type: "integer" },
            fecha: { type: "string", format: "date" },
            horaMinima: { type: "string", format: "time" },
            nivel: { type: "string" }
          },
          required: ["intent", "numPersonas"]
        }
      }
    }
  });
  return JSON.parse(response.choices[0].message.content);
};
```

#### 4.1.2 Checkout Multicanal (RF2.2)
```typescript
// Integración con Mercado Pago, PayPal y SPEI
padel.pagos.crearCheckout({
  monto: number,
  concepto: string, // "Reservación", "Clase", "Torneo"
  metodos: ["mercado_pago", "paypal", "spei"],
  webhookUrl: "https://erp.cccplayapalmas.club/webhooks/pagos"
})

// Respuesta: Links de pago dinámicos
// {
//   mercadoPago: "https://mpago.la/...",
//   paypal: "https://paypal.me/...",
//   spei: { cuenta: "...", referencia: "..." }
// }
```

#### 4.1.3 Notificaciones Proactivas (RF2.3, RF2.5, RF2.6)
```typescript
// Flujo n8n: Cuando se genera un torneo
// 1. Obtener lista de participantes
// 2. Para cada participante:
//    - Generar mensaje personalizado
//    - Adjuntar QR (JWT)
//    - Enviar vía WhatsApp

const notificarTorneo = async (torneoId: number) => {
  const torneo = await db.query.torneos.findFirst({ where: eq(torneos.id, torneoId) });
  const participantes = await db.query.participantes.findMany({
    where: eq(participantes.torneoId, torneoId)
  });
  
  for (const p of participantes) {
    const qr = jwt.sign({
      torneoId,
      participanteId: p.id,
      exp: Math.floor(Date.now() / 1000) + 86400 // 24 horas
    }, process.env.JWT_SECRET);
    
    await sendWhatsAppMessage({
      to: p.telefono,
      template: "torneo_confirmacion",
      params: {
        nombre: p.nombre,
        horario: torneo.horarioInicio,
        cancha: torneo.cancha,
        qrCode: generateQRCode(qr)
      }
    });
  }
};
```

#### 4.1.4 Consultas en Tiempo Real (RF2.4)
```typescript
// Agente IA escucha: "¿Cómo va mi grupo?"
// Responde consultando estado actual del torneo

const consultarEstadoTorneo = async (participanteId: number, torneoId: number) => {
  const grupo = await db.query.grupos.findFirst({
    where: and(
      eq(grupos.torneoId, torneoId),
      inArray(grupos.participantes, [participanteId])
    )
  });
  
  const partidos = await db.query.partidos.findMany({
    where: eq(partidos.grupoId, grupo.id)
  });
  
  return {
    posicion: grupo.posicion,
    puntaje: grupo.puntaje,
    proximoPartido: partidos.find(p => p.estado === 'pendiente'),
    resultados: partidos.filter(p => p.estado === 'completado')
  };
};
```

---

### 4.2 Módulo 1: Generador de Torneos (RF1.3 - RF1.6) - CRÍTICO

**Descripción:** Automatización de la logística compleja de torneos mediante IA.

#### 4.2.1 Procesamiento de Excel (RF1.3)
```typescript
// Endpoint: POST /api/padel/torneos/bulk-upload
// Body: FormData con archivo .xlsx

const procesarExcelTorneo = async (file: File) => {
  const workbook = xlsx.read(await file.arrayBuffer());
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  const participantes = data.map(row => ({
    nombre: row.Nombre,
    telefono: row.Teléfono,
    nivelDeclarado: row['Nivel Declarado'],
    categoria: row.Categoría,
    tipo: row['Tipo de Jugador'], // Socio/Externo
    // Validar si existe en DB
    eloHistorico: buscarEloHistorico(row.Nombre)
  }));
  
  return participantes;
};
```

#### 4.2.2 Algoritmo de Seeding (RF1.4)
```typescript
// Basado en Ranking ELO histórico
// Distribuir "Cabezas de Serie" en extremos opuestos del bracket

const generarSeeding = async (participantes: Participante[], tipoBracket: 'single' | 'double' | 'round_robin') => {
  // 1. Ordenar por ELO descendente
  const ordenados = participantes.sort((a, b) => b.eloHistorico - a.eloHistorico);
  
  // 2. Distribuir en "serpentina" para equilibrio
  const posiciones = [];
  const mitad = Math.ceil(ordenados.length / 2);
  
  for (let i = 0; i < mitad; i++) {
    posiciones.push(ordenados[i]); // Lado izquierdo
    if (ordenados.length - 1 - i !== i) {
      posiciones.push(ordenados[ordenados.length - 1 - i]); // Lado derecho (invertido)
    }
  }
  
  return posiciones;
};
```

#### 4.2.3 Generación de Brackets (RF1.6)
```typescript
// Crear estructura de llave eliminatoria, doble eliminatoria o round-robin

const generarBracket = async (
  participantes: Participante[],
  tipoBracket: 'single' | 'double' | 'round_robin',
  torneoId: number
) => {
  let estructura;
  
  if (tipoBracket === 'single') {
    estructura = generarSingleElimination(participantes);
  } else if (tipoBracket === 'double') {
    estructura = generarDoubleElimination(participantes);
  } else {
    estructura = generarRoundRobin(participantes);
  }
  
  // Guardar en DB
  await db.insert(brackets).values({
    torneoId,
    estructura: JSON.stringify(estructura),
    exportPDF: generarPDFBracket(estructura),
    exportJSON: estructura
  });
  
  return estructura;
};
```

#### 4.2.4 Optimización de Horarios (RF1.5)
```typescript
// Torneo Relámpago: Maximizar uso de canchas en un día
// Descanso mínimo: 15-30 minutos entre partidos del mismo jugador

const optimizarHorariosRelampage = async (
  participantes: Participante[],
  canchas: Cancha[],
  duracionPartido: number = 45 // minutos
) => {
  const horarios = [];
  const descansoMinimo = 20; // minutos
  
  // Algoritmo greedy: asignar partidos a canchas disponibles
  for (const partido of partidos) {
    const cancha = encontrarCanchaDisponible(canchas, partido.horaInicio);
    const horaFin = partido.horaInicio + duracionPartido;
    
    // Validar descanso para jugadores
    for (const jugador of partido.jugadores) {
      const ultimoPartido = horarios.find(h => h.jugadores.includes(jugador));
      if (ultimoPartido && (partido.horaInicio - ultimoPartido.horaFin) < descansoMinimo) {
        // Buscar slot alternativo
        partido.horaInicio = encontrarHoraAlternativa(horarios, jugador, descansoMinimo);
      }
    }
    
    horarios.push({ ...partido, cancha, horaFin });
  }
  
  return horarios;
};
```

---

### 4.3 Módulo 1: Agendador de Clases (RF1.7)

```typescript
// Calendario en tiempo real de instructores
// Filtros: deporte, nivel, tipo (individual/grupal)

padel.clases.listarDisponibilidad({
  deporte: 'padel',
  nivel: 'intermedio', // Vinculado a Ranking ELO
  tipo: 'individual',
  fecha: '2026-03-01',
  horaInicio: '09:00',
  horaFin: '18:00'
})

// Respuesta:
// {
//   clases: [
//     { id: 1, instructor: "Carlos", horario: "09:00-10:00", disponible: true },
//     { id: 2, instructor: "María", horario: "10:00-11:00", disponible: true }
//   ]
// }
```

---

### 4.4 Módulo 3: Control de Acceso (RF3.1 - RF3.2)

```typescript
// PWA para guardia: escanear QR JWT
// Validar: ID de reserva, timestamp, zona autorizada

const validarAcceso = async (qrToken: string) => {
  try {
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
    
    // Validar que no haya expirado
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return { valido: false, razon: "QR expirado" };
    }
    
    // Registrar entrada
    await db.insert(accesos).values({
      reservacionId: decoded.reservacionId,
      guardiaId: currentGuard.id,
      horaEntrada: new Date(),
      zona: decoded.zona
    });
    
    return { valido: true, reservacion: decoded };
  } catch (error) {
    return { valido: false, razon: "QR inválido" };
  }
};
```

---

## 5. Roadmap de Implementación Revisado

### Fase 0: Preparación (Semana 1)
- [x] Crear base de datos con 11 tablas
- [x] Implementar APIs tRPC básicas
- [x] Conectar frontend a backend
- [ ] Migrar a PostgreSQL (si es necesario)
- [ ] Configurar WhatsApp Business API

### Fase 1: Motor de Reservas Robusto (Semana 2-3)
- [ ] Implementar mutex locks para evitar double-booking
- [ ] Agregar lista de espera dinámica
- [ ] Generar QRs con JWT
- [ ] Tests de concurrencia

### Fase 2: Sistema de Ranking ELO (Semana 4-5)
- [ ] Tabla de ranking en schema
- [ ] Algoritmo Elo para parejas
- [ ] Endpoint para registrar resultados
- [ ] Dashboard de ranking

### Fase 3: Generador de Torneos (Semana 6-9)
- [ ] Procesamiento de Excel (bulk load)
- [ ] Algoritmo de seeding (RF1.4)
- [ ] Generación de brackets (RF1.6)
- [ ] Optimización de horarios (RF1.5)
- [ ] Agendador de clases (RF1.7)

### Fase 4: Agente IA + WhatsApp (Semana 10-15)
- [ ] Configurar n8n self-hosted
- [ ] Integrar GPT-4o-mini con LangGraph
- [ ] NLP avanzado (RF2.1)
- [ ] Checkout multicanal (RF2.2)
- [ ] Notificaciones proactivas (RF2.3, RF2.5, RF2.6)
- [ ] Consultas en tiempo real (RF2.4)
- [ ] Matchmaking de suplentes (RF2.7)

### Fase 5: Control de Acceso (Semana 16-17)
- [ ] PWA para caseta (RF3.1)
- [ ] Validación de QR (RF3.2)
- [ ] Trazabilidad de accesos

### Fase 6: Dashboard Administrativo (Semana 18-19)
- [ ] Editor de brackets drag-and-drop (RF4.1)
- [ ] Registro de resultados (RF4.2)
- [ ] Gestión de wallet (RF4.3)
- [ ] Reportes financieros (RF4.4)

### Fase 7: Integraciones Avanzadas (Semana 20+)
- [ ] Integración de cámaras IA (RF4.5)
- [ ] RAG para soporte al cliente
- [ ] Análisis predictivo de retención

---

## 6. Análisis Económico Revisado

### Inversión Inicial por Fase

| Fase | Componente | Estimado |
|---|---|---|
| 0-1 | Reservas + QR | $5,000 - $8,000 |
| 2 | Ranking ELO | $3,000 - $5,000 |
| 3 | Generador de Torneos | $8,000 - $12,000 |
| 4 | Agente IA + WhatsApp | $15,000 - $25,000 |
| 5-6 | Control de Acceso + Admin | $5,000 - $8,000 |
| 7 | Integraciones Avanzadas | $5,000 - $10,000 |
| **TOTAL MVP (Fases 0-6)** | | **$41,000 - $68,000** |

### Costos Operativos Mensuales

| Componente | Costo |
|---|---|
| AWS (EC2 + RDS PostgreSQL) | $150 - $250 |
| WhatsApp Business API | $50 - $150 |
| OpenAI (GPT-4o-mini) | $50 - $100 |
| n8n (self-hosted) | Incluido en AWS |
| Mercado Pago/PayPal (comisiones) | Variable (~2-3% de ingresos) |
| **Total/mes** | **$250 - $500** |

### ROI Comparativo

**Opción A: SaaS (Playtomic)**
- Costo mensual: $300-500
- Costo anual: $3,600-6,000
- Sin control de datos, sin diferenciación

**Opción B: Desarrollo Propietario (clubos)**
- Inversión inicial: $50,000
- Costo anual: $3,000-6,000
- Control total, diferenciación competitiva
- **Recuperación: 8-12 meses**

---

## 7. Matriz de Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Delay en integración WhatsApp | Media | Alto | Usar templates pre-aprobadas de Meta |
| Costos de IA superiores a lo estimado | Media | Medio | Usar GPT-4o-mini (60% más barato que GPT-4o) |
| Double-booking en picos | Alta | Alto | Implementar mutex locks desde Fase 1 |
| Latencia en matchmaking | Media | Medio | Usar heurísticas greedy, no búsqueda exhaustiva |
| Exposición de datos en n8n | Baja | Alto | Self-hosting en AWS privada, encriptación TLS |
| Falta de adopción del Agente IA | Media | Alto | UX testing iterativo, feedback loop con socios |

---

## 8. Criterios de Éxito

### MVP (Fase 0-3)
- ✅ Reservaciones sin double-booking
- ✅ Ranking ELO funcionando
- ✅ Torneos generados automáticamente desde Excel
- ✅ Brackets visuales en PDF

### Phase 1 (Fase 4)
- ✅ Agente IA respondiendo en WhatsApp
- ✅ Checkout multicanal funcionando
- ✅ Notificaciones proactivas de torneos
- ✅ Matchmaking de suplentes activo

### Phase 2 (Fase 5-6)
- ✅ Control de acceso con QR validado
- ✅ Dashboard administrativo completo
- ✅ Reportes financieros automáticos

---

## 9. Próximos Pasos Inmediatos

1. **Validación con Cliente:**
   - Presentar esta especificación integrada
   - Confirmar presupuesto y timeline
   - Priorizar fases (¿Agente IA primero o Torneos?)

2. **Preparación Técnica:**
   - Configurar PostgreSQL en staging
   - Registrar en Meta Business Suite
   - Crear ambiente de n8n

3. **Comenzar Fase 1:**
   - Implementar mutex locks
   - Agregar lista de espera
   - Generar QRs con JWT

---

## 10. Referencias Documentales

- **DRF v1.7:** Documento de Requisitos Funcionales del Cliente (PIXS S.A. de C.V.)
- **Análisis de Factibilidad:** Análisis Arquitectónico y Operativo del Módulo Pádel con IA
- **Especificación Técnica Actual:** Este documento

---

**Documento Preparado Por:** Asistente de Desarrollo (Manus)  
**Fecha:** 26 de Febrero de 2026  
**Versión:** 2.0 (Integrada)  
**Estado:** Listo para Presentación al Cliente
