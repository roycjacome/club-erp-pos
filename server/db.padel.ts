import { eq, and, gte, lte, desc, asc, sql, count } from "drizzle-orm";
import { getDb } from "./db";
import QRCode from "qrcode";
import { SignJWT } from "jose";
import {
  canchas,
  reservaciones,
  socios,
  ranking,
  torneos,
  inscripcionesTorneo,
  pagos,
  partidos,
  clases,
  cancelaciones,
  type InsertCancha,
  type InsertReservacion,
  type InsertSocio,
  type InsertRanking,
  type InsertTorneo,
  type InsertPago,
  type InsertPartido,
} from "../drizzle/schema";

// ─── CANCHAS ─────────────────────────────────────────────────────────────────

export async function listCanchas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(canchas).orderBy(asc(canchas.numero));
}

export async function getCanchaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(canchas).where(eq(canchas.id, id)).limit(1);
  return result[0];
}

export async function createCancha(data: InsertCancha) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(canchas).values(data);
  return { id: result[0].insertId };
}

export async function updateCanchaEstado(id: number, estado: "disponible" | "ocupada" | "mantenimiento") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(canchas).set({ estado }).where(eq(canchas.id, id));
}

// ─── DISPONIBILIDAD ──────────────────────────────────────────────────────────

export async function getDisponibilidad(canchaId: number, fecha: string) {
  const db = await getDb();
  if (!db) return [];
  const reservas = await db
    .select({
      horaInicio: reservaciones.horaInicio,
      horaFin: reservaciones.horaFin,
      estado: reservaciones.estado,
    })
    .from(reservaciones)
    .where(
      and(
        eq(reservaciones.canchaId, canchaId),
        sql`${reservaciones.fecha} = ${fecha}`,
        sql`${reservaciones.estado} NOT IN ('cancelada')`
      )
    )
    .orderBy(asc(reservaciones.horaInicio));

  // Generate available slots (7:00 - 22:00, 1-hour blocks)
  const allSlots = [];
  for (let h = 7; h < 22; h++) {
    const start = `${h.toString().padStart(2, "0")}:00:00`;
    const end = `${(h + 1).toString().padStart(2, "0")}:00:00`;
    const isOccupied = reservas.some(
      (r) => r.horaInicio <= start && r.horaFin > start
    );
    allSlots.push({
      horaInicio: start,
      horaFin: end,
      disponible: !isOccupied,
    });
  }
  return allSlots;
}

// ─── RESERVACIONES ───────────────────────────────────────────────────────────

export async function listReservaciones(filters?: {
  fecha?: string;
  canchaId?: number;
  socioId?: number;
  estado?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { data: [], total: 0 };

  const conditions = [];
  if (filters?.fecha) conditions.push(sql`${reservaciones.fecha} = ${filters.fecha}`);
  if (filters?.canchaId) conditions.push(eq(reservaciones.canchaId, filters.canchaId));
  if (filters?.socioId) conditions.push(eq(reservaciones.socioId, filters.socioId));
  if (filters?.estado) conditions.push(eq(reservaciones.estado, filters.estado as any));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(reservaciones)
      .where(where)
      .orderBy(desc(reservaciones.fecha), desc(reservaciones.horaInicio))
      .limit(filters?.limit ?? 50)
      .offset(filters?.offset ?? 0),
    db.select({ count: count() }).from(reservaciones).where(where),
  ]);

  return { data, total: totalResult[0]?.count ?? 0 };
}

export async function getReservacionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(reservaciones)
    .where(eq(reservaciones.id, id))
    .limit(1);
  return result[0];
}

export async function createReservacion(data: InsertReservacion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check for conflicts
  const conflicts = await db
    .select()
    .from(reservaciones)
    .where(
      and(
        eq(reservaciones.canchaId, data.canchaId),
        sql`${reservaciones.fecha} = ${data.fecha}`,
        sql`${reservaciones.estado} NOT IN ('cancelada')`,
        sql`(${reservaciones.horaInicio} < ${data.horaFin} AND ${reservaciones.horaFin} > ${data.horaInicio})`
      )
    );

  if (conflicts.length > 0) {
    throw new Error("CONFLICT: La cancha ya está reservada en ese horario");
  }

  const result = await db.insert(reservaciones).values(data);
  return { id: result[0].insertId };
}

export async function updateReservacion(id: number, data: Partial<InsertReservacion>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(reservaciones).set(data).where(eq(reservaciones.id, id));
}

export async function cancelReservacion(id: number, motivo?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const reservacion = await getReservacionById(id);
  if (!reservacion) throw new Error("Reservación no encontrada");

  // Calculate hours until reservation
  const reservaDateTime = new Date(`${reservacion.fecha}T${reservacion.horaInicio}`);
  const now = new Date();
  const horasAnticipacion = (reservaDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  const penalizada = horasAnticipacion < 3;

  await db
    .update(reservaciones)
    .set({
      estado: "cancelada",
      canceladoEn: new Date(),
      motivoCancelacion: motivo ?? "Cancelada por el socio",
    })
    .where(eq(reservaciones.id, id));

  // Record cancellation
  await db.insert(cancelaciones).values({
    socioId: reservacion.socioId,
    reservacionId: id,
    horasAnticipacion: horasAnticipacion.toFixed(2),
    penalizada,
    reembolsado: !penalizada,
  });

  return { penalizada, horasAnticipacion: Math.round(horasAnticipacion * 10) / 10 };
}

export async function generateReservacionQR(reservacionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const reservacion = await getReservacionById(reservacionId);
  if (!reservacion) throw new Error("Reservación no encontrada");

  // JWT Secret
  const secretKey = process.env.JWT_SECRET || "dev-secret-key";
  const secret = new TextEncoder().encode(secretKey);

  // Generate encrypted JWT representation
  const token = await new SignJWT({
    resId: reservacion.id,
    cancha: reservacion.canchaId,
    fecha: reservacion.fecha,
    hora: reservacion.horaInicio,
    tipo: "access_qr",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    // Expiration: the end of the day or an extra day later
    .setExpirationTime(new Date(`${reservacion.fecha}T23:59:59`))
    .sign(secret);

  // Generate QR Data URL
  const qrDataUrl = await QRCode.toDataURL(token, { width: 300 });

  // Update DB with the ticket/QR identity token (varchar(255) size friendly)
  await db
    .update(reservaciones)
    .set({ qrCode: token })
    .where(eq(reservaciones.id, reservacionId));

  return { qrDataUrl, token };
}

// ─── RANKING ─────────────────────────────────────────────────────────────────

export async function getRanking(categoria?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = categoria
    ? eq(ranking.categoria, categoria as any)
    : undefined;

  return db
    .select({
      id: ranking.id,
      socioId: ranking.socioId,
      puntos: ranking.puntos,
      categoria: ranking.categoria,
      partidosJugados: ranking.partidosJugados,
      victorias: ranking.victorias,
      derrotas: ranking.derrotas,
      rachaActual: ranking.rachaActual,
      mejorRacha: ranking.mejorRacha,
      posicion: ranking.posicion,
      socioNombre: socios.nombre,
      socioNumero: socios.numeroSocio,
    })
    .from(ranking)
    .innerJoin(socios, eq(ranking.socioId, socios.id))
    .where(conditions)
    .orderBy(desc(ranking.puntos));
}

// ─── TORNEOS ─────────────────────────────────────────────────────────────────

export async function listTorneos(estado?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = estado
    ? eq(torneos.estado, estado as any)
    : undefined;

  return db.select().from(torneos).where(conditions).orderBy(desc(torneos.fechaInicio));
}

export async function inscribirTorneo(torneoId: number, socioId: number, companeroId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const torneo = await db.select().from(torneos).where(eq(torneos.id, torneoId)).limit(1);
  if (!torneo[0]) throw new Error("Torneo no encontrado");
  if (torneo[0].inscripcionesActuales >= torneo[0].maxParticipantes) {
    throw new Error("Torneo lleno");
  }

  await db.insert(inscripcionesTorneo).values({
    torneoId,
    socioId,
    companeroId: companeroId ?? null,
  });

  await db
    .update(torneos)
    .set({ inscripcionesActuales: sql`${torneos.inscripcionesActuales} + 1` })
    .where(eq(torneos.id, torneoId));

  return { success: true };
}

export async function bulkInscribirTorneo(torneoId: number, participaciones: { nombre: string; email?: string; telefono?: string }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const results = [];
  for (const part of participaciones) {
    try {
      // 1. Intentar encontrar socio por nombre o email
      let socio = await db.select().from(socios).where(eq(socios.nombre, part.nombre)).limit(1);

      let finalSocioId: number;
      if (socio[0]) {
        finalSocioId = socio[0].id;
      } else {
        // 2. Crear socio "Invitado" si no existe
        const newSocio = await db.insert(socios).values({
          nombre: part.nombre,
          email: part.email || null,
          telefono: part.telefono || null,
          tipoMembresia: "visitante",
          estado: "activa",
          fechaAlta: new Date()
        });
        finalSocioId = newSocio[0].insertId;
      }

      // 3. Inscribir
      await db.insert(inscripcionesTorneo).values({
        torneoId,
        socioId: finalSocioId,
        estado: "inscrito"
      });

      results.push({ nombre: part.nombre, success: true });
    } catch (err: any) {
      results.push({ nombre: part.nombre, success: false, error: err.message });
    }
  }

  // Actualizar contador del torneo
  const inscritosCount = results.filter(r => r.success).length;
  await db
    .update(torneos)
    .set({ inscripcionesActuales: sql`${torneos.inscripcionesActuales} + ${inscritosCount}` })
    .where(eq(torneos.id, torneoId));

  return results;
}

// ─── SOCIOS ──────────────────────────────────────────────────────────────────

export async function listSocios(filters?: { estado?: string; tipoMembresia?: string }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters?.estado) conditions.push(eq(socios.estado, filters.estado as any));
  if (filters?.tipoMembresia) conditions.push(eq(socios.tipoMembresia, filters.tipoMembresia as any));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return db.select().from(socios).where(where).orderBy(asc(socios.nombre));
}

export async function getSocioById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(socios).where(eq(socios.id, id)).limit(1);
  return result[0];
}

export async function createSocio(data: InsertSocio) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(socios).values(data);
  return { id: result[0].insertId };
}

// ─── PAGOS ───────────────────────────────────────────────────────────────────

export async function createPago(data: InsertPago) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pagos).values(data);
  return { id: result[0].insertId };
}

export async function listPagosBySocio(socioId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(pagos)
    .where(eq(pagos.socioId, socioId))
    .orderBy(desc(pagos.createdAt));
}

// ─── ESTADÍSTICAS ────────────────────────────────────────────────────────────

export async function getPadelStats() {
  const db = await getDb();
  if (!db) return null;

  const [
    totalCanchas,
    totalReservacionesHoy,
    totalSocios,
    ingresosMes,
    totalReservaciones,
  ] = await Promise.all([
    db.select({ count: count() }).from(canchas),
    db
      .select({ count: count() })
      .from(reservaciones)
      .where(
        and(
          sql`${reservaciones.fecha} = CURDATE()`,
          sql`${reservaciones.estado} NOT IN ('cancelada')`
        )
      ),
    db.select({ count: count() }).from(socios).where(eq(socios.estado, "activa")),
    db
      .select({ total: sql<string>`COALESCE(SUM(${pagos.monto}), 0)` })
      .from(pagos)
      .where(
        and(
          eq(pagos.estado, "completado"),
          sql`MONTH(${pagos.createdAt}) = MONTH(CURDATE())`,
          sql`YEAR(${pagos.createdAt}) = YEAR(CURDATE())`
        )
      ),
    db.select({ count: count() }).from(reservaciones),
  ]);

  return {
    totalCanchas: totalCanchas[0]?.count ?? 0,
    reservacionesHoy: totalReservacionesHoy[0]?.count ?? 0,
    sociosActivos: totalSocios[0]?.count ?? 0,
    ingresosMes: parseFloat(ingresosMes[0]?.total ?? "0"),
    totalReservaciones: totalReservaciones[0]?.count ?? 0,
  };
}

// ─── BRACKETS & TORNEO PROGRESSION ───────────────────────────────────────────

export async function listPartidosByTorneo(torneoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(partidos)
    .where(eq(partidos.torneoId, torneoId))
    .orderBy(asc(partidos.ronda), asc(partidos.matchNumero));
}

export async function generateBrackets(torneoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // 1. Obtener inscritos
  const inscritos = await db
    .select({
      id: inscripcionesTorneo.id,
      socioId: inscripcionesTorneo.socioId,
      nombreSocio: socios.nombre,
      companeroId: inscripcionesTorneo.companeroId,
    })
    .from(inscripcionesTorneo)
    .innerJoin(socios, eq(inscripcionesTorneo.socioId, socios.id))
    .where(eq(inscripcionesTorneo.torneoId, torneoId));

  if (inscritos.length < 2) {
    throw new Error("Se necesitan al menos 2 inscritos para generar brackets");
  }

  // 2. Barajar para aleatoriedad
  const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const participantes = shuffle([...inscritos]);
  const numParticipantes = participantes.length;

  // Calcular número de rondas (potencia de 2)
  const numRondas = Math.ceil(Math.log2(numParticipantes));
  const totalMatchesFirstRound = Math.pow(2, numRondas - 1);

  // 3. Limpiar partidos previos del torneo si existen
  await db.delete(partidos).where(eq(partidos.torneoId, torneoId));

  // 4. Crear mapa de partidos por ronda para enlazar
  const matchesByRound: any[][] = [];

  // Crear matches para todas las rondas (de final a inicio para enlazar)
  let currentRoundMatches = 1;
  for (let r = numRondas; r >= 1; r--) {
    const roundMatches: any[] = [];
    for (let m = 0; m < currentRoundMatches; m++) {
      const match = {
        torneoId,
        fecha: new Date(), // Fecha tentativa
        canchaId: 1, // Por asignar
        equipo1: "[]",
        equipo2: "[]",
        ronda: r,
        matchNumero: m,
        estado: "programado",
        tipo: "torneo" as const,
        siguientePartidoId: null as number | null,
      };

      // Enlazar con el siguiente si no es la final
      if (r < numRondas) {
        const nextMatchIdx = Math.floor(m / 2);
        const nextMatch = matchesByRound[numRondas - r - 1][nextMatchIdx];
        // match.siguientePartidoId = nextMatch.id; // No tenemos ID todavía
      }

      roundMatches.push(match);
    }
    matchesByRound.push(roundMatches);
    currentRoundMatches *= 2;
  }

  // Invertir para que ronda 1 sea la primera
  matchesByRound.reverse();

  // 5. Insertar partidos y enlazar
  // Insertamos rondas finales primero para tener IDs? No, mejor ronda 1 a final y luego update, o final a 1.
  // Si insertamos final a 1, tenemos los IDs de los siguientes.

  const createdMatches: any[][] = [];
  let lastRoundIds: number[] = [];

  for (let r = numRondas; r >= 1; r--) {
    const roundIdx = numRondas - r;
    const matchesToCreate = matchesByRound[numRondas - r];
    const roundCreatedIds: number[] = [];

    for (let m = 0; m < matchesToCreate.length; m++) {
      const data = matchesToCreate[m];

      // Enlazar con el ID guardado del "siguiente"
      if (r < numRondas) {
        const nextMatchIdx = Math.floor(m / 2);
        data.siguientePartidoId = lastRoundIds[nextMatchIdx];
      }

      const result = await db.insert(partidos).values(data);
      roundCreatedIds.push(result[0].insertId);
    }
    lastRoundIds = roundCreatedIds;
    createdMatches.push(roundCreatedIds);
  }

  // 6. Asignar participantes a la Ronda 1
  const round1MatchIds = lastRoundIds; // En el loop anterior r=1 fue el último
  round1MatchIds.reverse(); // Estaban de final a inicio

  for (let i = 0; i < round1MatchIds.length; i++) {
    const matchId = round1MatchIds[i];
    const p1 = participantes[i * 2];
    const p2 = participantes[i * 2 + 1];

    const team1Ids = p1 ? [p1.socioId] : [];
    if (p1?.companeroId) team1Ids.push(p1.companeroId);

    const team2Ids = p2 ? [p2.socioId] : [];
    if (p2?.companeroId) team2Ids.push(p2.companeroId);

    await db.update(partidos)
      .set({
        equipo1: JSON.stringify(team1Ids),
        equipo2: JSON.stringify(team2Ids),
        estado: p1 && p2 ? "programado" : "finalizado", // BYE logic: if one team is missing
        ganador: !p2 ? "equipo1" : !p1 ? "equipo2" : null,
      })
      .where(eq(partidos.id, matchId));
  }

  // Actualizar estado del torneo
  await db.update(torneos).set({ estado: "en_curso" }).where(eq(torneos.id, torneoId));

  return { success: true, rounds: numRondas };
}
