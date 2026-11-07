import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { stripe } from "./stripe";
import { createPago } from "../db.padel";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Stripe Webhook
  app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const payload = req.body;
    const sig = req.headers["stripe-signature"] as string;

    let event;
    try {
      // For demo, we might skip signature validation if secret is not set, 
      // but let's try to be consistent.
      event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const { socioId, reservacionId, torneoId, concepto } = session.metadata;

      await createPago({
        socioId: parseInt(socioId),
        reservacionId: reservacionId ? parseInt(reservacionId) : undefined,
        torneoId: torneoId ? parseInt(torneoId) : undefined,
        concepto: concepto || "Pago Stripe",
        monto: (session.amount_total / 100).toString(),
        metodo: "stripe",
        estado: "completado",
        stripePaymentId: session.id,
      });
      
      console.log(`✓ Pago registrado para socio ${socioId}: ${concepto}`);
    }

    res.json({ received: true });
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
