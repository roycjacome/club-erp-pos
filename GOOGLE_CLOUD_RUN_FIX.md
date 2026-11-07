# Google Cloud Run - Fix de Configuración de Puerto

**Fecha:** 20 de Febrero de 2026  
**Problema:** `The user-provided container failed to start and listen on the port defined by the PORT environment variable`  
**Solución:** Configurar el servidor para escuchar en `0.0.0.0` y usar `process.env.PORT`

---

## 🔧 Cambios Realizados

### 1. **server/index.ts** - Escuchar en puerto dinámico

**Antes:**
```typescript
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
```

**Después:**
```typescript
// CRITICAL: Google Cloud Run requires listening on 0.0.0.0 and using process.env.PORT
const port = parseInt(process.env.PORT || "3000", 10);
const host = "0.0.0.0";

server.listen(port, host, () => {
  console.log(`✓ Server running on http://0.0.0.0:${port}/`);
  console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`  Port: ${port}`);
});
```

**Cambios clave:**
- ✅ Escucha en `0.0.0.0` (todas las interfaces) en lugar de `localhost`
- ✅ Parsea el puerto como entero
- ✅ Usa `process.env.PORT` con fallback a 3000
- ✅ Logs mejorados para debugging

### 2. **Dockerfile** - Nuevo archivo creado

```dockerfile
# ============================================================================
# BUILDER STAGE - Construir la aplicación
# ============================================================================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches 2>/dev/null || true

# Install dependencies (incluye devDependencies para build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
# Esto genera: dist/index.js (server) y dist/public/* (frontend)
RUN pnpm run build

# ============================================================================
# RUNTIME STAGE - Ejecutar la aplicación
# ============================================================================
FROM node:20-bookworm-slim AS runtime

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# CRITICAL: Google Cloud Run requirements
# 1. Listen on 0.0.0.0 (all interfaces)
# 2. Use PORT environment variable (default 8080)
# 3. Respond to health checks on startup
ENV PORT=8080
EXPOSE 8080

# Health check for Google Cloud Run
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the server
# The server/index.ts listens on process.env.PORT (8080) and 0.0.0.0
CMD ["node", "dist/index.js"]
```

**Características:**
- ✅ Multi-stage build (builder + runtime)
- ✅ Optimizado para tamaño
- ✅ Health check integrado
- ✅ PORT=8080 como default
- ✅ NODE_ENV=production

### 3. **.dockerignore** - Nuevo archivo creado

Optimiza el contexto de build excluyendo archivos innecesarios:
- node_modules
- .git
- .env
- dist
- screenshots
- .manus-logs

---

## 📋 Próximos Pasos

### 1. **Hacer Push a GitHub**

El commit está listo localmente. Para hacer push a GitHub:

```bash
# Opción A: Usando GitHub CLI
gh auth login  # Si no estás autenticado
git push user_github main

# Opción B: Usando token personal
git push https://tu-token@github.com/roycjacome/cc-playa-palmas-erp.git main
```

### 2. **Verificar el Despliegue en Google Cloud**

Una vez que hagas push a GitHub, Google Cloud Build debería:
1. Detectar el nuevo commit
2. Construir la imagen Docker
3. Desplegar en Cloud Run
4. Escuchar en puerto 8080

### 3. **Validar que Funciona**

```bash
# Ver logs de Cloud Run
gcloud run logs read cc-playa-palmas-erp --limit 50

# Probar la aplicación
curl https://cc-playa-palmas-erp-XXXXX.run.app/
```

---

## 🔍 Validación Local

Puedes probar localmente que el Dockerfile funciona:

```bash
# Construir la imagen
docker build -t cc-playa-palmas-erp:test .

# Ejecutar con puerto dinámico
docker run -e PORT=8080 -p 8080:8080 cc-playa-palmas-erp:test

# Probar
curl http://localhost:8080/
```

---

## 📊 Resumen de Cambios

| Archivo | Cambio | Razón |
|---------|--------|-------|
| `server/index.ts` | Escuchar en `0.0.0.0:process.env.PORT` | Google Cloud Run requiere puerto dinámico |
| `Dockerfile` | Creado (multi-stage) | Contenerización para Cloud Run |
| `.dockerignore` | Creado | Optimizar contexto de build |

---

## ✅ Checklist

- [x] Servidor escucha en `0.0.0.0`
- [x] Servidor usa `process.env.PORT` con fallback
- [x] Dockerfile optimizado para Cloud Run
- [x] Health check configurado
- [x] .dockerignore creado
- [ ] Push a GitHub (pendiente - problema de autenticación)
- [ ] Validar despliegue en Cloud Run

---

## 🚀 Resultado Esperado

Cuando hagas push a GitHub y Google Cloud Build detecte el cambio:

1. ✅ Imagen Docker se construye correctamente
2. ✅ Contenedor inicia en puerto 8080
3. ✅ Health check pasa
4. ✅ Aplicación responde en `https://cc-playa-palmas-erp-XXXXX.run.app/`

---

**Commit Hash:** `cbb1901`  
**Rama:** `main`  
**Estado:** Listo para push a GitHub
