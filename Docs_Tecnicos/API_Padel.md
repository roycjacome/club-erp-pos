# Documentación de API - Módulo de Pádel

Este documento detalla los endpoints de la API RESTful para el módulo de Pádel del ERP Demo Country Club.

## 1. Endpoints de Pádel

### 1.1 Canchas

- `GET /api/padel/canchas`
  - **Descripción:** Obtener todas las canchas de pádel.
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "CANCHA-001",
          "nombre": "Cancha 1",
          "numero": 1,
          "status": "Disponible",
          "capacidad": 4,
          "tipoSuperficie": "Cemento",
          "iluminacion": true,
          "ultimoMantenimiento": "2026-02-20T14:00:00Z",
          "proximoMantenimiento": null
        }
      ]
    }
    ```

- `GET /api/padel/canchas/:id`
  - **Descripción:** Obtener una cancha específica por su ID.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la cancha.
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "id": "CANCHA-001",
        "nombre": "Cancha 1",
        "numero": 1,
        "status": "Disponible",
        "capacidad": 4,
        "tipoSuperficie": "Cemento",
        "iluminacion": true,
        "ultimoMantenimiento": "2026-02-20T14:00:00Z",
        "proximoMantenimiento": null
      }
    }
    ```
  - **Respuesta de Error (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Cancha not found"
    }
    ```

- `POST /api/padel/canchas`
  - **Descripción:** Crear una nueva cancha.
  - **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "nombre": "Cancha 5",
      "numero": 5,
      "capacidad": 2,
      "tipoSuperficie": "Hierba Sintética",
      "iluminacion": true,
      "ultimoMantenimiento": "2026-02-20T14:00:00Z"
    }
    ```
  - **Respuesta Exitosa (201 Created):**
    ```json
    {
      "success": true,
      "data": { ... },
      "message": "Cancha created successfully"
    }
    ```
  - **Respuesta de Error (400 Bad Request):**
    ```json
    {
      "success": false,
      "error": "Missing required fields: nombre, numero, capacidad"
    }
    ```

- `PUT /api/padel/canchas/:id`
  - **Descripción:** Actualizar una cancha existente.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la cancha.
  - **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "status": "Mantenimiento",
      "proximoMantenimiento": "2026-03-01T09:00:00Z"
    }
    ```
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": { ... },
      "message": "Cancha updated successfully"
    }
    ```

- `DELETE /api/padel/canchas/:id`
  - **Descripción:** Eliminar una cancha.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la cancha.
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "message": "Cancha deleted successfully"
    }
    ```
  - **Respuesta de Error (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Cancha not found"
    }
    ```

### 1.2 Reservaciones

- `GET /api/padel/reservaciones`
  - **Descripción:** Obtener reservaciones con filtros opcionales.
  - **Parámetros de Consulta (Query Parameters):**
    - `canchaId` (string, opcional): Filtrar por ID de cancha.
    - `socioId` (string, opcional): Filtrar por ID de socio.
    - `fecha` (string, opcional): Filtrar por fecha (formato `YYYY-MM-DD`).
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "RES-001",
          "canchaId": "CANCHA-001",
          "socioId": "SOC-001",
          "fecha": "2026-02-20",
          "horaInicio": "10:00",
          "horaFin": "11:00",
          "jugadores": ["Jugador A", "Jugador B"],
          "estado": "Confirmada",
          "tipoPago": "Cargo a Cuenta",
          "monto": 250,
          "notas": "",
          "createdAt": "2026-02-20T09:00:00Z",
          "updatedAt": "2026-02-20T09:00:00Z"
        }
      ]
    }
    ```

- `GET /api/padel/reservaciones/:id`
  - **Descripción:** Obtener una reservación específica por su ID.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la reservación.
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": { ... }
    }
    ```
  - **Respuesta de Error (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Reservacion not found"
    }
    ```

- `POST /api/padel/reservaciones`
  - **Descripción:** Crear una nueva reservación.
  - **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "canchaId": "CANCHA-002",
      "socioId": "SOC-002",
      "fecha": "2026-02-21",
      "horaInicio": "15:00",
      "horaFin": "16:30",
      "jugadores": ["Jugador C"],
      "tipoPago": "Tarjeta",
      "monto": 300
    }
    ```
  - **Respuesta Exitosa (201 Created):**
    ```json
    {
      "success": true,
      "data": { ... },
      "message": "Reservacion created successfully"
    }
    ```

- `PUT /api/padel/reservaciones/:id`
  - **Descripción:** Actualizar una reservación existente.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la reservación.
  - **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "estado": "Cancelada"
    }
    ```
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": { ... },
      "message": "Reservacion updated successfully"
    }
    ```

- `DELETE /api/padel/reservaciones/:id`
  - **Descripción:** Cancelar una reservación.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la reservación.
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "message": "Reservacion deleted successfully"
    }
    ```

### 1.3 Clases

- `GET /api/padel/clases`
  - **Descripción:** Obtener todas las clases de pádel con filtros opcionales.
  - **Parámetros de Consulta (Query Parameters):**
    - `canchaId` (string, opcional): Filtrar por ID de cancha.
    - `instructorId` (string, opcional): Filtrar por ID de instructor.
    - `fecha` (string, opcional): Filtrar por fecha (formato `YYYY-MM-DD`).
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "CLASE-001",
          "canchaId": "CANCHA-003",
          "instructorId": "INST-001",
          "fecha": "2026-02-22",
          "horaInicio": "09:00",
          "horaFin": "10:00",
          "alumnos": ["SOC-001", "SOC-003"],
          "capacidadMaxima": 4,
          "tipoClase": "Principiante",
          "precio": 500,
          "estado": "Programada",
          "createdAt": "2026-02-21T10:00:00Z",
          "updatedAt": "2026-02-21T10:00:00Z"
        }
      ]
    }
    ```

- `GET /api/padel/clases/:id`
  - **Descripción:** Obtener una clase específica por su ID.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la clase.
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": { ... }
    }
    ```

- `POST /api/padel/clases`
  - **Descripción:** Crear una nueva clase.
  - **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "canchaId": "CANCHA-004",
      "instructorId": "INST-002",
      "fecha": "2026-02-23",
      "horaInicio": "11:00",
      "horaFin": "12:00",
      "alumnos": [],
      "capacidadMaxima": 2,
      "tipoClase": "Avanzado",
      "precio": 800
    }
    ```
  - **Respuesta Exitosa (201 Created):**
    ```json
    {
      "success": true,
      "data": { ... },
      "message": "Clase created successfully"
    }
    ```

- `PUT /api/padel/clases/:id`
  - **Descripción:** Actualizar una clase existente.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la clase.
  - **Cuerpo de la Solicitud (JSON):**
    ```json
    {
      "estado": "Cancelada"
    }
    ```
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": { ... },
      "message": "Clase updated successfully"
    }
    ```

- `DELETE /api/padel/clases/:id`
  - **Descripción:** Eliminar una clase.
  - **Parámetros de Ruta:**
    - `id` (string, requerido): ID de la clase.
  - **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "message": "Clase deleted successfully"
    }
    ```

---

**Autor:** Manus AI
**Fecha:** 20 de Febrero de 2026
