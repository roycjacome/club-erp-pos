#!/bin/bash

# Script: scripts/sync-from-github.sh
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
