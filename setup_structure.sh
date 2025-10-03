#!/usr/bin/env bash
set -euo pipefail

# Run this from the root of your cloned repo:
#   bash setup_structure.sh

echo "Creating folders…"

# --- BACKEND ---
mkdir -p BACKEND/{configs,controllers,helpers,middlewares,models,routes}

# --- FRONTEND ---
mkdir -p frontend/{public,src/{api,components,pages,styles,theme,utils}}

# Note: node_modules should NOT be committed. It will be created by npm/yarn/pnpm locally.

echo "Adding placeholder .gitkeep files so Git tracks empty dirs…"
for d in \
  BACKEND/configs BACKEND/controllers BACKEND/helpers BACKEND/middlewares BACKEND/models BACKEND/routes \
  frontend/public frontend/src/api frontend/src/components frontend/src/pages frontend/src/styles frontend/src/theme frontend/src/utils
do
  touch "$d/.gitkeep"
done

echo "Creating files (leaving existing ones untouched)…"
# BACKEND top-level files
: > BACKEND/server.js
: > BACKEND/package.json
: > BACKEND/package-lock.json
: > BACKEND/.env        # will be ignored by git (see .gitignore below)

# FRONTEND src files
: > frontend/src/App.css
: > frontend/src/App.js
: > frontend/src/App.test.js
: > frontend/src/index.css
: > frontend/src/index.js
: > frontend/src/logo.svg
: > frontend/src/reportWebVitals.js
: > frontend/src/setupTests.js

# .gitignore at repo root (append if not present)
echo "Ensuring .gitignore ignores environment files and node_modules…"
{
  echo "# Dependencies"
  echo "node_modules/"
  echo ""
  echo "# Env files"
  echo "*.env"
  echo "BACKEND/.env"
  echo ""
  echo "# Build outputs"
  echo "dist/"
  echo "build/"
} >> .gitignore

# Make a minimal README note (optional)
if [ ! -f README.md ]; then
cat > README.md <<'EOF'
# SupremeFitness

Monorepo layout

