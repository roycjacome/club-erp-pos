# ============================================================================
# DOCKERFILE - Demo Country Club ERP/POS
# Optimizado para Google Cloud Run
# ============================================================================

# --- STAGE 1: Build ---
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable pnpm

# Copy package files and patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches/

# Install ALL dependencies (including devDependencies for vite build)
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY client ./client/
COPY shared ./shared/
COPY server ./server/
COPY vite.config.ts tsconfig.json ./

# Build the frontend (vite build generates dist/public)
RUN pnpm exec vite build

# Verify build output exists
RUN ls -la dist/public/index.html && echo "✅ Build successful"

# --- STAGE 2: Production Runtime ---
FROM node:20-bookworm-slim AS runtime

WORKDIR /app

# Install express as the only runtime dependency
RUN npm install --no-save express@4.21.2

# Copy built frontend from builder stage
COPY --from=builder /app/dist/public ./dist/public

# Copy the production server (pure JavaScript, no TypeScript needed)
COPY server.mjs ./server.mjs

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port for Cloud Run
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "const http=require('http');const req=http.get('http://localhost:8080/health',(res)=>{process.exit(res.statusCode===200?0:1)});req.on('error',()=>process.exit(1));req.setTimeout(2000,()=>{req.destroy();process.exit(1)})"

# Start the application
CMD ["node", "server.mjs"]
