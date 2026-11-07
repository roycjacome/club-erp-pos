# Guía de Implementación: Google Cloud Platform para clubos ERP

**Fecha:** 26 de Febrero de 2026  
**Versión:** 1.0  
**Objetivo:** Migrar infraestructura de Manus Cloud a Google Cloud Platform (GCS)

---

## 1. Fase 1: Configuración Inicial de GCS

### 1.1 Crear Proyecto en Google Cloud

```bash
# 1. Ir a https://console.cloud.google.com
# 2. Crear nuevo proyecto: "clubos-erp"
# 3. Seleccionar proyecto

# Desde CLI (si tienes gcloud instalado):
gcloud projects create clubos-erp --name="clubos ERP"
gcloud config set project clubos-erp
```

### 1.2 Habilitar APIs Necesarias

```bash
# Habilitar APIs críticas
gcloud services enable \
  cloudsql.googleapis.com \
  run.googleapis.com \
  storage-api.googleapis.com \
  compute.googleapis.com \
  cloudresourcemanager.googleapis.com \
  servicenetworking.googleapis.com \
  cloudlogging.googleapis.com
```

### 1.3 Crear Service Account

```bash
# Crear service account para aplicación
gcloud iam service-accounts create clubos-app \
  --display-name="clubos Application"

# Asignar roles necesarios
gcloud projects add-iam-policy-binding clubos-erp \
  --member="serviceAccount:clubos-app@clubos-erp.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding clubos-erp \
  --member="serviceAccount:clubos-app@clubos-erp.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Crear clave JSON
gcloud iam service-accounts keys create ~/clubos-key.json \
  --iam-account=clubos-app@clubos-erp.iam.gserviceaccount.com
```

---

## 2. Fase 2: Configurar Cloud SQL PostgreSQL

### 2.1 Crear Instancia de Cloud SQL

```bash
# Crear instancia PostgreSQL
gcloud sql instances create clubos-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-size=100GB \
  --storage-auto-increase \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --database-flags=cloudsql_iam_authentication=on
```

### 2.2 Crear Base de Datos y Usuario

```bash
# Crear base de datos
gcloud sql databases create clubos \
  --instance=clubos-db

# Crear usuario de aplicación
gcloud sql users create clubos-user \
  --instance=clubos-db \
  --password=GENERAR_PASSWORD_SEGURO

# Crear usuario IAM para Cloud Run
gcloud sql users create clubos-app@clubos-erp.iam \
  --instance=clubos-db \
  --type=CLOUD_IAM_SERVICE_ACCOUNT
```

### 2.3 Obtener Connection String

```bash
# Obtener IP pública
gcloud sql instances describe clubos-db \
  --format='value(ipAddresses[0].ipAddress)'

# Connection string para desarrollo local:
# postgresql://clubos-user:PASSWORD@IP:5432/clubos

# Connection string para Cloud Run (Cloud SQL Proxy):
# postgresql://clubos-app@clubos-erp.iam:@/clubos?host=/cloudsql/clubos-erp:us-central1:clubos-db
```

---

## 3. Fase 3: Migrar Base de Datos

### 3.1 Exportar de MySQL Actual

```bash
# Desde tu instancia MySQL actual (Manus)
mysqldump -h HOST -u USER -p DATABASE > clubos_backup.sql

# O si está en Manus Cloud:
# Usar el panel de administración para descargar backup
```

### 3.2 Convertir SQL de MySQL a PostgreSQL

```bash
# MySQL y PostgreSQL tienen diferencias de sintaxis
# Cambios principales:
# 1. AUTO_INCREMENT → SERIAL
# 2. UNSIGNED → Sin cambios (PostgreSQL no tiene UNSIGNED)
# 3. DATETIME → TIMESTAMP
# 4. VARCHAR(255) → VARCHAR(255) (compatible)

# Usar herramienta de conversión:
# https://www.pgloader.io/ (recomendado)

pgloader mysql://user:password@localhost/clubos \
         postgresql://clubos-user:password@CLOUD_SQL_IP/clubos
```

### 3.3 Importar a Cloud SQL

```bash
# Opción 1: Desde archivo SQL
gcloud sql import sql clubos-db \
  gs://clubos-bucket/clubos_backup.sql \
  --database=clubos

# Opción 2: Usar psql directamente
psql -h CLOUD_SQL_IP -U clubos-user -d clubos < clubos_backup.sql

# Opción 3: Usar Cloud SQL Proxy (más seguro)
cloud_sql_proxy -instances=clubos-erp:us-central1:clubos-db &
psql -h 127.0.0.1 -U clubos-user -d clubos < clubos_backup.sql
```

### 3.4 Validar Datos

```bash
# Conectar a Cloud SQL
gcloud sql connect clubos-db --user=clubos-user

# Verificar tablas
\dt

# Contar registros
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM reservaciones;
SELECT COUNT(*) FROM torneos;
```

---

## 4. Fase 4: Actualizar Código para Cloud SQL

### 4.1 Actualizar Connection String en `.env`

```bash
# Antes (MySQL en Manus):
DATABASE_URL="mysql://user:password@localhost:3306/clubos"

# Después (Cloud SQL PostgreSQL):
DATABASE_URL="postgresql://clubos-user:PASSWORD@CLOUD_SQL_IP:5432/clubos"

# Para Cloud Run (con Cloud SQL Proxy):
DATABASE_URL="postgresql://clubos-app@clubos-erp.iam:@/clubos?host=/cloudsql/clubos-erp:us-central1:clubos-db"
```

### 4.2 Actualizar Drizzle Config

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql", // Cambiar de "mysql" a "postgresql"
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 4.3 Ejecutar Migraciones

```bash
# Generar migraciones para PostgreSQL
pnpm db:push

# Verificar que todo está correcto
pnpm db:check
```

---

## 5. Fase 5: Configurar Cloud Storage

### 5.1 Crear Bucket

```bash
# Crear bucket para archivos
gsutil mb -l us-central1 gs://clubos-storage

# Configurar CORS para acceso desde frontend
cat > cors.json << 'EOF'
[
  {
    "origin": ["https://clubos.example.com"],
    "method": ["GET", "HEAD", "DELETE", "PUT", "POST"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors.json gs://clubos-storage
```

### 5.2 Actualizar Código para Cloud Storage

```typescript
// server/storage.ts
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket("clubos-storage");

export async function storagePut(
  key: string,
  data: Buffer | string,
  contentType: string
) {
  const file = bucket.file(key);
  
  await file.save(data, {
    metadata: {
      contentType,
    },
  });
  
  // Generar URL pública
  const url = `https://storage.googleapis.com/clubos-storage/${key}`;
  
  return { key, url };
}

export async function storageGet(key: string, expiresIn: number = 3600) {
  const file = bucket.file(key);
  
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + expiresIn * 1000,
  });
  
  return { key, url };
}
```

### 5.3 Configurar Cloud CDN

```bash
# Crear load balancer con Cloud CDN
gcloud compute backend-buckets create clubos-cdn \
  --gcs-bucket-name=clubos-storage \
  --enable-cdn

# Crear URL map
gcloud compute url-maps create clubos-cdn-map \
  --default-service=clubos-cdn

# Crear HTTPS proxy
gcloud compute ssl-certificates create clubos-cert \
  --certificate=cert.pem \
  --private-key=key.pem

gcloud compute target-https-proxies create clubos-https \
  --url-map=clubos-cdn-map \
  --ssl-certificates=clubos-cert

# Crear forwarding rule
gcloud compute forwarding-rules create clubos-https-rule \
  --global \
  --target-https-proxy=clubos-https \
  --address=clubos-ip \
  --ports=443
```

---

## 6. Fase 6: Desplegar n8n en Cloud Run

### 6.1 Crear Dockerfile para n8n

```dockerfile
# Dockerfile
FROM n8nio/n8n:latest

ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=8080
ENV N8N_PROTOCOL=https
ENV N8N_SECURE_COOKIE=true
ENV N8N_WEBHOOK_URL=https://n8n.clubos.example.com/

# Instalar dependencias adicionales si es necesario
RUN npm install -g npm@latest

EXPOSE 8080

CMD ["n8n", "start"]
```

### 6.2 Desplegar en Cloud Run

```bash
# Construir imagen
gcloud builds submit --tag gcr.io/clubos-erp/n8n

# Desplegar en Cloud Run
gcloud run deploy n8n \
  --image gcr.io/clubos-erp/n8n \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 1 \
  --timeout 3600 \
  --set-env-vars="N8N_DB_TYPE=postgresdb,N8N_DB_POSTGRESDB_HOST=CLOUD_SQL_IP,N8N_DB_POSTGRESDB_USER=clubos-user,N8N_DB_POSTGRESDB_PASSWORD=PASSWORD,N8N_DB_POSTGRESDB_DATABASE=n8n" \
  --allow-unauthenticated
```

### 6.3 Configurar Webhooks de WhatsApp

```bash
# URL de n8n en Cloud Run
N8N_URL="https://n8n-RANDOM.a.run.app"

# Crear webhook en n8n para WhatsApp
# POST ${N8N_URL}/webhook/whatsapp
# Configurar en Meta Business Suite para que envíe mensajes a este endpoint
```

---

## 7. Fase 7: Desplegar Aplicación tRPC en Cloud Run

### 7.1 Crear Dockerfile para tRPC

```dockerfile
# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copiar archivos
COPY package.json pnpm-lock.yaml ./
COPY . .

# Instalar dependencias
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm build

# Exponer puerto
EXPOSE 8080

# Iniciar servidor
CMD ["node", "dist/index.js"]

# Configurar puerto dinámico
ENV PORT=8080
```

### 7.2 Desplegar en Cloud Run

```bash
# Construir imagen
gcloud builds submit --tag gcr.io/clubos-erp/app

# Desplegar
gcloud run deploy clubos-app \
  --image gcr.io/clubos-erp/app \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 1 \
  --set-env-vars="DATABASE_URL=postgresql://...,JWT_SECRET=...,VITE_APP_ID=..." \
  --allow-unauthenticated
```

---

## 8. Fase 8: Configurar Dominio Personalizado

### 8.1 Configurar Cloud Armor (Seguridad)

```bash
# Crear política de Cloud Armor
gcloud compute security-policies create clubos-policy \
  --description="clubos Security Policy"

# Agregar regla para bloquear bots
gcloud compute security-policies rules create 1000 \
  --security-policy=clubos-policy \
  --action=deny-403 \
  --expression="evaluatePreconfiguredExpr('xss-v33')"
```

### 8.2 Mapear Dominio Personalizado

```bash
# Crear registro DNS
# Tipo: CNAME
# Nombre: clubos.example.com
# Valor: c.storage.googleapis.com

# O si usas Cloud Run directamente:
# Tipo: A
# Nombre: clubos.example.com
# Valor: IP de Cloud Run (obtener con gcloud run services describe)
```

---

## 9. Fase 9: Configurar Logging y Monitoreo

### 9.1 Habilitar Cloud Logging

```bash
# Los logs se capturan automáticamente en Cloud Logging
# Ver logs de Cloud Run
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Ver logs de Cloud SQL
gcloud logging read "resource.type=cloudsql_database" --limit 50
```

### 9.2 Crear Alertas

```bash
# Crear alerta para errores en Cloud Run
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="clubos App Errors" \
  --condition-display-name="Error Rate High" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s
```

---

## 10. Checklist de Implementación

- [ ] Proyecto GCS creado
- [ ] APIs habilitadas
- [ ] Service account configurado
- [ ] Cloud SQL PostgreSQL creado
- [ ] Base de datos migrada
- [ ] Connection strings actualizados
- [ ] Cloud Storage configurado
- [ ] Cloud CDN habilitado
- [ ] n8n desplegado en Cloud Run
- [ ] Aplicación tRPC desplegada en Cloud Run
- [ ] Dominio personalizado configurado
- [ ] Cloud Logging habilitado
- [ ] Alertas configuradas
- [ ] Tests de carga completados
- [ ] Backups validados

---

## 11. Estimado de Costos Mensuales

| Servicio | Costo |
|---|---|
| Cloud SQL (db-f1-micro) | $30 |
| Cloud Run (1 vCPU, 2GB) | $20 |
| Cloud Storage (100GB) | $2 |
| Cloud CDN | $0.12/GB (primeros 1TB gratis) |
| Cloud Logging | Incluido |
| **Total** | **~$52/mes** |

---

## 12. Próximos Pasos

1. Crear cuenta en Google Cloud (https://cloud.google.com/free)
2. Ejecutar comandos de Fase 1 (Configuración Inicial)
3. Ejecutar comandos de Fase 2 (Cloud SQL)
4. Migrar base de datos (Fase 3)
5. Actualizar código (Fase 4)
6. Desplegar aplicación (Fase 7)

---

**Documento Preparado Por:** Asistente de Desarrollo (Manus)  
**Fecha:** 26 de Febrero de 2026  
**Versión:** 1.0
