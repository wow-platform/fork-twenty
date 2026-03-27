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
