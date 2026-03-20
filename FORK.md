# FORK.md

Fork of [twentyhq/twenty](https://github.com/twentyhq/twenty).

## Purpose

Add Vietnamese (vi) documentation i18n to Twenty CRM, with tooling to keep translations in sync as upstream evolves.

## Rules

### DO
- Track every change diverging from upstream in the [Changes](#changes) section below.
- When syncing upstream, run `detect-vi-changes.ts` to find English source files that changed.
- Regenerate `docs.json` after any translation or navigation change (`yarn docs:generate`).
- Run `fix-links` after adding/modifying translated MDX files.
- Keep fork changes minimal — only what's needed for vi i18n.

### DO NOT
- Do NOT commit `yarn.lock` — regenerate locally after merge to avoid conflicts with upstream.
- Do NOT edit `packages/twenty-docs/docs.json` manually — it is generated.
- Do NOT modify upstream code (backend, frontend, etc.) unless absolutely necessary.
- Do NOT rebase fork commits onto upstream — merge only, to preserve fork history.

### Syncing with upstream

```bash
# 1. Merge upstream
git fetch upstream && git merge upstream/main

# 2. Regenerate yarn.lock locally (do NOT carry over fork's yarn.lock)
yarn install

# 3. Detect English source changes needing vi translation updates
npx tsx packages/twenty-docs/scripts/detect-vi-changes.ts

# 4. Update/create vi translations for reported files

# 5. Fix internal links
yarn --cwd packages/twenty-docs fix-links

# 6. Regenerate docs.json
yarn docs:generate

# 7. Save checksums when translations are done
npx tsx packages/twenty-docs/scripts/detect-vi-changes.ts --save

# 8. Update the Changes section in this file if new divergence is introduced
```

---

## Changes

### docs: Vietnamese (vi) i18n (2026-03-21)

Added 169 files: `packages/twenty-docs/l/vi/` (168 MDX + 1 navigation.json).

**Modified files (exact diff from upstream):**

`packages/twenty-shared/src/constants/DocumentationSupportedLanguages.ts`
```diff
+  'vi',
```

`.github/workflows/docs-i18n-pull.yaml`
```diff
-          LANGUAGES="fr ar cs de es it ja ko pt ro ru tr zh-CN"
+          LANGUAGES="fr ar cs de es it ja ko pt ro ru tr vi zh-CN"
```

`packages/twenty-docs/package.json`
```diff
-    "mintlify": "latest"
+    "mintlify": "^4.2.444"
```

**Generated (regenerate, do not edit):**
- `packages/twenty-docs/docs.json`

### docker: docs compose (2026-03-21)

Added Docker setup to build and serve the documentation site.

**Added files:**
- `packages/twenty-docker/twenty-docs/Dockerfile`
- `packages/twenty-docker/docker-compose.docs.yml`
- `packages/twenty-docker/README.md`

**Usage:**
```bash
cd packages/twenty-docker

# Build and start (available at http://localhost:3900)
docker compose -f docker-compose.docs.yml up -d --build

# Rebuild from scratch
docker compose -f docker-compose.docs.yml build --no-cache
docker compose -f docker-compose.docs.yml up -d

# Stop
docker compose -f docker-compose.docs.yml down
```

### scripts: detect-vi-changes (2026-03-21)

Added tooling to detect English source changes for vi translation sync.

**Added files:**
- `packages/twenty-docs/scripts/detect-vi-changes.ts`
- `packages/twenty-docs/scripts/detect-vi-changes.checksums.json`

**Usage:**
```bash
npx tsx packages/twenty-docs/scripts/detect-vi-changes.ts          # report changes
npx tsx packages/twenty-docs/scripts/detect-vi-changes.ts --save   # persist checksums after updating translations
```
