# FORK.md

Fork of [twentyhq/twenty](https://github.com/twentyhq/twenty).

## Repository Architecture

```
[twentyhq/twenty]                        ← upstream (original)
    ↓  GitHub "Sync fork"
[wow-platform/fork-twenty]  (public)     ← public fork, always tracks upstream
    ↓  git fetch upstream + merge
[wow-platform/rebatefx]     (private)    ← private dev repo, all work happens here
    ↑  push branch → fork-twenty when PR to upstream is needed
```

| Repo | Visibility | Role |
|------|-----------|------|
| `twentyhq/twenty` | Public | Original upstream |
| `wow-platform/fork-twenty` | Public | Sync relay + PR gateway to upstream |
| `wow-platform/rebatefx` | Private | Active development, customisation, deployment |

### Why this structure?

GitHub does not allow private forks of public repositories. This 3-tier setup gives us:
- **Private development** — all proprietary work stays in `rebatefx`.
- **Upstream sync** — `fork-twenty` stays in sync via GitHub's built-in "Sync fork" button.
- **PR gateway** — when contributing back to upstream, push a branch from `rebatefx` → `fork-twenty` and open a PR from there.

---

## Setup (one-time)

### 1. Create private repo from public fork

```bash
# Bare clone the public fork
git clone --bare git@github.com:wow-platform/fork-twenty.git
cd fork-twenty.git

# Mirror push to the private repo (create wow-platform/rebatefx on GitHub first, empty, no init)
git push --mirror git@github.com:wow-platform/rebatefx.git

# Clean up
cd ..
rm -rf fork-twenty.git
```

### 2. Clone private repo and configure remotes

```bash
git clone git@github.com:wow-platform/rebatefx.git
cd rebatefx

# Add public fork as upstream (for syncing)
git remote add upstream git@github.com:wow-platform/fork-twenty.git
git remote set-url --push upstream DISABLE   # prevent accidental push

# Add public fork as a push target (for PRs to upstream Twenty)
git remote add fork-twenty git@github.com:wow-platform/fork-twenty.git
```

### 3. Verify remotes

```bash
git remote -v
# fork-twenty  git@github.com:wow-platform/fork-twenty.git     (fetch)
# fork-twenty  git@github.com:wow-platform/fork-twenty.git     (push)
# origin       git@github.com:wow-platform/rebatefx.git        (fetch)
# origin       git@github.com:wow-platform/rebatefx.git        (push)
# upstream     git@github.com:wow-platform/fork-twenty.git     (fetch)
# upstream     DISABLE                                          (push)
```

---

## Rules

### DO
- Track every change diverging from upstream in the [Changes](#changes) section below.
- When syncing upstream, run `detect-vi-changes.ts` to find English source files that changed.
- Regenerate `docs.json` after any translation or navigation change (`yarn docs:generate`).
- Run `fix-links` after adding/modifying translated MDX files.
- Keep fork changes minimal — only what's needed for vi i18n.
- Always sync `fork-twenty` with upstream **before** pulling into `rebatefx`.
- Do all development work in `rebatefx` — never commit directly in `fork-twenty`.

### DO NOT
- Do NOT commit `yarn.lock` — regenerate locally after merge to avoid conflicts with upstream.
- Do NOT edit `packages/twenty-docs/docs.json` manually — it is generated.
- Do NOT modify upstream code (backend, frontend, etc.) unless absolutely necessary.
- Do NOT rebase fork commits onto upstream — merge only, to preserve fork history.
- Do NOT push proprietary/business code to `fork-twenty` — it is public.
- Do NOT push directly to `upstream` remote (it is disabled for safety).

---

## Workflows

### Syncing upstream → rebatefx

```bash
# 0. First, sync fork-twenty with twentyhq/twenty
#    → Go to github.com/wow-platform/fork-twenty → "Sync fork" → "Update branch"
#    Or via CLI:
#      cd fork-twenty && git fetch upstream && git merge upstream/main && git push origin main

# 1. In rebatefx: pull latest from public fork
git fetch upstream
git checkout main
git merge upstream/main

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

# 9. Push to private repo
git push origin main
```

### Contributing back to upstream Twenty (PR workflow)

```bash
# 1. Create feature branch in rebatefx
git checkout -b feature/my-contribution
# ... code, commit ...

# 2. Push branch to public fork
git push fork-twenty feature/my-contribution

# 3. Open PR on GitHub: fork-twenty/feature/my-contribution → twentyhq/twenty/main

# 4. After PR is merged, clean up
git checkout main
git branch -d feature/my-contribution
git push fork-twenty --delete feature/my-contribution
```

### Syncing fork-specific changes (rebatefx → fork-twenty)

Only push changes that are meant to be **public** (e.g., vi i18n work, bug fixes for upstream).

```bash
# Push specific branch to public fork
git push fork-twenty main

# Or push a specific branch only
git push fork-twenty feature/vi-docs-update
```

> ⚠️ **WARNING**: Never push `main` from `rebatefx` to `fork-twenty` if it contains proprietary commits. Cherry-pick or use dedicated branches instead.

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

### fix: Windows compatibility for twenty-server (2026-03-21)

Fixed hardcoded Unix path separators (`/dist/`) that broke asset resolution and server startup on Windows.

**Modified files (exact diff from upstream):**

`packages/twenty-server/src/constants/assets-path.ts`
```diff
-const IS_BUILT_THROUGH_TESTING_MODULE = !__dirname.includes('/dist/');
+const IS_BUILT_THROUGH_TESTING_MODULE = !__dirname.includes(`${path.sep}dist${path.sep}`);
```

`packages/twenty-server/src/engine/workspace-manager/dev-seeder/data/services/dev-seeder-data.service.ts`
```diff
-import { join } from 'path';
+import { join, sep } from 'path';
...
-    const IS_BUILT = __dirname.includes('/dist/');
+    const IS_BUILT = __dirname.includes(`${sep}dist${sep}`);
```

`packages/twenty-server/project.json`
```diff
 # start, start:ci, start:debug, test:integration commands
-"NODE_ENV=development nest start --watch"
+"cross-env NODE_ENV=development nest start --watch"
```

`package.json`
```diff
+    "cross-env": "^7.0.3"
```

### fix: Arabic numeral parsing in docs MDX (2026-03-21)

Fixed `cols={٢}` (Arabic numeral) → `cols={2}` in 8 Arabic-locale MDX files. Acorn parser cannot parse non-Latin numerals in JSX expressions.

**Modified files:**
- `packages/twenty-docs/l/ar/developers/contribute/contribute.mdx`
- `packages/twenty-docs/l/ar/developers/extend/extend.mdx`
- `packages/twenty-docs/l/ar/developers/introduction.mdx`
- `packages/twenty-docs/l/ar/developers/self-host/self-host.mdx`
- `packages/twenty-docs/l/ar/twenty-ui/introduction.mdx`
- `packages/twenty-docs/l/ar/user-guide/billing/overview.mdx`
- `packages/twenty-docs/l/ar/user-guide/introduction.mdx`
- `packages/twenty-docs/l/ar/user-guide/permissions-access/overview.mdx`

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
