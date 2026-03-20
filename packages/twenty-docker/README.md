# Twenty Docker

Docker configurations for running Twenty CRM services.

## Compose Files

| File | Description | Services |
|------|-------------|----------|
| `docker-compose.yml` | Production stack | server, worker, db, redis |
| `docker-compose.dev.yml` | Development infrastructure | db, redis |
| `docker-compose.docs.yml` | Documentation site (Mintlify) | docs |

## Quick Start

All commands run from `packages/twenty-docker/`.

### Production

```bash
# Start full production stack
docker compose up -d

# Stop
docker compose down

# Stop and wipe all data
docker compose down -v
```

### Development Infrastructure

```bash
# Start Postgres + Redis for local development
docker compose -f docker-compose.dev.yml up -d

# Stop
docker compose -f docker-compose.dev.yml down

# Stop and wipe data
docker compose -f docker-compose.dev.yml down -v
```

### Documentation Site

```bash
# Build and start
docker compose -f docker-compose.docs.yml up -d --build

# Rebuild from scratch (no cache)
docker compose -f docker-compose.docs.yml build --no-cache
docker compose -f docker-compose.docs.yml up -d

# View logs
docker compose -f docker-compose.docs.yml logs -f

# Stop
docker compose -f docker-compose.docs.yml down
```

The docs site is available at `http://localhost:3900` by default. Change the port with:

```bash
DOCS_PORT=4000 docker compose -f docker-compose.docs.yml up -d --build
```

## Dockerfiles

| Path | Description |
|------|-------------|
| `twenty/Dockerfile` | Main app (server + frontend) |
| `twenty-app-dev/Dockerfile` | Development container |
| `twenty-docs/Dockerfile` | Documentation site |
| `twenty-website/Dockerfile` | Marketing website |
| `twenty-postgres-spilo/Dockerfile` | Custom PostgreSQL |

## Makefile

For image building without Compose:

```bash
# Build production image
make prod-build

# Build with custom platform/tag
make PLATFORM=linux/aarch64 TAG=v1.0 prod-build

# Run local Postgres
make postgres-on-docker

# Run local Redis
make redis-on-docker
```

## Environment Variables

### Production (`docker-compose.yml`)

| Variable | Default | Description |
|----------|---------|-------------|
| `TAG` | `latest` | Docker image tag |
| `SERVER_URL` | - | Public server URL |
| `APP_SECRET` | `replace_me_with_a_random_string` | Application secret |
| `PG_DATABASE_USER` | `postgres` | Database user |
| `PG_DATABASE_PASSWORD` | `postgres` | Database password |
| `REDIS_URL` | `redis://redis:6379` | Redis connection URL |

### Documentation (`docker-compose.docs.yml`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DOCS_PORT` | `3900` | Host port for docs site |
