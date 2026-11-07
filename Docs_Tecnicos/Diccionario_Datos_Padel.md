# Diccionario de Datos - Módulo de Pádel

Este documento describe la estructura de la base de datos para el módulo de Pádel del ERP Demo Country Club, incluyendo tablas, campos, tipos de datos y relaciones.

## 1. Tablas del Módulo de Pádel

### 1.1 Tabla: `canchas`

Almacena información sobre las canchas de pádel disponibles en el club.

| Campo | Tipo de Dato | Descripción | Restricciones | Notas |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | Identificador único de la cancha | `PRIMARY KEY`, `NOT NULL` | Generado automáticamente (ej. `CANCHA-1678886400000`) |
| `nombre` | `VARCHAR(100)` | Nombre descriptivo de la cancha | `NOT NULL` | Ej. "Cancha 1", "Cancha Principal" |
| `numero` | `INT` | Número de identificación de la cancha | `NOT NULL`, `UNIQUE` | |
| `status` | `VARCHAR(20)` | Estado actual de la cancha | `NOT NULL`, `DEFAULT 'Disponible'` | `Disponible`, `Ocupada`, `Mantenimiento` |
| `capacidad` | `INT` | Número máximo de jugadores | `NOT NULL` | |
| `tipo_superficie` | `VARCHAR(50)` | Tipo de superficie de la cancha | `NOT NULL` | `Cemento`, `Arcilla`, `Hierba Sintética` |
| `iluminacion` | `BOOLEAN` | Indica si la cancha tiene iluminación | `NOT NULL`, `DEFAULT true` | `true` (sí), `false` (no) |
| `ultimo_mantenimiento` | `TIMESTAMP` | Fecha y hora del último mantenimiento | `NOT NULL` | |
| `proximo_mantenimiento` | `TIMESTAMP` | Fecha y hora del próximo mantenimiento programado | `NULLABLE` | |
| `created_at` | `TIMESTAMP` | Fecha y hora de creación del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | Fecha y hora de la última actualización del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |

### 1.2 Tabla: `socios`

Almacena información básica de los socios del club. Esta tabla es compartida con otros módulos, pero se incluye aquí por su relación con las reservaciones.

| Campo | Tipo de Dato | Descripción | Restricciones | Notas |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | Identificador único del socio | `PRIMARY KEY`, `NOT NULL` | Generado automáticamente (ej. `SOC-1678886400000`) |
| `nombre` | `VARCHAR(150)` | Nombre completo del socio | `NOT NULL` | |
| `email` | `VARCHAR(100)` | Correo electrónico del socio | `NULLABLE` | |
| `telefono` | `VARCHAR(20)` | Número de teléfono del socio | `NULLABLE` | |
| `tipo_membresia` | `VARCHAR(50)` | Tipo de membresía del socio | `NOT NULL` | `Platino`, `Oro`, `Diferida`, `Familiar` |
| `estado` | `VARCHAR(20)` | Estado de la membresía | `NOT NULL`, `DEFAULT 'Activa'` | `Activa`, `Suspendida`, `Cancelada` |
| `created_at` | `TIMESTAMP` | Fecha y hora de creación del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | Fecha y hora de la última actualización del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |

### 1.3 Tabla: `reservaciones`

Registra las reservaciones de canchas de pádel realizadas por los socios.

| Campo | Tipo de Dato | Descripción | Restricciones | Notas |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | Identificador único de la reservación | `PRIMARY KEY`, `NOT NULL` | Generado automáticamente (ej. `RES-1678886400000`) |
| `cancha_id` | `VARCHAR(50)` | ID de la cancha reservada | `NOT NULL`, `FOREIGN KEY (canchas.id)` | |
| `socio_id` | `VARCHAR(50)` | ID del socio que realiza la reservación | `NOT NULL`, `FOREIGN KEY (socios.id)` | |
| `fecha` | `DATE` | Fecha de la reservación | `NOT NULL` | |
| `hora_inicio` | `TIME` | Hora de inicio de la reservación | `NOT NULL` | |
| `hora_fin` | `TIME` | Hora de finalización de la reservación | `NOT NULL` | |
| `jugadores` | `JSON` | Lista de nombres de los jugadores adicionales | `NULLABLE` | Almacenado como JSON array (ej. `["Jugador 1", "Jugador 2"]`) |
| `estado` | `VARCHAR(20)` | Estado de la reservación | `NOT NULL`, `DEFAULT 'Confirmada'` | `Confirmada`, `Pendiente`, `Cancelada` |
| `tipo_pago` | `VARCHAR(50)` | Método de pago utilizado | `NOT NULL` | `Cargo a Cuenta`, `Efectivo`, `Tarjeta` |
| `monto` | `DECIMAL(10, 2)` | Monto total de la reservación | `NOT NULL` | |
| `notas` | `TEXT` | Notas adicionales sobre la reservación | `NULLABLE` | |
| `created_at` | `TIMESTAMP` | Fecha y hora de creación del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | Fecha y hora de la última actualización del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |

### 1.4 Tabla: `instructores`

Almacena información sobre los instructores de pádel. Esta tabla es compartida con otros módulos, pero se incluye aquí por su relación con las clases.

| Campo | Tipo de Dato | Descripción | Restricciones | Notas |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | Identificador único del instructor | `PRIMARY KEY`, `NOT NULL` | Generado automáticamente (ej. `INST-1678886400000`) |
| `nombre` | `VARCHAR(150)` | Nombre completo del instructor | `NOT NULL` | |
| `email` | `VARCHAR(100)` | Correo electrónico del instructor | `NULLABLE` | |
| `telefono` | `VARCHAR(20)` | Número de teléfono del instructor | `NULLABLE` | |
| `especialidad` | `VARCHAR(100)` | Especialidad del instructor | `NULLABLE` | Ej. "Pádel Profesional", "Pádel Avanzado" |
| `horario_disponible` | `VARCHAR(200)` | Horario de disponibilidad del instructor | `NULLABLE` | |
| `tarifa` | `DECIMAL(10, 2)` | Tarifa por hora/clase del instructor | `NOT NULL` | |
| `estado` | `VARCHAR(20)` | Estado del instructor | `NOT NULL`, `DEFAULT 'Activo'` | `Activo`, `Inactivo` |
| `created_at` | `TIMESTAMP` | Fecha y hora de creación del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | Fecha y hora de la última actualización del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |

### 1.5 Tabla: `clases`

Registra las clases de pádel programadas.

| Campo | Tipo de Dato | Descripción | Restricciones | Notas |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | Identificador único de la clase | `PRIMARY KEY`, `NOT NULL` | Generado automáticamente (ej. `CLASE-1678886400000`) |
| `cancha_id` | `VARCHAR(50)` | ID de la cancha donde se imparte la clase | `NOT NULL`, `FOREIGN KEY (canchas.id)` | |
| `instructor_id` | `VARCHAR(50)` | ID del instructor que imparte la clase | `NOT NULL`, `FOREIGN KEY (instructores.id)` | |
| `fecha` | `DATE` | Fecha de la clase | `NOT NULL` | |
| `hora_inicio` | `TIME` | Hora de inicio de la clase | `NOT NULL` | |
| `hora_fin` | `TIME` | Hora de finalización de la clase | `NOT NULL` | |
| `alumnos` | `JSON` | Lista de IDs de los alumnos inscritos | `NULLABLE` | Almacenado como JSON array (ej. `["SOC-001", "SOC-002"]`) |
| `capacidad_maxima` | `INT` | Capacidad máxima de alumnos para la clase | `NOT NULL` | |
| `tipo_clase` | `VARCHAR(50)` | Tipo de clase | `NOT NULL` | `Principiante`, `Intermedio`, `Avanzado`, `Grupal` |
| `precio` | `DECIMAL(10, 2)` | Precio de la clase | `NOT NULL` | |
| `estado` | `VARCHAR(20)` | Estado de la clase | `NOT NULL`, `DEFAULT 'Programada'` | `Programada`, `Cancelada`, `Completada` |
| `created_at` | `TIMESTAMP` | Fecha y hora de creación del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |
| `updated_at` | `TIMESTAMP` | Fecha y hora de la última actualización del registro | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | |

## 2. Relaciones entre Tablas

- `reservaciones.cancha_id` -> `canchas.id` (Una cancha puede tener múltiples reservaciones)
- `reservaciones.socio_id` -> `socios.id` (Un socio puede tener múltiples reservaciones)
- `clases.cancha_id` -> `canchas.id` (Una cancha puede tener múltiples clases)
- `clases.instructor_id` -> `instructores.id` (Un instructor puede impartir múltiples clases)
- `clases.alumnos` (JSON array) contiene `socio.id` (Múltiples socios pueden estar en una clase)

## 3. Consideraciones de Implementación

- **IDs:** Los IDs son generados por el sistema y son únicos.
- **Fechas y Horas:** Se almacenan en formato ISO 8601 para consistencia.
- **JSON Fields:** Los campos `jugadores` en `reservaciones` y `alumnos` en `clases` se almacenan como JSON para flexibilidad, permitiendo almacenar arrays de strings.
- **Timestamps:** `created_at` y `updated_at` se gestionan automáticamente para auditoría.

---

**Autor:** Manus AI
**Fecha:** 20 de Febrero de 2026
