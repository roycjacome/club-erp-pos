#!/bin/bash

# Script: scripts/sync-n8n-workflows.sh
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
