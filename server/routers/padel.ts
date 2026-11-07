import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  listCanchas,
  getCanchaById,
  createCancha,
  updateCanchaEstado,
  getDisponibilidad,
  listReservaciones,
  getReservacionById,
  createReservacion,
  cancelReservacion,
  getRanking,
  listTorneos,
  inscribirTorneo,
  bulkInscribirTorneo,
  listSocios,
  getSocioById,
  createSocio,
  createPago,
  listPagosBySocio,
  getPadelStats,
  generateReservacionQR,
  generateBrackets,
  listPartidosByTorneo,
} from "../db.padel";
import { createStripeCheckoutSession } from "../_core/stripe";

export const padelRouter = router({
  // ─── ESTADÍSTICAS DASHBOARD ──────────────────────────────────────────────
  stats: publicProcedure.query(async () => {
    return getPadelStats();
  }),

  // ─── CANCHAS ─────────────────────────────────────────────────────────────
  canchas: router({
    list: publicProcedure.query(async () => {
      return listCanchas();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getCanchaById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          nombre: z.string().min(1),
          numero: z.number().int().positive(),
          tipo: z.enum(["cemento", "arcilla", "hierba_sintetica"]),
          capacidad: z.number().int().default(4),
          iluminacion: z.boolean().default(true),
          precioHora: z.string(),
          precioHoraLuz: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createCancha(input);
      }),

    updateEstado: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          estado: z.enum(["disponible", "ocupada", "mantenimiento"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateCanchaEstado(input.id, input.estado);
        return { success: true };
      }),

    disponibilidad: publicProcedure
      .input(
        z.object({
          canchaId: z.number(),
          fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        })
      )
      .query(async ({ input }) => {
        return getDisponibilidad(input.canchaId, input.fecha);
      }),
  }),

  // ─── RESERVACIONES ───────────────────────────────────────────────────────
  reservaciones: router({
    list: publicProcedure
      .input(
        z
          .object({
            fecha: z.string().optional(),
            canchaId: z.number().optional(),
            socioId: z.number().optional(),
            estado: z.string().optional(),
            limit: z.number().min(1).max(100).default(50),
            offset: z.number().min(0).default(0),
          })
          .optional()
      )
      .query(async ({ input }) => {
        return listReservaciones(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getReservacionById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          canchaId: z.number(),
          socioId: z.number(),
          fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          horaInicio: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
          horaFin: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
          tipoPago: z.enum([
            "cargo_cuenta",
            "efectivo",
            "tarjeta",
            "stripe",
            "mercado_pago",
            "paypal",
            "apple_pay_nfc",
          ]),
          viaCobro: z.enum(["erp", "whatsapp_ia", "web_socio"]).default("erp"),
          monto: z.string(),
          jugadores: z.string().optional(),
          notas: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await createReservacion({
            ...input,
            fecha: new Date(`${input.fecha}T12:00:00`), // avoid timezone shift
          });
          return { success: true, id: result.id };
        } catch (error: any) {
          if (error.message?.startsWith("CONFLICT")) {
            return {
              success: false,
              error: "La cancha ya está reservada en ese horario",
            };
          }
          throw error;
        }
      }),

    cancel: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          motivo: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const result = await cancelReservacion(input.id, input.motivo);
        return {
          success: true,
          penalizada: result.penalizada,
          horasAnticipacion: result.horasAnticipacion,
          mensaje: result.penalizada
            ? `Cancelación con menos de 3 horas de anticipación (${result.horasAnticipacion}h). Se aplicará cargo.`
            : `Cancelación exitosa con ${result.horasAnticipacion}h de anticipación. Se procesará reembolso.`,
        };
      }),

    generateQR: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return generateReservacionQR(input.id);
      }),
  }),

  // ─── RANKING ─────────────────────────────────────────────────────────────
  ranking: router({
    list: publicProcedure
      .input(
        z
          .object({
            categoria: z
              .enum(["principiante", "intermedio", "avanzado", "profesional"])
              .optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        return getRanking(input?.categoria);
      }),
  }),

  // ─── TORNEOS ─────────────────────────────────────────────────────────────
  torneos: router({
    list: publicProcedure
      .input(
        z
          .object({
            estado: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        return listTorneos(input?.estado);
      }),

    listPartidos: publicProcedure
      .input(z.object({ torneoId: z.number() }))
      .query(async ({ input }) => {
        return listPartidosByTorneo(input.torneoId);
      }),

    generateBrackets: protectedProcedure
      .input(z.object({ torneoId: z.number() }))
      .mutation(async ({ input }) => {
        return generateBrackets(input.torneoId);
      }),

    inscribir: protectedProcedure
      .input(
        z.object({
          torneoId: z.number(),
          socioId: z.number(),
          companeroId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return inscribirTorneo(input.torneoId, input.socioId, input.companeroId);
      }),

    bulkInscribir: protectedProcedure
      .input(
        z.object({
          torneoId: z.number(),
          participaciones: z.array(z.object({
            nombre: z.string().min(1),
            email: z.string().email().optional(),
            telefono: z.string().optional(),
          }))
        })
      )
      .mutation(async ({ input }) => {
        return bulkInscribirTorneo(input.torneoId, input.participaciones);
      }),
  }),

  // ─── SOCIOS ──────────────────────────────────────────────────────────────
  socios: router({
    list: publicProcedure
      .input(
        z
          .object({
            estado: z.string().optional(),
            tipoMembresia: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        return listSocios(input ?? undefined);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getSocioById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          nombre: z.string().min(1),
          email: z.string().email().optional(),
          telefono: z.string().optional(),
          tipoMembresia: z.enum(["platino", "oro", "diferida", "familiar", "visitante", "invitado"]),
          categoriaPadel: z
            .enum(["principiante", "intermedio", "avanzado", "profesional"])
            .optional(),
          numeroSocio: z.string().optional(),
          fechaAlta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        })
      )
      .mutation(async ({ input }) => {
        return createSocio({
          ...input,
          fechaAlta: new Date(input.fechaAlta),
        });
      }),
  }),

  // ─── PAGOS ───────────────────────────────────────────────────────────────
  pagos: router({
    create: protectedProcedure
      .input(
        z.object({
          socioId: z.number(),
          reservacionId: z.number().optional(),
          torneoId: z.number().optional(),
          concepto: z.string(),
          monto: z.string(),
          metodo: z.enum([
            "tarjeta",
            "efectivo",
            "cargo_cuenta",
            "stripe",
            "mercado_pago",
            "paypal",
            "apple_pay_nfc",
          ]),
        })
      )
      .mutation(async ({ input }) => {
        return createPago(input);
      }),

    createStripeSession: protectedProcedure
      .input(
        z.object({
          socioId: z.number(),
          monto: z.number(),
          concepto: z.string(),
          reservacionId: z.number().optional(),
          torneoId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createStripeCheckoutSession(input);
      }),

    listBySocio: publicProcedure
      .input(z.object({ socioId: z.number() }))
      .query(async ({ input }) => {
        return listPagosBySocio(input.socioId);
      }),
  }),
});
