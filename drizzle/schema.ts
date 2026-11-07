import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  date,
  time,
} from "drizzle-orm/mysql-core";

// ─── USERS (Core Auth) ───────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", [
    "user",
    "admin_super",
    "admin_padel",
    "admin_golf",
    "admin_gym",
    "admin_pos",
    "admin_membresias",
    "admin_eventos",
    "guardia",
  ])
    .default("user")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── SOCIOS (Miembros del Club) ──────────────────────────────────────────────

export const socios = mysqlTable("socios", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }),
  telefono: varchar("telefono", { length: 20 }),
  tipoMembresia: mysqlEnum("tipoMembresia", [
    "platino",
    "oro",
    "diferida",
    "familiar",
    "visitante",
    "invitado",
  ])
    .default("oro")
    .notNull(),
  estado: mysqlEnum("estado", ["activa", "suspendida", "cancelada"])
    .default("activa")
    .notNull(),
  categoriaPadel: mysqlEnum("categoriaPadel", [
    "principiante",
    "intermedio",
    "avanzado",
    "profesional",
  ]).default("principiante"),
  numeroSocio: varchar("numeroSocio", { length: 20 }).unique(),
  fechaAlta: date("fechaAlta").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Socio = typeof socios.$inferSelect;
export type InsertSocio = typeof socios.$inferInsert;

// ─── CANCHAS DE PÁDEL ────────────────────────────────────────────────────────

export const canchas = mysqlTable("canchas", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  numero: int("numero").notNull().unique(),
  tipo: mysqlEnum("tipo", ["cemento", "arcilla", "hierba_sintetica"])
    .default("cemento")
    .notNull(),
  estado: mysqlEnum("estado", ["disponible", "ocupada", "mantenimiento"])
    .default("disponible")
    .notNull(),
  capacidad: int("capacidad").default(4).notNull(),
  iluminacion: boolean("iluminacion").default(true).notNull(),
  precioHora: decimal("precioHora", { precision: 10, scale: 2 }).notNull(),
  precioHoraLuz: decimal("precioHoraLuz", { precision: 10, scale: 2 }),
  ultimoMantenimiento: date("ultimoMantenimiento"),
  proximoMantenimiento: date("proximoMantenimiento"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cancha = typeof canchas.$inferSelect;
export type InsertCancha = typeof canchas.$inferInsert;

// ─── RESERVACIONES DE PÁDEL ──────────────────────────────────────────────────

export const reservaciones = mysqlTable("reservaciones", {
  id: int("id").autoincrement().primaryKey(),
  canchaId: int("canchaId")
    .references(() => canchas.id)
    .notNull(),
  socioId: int("socioId")
    .references(() => socios.id)
    .notNull(),
  fecha: date("fecha").notNull(),
  horaInicio: time("horaInicio").notNull(),
  horaFin: time("horaFin").notNull(),
  estado: mysqlEnum("estado", [
    "confirmada",
    "pendiente",
    "cancelada",
    "completada",
    "no_show",
  ])
    .default("pendiente")
    .notNull(),
  tipoPago: mysqlEnum("tipoPago", [
    "cargo_cuenta",
    "efectivo",
    "tarjeta",
    "stripe",
    "mercado_pago",
    "paypal",
    "apple_pay_nfc",
  ])
    .default("tarjeta")
    .notNull(),
  viaCobro: mysqlEnum("viaCobro", ["erp", "whatsapp_ia", "web_socio"]).default("erp").notNull(),
  monto: decimal("monto", { precision: 10, scale: 2 }).notNull(),
  jugadores: text("jugadores"), // JSON array of player names
  notas: text("notas"),
  canceladoEn: timestamp("canceladoEn"),
  motivoCancelacion: text("motivoCancelacion"),
  confirmadoAsistencia: boolean("confirmadoAsistencia").default(false),
  qrCode: varchar("qrCode", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reservacion = typeof reservaciones.$inferSelect;
export type InsertReservacion = typeof reservaciones.$inferInsert;

// ─── RANKING DE PÁDEL ────────────────────────────────────────────────────────

export const ranking = mysqlTable("ranking", {
  id: int("id").autoincrement().primaryKey(),
  socioId: int("socioId")
    .references(() => socios.id)
    .notNull(),
  puntos: int("puntos").default(0).notNull(),
  categoria: mysqlEnum("categoria", [
    "principiante",
    "intermedio",
    "avanzado",
    "profesional",
  ])
    .default("principiante")
    .notNull(),
  partidosJugados: int("partidosJugados").default(0).notNull(),
  victorias: int("victorias").default(0).notNull(),
  derrotas: int("derrotas").default(0).notNull(),
  rachaActual: int("rachaActual").default(0).notNull(),
  mejorRacha: int("mejorRacha").default(0).notNull(),
  posicion: int("posicion"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ranking = typeof ranking.$inferSelect;
export type InsertRanking = typeof ranking.$inferInsert;

// ─── PARTIDOS ────────────────────────────────────────────────────────────────

export const partidos = mysqlTable("partidos", {
  id: int("id").autoincrement().primaryKey(),
  reservacionId: int("reservacionId").references(() => reservaciones.id),
  torneoId: int("torneoId").references(() => torneos.id),
  canchaId: int("canchaId").references(() => canchas.id),
  fecha: date("fecha").notNull(),
  equipo1: text("equipo1").notNull(), // JSON array of socio IDs
  equipo2: text("equipo2").notNull(), // JSON array of socio IDs
  marcadorEquipo1: varchar("marcadorEquipo1", { length: 50 }),
  marcadorEquipo2: varchar("marcadorEquipo2", { length: 50 }),
  ganador: mysqlEnum("ganador", ["equipo1", "equipo2", "empate"]),
  estado: mysqlEnum("estado", ["programado", "en_curso", "finalizado", "cancelado"])
    .default("programado")
    .notNull(),
  tipo: mysqlEnum("tipo", ["amistoso", "torneo", "reta", "clase"])
    .default("amistoso")
    .notNull(),
  ronda: int("ronda").default(1),
  matchNumero: int("matchNumero"),
  siguientePartidoId: int("siguientePartidoId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Partido = typeof partidos.$inferSelect;
export type InsertPartido = typeof partidos.$inferInsert;

// ─── TORNEOS ─────────────────────────────────────────────────────────────────

export const torneos = mysqlTable("torneos", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
  fechaInicio: date("fechaInicio").notNull(),
  fechaFin: date("fechaFin"),
  tipo: mysqlEnum("tipo", [
    "singles",
    "dobles",
    "mixto",
    "americano",
    "round_robin",
  ])
    .default("dobles")
    .notNull(),
  categoria: mysqlEnum("categoriaT", [
    "principiante",
    "intermedio",
    "avanzado",
    "abierto",
  ])
    .default("abierto")
    .notNull(),
  maxParticipantes: int("maxParticipantes").default(16).notNull(),
  inscripcionesActuales: int("inscripcionesActuales").default(0).notNull(),
  costoInscripcion: decimal("costoInscripcion", { precision: 10, scale: 2 }),
  premio: text("premio"),
  estado: mysqlEnum("estadoT", [
    "proximo",
    "inscripciones_abiertas",
    "en_curso",
    "finalizado",
    "cancelado",
  ])
    .default("proximo")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Torneo = typeof torneos.$inferSelect;
export type InsertTorneo = typeof torneos.$inferInsert;

// ─── INSCRIPCIONES A TORNEOS ─────────────────────────────────────────────────

export const inscripcionesTorneo = mysqlTable("inscripciones_torneo", {
  id: int("id").autoincrement().primaryKey(),
  torneoId: int("torneoId")
    .references(() => torneos.id)
    .notNull(),
  socioId: int("socioId")
    .references(() => socios.id)
    .notNull(),
  companeroId: int("companeroId").references(() => socios.id),
  estado: mysqlEnum("estadoI", ["inscrito", "confirmado", "eliminado", "ganador"])
    .default("inscrito")
    .notNull(),
  fechaInscripcion: timestamp("fechaInscripcion").defaultNow().notNull(),
  pagado: boolean("pagado").default(false).notNull(),
});

export type InscripcionTorneo = typeof inscripcionesTorneo.$inferSelect;
export type InsertInscripcionTorneo = typeof inscripcionesTorneo.$inferInsert;

// ─── PAGOS ───────────────────────────────────────────────────────────────────

export const pagos = mysqlTable("pagos", {
  id: int("id").autoincrement().primaryKey(),
  socioId: int("socioId")
    .references(() => socios.id)
    .notNull(),
  reservacionId: int("reservacionId").references(() => reservaciones.id),
  torneoId: int("torneoId").references(() => torneos.id),
  concepto: varchar("concepto", { length: 200 }).notNull(),
  monto: decimal("monto", { precision: 10, scale: 2 }).notNull(),
  metodo: mysqlEnum("metodo", [
    "tarjeta",
    "efectivo",
    "cargo_cuenta",
    "stripe",
    "mercado_pago",
    "paypal",
    "apple_pay_nfc",
  ])
    .default("tarjeta")
    .notNull(),
  estado: mysqlEnum("estadoP", ["pendiente", "completado", "fallido", "reembolsado"])
    .default("pendiente")
    .notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  referencia: varchar("referencia", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Pago = typeof pagos.$inferSelect;
export type InsertPago = typeof pagos.$inferInsert;

// ─── CLASES DE PÁDEL ─────────────────────────────────────────────────────────

export const clases = mysqlTable("clases", {
  id: int("id").autoincrement().primaryKey(),
  canchaId: int("canchaId")
    .references(() => canchas.id)
    .notNull(),
  instructorNombre: varchar("instructorNombre", { length: 200 }).notNull(),
  fecha: date("fecha").notNull(),
  horaInicio: time("horaInicio").notNull(),
  horaFin: time("horaFin").notNull(),
  tipo: mysqlEnum("tipoClase", [
    "principiante",
    "intermedio",
    "avanzado",
    "grupal",
    "privada",
  ])
    .default("grupal")
    .notNull(),
  capacidadMaxima: int("capacidadMaxima").default(8).notNull(),
  inscritos: int("inscritos").default(0).notNull(),
  precio: decimal("precio", { precision: 10, scale: 2 }).notNull(),
  estado: mysqlEnum("estadoC", ["programada", "cancelada", "completada"])
    .default("programada")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Clase = typeof clases.$inferSelect;
export type InsertClase = typeof clases.$inferInsert;

// ─── HISTORIAL DE CANCELACIONES ──────────────────────────────────────────────

export const cancelaciones = mysqlTable("cancelaciones", {
  id: int("id").autoincrement().primaryKey(),
  socioId: int("socioId")
    .references(() => socios.id)
    .notNull(),
  reservacionId: int("reservacionId")
    .references(() => reservaciones.id)
    .notNull(),
  horasAnticipacion: decimal("horasAnticipacion", { precision: 5, scale: 2 }).notNull(),
  penalizada: boolean("penalizada").default(false).notNull(),
  reembolsado: boolean("reembolsado").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Cancelacion = typeof cancelaciones.$inferSelect;
export type InsertCancelacion = typeof cancelaciones.$inferInsert;
