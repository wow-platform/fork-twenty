# UPSTREAM-SYNC.md

Upstream merge changelog for [wow-platform/fork-twenty](https://github.com/wow-platform/fork-twenty) ← [twentyhq/twenty](https://github.com/twentyhq/twenty).

This file tracks every merge from upstream Twenty into this fork. Entries are ordered **newest first**.

---

## Workflow

### Syncing upstream → fork-twenty

```bash
# 1. Sync via GitHub UI
#    → github.com/wow-platform/fork-twenty → "Sync fork" → "Update branch"
#
# Or via CLI:
git fetch upstream
git merge upstream/main
git push origin main

# 2. Tag the merge point
git tag -a upstream-sync-YYYY-MM-DD -m "Upstream sync: SUMMARY"
git push origin upstream-sync-YYYY-MM-DD

# 3. Add entry to this file (see template below)
# 4. Commit and push
```

### After syncing: notify rebatefx

```bash
# In rebatefx repo:
git fetch upstream   # upstream = fork-twenty
git merge upstream/main
# Follow rebatefx/UPSTREAM.md merge workflow
```

### Entry template

Each merge entry **must** include:

1. **Summary table** — merge commit, tags, stats
2. **Security** — security-related fixes (even if none)
3. **Database Migrations** — new migration files, run command
4. **Features** — grouped by theme
5. **Bug Fixes** — categorized
6. **Refactoring** — renames, structural changes
7. **Infrastructure** — CI/CD, Docker, Helm
8. **i18n** — summary count
9. **Post-merge Checklist** — actionable items

### Data gathering commands

```bash
PREV=upstream-sync-YYYY-MM-DD   # previous tag
CURR=upstream-sync-YYYY-MM-DD   # new tag

git log $PREV..$CURR --oneline --no-merges
git diff --stat $PREV..$CURR
git shortlog -sn --no-merges $PREV..$CURR
git diff --diff-filter=A --name-only $PREV..$CURR -- packages/twenty-server/src/database/typeorm/core/migrations/
```

> Changed file lists are NOT committed — use `git diff --name-status $PREV..$CURR` to regenerate anytime.

---

## 2026-03-27 — upstream-sync-2026-03-27-v1.19.11

| Item | Value |
|------|-------|
| **Upstream tag** | `v1.19.11` |
| **Merge commit** | `cf69e05759` |
| **Upstream HEAD** | `7f1814805d` — Fix backfill record page layout command (#19043) |
| **Previous tag** | `upstream-sync-2026-03-27` (`16acf6ae58`) |
| **New tag** | `upstream-sync-2026-03-27-v1.19.11` |
| **Total commits** | 18 (17 non-merge + 1 merge) |
| **Files changed** | 472 |
| **New files (A)** | 199 |
| **Modified (M)** | 256 |
| **Deleted (D)** | 9 |
| **Renamed (R)** | 8 |
| **Insertions** | +14,368 |
| **Deletions** | -2,966 |
| **Contributors** | 12 |

### Security

| Commit | Description | Impact |
|--------|-------------|--------|
| `08077476f3` | Remove remaining direct cookie writes that make tokenPair a session cookie on renewal (#19031) | **Medium** — session token persisted as session cookie instead of expiring properly |
| `5efe69f8d3` | Migrate field permission to syncable entity (#18751) | **Low** — permission model hardened, now syncable across workspaces |
| `281bb6d783` | Guard `yarn database:migrate:prod` (#19008) | **Low** — prevents accidental migration in non-prod environments |

### Database Migrations (2 new + 1 util)

```bash
npx nx run twenty-server:database:migrate:prod
```

| Migration | Description |
|-----------|-------------|
| `1773400000000-add-universal-identifier-and-application-id-to-field-permission` | Add `universalIdentifier` and `applicationId` columns to field permission table |
| `1773400000001-make-field-permission-universal-identifier-and-application-id-not-null` | Make those new columns NOT NULL |
| `1773400000000-make-field-permission-universal-identifier-and-application-id-not-null.util` | Shared util for the migration |

### Features

**New Twenty Website** (#19035)
- First PR introducing `twenty-website-new` package (144 new files)
- Next.js-based redesign with new hero, problem statement, three-cards feature sections
- New images, theme system (colors, spacing, radius, typography)
- Separate from existing `twenty-website` — runs in parallel during transition

**Workspace Management** (#19036)
- Enforce workspace count limit for multi-workspace setups

**Workflow** (#18909)
- Seed company workflow for email upserts — automated company creation from incoming emails

**Field Permissions** (#18751)
- Field permissions migrated to syncable entity pattern
- Adds `universalIdentifier` and `applicationId` to field permissions
- Enables cross-workspace permission synchronization

### Bug Fixes

| Category | Commit | Description |
|----------|--------|-------------|
| Auth/Cookie | `08077476f3` | Remove direct cookie writes that cause session cookie on token renewal (#19031) |
| Data integrity | `c2b058a6a7` | Use workspace-generated id for core dual-write in message folder save (#19038) |
| Data integrity | `6f0ac88e20` | Batch viewGroup mutations sequentially to prevent race conditions (#19027) |
| File handling | `68f5e70ade` | Sign file URLs in timeline + fix file loss on click outside (#19001) |
| Backfill | `7f1814805d` | Fix backfill record page layout command (#19043) |
| Backfill | `fb21f3ccf5` | Resolve availabilityObjectMetadataUniversalIdentifier in backfill (#19041) |
| Feature gate | `17424320e3` | Gate command-menu-items query behind feature flag (#19029) |

### Refactoring

| Commit | Description |
|--------|-------------|
| `56056b885d` | Remove `@hello-pangea/dnd` from navigation-menu-item module (#19033) — lighter dependency tree |
| `db9da3194f` | Refactor client auto heal (#19032) — cleaner reconnection logic |

### Infrastructure

**CI/CD:**
- Guard `yarn database:migrate:prod` — safety check before running migrations (#19008)

**Docker:**
- Migration guard also applied to Docker entrypoint scripts (#19008)

**AI Catalog:**
- Sync AI model catalog from models.dev (#19028)

### i18n

3 automated translation commits (#19046, #19040, and locale files).

### Packages Affected

| Package | Files | Key changes |
|---------|-------|-------------|
| `twenty-server` | ~80 | Field permission migration, workspace limit, migration guard, backfill fixes, email upsert workflow |
| `twenty-front` | ~75 | Permission sync, DnD removal, cookie fix, file URL signing, feature gating |
| `twenty-website-new` | 144 (all new) | Entirely new Next.js website package |
| `twenty-shared` | ~5 | Field permission types, backfill command types |
| `twenty-docker` | ~3 | Dockerfile cleanup, migration guard in entrypoint |
| `.github` | 1 | CI breaking changes workflow update |

### Post-merge Checklist

- [ ] `yarn install` (new `twenty-website-new` workspace)
- [ ] Run database migrations: `npx nx run twenty-server:database:migrate:prod`
- [ ] Rebuild twenty-shared: `npx nx build twenty-shared`
- [ ] Verify field permissions after migration (universalIdentifier NOT NULL)
- [ ] Test file URL signing in timeline views
- [ ] Check workspace count limit if running multi-workspace

*Full diff: `git diff upstream-sync-2026-03-27..upstream-sync-2026-03-27-v1.19.11`*

---

## 2026-03-27 — upstream-sync-2026-03-27

| Item | Value |
|------|-------|
| **Merge commit** | `16acf6ae58` |
| **Previous tag** | `upstream-sync-2026-03-25` (`03e1ee9f96`) |
| **New tag** | `upstream-sync-2026-03-27` |
| **Total commits** | 73 (71 non-merge + 2 merge) |
| **Files changed** | 577 |
| **Insertions** | +157,158 |
| **Deletions** | -58,418 |

### Security

| Commit | Description | Impact |
|--------|-------------|--------|
| `2e015ee68d` | Add missing row-level permission check on Kanban view (#19002) | **Medium** — unauthorized read in board view |
| `7a341c6475` | Support authType on AI providers for IAM role authentication (#19016) | **Low** — new auth method, no regression |
| `bf22373315` | Use user role for OAuth tokens bearing user context (#18954) | **Medium** — correct role resolution |
| `e1374e34a7` | Fix object permission override (#18948) | **Medium** — permission bypass |

### Database Migrations

No new core migration files. One existing migration modified:
- `1773900000000-migrate-model-ids-to-composite-format.ts` — minor fix

### Features

**AI Provider Enhancements** (#19016, #18876, #18874, #18999, #19003)
- IAM role authentication support for AI providers (`authType` field)
- Settings search refactored to use SearchInput, Skills tab restructured
- AI chat composer UI matched to Figma designs
- Navigation panel scroll refactor + non-chat placeholder

**Dashboard & Widgets** (#18960, #19017, #18965)
- Record table widget feature flag added
- Rich text widget fix (again)
- Dashboard widget edit mode content fix
- Handle dashboard filters referencing deleted fields (#18512)

**Workflow** (#18906, #19015)
- Workflow objects now searchable
- Fix: cannot create two workflow agent nodes with same name

**Navigation & Layout** (#18764, #18940, #19004, #18961)
- Add command menu item to layout customization
- Clear navbar edit selection when closing side panel
- Combine and clean upgrade commands for record page layouts
- Use record page layouts in merge records feature

**SDK** (#18963, #19010, #19006, #19000)
- Refactor dependency graph for SDK, client-sdk and create-app
- twenty-ui/display selective re-export to avoid bloating icons
- Add error message if relationType is missing
- Bump prerelease version sdk, sdk-client, create-twenty-app

**S3 & File Downloads** (#18864)
- S3 presigned URL redirect for file downloads

**Form & Record Picker** (#18979, #18912)
- Multiselect option in form step
- Object type filter dropdown in side panel record searches

### Bug Fixes

| Category | Commits | Key fixes |
|----------|---------|-----------|
| Board/Kanban | 3 | Drag-and-drop (#19005), no-value column fetch (#18977), row-level permission (#19002) |
| Dashboard | 3 | Widget edit mode (#18965), deleted field filters (#18512), rich text (#19017) |
| Navigation | 4 | Menu item overflow (#18937), folder visibility (#18992, #18993), side panel clear (#18940) |
| Records | 3 | Create with filters (#18969), single record picker (#18995), format result (#18975) |
| Auth/Permissions | 4 | Object permission override (#18948), OAuth role (#18954), allow-read default (#18971), SSE impersonation (#18966) |
| UI | 3 | SVG sizing Chrome 142 (#18974), chip height (#19020), settings mobile viewport (#18991) |
| Other | 4 | Logo upload onboarding (#18905), API key empty name (#18970), channel throttle (#18843), loop iterator skip (#18964) |

### Refactoring

- Connected accounts follow up (#18998)
- Record page layout upgrade commands combined (#19004, #18962)
- Command menu items backfill split into separate migration runs (#18957)
- Migrate twenty-companion from npm to yarn workspaces (#18946)
- Cache invalidation failure no longer triggers rollback in workspace migration runner (#18947)

### Infrastructure

**Dependencies:**
- `@microsoft/microsoft-graph-types` 2.40.0 → 2.43.1
- `@ai-sdk/xai` 3.0.59 → 3.0.74
- `@linaria/core` 6.2.0 → 6.3.0

### i18n

18 automated translation commits (frontend + docs).

### Packages Affected

| Package | Files | Key changes |
|---------|-------|-------------|
| `twenty-front` | ~438 | AI chat UI, dashboard widgets, navigation, board fixes, SDK re-exports |
| `twenty-server` | ~34 | Permissions, migration runner, S3 presigned URLs, command backfill |
| `twenty-sdk` | 7 | Dependency graph refactor, selective re-exports |
| `twenty-shared` | 4 | Channel visibility constraints, auto-select model utils |
| `twenty-ui` | 3 | Animated icon crossfade, animation utilities |
| `twenty-companion` | 2 | Migrated from npm to yarn workspaces |
| `twenty-emails` | 2 | i18n updates |
| `create-twenty-app` | 3 | SDK dependency refactor |

### Post-merge Checklist

- [ ] `yarn install` (twenty-companion workspace migration)
- [ ] Rebuild twenty-shared: `npx nx build twenty-shared`
- [ ] Check vi translation changes: `npx tsx packages/twenty-docs/scripts/detect-vi-changes.ts`
- [ ] Verify AI provider settings if using IAM auth
- [ ] Test Kanban view with restricted roles (permission fix)

*Full diff: `git diff upstream-sync-2026-03-25..upstream-sync-2026-03-27`*

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
| **Deletions** | -28,139 |

### Security

| Commit | Description | Impact |
|--------|-------------|--------|
| `6f4f7a1198` | Add security headers to file serving endpoints to prevent stored XSS (#18857) | **High** |
| `cd651f57cb` | Prevent blank subdomain from being saved (#18812) | **Medium** |
| `1a0588d233` | Auto-retry Microsoft OAuth on AADSTS650051 race condition (#18405) | **Medium** |

### Database Migrations (7 new)

```bash
npx nx run twenty-server:database:migrate:prod
```

| Migration | Description |
|-----------|-------------|
| `add-is-sdk-layer-stale-to-application` | `isSdkLayerStale` column for SDK client provisioning |
| `add-uses-sdk-client-to-front-component` | `usesSdkClient` column for front components |
| `migrate-model-ids-to-composite-format` | AI model IDs → `provider:model` composite format |
| `split-ai-providers-config` | AI providers config → dedicated table |
| `addRecordTableWidgetType` | `RECORD_TABLE` widget type for dashboards |
| `drop-workspace-ai-columns` | Drop legacy AI columns after split |
| `convert-engine-component-key-to-varchar` | Engine component key enum → varchar |

### Features

**Dashboard Record Table Widget** (#18747, #18808, #18801)
- Record table widgets on dashboards, field widgets migrated to backend

**AI Model Catalog** (#18818, #18854, #18845)
- JSON seed catalog (synced from models.dev) replaces hardcoded constants
- AI provider settings visible regardless of billing plan

**Billing Usage Analytics** (#18592)
- ClickHouse integration for billing usage dashboard

**Navigation Overhaul** (#18882, #18879, #18872, #18867)
- Batch create/update/delete navigation menu items
- Sidebar animations, DnD fixes, folder insertion fixes

**Command Menu & Workflows** (#18908, #18746)
- Workflows with manual triggers in command menu (Cmd+K)

**SSO Connected Accounts** (#18825, #18927)
- SSO connections persisted as connected accounts

**Email Workflow** (#18641)
- `In-Reply-To` header for email threading

**SDK Client** (#18544, #18933)
- New `twenty-client-sdk` package, SDK provisioning refactored

### Bug Fixes

| Category | Commits | Key fixes |
|----------|---------|-----------|
| Data integrity | 5 | Batch update mass-update prevention, blocknote JSON validation, multi-select crash |
| UI/UX | 8 | Board skeleton placeholders, workspace dropdown truncation, form dirty detection |
| Backend | 3 | Lambda driver, migration crash, X-Schema-Version header |
| Metadata | 3 | Metadata store lifecycle fix, localStorage bloat prevention |

### Refactoring

- `ObjectMetadataItem` → `EnrichedObjectMetadataItem` rename (#18830)
- Dynamic view names for standard views (#18701)

### Infrastructure

- Helm chart improvements + Redis externalSecret (#18157, #18836)
- Docker app-dev image optimization (#18856, #18852)
- Visual regression CI for twenty-ui (#18877)

### i18n

28 automated translation commits (15 frontend + 13 docs).

### Post-merge Checklist

- [ ] Run database migrations
- [ ] `yarn install` (new `twenty-client-sdk` package)
- [ ] Rebuild twenty-shared
- [ ] Regenerate GraphQL types
- [ ] Check vi translation changes

*Full diff: `git diff upstream-sync-2026-03-21..upstream-sync-2026-03-25`*
