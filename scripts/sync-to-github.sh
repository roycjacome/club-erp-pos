#!/bin/bash

# Script: scripts/sync-to-github.sh
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
