#!/bin/bash
# Script: scripts/monitor-sync.sh

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
