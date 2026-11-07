// Tipos compartidos para el ERP Demo Country Club

export interface Cancha {
  id: string;
  nombre: string;
  numero: number;
  status: "Disponible" | "Ocupada" | "Mantenimiento";
  capacidad: number;
  tipoSuperficie: "Cemento" | "Arcilla" | "Hierba Sintética";
  iluminacion: boolean;
  ultimoMantenimiento: string;
  proximoMantenimiento?: string;
}

export interface Reservacion {
  id: string;
  canchaId: string;
  socioId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  jugadores: string[];
  estado: "Confirmada" | "Pendiente" | "Cancelada";
  tipoPago: "Cargo a Cuenta" | "Efectivo" | "Tarjeta";
  monto: number;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Clase {
  id: string;
  canchaId: string;
  instructorId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  alumnos: string[];
  capacidadMaxima: number;
  tipoClase: "Principiante" | "Intermedio" | "Avanzado" | "Grupal";
  precio: number;
  estado: "Programada" | "Cancelada" | "Completada";
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  horarioDisponible: string;
  tarifa: number;
  estado: "Activo" | "Inactivo";
  createdAt: string;
  updatedAt: string;
}

export interface Socio {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoMembresia: "Platino" | "Oro" | "Diferida" | "Familiar";
  estado: "Activa" | "Suspendida" | "Cancelada";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
