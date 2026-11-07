import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // CRITICAL: Google Cloud Run requires listening on 0.0.0.0 and using process.env.PORT
  const port = parseInt(process.env.PORT || "3000", 10);
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    console.log(`✓ Server running on http://0.0.0.0:${port}/`);
    console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`  Port: ${port}`);
  });
}

startServer().catch(console.error);
