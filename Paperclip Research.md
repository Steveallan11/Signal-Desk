# Paperclip Repository Deep Research Report

## Executive summary

Paperclip is an open-source “control plane” for running teams of AI agents as an organisation: you define goals, “hire” agents, govern risky actions via approvals, enforce budgets, and observe work through a board-style UI rather than juggling many independent agent sessions. citeturn28search0turn24search2

The repository is a TypeScript monorepo owned by entity["organization","paperclipai","github org"] on entity["company","GitHub","code hosting platform"]. It centres on a Node.js + TypeScript backend (Express REST API), a React + Vite web UI, a CLI, and shared packages for DB/schema, types, adapters, and plugins. citeturn8view2turn15view2turn16view1turn7view4

From an operator standpoint, the project optimises for “one-command local first”: if `DATABASE_URL` is not set, the server can bring up an embedded PostgreSQL and manage a persistent data dir automatically; for production you can point at a hosted Postgres and S3-compatible object storage. citeturn10view2turn10view1turn29view0

Integration is designed around agents “bringing their own runtime”: Paperclip includes an adapter abstraction (process-spawn and HTTP invocation patterns) and a task-management interface specified for MCP-style calling, plus a CLI that can act as an operator tool or a client for control-plane operations (issues, approvals, agents, activity, dashboard). citeturn15view1turn14view1turn12view3

Project activity is high as of 2026-03-31: the repo shows updates through 2026-03-30, with many open pull requests and issues and recent releases (e.g., v2026.325.0 on 2026-03-25). Counts fluctuate, but the public repo is on the order of ~41k stars and ~6.1k forks, with ~787 open PRs and ~550 open issues visible in GitHub UI snapshots. citeturn28search1turn23search4turn30view0turn23search2turn26view0turn25view2

Assumptions used in this report: OS is unspecified unless noted; examples assume a POSIX-like shell (macOS/Linux) but are generally portable; Node.js and pnpm versions follow the repo’s declared requirements; all observations are as of 2026-03-31 (Europe/London), and small metric counts (issues/PRs/stars) may change after that date. citeturn23search1turn7view1

## Repository overview and codebase map

Paperclip’s public positioning (from its README) is explicit: it is not a chatbot, not a prompt manager, not a workflow builder; it aims to model organisations (org charts, goals, budgets, governance) and orchestrate agent work at the “company” level. citeturn23search1turn28search0

A contributor-facing “repo map” is provided in `AGENTS.md`, which also sets design invariants (company scoping, atomic checkout semantics, approval gates, budget hard-stop auto-pause, and activity logging for mutations). citeturn8view2

image_group{"layout":"carousel","aspect_ratio":"16:9","query":["paperclip ai dashboard screenshot","paperclip ai org chart screenshot","paperclipai paperclip ui board"] ,"num_per_query":1}

### Core modules and responsibilities

| Area (path) | Responsibility | Key technologies / implementation clues | Primary public surface |
|---|---|---|---|
| `server/` | REST API + orchestration services; serves UI in dev (Vite middleware) and optionally in production (static build) | Express (v5), Better Auth, Drizzle ORM, embedded-postgres, WebSockets (`ws`), pino logging | HTTP JSON API under `/api`; browser UI hosting; agent heartbeat integrations citeturn8view2turn16view1turn20view1turn15view4 |
| `ui/` | Board/operator web UI | React + Vite | Browser UI calling `/api/*` citeturn8view2turn15view2 |
| `cli/` | Operator + client CLI (“paperclipai”) | Node/TS (invoked via repo script); supports onboarding/doctor/configure and control-plane commands | CLI commands that call the API or manage local instance state citeturn12view3turn7view1turn8view2 |
| `packages/db/` | DB schema + migrations + DB client creation | Drizzle schema/migrations; used by server | Tables and migrations; DB client helpers citeturn8view2turn10view1turn19view0 |
| `packages/shared/` | Shared types/constants/validators/API path constants | Shared TypeScript types and helpers | Compile-time contracts and runtime validation citeturn8view2turn15view2 |
| `packages/adapters/*` | “Bring your own agent runtime” adapters (local and gateway patterns) | Separate adapter packages: claude-local, codex-local, cursor-local, gemini-local, opencode-local, pi-local, openclaw-gateway | Adapter implementations invoked by the server/runtime citeturn17view2turn16view1turn11view2 |
| `packages/adapter-utils/` | Shared adapter utilities | Shared TS utilities | Support library for adapters citeturn8view2turn16view1 |
| `packages/plugins/*` | Plugin system packages (incl. SDK) | Plugin SDK referenced by server; server initialises a “plugin tool dispatcher” and serves plugin UI static assets | Extensibility surface (tools + UI) citeturn7view4turn16view1turn20view1 |

The monorepo structure is formalised via `pnpm-workspace.yaml`, which includes the root packages plus adapter and plugin package namespaces. citeturn7view4

## Architecture and component model

Paperclip’s architecture is documented both as “V1 build contract” material (`doc/SPEC-implementation.md`) and as concrete implementation in `server/src/index.ts`, `server/src/app.ts`, and the routes/services folders. citeturn15view2turn19view0turn20view1turn21view0turn21view1

### High-level runtime components

The spec describes an architecture with: `server/` (REST API/auth/orchestration), `ui/` (operator interface), `packages/db/` (Postgres), and `packages/shared/` (types/validators), plus explicit data stores (PostgreSQL + local/embedded option; file/object storage local_disk or S3-compatible). citeturn15view2turn10view2turn29view0

The implementation matches this: the server builds an Express app with API routes mounted at `/api`, optionally serves the UI (static dist or Vite dev middleware), starts schedulers/job systems, and initialises plugin tooling. citeturn20view1turn20view2turn19view0

```mermaid
flowchart LR
  subgraph Operator
    Browser[Board UI (React)]
    CLI[paperclipai CLI]
  end

  subgraph ControlPlane
    Server[Server (Express REST API)]
    Auth[Auth: local_trusted or Better Auth sessions]
    Jobs[Schedulers / jobs / routines]
    Plugins[Plugin loader + tool dispatcher]
    Realtime[Realtime (WebSockets/SSE)]
  end

  subgraph Data
    PG[(PostgreSQL\nembedded or external)]
    Storage[(Object storage\nlocal_disk or S3-compatible)]
    Secrets[(Secrets master key file\nlocal encrypted)]
  end

  subgraph AgentRuntimes
    ProcAdapter[Process adapter\nspawn local commands]
    HttpAdapter[HTTP adapter\ninvoke remote runtime]
    LocalCLIs[Local CLIs\n(e.g. Claude/Codex)]
    RemoteAgents[Remote agent services]
  end

  Browser -->|HTTP JSON /api| Server
  CLI -->|HTTP JSON /api| Server

  Server --> Auth
  Server --> Jobs
  Server --> Plugins
  Server --> Realtime

  Server <--> PG
  Server <--> Storage
  Server --> Secrets

  Server --> ProcAdapter
  Server --> HttpAdapter
  ProcAdapter --> LocalCLIs
  HttpAdapter --> RemoteAgents
```

This diagram reflects concrete routing and startup wiring: `server/src/index.ts` calls `loadConfig()`, prepares DB and auth (including Better Auth handler when in authenticated mode), and passes runtime options into `createApp()` to mount routes, UI mode, and services. citeturn19view0turn19view2turn20view1turn29view0

### Execution and orchestration primitives

**Company scoping as a hard invariant.** The repo explicitly requires that “every domain entity” be scoped to a company, and that company boundaries must be enforced in routes/services. citeturn8view2

**Atomic checkout semantics.** The project asserts (and tests/guards for) atomic “issue checkout” to prevent double-work. This is codified as a “control-plane invariant” in `AGENTS.md` and is part of the spec’s testing/reliability targets. citeturn8view2turn15view1

**Heartbeat-driven work.** Paperclip supports “heartbeat runs” and adapter invocation/cancel semantics. The spec defines an `AgentAdapter` interface with `invoke`, `status`, and `cancel`, and distinguishes process-based adapters (spawn child process, stream logs, SIGTERM/SIGKILL cancellation) and HTTP-based adapters. citeturn15view1turn21view3

**Routines and recurring work.** Recent releases highlight full “routines and recurring tasks” with triggers and portable routine export support, indicating scheduled, policy-driven work dispatch beyond ad-hoc task assignment. citeturn23search2

## Public APIs, key modules, and supported data model

Paperclip exposes multiple “contract surfaces”: REST endpoints under `/api`, a CLI that can operate locally or as an API client, and an MCP-oriented task interface specification for agents/external tools. citeturn15view4turn12view3turn14view1

### Server modules and route groups

The server’s `createApp()` function configures JSON parsing (including raw-body capture) and mounts route modules under `/api`, applying middleware such as actor resolution and board mutation guards. citeturn20view1turn20view2

The `server/src/routes` directory includes route modules for access control, activity, agents, approvals, assets, companies, costs, dashboard, execution workspaces, goals, issues, LLMs, and health. citeturn21view0

A load-bearing example is `healthRoutes`, which returns version and deployment mode/exposure, auth readiness, bootstrap state for authenticated deployments, and feature flags such as `companyDeletionEnabled`. citeturn22view0

### REST API surface (representative)

The spec states that all endpoints are under `/api` and return JSON, and provides a canonical error semantics palette (`400/401/403/404/409/422/500`). citeturn15view4turn15view1

From the spec’s API contract excerpt, agent endpoints include, for example: `GET /companies/:companyId/agents`, `POST /companies/:companyId/agents`, `GET /agents/:agentId`, `PATCH /agents/:agentId`, and heartbeat invocations under `POST /agents/:agentId/heartbeat/invoke`. citeturn15view4

The concrete routing setup in `server/src/app.ts` mounts: `/api/health`, `/api/companies`, “company skills”, `/api/agents`, assets, and projects (and, by implication given the route files, most other control-plane aspects). citeturn20view2turn21view0

### CLI public interface

The CLI reference describes two broad classes of commands:

* **Instance setup/diagnostics**: `onboard`, `doctor`, `configure`, `env`, and hostname allowlisting for authenticated/private deployments. citeturn12view3turn9view0  
* **Control-plane client operations**: commands for `company`, `issue`, `agent`, `approval`, `activity`, `dashboard`, and more, with consistent options like `--api-base`, `--api-key`, `--context`, `--profile`, and `--json`. citeturn12view3turn12view1

The CLI supports “context profiles” stored in `~/.paperclip/context.json` and can be configured to keep API keys in environment variables (via `apiKeyEnvVarName`) rather than writing secrets into a context file. citeturn12view3turn29view0

### MCP task interface contract

`doc/TASKS-mcp.md` defines “function contracts” for the task management system via MCP, and explicitly states: all operations return JSON; IDs are UUIDs; timestamps are ISO 8601; and human-readable issue identifiers (e.g., `ENG-123`) are accepted anywhere an issue UUID is expected. citeturn14view1turn13view2

The contract includes operations like `list_issues` with robust filtering (team, status/stateType category, assignee, project, labels, priority), plus pagination parameters (`limit`, `after`, `before`). citeturn14view1turn14view3

### Supported data models and formats

Paperclip models issues/tasks, teams, workflow states, projects, milestones, labels, issue relations/dependencies, comments, and initiatives (higher-level planning constructs). Workflow state is team-specific and category-based rather than a flat enum, and priority is an intentionally small fixed numeric scale (0–4). citeturn13view0turn14view1

Issue descriptions support text/markdown. citeturn13view0

| Domain area | Format/encoding | Evidence |
|---|---|---|
| API payloads | JSON | REST spec and MCP interface both describe JSON responses; server mounts JSON parsing for the app. citeturn15view4turn14view1turn20view1 |
| Identifiers | UUIDs plus human-readable `{TEAM_KEY}-{NUMBER}` identifiers | TASKS + MCP contract. citeturn13view2turn14view1 |
| Timestamps | ISO 8601 | MCP contract. citeturn14view1 |
| Rich text fields | Markdown (at least for issue/description) | TASKS data model. citeturn13view0 |
| Configuration | JSON config file + `.env` | Server config loader reads config file and loads dotenv from a Paperclip env path and CWD `.env`. citeturn29view0turn12view1 |
| Database | PostgreSQL (embedded or external), schema via Drizzle | DATABASE doc + server code imports DB utilities. citeturn10view1turn10view2turn19view0 |
| Object/file storage | `local_disk` directory or S3-compatible storage | CLI storage provider list + server config fields for S3/local disk. citeturn12view1turn29view0turn15view2 |
| Company portability packages | “Portable company templates” with import/export UX, frontmatter preview, merge-history support, GitHub shorthand refs; CLI `company import/export` | Release notes highlight. citeturn23search2turn20view1 |

## Installation, deployment, and configuration

### Runtime requirements

The README states “Requirements: Node.js 20+, pnpm 9.15+”. The repository also declares `node >=20` in the root `package.json` engines. citeturn23search1turn7view1

OS requirements are not stated globally; Docker examples imply a typical Linux container runtime works, and local dev instructions assume a standard Node toolchain. citeturn11view2turn8view2

### Installation and local development commands

Paperclip supports both a packaged onboarding path and a developer “clone + dev” path.

```bash
# One-command onboarding (self-hosted)
npx paperclipai onboard --yes
```

This is the documented “Quickstart” for users who want a local instance without a manual repo clone. citeturn23search1turn11view3

```bash
# Manual dev setup
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm dev
```

This starts the API server at `http://localhost:3100`, with an embedded PostgreSQL created automatically when `DATABASE_URL` is not set. citeturn23search1turn10view2turn8view2

The repo’s `package.json` exposes common dev/test scripts, including `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm test:run` (Vitest), and multiple Playwright-based suites (`test:e2e`, `test:release-smoke`). citeturn7view1

### Database modes and persistence

Paperclip uses PostgreSQL via Drizzle ORM, with three modes:

* Embedded Postgres (zero config): if `DATABASE_URL` is unset, the server auto-creates storage under `~/.paperclip/instances/default/db/`, ensures a `paperclip` DB exists, and auto-runs migrations for empty DBs. citeturn10view2turn19view2  
* Local Docker Postgres: the docs describe an included compose setup that starts PostgreSQL 17 on `localhost:5432` and uses the `.env.example` connection string. citeturn10view1turn6view0  
* Hosted Postgres (example: entity["company","Supabase","hosted postgres platform"]): recommended for production; docs note separate URIs for pooled (application) vs direct (migrations) connections, and warn that pooled mode may require disabling prepared statements in the Postgres client. citeturn10view1turn10view2

### Deployment modes and exposure policy

Paperclip defines two runtime modes, with authenticated mode split into exposure profiles:

* `local_trusted`: loopback-only binding, no human login flow, optimised for local startup. citeturn9view0turn19view2  
* `authenticated/private`: login required, private-network access (e.g., LAN/VPN such as entity["company","Tailscale","vpn mesh network"]), hostname trust policy. citeturn9view0turn20view1turn23search1  
* `authenticated/public`: login required, explicit public URL required, stricter deployment checks. citeturn9view0turn19view2

The server enforces key invariants at startup: `local_trusted` requires loopback host binding; authenticated/public exposure requires explicit base URL configuration. citeturn19view2turn9view0

### Configuration files and environment variables

Paperclip has a config file concept (“instance config”) combined with `.env` loading. The server’s config loader:

* Loads dotenv from a Paperclip env path (and also a CWD `.env` if distinct). citeturn29view0  
* Reads a JSON config file (`readConfigFile()`), then merges environment overrides for many settings. citeturn29view0turn12view1

Key config fields include deployment mode/exposure, host/port, allowed hostnames, auth base URL settings, database mode and backup schedules, UI serving toggles, secrets provider and key file path, storage provider (local vs S3) with S3 parameters, heartbeat scheduling, and a feature flag for company deletion. citeturn29view0turn22view0

Representative environment variables (non-exhaustive, but grounded in the server config loader, docs, and Docker examples):

| Environment variable | Role | Source evidence |
|---|---|---|
| `DATABASE_URL` | Selects DB mode: unset ⇒ embedded; set ⇒ external Postgres connection string | `.env.example`, DATABASE doc, server DB bootstrap logic. citeturn6view0turn10view2turn19view2 |
| `PORT`, `HOST` | Server bind config | `.env.example`, Docker examples, config interface. citeturn6view0turn11view2turn29view0 |
| `SERVE_UI` | Controls serving the UI from the server | `.env.example` and Dockerfile default env shows `SERVE_UI=true` in production image. citeturn6view0turn7view0 |
| `PAPERCLIP_HOME`, `PAPERCLIP_INSTANCE_ID` | Controls local instance root and selected instance | CLI docs + Dockerfile defaults. citeturn12view1turn7view0 |
| `PAPERCLIP_CONFIG` | Config file path (used in container defaults) | Dockerfile env. citeturn7view0 |
| `PAPERCLIP_DEPLOYMENT_MODE`, `PAPERCLIP_DEPLOYMENT_EXPOSURE` | Runtime mode/exposure | Docker quickstart compose; config loader supports env override and validates values. citeturn6view1turn29view0turn9view0 |
| `PAPERCLIP_PUBLIC_URL` | Derived source for auth/public base URL defaults and hostname allowlists | Docker doc + config loader uses it as an auth URL source. citeturn11view2turn29view0 |
| `PAPERCLIP_ALLOWED_HOSTNAMES` | Hostname allowlisting for authenticated/private gating | Docker doc + config loader accepts comma-separated list | citeturn11view2turn29view0turn20view1 |
| `PAPERCLIP_AUTH_PUBLIC_BASE_URL` (and `BETTER_AUTH_URL` / `BETTER_AUTH_BASE_URL`) | Auth base URL explicit overrides / compatibility | Docker doc lists granular overrides; config loader reads these in precedence order. citeturn11view2turn29view0 |
| `PAPERCLIP_AUTH_DISABLE_SIGN_UP` | Disable signup | Config loader. citeturn29view0 |
| `PAPERCLIP_SECRETS_PROVIDER`, `PAPERCLIP_SECRETS_STRICT_MODE` | Secrets provider selection and strict mode | Config loader. citeturn29view0turn10view3 |
| `PAPERCLIP_STORAGE_PROVIDER`, `PAPERCLIP_STORAGE_LOCAL_DIR`, `PAPERCLIP_STORAGE_S3_*` | Storage provider selection + S3 config | Config loader enumerates these. citeturn29view0turn12view1turn16view1 |
| `PAPERCLIP_ENABLE_COMPANY_DELETION` | Gates destructive company deletion server-side | CLI docs note deletion is “server-gated”. citeturn12view3turn22view0 |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` | Enables certain local adapters (and container-bundled CLIs) to authenticate | Docker quickstart compose and Docker docs describe passing these; Dockerfile installs `@openai/codex` and `@anthropic-ai/claude-code`. citeturn6view1turn11view2turn7view0 |

## Security, threat model, and operational characteristics

### Authentication and access control model

The mode taxonomy is a first-class security control: local mode removes login flows but must stay loopback-bound; authenticated modes add login and additional deployment checks, including URL/hostname trust management. citeturn9view0turn19view2turn20view1

On the API side, Paperclip distinguishes “board” operator context from agent access. `AGENTS.md` states agent access uses bearer API keys (`agent_api_keys`) hashed at rest, and emphasises strict company boundary checks. citeturn8view2turn15view1

The server config and app wiring also show host-based gating for authenticated/private deployments (a “private hostname guard”), suggesting defence-in-depth against unintended exposure when running on private networks. citeturn20view1turn29view0

### Secret storage and redaction

The database documentation describes secrets as stored in `company_secrets` and `company_secret_versions`, with a default “local_encrypted” provider encrypting secret material at rest using a local master key file (default `~/.paperclip/instances/default/secrets/master.key`). citeturn10view3turn12view1

The spec’s security requirements additionally call out explicit log redaction (secrets in adapter config, auth headers, env vars) and CSRF protection for board session endpoints, along with rate limiting of auth/key-management endpoints and strict company boundary checks on every entity fetch/mutation. citeturn15view1turn29view4turn29view5

### Threat model (practical)

The repo’s design implies the main threat surfaces are:

* **Board UI + REST API exposure** (especially authenticated/public): risk of credential/session compromise, CSRF, and misconfigured trusted origins/hostnames. citeturn9view0turn11view2turn29view0turn20view1  
* **Agent API keys**: long-lived keys can be abused if leaked; key hashing at rest mitigates DB leakage but not client-side leakage. citeturn8view2turn15view1  
* **Adapters that execute code** (process adapter, workspace provisioning, plugin tools): these are inherently high-risk because they can spawn processes or call external HTTP services. citeturn15view1turn21view3  
* **Import/export of companies**: portability is powerful but increases the need for safe parsing, collision handling, and scrubbing. Release notes emphasise “secret scrubbing” and “merge-history support”, indicating active mitigation work. citeturn23search2turn20view1

A concrete example of risk acknowledgement is the open security issue reporting a “CRITICAL command injection vulnerability” in workspace provisioning commands (`provisionCommand/teardownCommand`). citeturn24search15

Separately, the repository includes an “untrusted review” Docker compose file that drops Linux capabilities (`cap_drop: ALL`) and sets `no-new-privileges:true`, suggesting a hardening posture for reviewing untrusted changes with agent tooling. citeturn30view1turn11view2

### Performance, scalability, and reliability characteristics

The spec sets explicit reliability targets, including API p95 latency under 250ms for standard CRUD at 1k tasks/company and heartbeat acknowledgement under 2 seconds for process adapters. citeturn15view1

From implementation details, a few operational characteristics stand out:

* **Single-process local default**: in local installs, one Node process can manage the embedded Postgres and local storage, which is ideal for fast start but implies that production scaling should use external Postgres and object storage. citeturn10view2turn23search1turn29view0  
* **Large payload handling exists**: the server increases JSON body limit to 10MB, explicitly noting that company import/export payloads can inline full portable packages; this hints at heavy, potentially memory-intensive payloads during portability operations. citeturn20view1turn23search2  
* **Stateful orchestration requires correctness**: there are active issues around execution locks and assignment behaviour (e.g., stale lock fields on release/update; crashes when assigning tasks via PATCH), pointing to ongoing maturation of orchestration invariants. citeturn24search8turn28search7turn8view2  

## Testing strategy, CI/CD, licensing, and maintenance status

### Testing strategy and test tooling

Paperclip uses multiple layers of testing in both its specification and its repo scripts:

* The spec requires unit tests (state transition guards, budget enforcement, adapter semantics), integration tests (checkout conflict, approval flows, cost rollups), end-to-end tests (board → company → hire CEO → approve strategy), and a minimum regression suite that blocks release candidates (auth boundary, checkout race, budget hard stop, agent pause/resume, dashboard consistency). citeturn15view1  
* The root `package.json` implements test runners including Vitest (`pnpm test:run`), Playwright e2e (`pnpm test:e2e`), and a “release smoke” Playwright config, plus “promptfoo” evals. citeturn7view1  
* The server package includes `supertest` and a `dev:watch` mode that sets migration-related environment flags, implying server-side integration testing and developer-time migration behaviour. citeturn16view1  

### CI/CD and release engineering signals

The repo has explicit release automation scripts at the root (`release`, `release:canary`, `release:stable`, `release:github`). citeturn7view1

Release notes show that the project has been adding operational workflows such as “Docker image CI — Added Docker image build and deploy workflow.” citeturn28search8turn23search2

### Licence and contribution guidelines

The repository is MIT-licensed. citeturn6view5turn16view1turn23search0

Contribution guidance emphasises either small, focused PRs (fast merge when clean) or larger changes discussed first in entity["organization","Discord","chat platform"], with a strong expectation of clear “thinking path” explanations and screenshots for UI/behaviour changes. citeturn8view3

### Maintenance and activity status

Signals of active maintenance (as-of 2026-03-31):

* The entity["organization","paperclipai","github org"] organisation listing shows the repo updated on 2026-03-30 and reports roughly ~41k stars and ~6.1k forks. citeturn28search1  
* The commits view shows multiple commits on 2026-03-30, including merges and fixes, indicating sustained day-to-day development. citeturn25view2  
* The pull requests index shows ~787 open PRs and ~718 closed PRs at the time of capture, reflecting high contribution volume and/or heavy PR backlog. citeturn23search4turn30view0  
* The project publishes dated releases; v2026.325.0 was released on 2026-03-25 with major features such as company import/export, company skills library, and routines. citeturn23search2  

Roadmap items visible in the README include completed items (plugin system, OpenClaw support, portability, skills manager, routines, budgeting) and planned work (artifacts/deployments, CEO chat, “MAXIMIZER MODE”, multiple human users, cloud deployments, desktop app). citeturn23search0

## Practical usage examples, interoperability notes, and next steps

### Common operational tasks with repeatable commands

**Start a local dev instance (embedded DB):**

```bash
pnpm install
pnpm dev
```

You can sanity-check the API immediately:

```bash
curl http://localhost:3100/api/health
curl http://localhost:3100/api/companies
```

These checks are explicitly suggested in `AGENTS.md`. citeturn8view2turn22view0

**Run the CLI locally and set a context profile:**

```bash
# Run the CLI in the repo
pnpm paperclipai --help

# Persist local defaults (API base + company id) into context.json
pnpm paperclipai context set --api-base http://localhost:3100 --company-id <company-id>
pnpm paperclipai context show
```

This is part of the CLI reference. citeturn12view3

**List and manipulate issues (CLI):**

```bash
pnpm paperclipai issue list --company-id <company-id> --status todo,in_progress
pnpm paperclipai issue create --company-id <company-id> --title "Investigate onboarding redirect bug"
pnpm paperclipai issue checkout <issue-id> --agent-id <agent-id> --expected-statuses todo,backlog,blocked
pnpm paperclipai issue comment <issue-id> --body "Repro steps: ..."
```

Commands and flags are documented in `doc/CLI.md`. citeturn12view3

**Run local agents via CLI-assisted setup:**

The CLI’s `agent local-cli` command creates an agent API key, installs Paperclip skills into local agent tool directories, and prints `export ...` lines for environment variables like `PAPERCLIP_API_URL`, `PAPERCLIP_COMPANY_ID`, `PAPERCLIP_AGENT_ID`, and `PAPERCLIP_API_KEY`. citeturn12view3turn12view1

```bash
pnpm paperclipai agent local-cli codexcoder --company-id <company-id>
pnpm paperclipai agent local-cli claudecoder --company-id <company-id>
```

**Docker quickstart:**

```bash
docker compose -f docker-compose.quickstart.yml up --build
```

Defaults and optional overrides (port/data dir) are documented. citeturn11view0turn6view1

Paperclip also documents a one-liner `docker build ... && docker run ...` that mounts a persistent data directory at `/paperclip` and exposes port 3100. citeturn11view2turn7view0

### Integration and interoperability with similar tools

Paperclip intentionally sits above “ticketing” and “review” tooling rather than replacing it: the README explicitly positions it as “manage business goals, not pull requests.” citeturn28search0turn23search1

Interoperability patterns visible in the repo:

* **Task-manager mapping:** The TASKS model is close to modern PM tools (issues, projects, milestones, labels, dependencies), but with semantics aimed at agent coordination (blocking relations, per-team workflows, single assignee, comment-driven coordination). citeturn13view0turn14view1  
* **Agent tool integration:** local adapters are built around local CLIs (e.g., the Docker image installs OpenAI Codex and Anthropic Claude Code tooling), and the server also supports HTTP adapters for remote runtimes. citeturn7view0turn11view2turn15view1turn16view1  
* **MCP tool contracts:** the MCP interface gives a clear foundation for plugging Paperclip into agent frameworks that speak MCP-like tool calling, without requiring those agents to embed Paperclip-specific database logic. citeturn14view1  

As an operator migration strategy from other tools (e.g., Trello/Asana-style systems), the most realistic interoperability path suggested by the repo is: treat Paperclip as the system of record for agent work orchestration, while continuing to use existing review/release processes externally; then progressively adopt portability features (company import/export) and skills libraries to standardise setups. citeturn23search1turn23search2

### Suggested next steps for deeper hands-on exploration

Run a small “hands-on deep dive” that aligns with the repository’s architectural seams and known risk areas:

* Stand up a local instance in `local_trusted`, create a company, then switch to `authenticated/private` and validate hostname gating and session bootstrap behaviour using `/api/health` fields (`authReady`, `bootstrapStatus`). citeturn9view0turn22view0turn19view2  
* Explore the DB schema by reading `packages/db/src/schema/*.ts`, then practice the documented schema change workflow (`pnpm db:generate`, `pnpm db:migrate`, and smoke-check full build/test). citeturn8view2turn7view1  
* Build a minimal external “agent runtime” using the HTTP adapter contract from the spec (accept invocation payloads, return 2xx, optionally implement async completion callbacks) and observe behaviour in heartbeat runs. citeturn15view1turn21view3  
* Perform a targeted security review on command execution surfaces (workspace provisioning, process adapters, plugin tools), using the open command-injection report (#883) as a starting checklist for input validation and sandboxing strategy. citeturn24search15turn15view1  
* Validate portability by testing the release-highlighted “company import/export” flows and reading the related server codepaths (company portability services, import/export endpoints, and JSON payload size assumptions). citeturn23search2turn21view1turn20view1  

### Links and references

```text
Repository:
- https://github.com/paperclipai/paperclip

Release notes:
- https://github.com/paperclipai/paperclip/releases

Website:
- https://paperclip.ing/

Docs (Mintlify):
- https://www.mintlify.com/paperclipai/paperclip
```