# Guía de Switchover: Manus Cloud → AntiGravity

**Fecha:** 26 de Febrero de 2026  
**Versión:** 1.0  
**Escenario:** Créditos agotados en Manus Cloud, continuar desarrollo en AntiGravity

---

## 1. Paso a Paso: Switchover a AntiGravity

### Paso 1: Verificar Falta de Créditos

```
Error en Manus Cloud:
"Insufficient credits to continue"
o
"Your account has reached the credit limit"
```

### Paso 2: Acceder a AntiGravity

```bash
# Conectarse a AntiGravity
ssh user@antigravity.example.com

# O si usas interfaz web:
# Ir a https://antigravity.example.com
```

### Paso 3: Clonar Repositorio

```bash
# Crear directorio de trabajo
mkdir -p ~/projects
cd ~/projects

# Clonar repositorio de GitHub
git clone https://github.com/roycjacome/cc-playa-palmas-erp.git
cd cc-playa-palmas-erp

# Verificar que está en rama develop
git checkout develop
git pull origin develop
```

### Paso 4: Instalar Dependencias

```bash
# Instalar Node.js si no está (AntiGravity generalmente lo tiene)
node --version  # Debe ser v22 o superior

# Instalar pnpm
npm install -g pnpm

# Instalar dependencias del proyecto
pnpm install

# Verificar que todo está bien
pnpm check
```

### Paso 5: Configurar Entorno Local

```bash
# Crear archivo .env.local (NO commitar a git)
cat > .env.local << 'EOF'
# Base de datos (local o remota)
DATABASE_URL="postgresql://user:password@localhost:5432/clubos_dev"

# JWT y OAuth (valores de desarrollo)
JWT_SECRET="dev-secret-key-$(date +%s)"
VITE_APP_ID="dev-app-id"
VITE_OAUTH_PORTAL_URL="http://localhost:3000"
OAUTH_SERVER_URL="http://localhost:3000"

# Otros
NODE_ENV="development"
VITE_APP_TITLE="clubos Dev"
OWNER_NAME="Dev Team"
EOF

# Verificar que .env.local está en .gitignore
grep ".env.local" .gitignore || echo ".env.local" >> .gitignore
```

### Paso 6: Configurar Base de Datos Local

```bash
# Opción A: PostgreSQL local
# Instalar PostgreSQL si no está
sudo apt-get install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres createdb clubos_dev
sudo -u postgres createuser clubos_user
sudo -u postgres psql -c "ALTER USER clubos_user WITH PASSWORD 'dev-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE clubos_dev TO clubos_user;"

# Opción B: Usar Cloud SQL remoto (si está disponible)
# Actualizar DATABASE_URL en .env.local con conexión remota
```

### Paso 7: Ejecutar Migraciones

```bash
# Generar y ejecutar migraciones
pnpm db:push

# Verificar que las tablas se crearon
psql -U clubos_user -d clubos_dev -c "\dt"
```

### Paso 8: Iniciar Servidor de Desarrollo

```bash
# Iniciar en terminal 1
pnpm dev

# Debería mostrar:
# [vite] Server running on http://localhost:3000/
# [Express] Server running on http://localhost:3000/api
```

### Paso 9: Verificar que Todo Funciona

```bash
# En otra terminal
curl http://localhost:3000/api/health

# Debería responder:
# {"status":"ok","timestamp":"2026-02-26T..."}

# Abrir en navegador
# http://localhost:3000
```

---

## 2. Flujo de Desarrollo en AntiGravity

### Crear Feature Branch

```bash
# Crear rama para tu feature
git checkout -b feature/RF-2.1-nlp-avanzado

# O si es un bug fix
git checkout -b bugfix/double-booking-issue

# O si es un hotfix
git checkout -b hotfix/critical-security-fix
```

### Desarrollar

```bash
# Terminal 1: Servidor de desarrollo
pnpm dev

# Terminal 2: Tests en watch mode
pnpm test

# Terminal 3: Hacer cambios en editor
# Editar archivos en ./client/src, ./server, etc.

# Los cambios se reflejan automáticamente en http://localhost:3000
```

### Hacer Commits

```bash
# Ver cambios
git status
git diff

# Agregar cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: Implementar NLP avanzado para reservas complejas

- Agregar endpoint /api/padel/reservas/parse
- Integrar GPT-4o-mini para interpretación de lenguaje natural
- Tests unitarios para casos complejos
- Documentación de API"

# Ver historial
git log --oneline -5
```

### Hacer Push

```bash
# Push a GitHub
git push origin feature/RF-2.1-nlp-avanzado

# Crear Pull Request en GitHub
# Ir a: https://github.com/roycjacome/cc-playa-palmas-erp/pulls
# Crear PR de feature/RF-2.1-nlp-avanzado → develop
```

### Esperar Review y Merge

```bash
# Esperar que alguien revise el PR
# Una vez aprobado, mergear en GitHub

# Volver a develop localmente
git checkout develop

# Pull cambios
git pull origin develop

# Eliminar rama local
git branch -d feature/RF-2.1-nlp-avanzado
```

---

## 3. Sincronización Automática a GitHub

### Configurar Cron Job (Opcional)

```bash
# Agregar a crontab para sincronizar cada 30 minutos
crontab -e

# Agregar línea:
*/30 * * * * cd ~/projects/cc-playa-palmas-erp && bash scripts/sync-to-github.sh >> /tmp/sync-github.log 2>&1
```

### O Sincronizar Manualmente

```bash
# Ver cambios
git status

# Si hay cambios sin commitear
git add -A
git commit -m "Auto-sync: cambios de desarrollo"

# Push
git push origin develop
```

---

## 4. Cuando Vuelvan Créditos a Manus Cloud

### Paso 1: Verificar Cambios en GitHub

```bash
# En AntiGravity, verificar que todo está pusheado
git status
# Debería mostrar: "On branch develop, nothing to commit"

# Si hay cambios sin pushear:
git add -A
git commit -m "Final sync before returning to Manus Cloud"
git push origin develop
```

### Paso 2: Manus Cloud Sincroniza Automáticamente

```
Manus Cloud detectará cambios en GitHub y:
1. Hará git pull origin develop
2. Ejecutará pnpm install
3. Ejecutará pnpm db:push (si hay cambios en schema)
4. Ejecutará pnpm build
5. Hará redeploy automático
```

### Paso 3: Verificar Sincronización

```bash
# Esperar ~5 minutos

# Verificar que Manus Cloud está corriendo
curl https://clubos.manus.space/api/health

# Debería responder:
# {"status":"ok","timestamp":"2026-02-26T..."}
```

### Paso 4: Continuar en Manus Cloud

```bash
# Volver a desarrollar en Manus Cloud
# Los cambios de AntiGravity ya están integrados

# Crear nueva feature branch
git checkout -b feature/RF-1.4-seeding-ai
```

---

## 5. Resolución de Conflictos

### Escenario: Cambios en Manus Cloud y AntiGravity

```bash
# En AntiGravity
git pull origin develop

# Si hay conflictos:
# Editar archivos con conflictos
# Resolver manualmente
# git add .
# git commit -m "Merge: resolver conflictos"
# git push origin develop

# Manus Cloud detectará cambios y sincronizará
```

### Escenario: Cambios en Manus Cloud, Vuelves a AntiGravity

```bash
# En AntiGravity
git pull origin develop

# Si hay conflictos:
# Resolver manualmente
# git add .
# git commit -m "Merge: cambios de Manus Cloud"
# git push origin develop
```

---

## 6. Checklist de Switchover

- [ ] Verificar que no hay créditos en Manus Cloud
- [ ] Acceder a AntiGravity
- [ ] Clonar repositorio de GitHub
- [ ] Instalar dependencias (pnpm install)
- [ ] Crear .env.local
- [ ] Configurar base de datos local
- [ ] Ejecutar migraciones (pnpm db:push)
- [ ] Iniciar servidor (pnpm dev)
- [ ] Verificar que funciona (curl /api/health)
- [ ] Crear feature branch
- [ ] Desarrollar y hacer commits
- [ ] Push a GitHub
- [ ] Esperar a que vuelvan créditos
- [ ] Verificar sincronización automática

---

## 7. Troubleshooting

### Error: "Cannot find module 'pnpm'"

```bash
npm install -g pnpm
pnpm --version
```

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Verificar DATABASE_URL en .env.local
cat .env.local | grep DATABASE_URL

# Probar conexión
psql -U clubos_user -d clubos_dev -c "SELECT 1"
```

### Error: "Port 3000 already in use"

```bash
# Encontrar proceso que usa puerto 3000
lsof -i :3000

# Matar proceso
kill -9 PID

# O usar puerto diferente
PORT=3001 pnpm dev
```

### Error: "Git authentication failed"

```bash
# Verificar que tienes acceso a GitHub
ssh -T git@github.com

# Si no funciona, usar HTTPS con token
git remote set-url origin https://TOKEN@github.com/roycjacome/cc-playa-palmas-erp.git
```

---

## 8. Ventajas de AntiGravity para Desarrollo

✅ **Sin dependencia de créditos:** Desarrollo continuo  
✅ **Control total:** Tu propia máquina  
✅ **Desarrollo local:** Más rápido que cloud  
✅ **Debugging fácil:** Acceso directo a logs  
✅ **Sincronización automática:** GitHub como fuente de verdad  
✅ **Recuperación fácil:** Cuando vuelvan créditos, todo se sincroniza  

---

## 9. Próximos Pasos

1. Guardar esta guía en tu wiki personal
2. Crear acceso a AntiGravity si aún no lo tienes
3. Clonar repositorio en AntiGravity como backup
4. Testear flujo de switchover (aunque no sea necesario ahora)
5. Configurar cron job de sincronización

---

**Documento Preparado Por:** Asistente de Desarrollo (Manus)  
**Fecha:** 26 de Febrero de 2026  
**Versión:** 1.0
