import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public
  const staticPath = path.resolve(__dirname, "..", "dist", "public");
  
  console.log(`📁 Serving static files from: ${staticPath}`);
  app.use(express.static(staticPath));

  // Health check endpoint for Cloud Run
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // CRITICAL: Google Cloud Run requirements
  // 1. Listen on 0.0.0.0 (all interfaces)
  // 2. Use PORT environment variable (default 8080)
  // 3. Respond to health checks on startup
  const port = parseInt(process.env.PORT || "8080", 10);
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    console.log(`✅ Server running`);
    console.log(`   URL: http://0.0.0.0:${port}/`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`   Port: ${port}`);
  });
}

startServer().catch(console.error);
