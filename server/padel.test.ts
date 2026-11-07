import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database helpers
vi.mock("./db.padel", () => ({
  listCanchas: vi.fn().mockResolvedValue([
    {
      id: 1,
      nombre: "Cancha 1",
      numero: 1,
      tipo: "cemento",
      estado: "disponible",
      capacidad: 4,
      iluminacion: true,
      precioHora: "350.00",
      precioHoraLuz: "450.00",
      ultimoMantenimiento: null,
      proximoMantenimiento: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      nombre: "Cancha 2",
      numero: 2,
      tipo: "arcilla",
      estado: "ocupada",
      capacidad: 4,
      iluminacion: true,
      precioHora: "400.00",
      precioHoraLuz: null,
      ultimoMantenimiento: null,
      proximoMantenimiento: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getCanchaById: vi.fn().mockResolvedValue({
    id: 1,
    nombre: "Cancha 1",
    numero: 1,
    tipo: "cemento",
    estado: "disponible",
    precioHora: "350.00",
  }),
  createCancha: vi.fn().mockResolvedValue({ id: 3 }),
  updateCanchaEstado: vi.fn().mockResolvedValue(undefined),
  getDisponibilidad: vi.fn().mockResolvedValue([
    { horaInicio: "07:00:00", horaFin: "08:00:00", disponible: true },
    { horaInicio: "08:00:00", horaFin: "09:00:00", disponible: false },
    { horaInicio: "09:00:00", horaFin: "10:00:00", disponible: true },
  ]),
  listReservaciones: vi.fn().mockResolvedValue({
    data: [
      {
        id: 1,
        canchaId: 1,
        socioId: 1,
        fecha: new Date("2026-02-21"),
        horaInicio: "08:00:00",
        horaFin: "09:00:00",
        estado: "confirmada",
        monto: "350.00",
      },
    ],
    total: 1,
  }),
  getReservacionById: vi.fn().mockResolvedValue({
    id: 1,
    canchaId: 1,
    socioId: 1,
    fecha: new Date("2026-02-21"),
    horaInicio: "08:00:00",
    horaFin: "09:00:00",
    estado: "confirmada",
  }),
  createReservacion: vi.fn().mockResolvedValue({ id: 2 }),
  cancelReservacion: vi.fn().mockResolvedValue({
    penalizada: false,
    horasAnticipacion: 24,
  }),
  getRanking: vi.fn().mockResolvedValue([
    {
      id: 1,
      socioId: 1,
      puntos: 2450,
      categoria: "avanzado",
      partidosJugados: 48,
      victorias: 38,
      derrotas: 10,
      rachaActual: 5,
      mejorRacha: 8,
      posicion: 1,
      socioNombre: "Carlos Mendoza",
      socioNumero: "SOC-001",
    },
  ]),
  listTorneos: vi.fn().mockResolvedValue([
    {
      id: 1,
      nombre: "Torneo Interno",
      fechaInicio: new Date("2026-03-01"),
      tipo: "dobles",
      maxParticipantes: 16,
      inscripcionesActuales: 8,
      costoInscripcion: "1500.00",
      estado: "inscripciones_abiertas",
    },
  ]),
  inscribirTorneo: vi.fn().mockResolvedValue({ success: true }),
  listSocios: vi.fn().mockResolvedValue([
    {
      id: 1,
      nombre: "Carlos Mendoza",
      email: "carlos@test.com",
      telefono: "555-1234",
      tipoMembresia: "platino",
      estado: "activa",
      numeroSocio: "SOC-001",
    },
  ]),
  getSocioById: vi.fn().mockResolvedValue({
    id: 1,
    nombre: "Carlos Mendoza",
    email: "carlos@test.com",
  }),
  createSocio: vi.fn().mockResolvedValue({ id: 2 }),
  createPago: vi.fn().mockResolvedValue({ id: 1 }),
  listPagosBySocio: vi.fn().mockResolvedValue([
    {
      id: 1,
      socioId: 1,
      monto: "350.00",
      metodo: "tarjeta",
      estado: "completado",
    },
  ]),
  getPadelStats: vi.fn().mockResolvedValue({
    totalCanchas: 4,
    reservacionesHoy: 12,
    sociosActivos: 45,
    ingresosMes: 85000,
  }),
}));

// ─── Test Context Helpers ────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@playapalmas.club",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("padel.stats", () => {
  it("returns dashboard statistics", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const stats = await caller.padel.stats();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalCanchas", 4);
    expect(stats).toHaveProperty("reservacionesHoy", 12);
    expect(stats).toHaveProperty("sociosActivos", 45);
    expect(stats).toHaveProperty("ingresosMes", 85000);
  });
});

describe("padel.canchas", () => {
  it("lists all canchas", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const canchas = await caller.padel.canchas.list();

    expect(canchas).toHaveLength(2);
    expect(canchas[0]).toHaveProperty("nombre", "Cancha 1");
    expect(canchas[0]).toHaveProperty("estado", "disponible");
    expect(canchas[1]).toHaveProperty("estado", "ocupada");
  });

  it("gets cancha by id", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const cancha = await caller.padel.canchas.getById({ id: 1 });

    expect(cancha).toBeDefined();
    expect(cancha).toHaveProperty("nombre", "Cancha 1");
    expect(cancha).toHaveProperty("precioHora", "350.00");
  });

  it("gets disponibilidad for a cancha on a date", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const slots = await caller.padel.canchas.disponibilidad({
      canchaId: 1,
      fecha: "2026-02-21",
    });

    expect(slots).toHaveLength(3);
    expect(slots[0]).toEqual({
      horaInicio: "07:00:00",
      horaFin: "08:00:00",
      disponible: true,
    });
    expect(slots[1]).toHaveProperty("disponible", false);
  });

  it("creates a cancha (requires auth)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.padel.canchas.create({
      nombre: "Cancha 5",
      numero: 5,
      tipo: "cemento",
      capacidad: 4,
      iluminacion: true,
      precioHora: "350.00",
    });

    expect(result).toHaveProperty("id", 3);
  });

  it("updates cancha estado (requires auth)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.padel.canchas.updateEstado({
      id: 1,
      estado: "mantenimiento",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("padel.reservaciones", () => {
  it("lists reservaciones", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.padel.reservaciones.list({
      fecha: "2026-02-21",
    });

    expect(result).toHaveProperty("total", 1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toHaveProperty("estado", "confirmada");
  });

  it("gets reservacion by id", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const reservacion = await caller.padel.reservaciones.getById({ id: 1 });

    expect(reservacion).toBeDefined();
    expect(reservacion).toHaveProperty("canchaId", 1);
    expect(reservacion).toHaveProperty("estado", "confirmada");
  });

  it("creates a reservacion (requires auth)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.padel.reservaciones.create({
      canchaId: 1,
      socioId: 1,
      fecha: "2026-02-21",
      horaInicio: "10:00:00",
      horaFin: "11:00:00",
      tipoPago: "tarjeta",
      monto: "350.00",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("id", 2);
  });

  it("cancels a reservacion with policy check (requires auth)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.padel.reservaciones.cancel({
      id: 1,
      motivo: "Cambio de planes",
    });

    expect(result).toHaveProperty("success", true);
    expect(result).toHaveProperty("penalizada", false);
    expect(result).toHaveProperty("horasAnticipacion", 24);
    expect(result.mensaje).toContain("Cancelación exitosa");
  });
});

describe("padel.ranking", () => {
  it("lists ranking", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const ranking = await caller.padel.ranking.list();

    expect(ranking).toHaveLength(1);
    expect(ranking[0]).toHaveProperty("puntos", 2450);
    expect(ranking[0]).toHaveProperty("socioNombre", "Carlos Mendoza");
  });
});

describe("padel.torneos", () => {
  it("lists torneos", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const torneos = await caller.padel.torneos.list();

    expect(torneos).toHaveLength(1);
    expect(torneos[0]).toHaveProperty("nombre", "Torneo Interno");
    expect(torneos[0]).toHaveProperty("estado", "inscripciones_abiertas");
  });

  it("inscribes to a torneo (requires auth)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.padel.torneos.inscribir({
      torneoId: 1,
      socioId: 1,
    });

    expect(result).toEqual({ success: true });
  });
});

describe("padel.socios", () => {
  it("lists socios", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const socios = await caller.padel.socios.list();

    expect(socios).toHaveLength(1);
    expect(socios[0]).toHaveProperty("nombre", "Carlos Mendoza");
    expect(socios[0]).toHaveProperty("tipoMembresia", "platino");
  });

  it("gets socio by id", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const socio = await caller.padel.socios.getById({ id: 1 });

    expect(socio).toBeDefined();
    expect(socio).toHaveProperty("nombre", "Carlos Mendoza");
  });

  it("creates a socio (requires auth)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.padel.socios.create({
      nombre: "Nuevo Socio",
      email: "nuevo@test.com",
      tipoMembresia: "oro",
      fechaAlta: "2026-02-21",
    });

    expect(result).toHaveProperty("id", 2);
  });
});

describe("padel.pagos", () => {
  it("creates a pago (requires auth)", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.padel.pagos.create({
      socioId: 1,
      reservacionId: 1,
      concepto: "Reservación Cancha 1",
      monto: "350.00",
      metodo: "tarjeta",
    });

    expect(result).toHaveProperty("id", 1);
  });

  it("lists pagos by socio", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const pagos = await caller.padel.pagos.listBySocio({ socioId: 1 });

    expect(pagos).toHaveLength(1);
    expect(pagos[0]).toHaveProperty("monto", "350.00");
    expect(pagos[0]).toHaveProperty("estado", "completado");
  });
});

describe("padel - auth protection", () => {
  it("rejects unauthenticated cancha creation", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.padel.canchas.create({
        nombre: "Cancha Test",
        numero: 99,
        tipo: "cemento",
        precioHora: "350.00",
      })
    ).rejects.toThrow();
  });

  it("rejects unauthenticated reservacion creation", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.padel.reservaciones.create({
        canchaId: 1,
        socioId: 1,
        fecha: "2026-02-21",
        horaInicio: "10:00:00",
        horaFin: "11:00:00",
        tipoPago: "tarjeta",
        monto: "350.00",
      })
    ).rejects.toThrow();
  });

  it("rejects unauthenticated reservacion cancellation", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.padel.reservaciones.cancel({ id: 1 })
    ).rejects.toThrow();
  });
});
