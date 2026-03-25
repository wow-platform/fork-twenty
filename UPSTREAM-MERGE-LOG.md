# Upstream Merge Log

Tracks every merge from [twentyhq/twenty](https://github.com/twentyhq/twenty) into this fork.

---

## Guidelines

### How to create an entry

After every upstream merge, create a new entry following this template. Entries are ordered **newest first**.

#### 1. Tag the merge point

```bash
# Get the commit date of HEAD
git log -1 --format="%ci"   # e.g. 2026-03-25

# Create annotated tag
git tag -a upstream-sync-YYYY-MM-DD -m "Upstream sync: merge upstream twentyhq/twenty into fork at <short-hash>"
git push origin upstream-sync-YYYY-MM-DD
```

#### 2. Gather data

```bash
PREV=upstream-sync-YYYY-MM-DD   # previous tag
CURR=upstream-sync-YYYY-MM-DD   # new tag

# Overview
git log $PREV..$CURR --oneline --no-merges                     # all commits
git diff --stat $PREV..$CURR                                   # diff stat summary
git shortlog -sn --no-merges $PREV..$CURR                      # contributors

# Per-package breakdown
git log $PREV..$CURR --no-merges --format="%h %s" -- packages/twenty-server/
git log $PREV..$CURR --no-merges --format="%h %s" -- packages/twenty-front/
# ... repeat for each package

# Categorized commits
git log $PREV..$CURR --no-merges --grep="fix" --format="%h %s"
git log $PREV..$CURR --no-merges --grep="feat" --format="%h %s"
git log $PREV..$CURR --no-merges --grep="security\|XSS\|auth\|OAuth" -i --format="%h %s"
git log $PREV..$CURR --no-merges --grep="breaking\|BREAKING" -i --format="%h %s"

# Migrations
git diff --diff-filter=A --name-only $PREV..$CURR -- packages/twenty-server/src/database/typeorm/core/migrations/

# Changed files (for detail file)
git diff --name-status $PREV..$CURR > .upstream-merges/YYYY-MM-DD-changed-files.raw
```

#### 3. Write the entry

Each merge entry **must** include these sections in order:

1. **Summary table** — merge commit, tags, stats (files, insertions, deletions)
2. **Contributors** — commit count per author
3. **Security** — any security-related fixes (even if none, state "No security changes")
4. **Database Migrations** — new migration files with description, run command
5. **Features** — grouped by theme, with commit hashes and descriptions
6. **Bug Fixes** — categorized (data integrity, UI/UX, backend, metadata, etc.)
7. **Refactoring** — structural changes, renames, performance
8. **Infrastructure & DevOps** — CI/CD, Docker, Helm, tooling
9. **i18n / Translations** — summary count (don't list each i18n commit)
10. **Packages Affected** — table with package name, commit count, key changes
11. **Post-merge Checklist** — actionable items with checkboxes
12. **Changed Files** — reference to detail file + inline summary counts

#### 4. Generate the changed files detail

Store in `.upstream-merges/YYYY-MM-DD-changed-files.md` with format:

```
| Status | Path |
|--------|------|
| A | `path/to/new-file.ts` |
| M | `path/to/modified-file.ts` |
| D | `path/to/deleted-file.ts` |
| R | `old/path.ts` → `new/path.ts` |
```

### Status codes

| Code | Meaning |
|------|---------|
| A | Added (new file) |
| M | Modified |
| D | Deleted |
| R | Renamed (may include similarity %) |
| C | Copied |
| T | Type changed |

### Rules

- **One tag per merge** — tag name format: `upstream-sync-YYYY-MM-DD` (use commit date, not current date)
- **Newest first** — latest merge at the top, below Guidelines section
- **Changed files in separate file** — too large for inline, store in `.upstream-merges/`
- **Group features by theme** — don't just list commits, explain what changed and why it matters
- **Always note breaking changes** — even if upstream doesn't flag them, check for schema changes, renamed exports, removed APIs
- **Checklist is actionable** — only list steps that actually need to be done for this specific merge
- **Don't list i18n commits individually** — summarize as "N commits from automated pipeline"

---

## 2026-03-25 — upstream-sync-2026-03-25

| Item | Value |
|------|-------|
| **Merge commit** | `03e1ee9f96` |
| **Previous tag** | `upstream-sync-2026-03-21` (`7c1372bb8a`) |
| **New tag** | `upstream-sync-2026-03-25` (`03e1ee9f96`) |
| **Total commits** | 90 (89 non-merge + 1 merge) |
| **Files changed** | 1,807 |
| **Insertions** | +76,491 |
| **Deletions** | −28,139 |
| **TS/TSX files changed** | 1,589 (+36,700 / −17,743) |
| **New TS/TSX files** | 324 |
| **Deleted TS/TSX files** | 59 |

### Contributors

| Commits | Author |
|---------|--------|
| 23 | github-actions[bot] (i18n automation) |
| 11 | Charles Bochet |
| 11 | Félix Malfait |
| 8 | Abdul Rahman |
| 6 | martmull |
| 5 | Baptiste Devessier |
| 4 | Raphaël Bosi |
| 4 | Thomas Trompette |
| 3 | neo773 |
| 2 | Etienne |
| 2 | Lucas Bordeau |
| 2 | oniani1 |
| 1 | Arun, BugIsGod, Lukas Huppertz, Paul Rastoin, Samuel Arbibe, Thomas des Francs, lasagna, nitin |

---

### Security

| Commit | Description | Impact |
|--------|-------------|--------|
| `6f4f7a1198` | Add security headers to file serving endpoints to prevent stored XSS (#18857) | **High** — fixes stored XSS vulnerability in file upload/serve flow. Adds `Content-Security-Policy`, `X-Content-Type-Options` headers. |
| `cd651f57cb` | Prevent blank subdomain from being saved (#18812) | **Medium** — validates subdomain input server-side to prevent empty/blank values. |
| `1a0588d233` | Auto-retry Microsoft OAuth on AADSTS650051 race condition (#18405) | **Medium** — handles OAuth token race condition that could cause auth failures. |

---

### Database Migrations (7 new)

Must be run in order after pulling this merge:

```bash
npx nx run twenty-server:database:migrate:prod
```

| Migration | Description | Commit |
|-----------|-------------|--------|
| `1773000000000-add-is-sdk-layer-stale-to-application` | Adds `isSdkLayerStale` column to application table for SDK client provisioning | `4ea2e32366` |
| `1773100000000-add-uses-sdk-client-to-front-component` | Adds `usesSdkClient` column to front component table | `4ea2e32366` |
| `1773900000000-migrate-model-ids-to-composite-format` | Migrates AI model IDs from simple strings to composite `provider:model` format | `908aefe7c1` |
| `1774000000000-split-ai-providers-config` | Splits AI providers config from workspace into dedicated table | `908aefe7c1` |
| `1774072000000-addRecordTableWidgetType` | Adds `RECORD_TABLE` to widget type enum for dashboard record table widgets | `96f3ff0e90` |
| `1774100000000-drop-workspace-ai-columns` | Drops legacy AI-related columns from workspace table (cleanup after split) | `908aefe7c1` |
| `1774363913813-convert-engine-component-key-to-varchar` | Converts engine component key column from enum to varchar for flexibility | `49afe5dbc4` |

Also modified existing migration:
- `AddFastAndSmartModelsToWorkspace` — minor fix for agent.modelId NOT NULL violation (`49af539032`)

---

### Features

#### Dashboard — Record Table Widget (#18747, #18808, #18801)
- `96f3ff0e90` Add record table widget to dashboards
- `be89ef30cd` Migrate field widgets to backend
- `e9aa6f47e5` Allow users to create Fields and Field widget
- `07a4cf2d26` Ensure command backfills all relations as Field widget
- `8eff9efab2` Fix rich text widget edition

Users can now add **record table widgets** to dashboards, displaying filterable/sortable record lists inline. Field widgets have been migrated from frontend-only to backend-persisted.

#### AI Model Catalog & Providers (#18818, #18854, #18855, #18885, #18845)
- `908aefe7c1` Replace hardcoded AI model constants with JSON seed catalog
- `b813d64324` Sync AI model catalog from models.dev
- `fd044ba9a2` Sync AI model catalog from models.dev (follow-up)
- `630f3a0fd7` Trigger automerge for AI catalog sync PRs
- `c9ca4dfa14` Run AI catalog sync as standalone script to avoid DB dependency
- `bb9e3c44a1` Show AI provider sections regardless of billing status
- `e0b36c3931` Fix AI providers JSON formatting
- `fc9723949b` Fix AI chat re-renders and refactored code
- `493830204a` Fix new chat button stacking side panel and auto-focus editor

AI model configuration is now driven by a **JSON seed catalog** (synced from models.dev) instead of hardcoded constants. AI provider settings are visible regardless of billing plan.

#### Billing Usage Analytics (#18592)
- `77d4bd9158` Add billing usage analytics dashboard with ClickHouse integration

New analytics dashboard using **ClickHouse** for billing usage data visualization.

#### Navigation System Overhaul (#18882, #18879, #18872, #18789, #18867, #18859, #18862)
- `37640521d5` Batch create, update, and delete navigation menu items
- `27c0ca975f` Fix navigation "add before/after" insertion index
- `4a099ed097` Use side panel sub-pages for add-to-folder flow
- `c1ec5567ce` Fix insert-before folder for workspace DnD and add-to-nav drags
- `b642d1b114` Animate sidebar when opening/closing elements in "opened" section
- `24055527c8` Rename "New sidebar item" to "New menu item"
- `766f956a15` Set system object icon colors to gray in New menu item flows
- `ec459d8dc8` Fix cropped view/link overlay icons in collapsed navigation sidebar
- `1cfdd2e8ed` Update BackfillCommandMenuItemsCommand with workflow backfill
- `cac92bffe3` Refactor backfill-command-menu-items to use single validateBuildAndRun call

Navigation menu items now support **batch operations** (create/update/delete in one call). Sidebar animation, DnD, folder insertion, and icon rendering all improved.

#### Command Menu & Workflows (#18908, #18746, #18848)
- `49afe5dbc4` Unify command menu item execution
- `c107d804d2` Create command menu items for workflows with manual trigger
- `1cfdd2e8ed` Update BackfillCommandMenuItemsCommand with workflow backfill

Workflows with manual triggers now appear in the **command menu** (Cmd+K). Command menu execution logic unified into single code path.

#### SSO & Auth (#18825, #18927)
- `9a306ddb9a` Store SSO connections as connected accounts during sign-in
- `d5b41b2801` Unify auth context → role permission config resolution into single pure utility

SSO connections are now persisted as **connected accounts**, enabling better integration tracking.

#### Email Workflow Enhancement (#18641)
- `8ef32c4781` Add `In-Reply-To` header to Email Workflow Node

Email workflow nodes now support `In-Reply-To` header for proper email threading.

#### SDK Client Refactoring (#18544, #18933)
- `4ea2e32366` Refactor twenty client SDK provisioning for logic function and front-component
- `98c21f958a` Add twenty-sdk-client to deployed packages unique version check

New `twenty-client-sdk` package added to workspace. SDK provisioning refactored for logic functions and front components.

**Root `package.json` change:**
```diff
+      "packages/twenty-client-sdk",
```

---

### Bug Fixes

#### Data Integrity
| Commit | Fix |
|--------|-----|
| `cec23e89fa` | Fix batch update optimistic and prevent accidental mass-update (#17213) — prevents silent mass-update when filter returns all records |
| `7b6fb52df7` | Validate blocknote JSON in rich text fields (#18902) — rejects malformed JSON before save |
| `708e53d829` | Fix multi-select option removal crashing when records contain removed values (#18871) |
| `d69e4d7008` | Prevent FIND_RECORDS from silently dropping unresolved filter variables (#18814) |
| `7a1780e415` | Fix duplicate views creation in command (#18900) |

#### UI/UX
| Commit | Fix |
|--------|-----|
| `03a2abb305` | Board view loads all records instead of showing skeleton placeholders (#18824) |
| `bdaff0b7e2` | Fetch load more on group by (#18811) |
| `4c6e102493` | Display found items after full items loaded (#18914) |
| `2317a701bd` | Fix double arrow (#18916) |
| `e2c85b5af0` | Fix workspace dropdown truncation and center auth titles (#18869) |
| `c6d4162b73` | Fix background color selected row + border bottom settings tab (#18870) |
| `dc00701448` | Fix TypeError: Cannot convert undefined or null to object (#18333) |
| `d16b94bde6` | Reset form defaultValues after save to fix dirty detection (#18835) |

#### Backend / Engine
| Commit | Fix |
|--------|-----|
| `d3c7b0131d` | Fix lambda driver (#18907) |
| `49af539032` | Fix migration crash: agent.modelId NOT NULL violation (#18844) |
| `c94aa7316a` | Send X-Schema-Version header when metadataVersion is 0 (#18924) |

#### Metadata & State
| Commit | Fix |
|--------|-----|
| `611947e031` | Fix metadata store lifecycle during sign-in, sign-out, and locale change (#18901) |
| `96c5728ed0` | Prevent localStorage bloat from derived fields on mock metadata (#18809) |
| `246afe0f2a` | Skip chat messages query when thread ID is the unknown-thread default (#18828) |

---

### Refactoring

| Commit | Description |
|--------|-------------|
| `d5a7dec117` | Rename `ObjectMetadataItem` → `EnrichedObjectMetadataItem` and clean up metadata flows (#18830) |
| `7bde8a4dfa` | Migration to dynamic view names for standard views (#18701) |
| `56ea79d98c` | Performance investigation — time GraphQL query (#18911) |
| `69fe6fcadd` | Add explicit return type to `getBackgroundColor` (#18878) |

---

### Infrastructure & DevOps

#### Helm Chart (#18157, #18836)
- `9d613dc19d` Improve helm chart — fix linting, add Redis externalSecret, additional ENVs, improve migrations
- `e95adcc757` Add unit tests, extraEnv schema validation, and minor fixes

#### Docker (#18856, #18852)
- `dd84ab25df` Optimize app-dev Docker image and add CI test
- `cc2be505c0` Fix twenty app dev image

#### CI/CD (#18877, #18921, #18850)
- `0ded15b363` Add visual regression CI for twenty-ui
- `d9eef5f351` Fix visual regression dispatch for fork PRs
- `2dfa742543` Improve i18n workflow to prevent stale compiled translations

---

### i18n / Translations

28 commits from `github-actions[bot]` automated translation pipeline:
- ~15 frontend translation updates (`i18n - translations`)
- ~13 docs translation updates (`i18n - docs translations`)

---

### Packages Affected

| Package | Commits | Key changes |
|---------|---------|-------------|
| `twenty-front` | 55 | Dashboard widgets, navigation overhaul, AI chat fixes, metadata refactoring |
| `twenty-server` | 37 | Migrations, SDK provisioning, security headers, billing analytics, AI catalog |
| `twenty-shared` | 11 | Widget types, SDK types, billing analytics types, AI model catalog |
| `twenty-ui` | 3 | Background color return type, field widget UI, AI model icons |
| `twenty-docker` | 4 | Docker image optimization, helm chart improvements |
| `twenty-apps` | 2 | SDK provisioning refactor, dev image fix |
| `twenty-emails` | 1 | i18n workflow fix |
| `create-twenty-app` | 1 | SDK provisioning refactor |
| `.github/` | 9 | Visual regression CI, AI catalog sync, i18n workflow |

---

### Post-merge Checklist

- [ ] Run database migrations: `npx nx run twenty-server:database:migrate:prod`
- [ ] Rebuild twenty-shared: `npx nx build twenty-shared`
- [ ] Regenerate GraphQL types: `npx nx run twenty-front:graphql:generate`
- [ ] Run `yarn install` to update dependencies (new `twenty-client-sdk` package)
- [ ] Check vi translation changes needed: `npx tsx packages/twenty-docs/scripts/detect-vi-changes.ts`
- [ ] Verify AI provider settings if using self-hosted AI features
- [ ] Review helm chart values if deploying via Kubernetes

---

### Changed Files

**Total: 1,807 files** — A: 368 | M: 1,274 | D: 60 | R: 105

Full file list: [`.upstream-merges/2026-03-25-changed-files.md`](.upstream-merges/2026-03-25-changed-files.md)

| Status | Count | Scope |
|--------|-------|-------|
| A (Added) | 368 | New migrations, SDK client package, visual regression CI, AI catalog, i18n translations |
| M (Modified) | 1,274 | Frontend modules, server engine, shared types, CI workflows, helm chart, Docker |
| D (Deleted) | 60 | Removed legacy AI constants, deprecated components, old test files |
| R (Renamed) | 105 | `ObjectMetadataItem` → `EnrichedObjectMetadataItem` refactoring, file reorganization |

*Compare full diff: `git diff upstream-sync-2026-03-21..upstream-sync-2026-03-25`*
