# Manual de Usuario - Módulo de Pádel

Este manual proporciona una guía para el uso del módulo de Pádel del ERP Demo Country Club, permitiendo la gestión de canchas, reservaciones y clases.

## 1. Introducción al Módulo de Pádel

El módulo de Pádel está diseñado para facilitar la administración de las instalaciones y actividades relacionadas con el pádel en el club. Permite:

- Visualizar el estado de las canchas en tiempo real.
- Realizar y gestionar reservaciones de canchas.
- Programar y administrar clases de pádel.
- Consultar información de instructores y socios.

## 2. Interfaz Principal

Al acceder al módulo de Pádel, verá un panel principal con las siguientes secciones:

- **KPIs (Indicadores Clave de Rendimiento):** Muestra métricas importantes como el número de reservaciones del día, ingresos generados, ocupación de canchas y alumnos en clases.
- **Estado de Canchas:** Una vista rápida del estado actual de cada cancha (Disponible, Ocupada, Mantenimiento), incluyendo detalles de la reservación actual si aplica.
- **Calendario de Reservaciones:** Una tabla que muestra la disponibilidad de las canchas por hora para el día actual.

## 3. Gestión de Canchas

### 3.1 Visualizar Canchas

En la sección "Estado de Canchas", cada tarjeta representa una cancha. Podrá ver:

- El nombre y número de la cancha.
- Su estado actual (con un indicador visual).
- Si está ocupada, los detalles de la reservación (hora y jugadores).
- Si está en mantenimiento, una nota indicando esta situación.

### 3.2 Reservar una Cancha (Simulado en MVP)

En el MVP actual, la funcionalidad de reservar es simulada. Al hacer clic en el botón "Reservar" de una cancha "Disponible", se mostrará un mensaje de confirmación.

**Próximas Funcionalidades:** En futuras fases, esta acción abrirá un formulario para seleccionar fecha, hora, socios participantes y método de pago.

## 4. Gestión de Reservaciones

La sección "Calendario de Reservaciones" muestra una tabla con las horas del día y el estado de cada cancha. Aquí puede ver qué canchas están libres, ocupadas por reservaciones o clases, o en mantenimiento.

**Próximas Funcionalidades:** Se implementarán filtros para buscar reservaciones por fecha, cancha o socio, así como la posibilidad de crear, modificar o cancelar reservaciones directamente desde la interfaz.

## 5. Gestión de Clases

Actualmente, la información de clases se muestra en los KPIs y en el calendario de reservaciones (cuando una cancha está ocupada por una clase).

**Próximas Funcionalidades:** Se desarrollará una sección dedicada a la gestión de clases, permitiendo:

- Crear nuevas clases, asignando instructor, cancha, fecha, hora y capacidad.
- Inscribir socios a clases.
- Modificar o cancelar clases.
- Consultar el historial de clases impartidas.

## 6. Gestión de Instructores

**Próximas Funcionalidades:** Se creará un módulo para gestionar la información de los instructores, incluyendo:

- Datos personales y de contacto.
- Especialidades y tarifas.
- Horarios de disponibilidad.
- Historial de clases impartidas.

## 7. Preguntas Frecuentes (FAQ)

**P: ¿Cómo puedo cambiar el estado de una cancha?**
**R:** En el MVP actual, el estado de las canchas es estático. En futuras versiones, los administradores podrán actualizar el estado (ej. "Mantenimiento") a través de un panel de configuración.

**P: ¿Puedo ver las reservaciones de días futuros?**
**R:** En el MVP, el calendario muestra solo el día actual. La funcionalidad para navegar por fechas futuras estará disponible en próximas actualizaciones.

**P: ¿Dónde puedo registrar un nuevo socio?**
**R:** La gestión completa de socios se realizará en el módulo de Membresías. Los socios registrados allí estarán disponibles para las reservaciones y clases de pádel.

---

**Autor:** Manus AI
**Fecha:** 20 de Febrero de 2026
