# Setup Híbrido con Continuidad: Manus Cloud + GCS + AntiGravity

**Fecha:** 26 de Febrero de 2026  
**Versión:** 1.0  
**Objetivo:** Garantizar continuidad de desarrollo sin dependencia de créditos en una sola plataforma

---

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB (Fuente de Verdad)                    │
│  - main branch: código producción                               │
│  - develop branch: desarrollo activo                            │
│  - feature/* branches: features en progreso                     │
└──────────────┬──────────────────────────────────────────────────┘
               │
        ┌──────┴──────┬──────────────┬──────────────┐
        │             │              │              │
        ▼             ▼              ▼              ▼
   ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  MANUS  │  │   GCS    │  │ANTIGRAVITY│ │  LOCAL   │
   │ CLOUD   │  │ CLOUD RUN│  │ (RESPALDO)│ │(OPCIONAL)│
   │ (ACTIVO)│  │ (n8n)    │  │ (RESPALDO)│ │          │
   └─────────┘  └──────────┘  └──────────┘  └──────────┘
        │             │              │              │
        └──────┬──────┴──────────────┴──────────────┘
               │
        ┌──────▼──────────────────────────────┐
        │   SINCRONIZACIÓN BIDIRECCIONAL      │
        │   (GitHub Actions / Webhooks)       │
        └───────────────────────────────────┘
```

---

## 2. Flujo de Desarrollo Híbrido

### 2.1 Escenario Normal (Con Créditos Manus)

```
Developer
    │
    ├─→ Crear feature branch en GitHub
    │
    ├─→ Clonar en Manus Cloud
    │       └─→ npm install
    │       └─→ pnpm dev
    │       └─→ Desarrollar y testear
    │
    ├─→ Commit y push a GitHub
    │       └─→ GitHub Actions ejecuta tests
    │       └─→ Si pasan: merge a develop
    │
    ├─→ Manus Cloud sincroniza (pull automático)
    │       └─→ Actualiza código
    │       └─→ Ejecuta migrations si hay
    │       └─→ Redeploy automático
    │
    └─→ GCS Cloud Run sincroniza n8n workflows
            └─→ Descarga workflows de GitHub
            └─→ Redeploy de n8n
```

### 2.2 Escenario de Falta de Créditos (Switchover a AntiGravity)

```
Créditos Manus agotados
    │
    ├─→ Clonar repositorio en AntiGravity
    │       └─→ git clone https://github.com/roycjacome/cc-playa-palmas-erp.git
    │
    ├─→ npm install / pnpm install
    │
    ├─→ Configurar .env local (sin Manus)
    │       └─→ DATABASE_URL: local o PostgreSQL remoto
    │       └─→ VITE_APP_ID: usar valores de desarrollo
    │       └─→ JWT_SECRET: generar nuevo
    │
    ├─→ pnpm dev (desarrollo local)
    │
    ├─→ Hacer cambios, commits, push a GitHub
    │       └─→ Crear feature branches
    │       └─→ Pull requests para review
    │
    └─→ Cuando vuelvan créditos Manus:
            ├─→ Manus Cloud hace pull de GitHub
            ├─→ Sincroniza todos los cambios de AntiGravity
            ├─→ Redeploy automático
            └─→ GCS Cloud Run actualiza n8n
```

### 2.3 Escenario de Recuperación (Créditos Restaurados)

```
Créditos Manus restaurados
    │
    ├─→ Manus Cloud detecta cambios en GitHub
    │       └─→ Pull automático de main/develop
    │       └─→ Ejecuta pnpm install
    │       └─→ Ejecuta migraciones pendientes
    │
    ├─→ Sincronizar estado de base de datos
    │       └─→ Si hay cambios en schema: pnpm db:push
    │       └─→ Validar integridad
    │
    ├─→ Redeploy de aplicación
    │       └─→ pnpm build
    │       └─→ Restart servidor
    │
    ├─→ GCS Cloud Run sincroniza n8n
    │       └─→ Descarga workflows de GitHub
    │       └─→ Redeploy
    │
    └─→ Validar todo está funcionando
            └─→ Tests de smoke
            └─→ Verificar APIs
```

---

## 3. Configuración de GitHub como Fuente de Verdad

### 3.1 Estructura de Ramas

```
main
  ├─ Producción estable
  ├─ Tags de versión (v1.0.0, v1.1.0, etc.)
  └─ Protegida: requiere PR + tests pasando

develop
  ├─ Rama de integración
  ├─ Donde se mergean features
  └─ Sincroniza automáticamente a Manus Cloud

feature/RF-2.1-nlp-avanzado
  ├─ Desarrollo de requisito específico
  ├─ Basada en develop
  └─ PR a develop cuando está lista

feature/RF-1.3-excel-bulk-load
  ├─ Otra feature en paralelo
  └─ PR a develop

hotfix/bug-double-booking
  ├─ Basada en main
  └─ Merge a main y develop
```

### 3.2 Configurar GitHub Actions para Sincronización

```yaml
# .github/workflows/sync-manus-cloud.yml
name: Sync to Manus Cloud

on:
  push:
    branches:
      - develop
      - main

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Manus Cloud Redeploy
        run: |
          curl -X POST https://manus-api.example.com/webhooks/redeploy \
            -H "Authorization: Bearer ${{ secrets.MANUS_WEBHOOK_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{
              "branch": "${{ github.ref_name }}",
              "commit": "${{ github.sha }}",
              "timestamp": "'$(date -u +'%Y-%m-%dT%H:%M:%SZ')'"
            }'

      - name: Trigger GCS Cloud Run Redeploy
        run: |
          curl -X POST https://cloudfunctions.net/redeploy-n8n \
            -H "Authorization: Bearer ${{ secrets.GCS_WEBHOOK_TOKEN }}" \
            -d "branch=${{ github.ref_name }}"
```

### 3.3 Configurar GitHub Secrets

```bash
# En GitHub Settings > Secrets and variables > Actions

MANUS_WEBHOOK_TOKEN=xxxxx  # Token para webhook de Manus
GCS_WEBHOOK_TOKEN=xxxxx    # Token para webhook de GCS
ANTIGRAVITY_SSH_KEY=xxxxx  # SSH key para clonar en AntiGravity
```

---

## 4. Sincronización Bidireccional

### 4.1 Desde Manus Cloud → GitHub

```bash
# Script: scripts/sync-to-github.sh
#!/bin/bash

set -e

# 1. Verificar cambios locales
if [ -z "$(git status --porcelain)" ]; then
    echo "No hay cambios locales"
    exit 0
fi

# 2. Crear commit automático
git add -A
git commit -m "Auto-sync from Manus Cloud: $(date -u +'%Y-%m-%d %H:%M:%S UTC')"

# 3. Push a GitHub
git push origin develop

# 4. Notificar
echo "✅ Sincronizado a GitHub"
```

**Ejecutar cada 30 minutos vía cron:**
```bash
# En Manus Cloud
*/30 * * * * cd /home/ubuntu/cc-playa-palmas-erp && bash scripts/sync-to-github.sh >> /var/log/sync-github.log 2>&1
```

### 4.2 Desde GitHub → Manus Cloud

```bash
# Script: scripts/sync-from-github.sh
#!/bin/bash

set -e

# 1. Pull cambios de GitHub
git pull origin develop

# 2. Instalar dependencias si cambió package.json
if git diff HEAD~1 package.json > /dev/null 2>&1; then
    echo "📦 package.json cambió, instalando dependencias..."
    pnpm install
fi

# 3. Ejecutar migraciones si cambió schema
if git diff HEAD~1 drizzle/schema.ts > /dev/null 2>&1; then
    echo "🗄️ Schema cambió, ejecutando migraciones..."
    pnpm db:push
fi

# 4. Rebuild si cambió código
echo "🔨 Rebuilding..."
pnpm build

# 5. Restart servidor (si está en Cloud Run, automático)
echo "✅ Sincronizado desde GitHub"
```

**Ejecutar automáticamente vía webhook de GitHub:**
```bash
# Webhook URL: https://manus-cloud.example.com/webhooks/github-push
# Eventos: push
# Branches: develop, main
```

### 4.3 Desde GitHub → GCS Cloud Run (n8n)

```bash
# Script: scripts/sync-n8n-workflows.sh
#!/bin/bash

set -e

# 1. Descargar workflows de GitHub
git pull origin develop

# 2. Exportar workflows a JSON
mkdir -p ./n8n-workflows
cp ./docs/n8n-workflows/*.json ./n8n-workflows/

# 3. Subir a GCS
gsutil -m cp ./n8n-workflows/*.json gs://clubos-n8n-workflows/

# 4. Trigger redeploy de n8n en Cloud Run
gcloud run deploy n8n \
  --image gcr.io/clubos-erp/n8n \
  --set-env-vars="N8N_WORKFLOWS_DIR=gs://clubos-n8n-workflows" \
  --region us-central1

echo "✅ n8n workflows sincronizados"
```

---

## 5. Configuración de AntiGravity como Respaldo

### 5.1 Clonar Repositorio en AntiGravity

```bash
# En AntiGravity terminal
git clone https://github.com/roycjacome/cc-playa-palmas-erp.git
cd cc-playa-palmas-erp

# Configurar remotes
git remote add manus https://manus-git-remote.example.com/repo.git
git remote add antigravity $(pwd)  # Local
```

### 5.2 Crear .env.local para AntiGravity

```bash
# .env.local (NO commitar a git)
DATABASE_URL="postgresql://localhost:5432/clubos_dev"
JWT_SECRET="dev-secret-key-change-in-production"
VITE_APP_ID="dev-app-id"
OAUTH_SERVER_URL="http://localhost:3000"
NODE_ENV="development"
```

### 5.3 Workflow de Desarrollo en AntiGravity

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear rama de feature
git checkout -b feature/RF-2.1-nlp-avanzado

# 3. Desarrollar
pnpm dev

# 4. Tests
pnpm test

# 5. Commit y push a GitHub
git add -A
git commit -m "feat: Implementar NLP avanzado para reservas complejas"
git push origin feature/RF-2.1-nlp-avanzado

# 6. Crear PR en GitHub
# (Ir a https://github.com/roycjacome/cc-playa-palmas-erp/pulls)
```

---

## 6. Matriz de Sincronización

| Origen | Destino | Frecuencia | Trigger | Automático |
|---|---|---|---|---|
| Manus Cloud | GitHub | 30 min | Cron | ✅ Sí |
| GitHub | Manus Cloud | Inmediato | Webhook | ✅ Sí |
| GitHub | GCS n8n | Inmediato | Webhook | ✅ Sí |
| AntiGravity | GitHub | Manual | Push | ❌ No |
| GitHub | AntiGravity | Manual | Pull | ❌ No |

---

## 7. Checklist de Configuración

### Fase 1: GitHub Setup
- [ ] Crear repositorio en GitHub (ya existe: roycjacome/cc-playa-palmas-erp)
- [ ] Configurar ramas (main, develop, feature/*)
- [ ] Proteger rama main (requiere PR + tests)
- [ ] Agregar GitHub Actions workflows
- [ ] Configurar secrets en GitHub

### Fase 2: Manus Cloud Sync
- [ ] Crear scripts de sincronización
- [ ] Configurar cron jobs
- [ ] Configurar webhooks de GitHub
- [ ] Testear sincronización bidireccional

### Fase 3: GCS n8n Sync
- [ ] Crear carpeta de workflows en GitHub
- [ ] Configurar script de sync a GCS
- [ ] Testear redeploy automático

### Fase 4: AntiGravity Respaldo
- [ ] Clonar repositorio en AntiGravity
- [ ] Crear .env.local
- [ ] Testear desarrollo local
- [ ] Documentar proceso de switchover

### Fase 5: Validación
- [ ] Testear flujo normal (Manus Cloud)
- [ ] Testear switchover a AntiGravity
- [ ] Testear recuperación a Manus Cloud
- [ ] Documentar runbooks

---

## 8. Runbook: Qué Hacer Cuando Se Acaben Créditos

### Paso 1: Detectar Falta de Créditos
```
Error en Manus Cloud: "Insufficient credits"
```

### Paso 2: Switchover a AntiGravity
```bash
# En AntiGravity
cd ~/cc-playa-palmas-erp

# Verificar que está actualizado
git pull origin develop

# Instalar dependencias
pnpm install

# Configurar .env.local si es necesario
cp .env.example .env.local
# Editar .env.local con valores locales

# Iniciar desarrollo
pnpm dev

# El servidor estará en http://localhost:3000
```

### Paso 3: Continuar Desarrollo
```bash
# Crear feature branch
git checkout -b feature/RF-2.1-nlp-avanzado

# Desarrollar normalmente
pnpm dev

# Hacer cambios, tests, etc.

# Commit y push
git add -A
git commit -m "feat: implementar NLP"
git push origin feature/RF-2.1-nlp-avanzado

# Crear PR en GitHub para review
```

### Paso 4: Cuando Vuelvan Créditos
```bash
# Manus Cloud detecta cambios en GitHub automáticamente
# Ejecuta: git pull origin develop
# Ejecuta: pnpm install
# Ejecuta: pnpm db:push
# Ejecuta: pnpm build
# Redeploy automático

# Verificar que todo está correcto
curl https://clubos.manus.space/api/health
```

---

## 9. Runbook: Recuperación de Cambios

### Escenario: Cambios en AntiGravity, Vuelven Créditos

```bash
# Manus Cloud hace pull automático
git pull origin develop

# Si hay conflictos (raro, pero posible):
git status
git diff

# Resolver conflictos manualmente
# Luego:
git add -A
git commit -m "Merge: cambios de AntiGravity"
git push origin develop

# Redeploy automático
```

### Escenario: Cambios en Manus Cloud, Desarrollo en AntiGravity

```bash
# En AntiGravity
git pull origin develop

# Si hay conflictos:
git status
git diff

# Resolver conflictos
# Luego:
git add -A
git commit -m "Merge: cambios de Manus Cloud"
git push origin develop
```

---

## 10. Monitoreo y Alertas

### Configurar Alertas de Sincronización

```bash
# Script: scripts/monitor-sync.sh
#!/bin/bash

# Verificar que Manus Cloud está sincronizado
LAST_COMMIT_MANUS=$(curl -s https://manus-cloud.example.com/api/git/log | jq -r '.[0].hash')
LAST_COMMIT_GITHUB=$(curl -s https://api.github.com/repos/roycjacome/cc-playa-palmas-erp/commits/develop | jq -r '.sha')

if [ "$LAST_COMMIT_MANUS" != "$LAST_COMMIT_GITHUB" ]; then
    echo "⚠️ Manus Cloud no está sincronizado con GitHub"
    # Enviar alerta por email/Slack
fi

# Verificar que GCS n8n está sincronizado
LAST_SYNC_N8N=$(gcloud run services describe n8n --region us-central1 --format='value(metadata.updateTime)')
LAST_COMMIT_TIME=$(git log -1 --format=%ai docs/n8n-workflows/)

if [ "$LAST_SYNC_N8N" < "$LAST_COMMIT_TIME" ]; then
    echo "⚠️ GCS n8n no está sincronizado con GitHub"
    # Enviar alerta
fi
```

---

## 11. Ventajas del Setup Híbrido

✅ **Continuidad sin dependencia de créditos:** Puedes seguir desarrollando en AntiGravity  
✅ **GitHub como fuente de verdad:** Un único lugar de referencia  
✅ **Sincronización automática:** Cambios se propagan automáticamente  
✅ **Recuperación fácil:** Cuando vuelvan créditos, todo se sincroniza  
✅ **Escalabilidad:** Puedes agregar más plataformas (AWS, Azure, etc.)  
✅ **Auditoría completa:** Todos los cambios en GitHub con historial  

---

## 12. Próximos Pasos

1. **Crear GitHub Actions workflows** (scripts/github-actions/)
2. **Crear scripts de sincronización** (scripts/sync-*.sh)
3. **Configurar webhooks** en Manus Cloud y GCS
4. **Testear flujo completo** (normal → AntiGravity → recuperación)
5. **Documentar runbooks** para el equipo

---

**Documento Preparado Por:** Asistente de Desarrollo (Manus)  
**Fecha:** 26 de Febrero de 2026  
**Versión:** 1.0  
**Estado:** Listo para implementación
