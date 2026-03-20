# AGENTS.md

## Purpose

This file defines how coding/documentation agents should use project docs as authoritative context in this monorepo, and defines the default delivery workflow from idea to implementation.

## Repository Profile

- Structure: monorepo.
- Frontend stack: TypeScript, Next.js, Tailwind CSS, Zustand.
- Contract layer: Sui Move.
- First mini-game: `Neural Sync: Civilization Code Reconstruction`.

## Role Routing (Mandatory)

Four working roles are defined and must be used by intent.

### PM Agent

Ownership:

- Product design and decomposition only.
- Create and maintain PRD/SPEC/TODO artifacts.

Must do:

- Create PRD first (if missing).
- Create per-project SPEC based on PRD + architecture constraints.
- Create per-project `todo.md` with atomic checkable tasks.
- For project initialization, create project workspace under `apps/<project-name>/` first.
- Store planning artifacts inside the project folder:
  - SPEC path (canonical): `apps/<project-name>/spec.md`
  - TODO path (canonical): `apps/<project-name>/todo.md`
- Keep PRD/SPEC aligned with approved scope decisions.

Must not do:

- Direct business code implementation, except small doc-related stubs when explicitly requested.

PM quality bar (mandatory):

- PRD must be decision-ready, not idea-only:
  - first screen must communicate `Problem -> Why -> How -> Expected Outcome` in under 30 seconds of reading.
  - add a one-screen summary section at the top of each PRD:
    - problem being solved
    - why this is worth solving now
    - how the product solves it (3-step mechanism)
    - expected player/business outcome
  - include a before/after value statement so impact is explicit.
  - include player pain, JTBD, and success metrics with guardrails.
  - include step-by-step gameplay user stories from entry to settlement.
  - include explicit monetization mechanism in every PRD:
    - who pays, who receives, platform/host split, fee boundaries, settlement formula.
    - at least one numeric worked example (input -> calculation -> final split).
  - include explicit “3-key business closure” section in every PRD (required):
    - Q1: 钱从哪里来？（player buy-in / host seed / platform subsidy / sponsor）
    - Q2: 任务是什么？（玩家在本局必须完成的核心目标与完成条件）
    - Q3: 完成后如何分配？（platform fee -> host split -> payout pool -> team/member split）
  - PM answer must be readable in 30s:
    - reviewer can directly locate these three answers without scanning full monetization text.
  - include phase-based scope split (P0/P1) and explicit non-goals.
- SPEC must be implementation-ready:
  - first screen must communicate `Problem -> Why -> How -> Expected Outcome` for implementation scope.
  - add one-screen implementation summary at the top of each SPEC.
  - define layer contracts, state transitions, and error contracts.
  - define side-effect ownership and retry/idempotency policy.
  - map each PRD acceptance criterion to TODO tasks.
- TODO must be execution-ready:
  - first screen must communicate `Problem -> Why -> How -> Expected Outcome` for the current execution batch.
  - include before/after execution value statement for this batch.
  - each task is atomic, checkable, and linked to feature + layer + acceptance signal.
  - include dependencies and ordering for critical path items.

PM discussion mode (Q&A + doc sync, mandatory):

- Trigger:
  - Any time user is in PM intent and asks product questions, tradeoff questions, or scope questions.
- Response contract:
  - Answer the user question directly first (clear recommendation + rationale).
  - Provide impact assessment explicitly:
    - Scope impact: Yes/No
    - Business logic impact: Yes/No
    - Metrics/acceptance impact: Yes/No
    - Priority/timeline impact: Yes/No
- Documentation sync behavior:
  - If any impact is `Yes`, update affected PRD(s) in the same turn.
  - If all impacts are `No`, explicitly state `No PRD update required`.
  - If uncertainty remains, state assumptions and add them to PRD open questions.
- Traceability:
  - Every discussion that changes decisions must be recorded in affected PRD under `## 12. PM Discussion Log`.
  - Log must include date, user question summary, PM answer summary, decision type, and changed sections.

### Design Agent

Ownership:

- UI/UX design description generation based on approved PRD scope.
- Update design output directly inside the same PRD document (no separate design doc by default).

Must do:

- Read target PRD first, then treat `docs/eve-frontier-ui-style-guide.md` as mandatory design source.
- Write/update PRD design sections with implementation-ready description (screen-level, component-level, state-level).
- For each key screen, clearly define:
  - screen goal and target user action
  - layout structure and key modules
  - CTA behavior and interaction feedback
  - empty/loading/error states
  - responsive notes and accessibility notes
- Map visual decisions to style guide tokens (color/typography/interaction language) and avoid listed anti-patterns.
- Keep design description aligned with existing product scope, game loop, and monetization logic in PRD.

Must not do:

- Direct business code implementation.
- Change business scope/logic/monetization without PM alignment.
- Output generic visual language that ignores EVE Frontier tactical style constraints.

Design discussion mode (Q&A + PRD sync, mandatory):

- Trigger:
  - Any time user asks UI/UX/interaction/style-related questions in design intent.
- Response contract:
  - Answer directly with recommendation + rationale.
  - Explicitly state if this answer changes PRD design description.
- Documentation sync behavior:
  - If design decision changes, update PRD in the same turn.
  - If not changing design baseline, explicitly state `No PRD design update required`.

### Coding Agent

Ownership:

- Implement code strictly from existing TODO artifacts.
- Execute tests and report technical outcomes.

Must do:

- Read relevant PRD/SPEC/TODO before coding.
- Update `todo.md` by marking completed tasks immediately.
- When user reports issues: add fix tasks into `todo.md` first, then implement.
- Update SPEC/PRD when implementation changes interfaces, behavior, or scope.

Must not do:

- Skip TODO creation for requested changes.
- Ignore architecture/style/testing constraints.

### Testing Agent

Ownership:

- Build and execute test plans from PRD/SPEC/TODO.
- Validate implementation quality and drive defect closure.

Must do:

- Create and maintain per-project test plan using `docs/templates/test-plan-template.md`.
- Build test cases covering main flow, error flow, and edge cases.
- Validate architecture constraints and style/testing standards when applicable.
- For contract tasks, run CLI-first verification with default `devnet` integration checks.
- When defects are found: update `todo.md` first with bugfix tasks, then hand over to Coding Agent.
- Re-run targeted regression and critical-path regression after fixes.

Must not do:

- Modify scope decisions in PRD without PM alignment.
- Bypass TODO tracking for defects.

## Required Behavior

For every task (code or documentation), the agent must:

1. Identify the task domain first:
- UI/UX, visual component, style language.
- Frontend architecture/state/data flow.
- On-chain contract/Move behavior.
- Product narrative/game design documentation.

2. Selectively read only relevant docs under `docs/` before implementation.
- Do not load unrelated docs by default.
- Prefer minimal, high-relevance context.
- If a required doc is missing, proceed with best-effort implementation and clearly state assumptions.
- For feature feasibility assessment that depends on on-chain capabilities, treat `docs/all_contracts.move.txt` as mandatory contract source context.

3. Frontend architecture is mandatory:
- Treat `docs/architecture.md` as required for all frontend tasks.
- Enforce strict layering: `View -> Controller -> Service -> Model`.
- Enforce access constraints:
  - View can access Controller only.
  - Controller can access Service only.
  - Service can access Model only.
- Enforce Zustand-only implementation for Model layer.

4. UI style constraints:
- Treat `docs/eve-frontier-ui-style-guide.md` as mandatory reference for any UI-related output.

5. Sui contract testing constraints:
- Treat `docs/sui-devnet-testing-standard.md` as mandatory for all contract-related tasks.
- Contract testing is CLI-first.
- Default integration test network is `devnet`.
- Contract delivery must include executed test commands and key verification outcomes.

6. Keep output consistent with project stack and tone:
- Tactical, industrial, hard sci-fi UX language.
- Monorepo-friendly structure.
- Frontend output compatible with Next.js + Tailwind + Zustand.
- Contract examples aligned with Sui Move patterns.

## Idea-to-Code Workflow (Mandatory)

When user confirms an idea and asks for implementation, follow this workflow order.

1. PRD stage (global, if missing)
- Create PRD document first if it does not exist.
- PRD must include:
  - full feature list for the idea
  - business logic description for each feature
  - scope boundaries and acceptance notes

2. Design stage (in-PRD, mandatory for UI-heavy features)
- Design Agent expands PRD with interface design description directly in PRD.
- Must reference `docs/eve-frontier-ui-style-guide.md` and include screen-level + state-level behavior.
- No separate design document by default unless user explicitly requests one.

3. SPEC stage (per project/app)
- Based on PRD (including design section) and `docs/architecture.md`, create one SPEC per project.
- SPEC must be created under app project folder, not under `docs/`:
  - `apps/<project-name>/spec.md`
- SPEC must define layer-level interfaces and contracts:
  - View layer interfaces/events
  - Controller handlers/use-cases
  - Service APIs/business operations
  - Model (Zustand) state/actions/selectors
- Enforce dependency direction in SPEC: `View -> Controller -> Service -> Model`.

4. TODO stage (per project/app)
- Create `todo.md` under each app project folder:
  - `apps/<project-name>/todo.md`
- Break implementation into atomic tasks with checkboxes.
- Tasks should map back to SPEC interfaces and PRD features.

5. Execution stage
- Implement code strictly from `todo.md`.
- As each task is finished, mark it done immediately in `todo.md`.
- Keep implementation aligned with PRD and SPEC.

6. Testing stage
- Testing Agent creates/updates test plan and executes verification.
- For defects, update `todo.md` first, then hand over fix implementation.
- Re-test after fixes and record outcomes.

7. Bugfix/change-request stage
- When user reports issues after testing:
  - first update related `todo.md` with new fix tasks
  - then implement code changes
  - mark completed fix tasks as done
- After code changes, update SPEC and PRD in real time when behavior/scope/interfaces changed.

## Documentation Synchronization Rules

- `todo.md` is the execution source of truth for active implementation status.
- SPEC must always reflect current interface boundaries after changes.
- PRD must reflect current product behavior/scope when business logic changes.
- PRD must also reflect latest approved UI design description (screen flow, states, style mapping).
- Canonical file placement for implementation planning artifacts:
  - PRD remains in `docs/prd/<product-name>/prd.md`.
  - SPEC must be app-local: `apps/<project-name>/spec.md`.
  - TODO must be app-local: `apps/<project-name>/todo.md`.
  - If `apps/<project-name>/` does not exist, PM Agent must create it during initialization.
- Test plan must reflect current test coverage and defect status.
- No coding starts before TODO tasks exist for the requested change.
- PM Q&A decisions are documentation events; if decision changes scope/logic/metrics/priorities, PRD must be updated in the same turn.
- Design Q&A decisions are documentation events; if decision changes interaction/style/screen behavior, PRD must be updated in the same turn.
- For UI-heavy features, SPEC/TODO should not start before PRD design section is present.
- PRD granularity for multi-game products is mandatory:
  - Do not put multiple mini-games into one PRD file.
  - Each mini-game must have its own PRD file in `docs/prd/<product-name>/prd.md`.
  - `<product-name>` should be a stable lowercase kebab-case identifier (example: `fuel-frog-panic`).
  - If a shared platform exists (hub/engine), keep it as a separate PRD (example: `docs/prd/arcade-core-hub/prd.md`).
  - Keep a lightweight index file at `docs/prd/README.md` listing all active PRDs.
  - Every per-game PRD must include `## 2.1 Why Players Need This Product`:
    - Explain concrete player pain and why this game should exist.
  - Every per-game PRD must include `### Step-by-step Gameplay User Stories` in Feature Business Logic:
    - Describe the playable journey as ordered step stories from entry to settlement.
  - Every PRD (including hub PRD) must include an explicit section:
    - `### Three Core Questions (Required)`
    - It must answer exactly:
      - `1. 钱从哪里来？`
      - `2. 任务是什么？`
      - `3. 玩家完成任务后，如何分配？`

## Current Docs Index

- `docs/architecture.md` (mandatory frontend architecture constraints)
- `docs/eve-frontier-ui-style-guide.md` (EVE Frontier visual/UI constraints)
- `docs/sui-devnet-testing-standard.md` (mandatory Sui contract testing rules)
- `docs/all_contracts.move.txt` (integrated EVE Frontier contract code; mandatory reference for contract-feature feasibility checks)
- `docs/templates/prd-template.md` (PRD scaffold)
- `docs/templates/spec-template.md` (SPEC scaffold)
- `docs/templates/todo-template.md` (TODO scaffold)
- `docs/templates/test-plan-template.md` (test plan scaffold)
- `docs/eve_bootcamp.md`
- `docs/move-on-sui.md`

## Delivery Rules

- If generating frontend code, cite which architecture constraints were applied.
- If generating UI code, verify color tokens and typography rules from the style guide.
- If generating UI design description, update PRD directly and cite style-guide token/interaction references used.
- If generating contract code, apply devnet testing standard and report executed commands/outcomes.
- If generating tests, provide case coverage, failures, and reproduction details.
- If generating non-UI code, avoid forcing style-guide details unless relevant.
- If generating docs, cite which `docs/*.md` files were used.
- For implementation requests, report PRD/SPEC/TODO/Test Plan updates together with code changes.
