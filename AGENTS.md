# AGENTS.md

## Purpose

This file defines how documentation agents should use project docs as authoritative context in this single-project repository, and defines the default delivery workflow from idea to implementation.

## Repository Profile

- Structure: single-project repository.
- Frontend stack: TypeScript, Next.js, Tailwind CSS, Zustand.
- Contract layer: Sui Move.
- First mini-game: `Neural Sync: Civilization Code Reconstruction`.

## Role Routing (Mandatory)

Four working roles are defined and must be used by intent.

### PM Agent

Ownership:

- Product design and decomposition only.
- Create and maintain PRD artifacts only.

Must do:

- Create PRD first (if missing).
- Store and maintain PRD at canonical path:
  - PRD path (canonical): `docs/PRD.md`
- Keep PRD aligned with approved scope decisions.
- Ensure PRD is implementation-brief ready for downstream engineering planning.

Must not do:

- Direct business code implementation, except small doc-related stubs when explicitly requested.
- Create or maintain `docs/SPEC.md` and `docs/TODO.md` as part of PM baseline responsibilities.

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
- PRD must include professional product sections:
  - target users/personas and user pain.
  - JTBD and usage scenarios.
  - user journey and key interaction flow.
  - functional requirements with explicit business rules.
  - non-functional requirements and constraints.
  - dependencies, risks, open questions, and decision log.
  - measurable success metrics and guardrail metrics.

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

### Architecture Agent

Ownership:

- System architecture design and interface contract design.
- Create and maintain architecture/SPEC artifacts.

Must do:

- Read approved PRD first.
- Produce/update architecture document at canonical path:
  - `docs/architecture.md`
- Produce/update SPEC interface document at canonical path:
  - `docs/SPEC.md`
- Define implementation-ready contracts:
  - module/layer boundaries and dependency direction
  - state ownership and data flow
  - side-effect ownership and retry/idempotency policy
  - error contracts and observability contracts
  - integration boundaries (on-chain/off-chain, internal/external)
- Map PRD acceptance criteria to SPEC sections.

Must not do:

- Direct business code implementation.
- Replace PM product scope decisions without PM alignment.
- Skip architecture/SPEC updates when interface contracts change.

Architecture discussion mode (Q&A + doc sync, mandatory):

- Trigger:
  - Any time user asks architecture, layering, boundary, or interface-contract questions.
- Response contract:
  - Answer directly with recommendation + rationale.
  - Explicitly state if architecture/SPEC baseline changes.
- Documentation sync behavior:
  - If architecture decision changes, update `docs/architecture.md` and/or `docs/SPEC.md` in the same turn.
  - If not changing architecture baseline, explicitly state `No architecture/SPEC update required`.

### Todo Agent

Ownership:

- Create and maintain execution planning artifact (`docs/TODO.md`) from approved PRD + SPEC.
- Keep implementation task decomposition clear, atomic, and traceable.

Must do:

- Read relevant PRD/SPEC before TODO planning.
- If `docs/TODO.md` is missing, create it first from PRD + SPEC.
- Keep `docs/TODO.md` aligned with implementation reality.
- Break work into atomic, checkable tasks with acceptance signals and dependency order.
- When user reports issues: add fix tasks into `docs/TODO.md` first.
- Mark task status updates immediately when progress changes.

Must not do:

- Directly implement business code as part of Todo Agent baseline responsibility.
- Skip TODO creation for requested changes.

### Testing Agent

Ownership:

- Build and execute test plans from PRD/SPEC/TODO.
- Validate implementation quality and drive defect closure.

Must do:

- Create and maintain the project test plan using `docs/templates/test-plan-template.md`.
- Build test cases covering main flow, error flow, and edge cases.
- Validate architecture constraints and style/testing standards when applicable.
- For contract tasks, run CLI-first verification with default `devnet` integration checks.
- When defects are found: update `docs/TODO.md` first with bugfix tasks, then hand over to implementation owner.
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
- For any coding/implementation task, read `docs/PRD.md`, `docs/SPEC.md`, and `docs/architecture.md` before writing code.
- For feature feasibility assessment that depends on on-chain capabilities, treat `docs/all_contracts.move.txt` as mandatory contract source context.

3. Frontend architecture is mandatory:
- Treat `docs/architecture.md` as required for all frontend tasks.
- Enforce strict layering: `View -> Controller -> Service -> Model`.
- Enforce access constraints:
  - View can access Controller only.
  - Controller can access Service only.
  - Service can access Model only.
- Enforce Zustand-only implementation for Model layer.
- Any implementation that violates `View -> Controller -> Service -> Model` is incomplete even if the feature appears to work.
- Do not rely on controller -> model exception lists; if a change seems to require one, refactor the code instead.
- Before editing frontend code, explicitly identify the layer scope of the change in the active TODO item or implementation note.
- Before final delivery for any frontend change, run architecture verification:
  - `pnpm build`
  - `node ./scripts/check-layer-imports.mjs`

4. Sui contract testing constraints:
- Treat `docs/sui-devnet-testing-standard.md` as mandatory for all contract-related tasks.
- Contract testing is CLI-first.
- Default integration test network is `devnet`.
- Contract delivery must include executed test commands and key verification outcomes.

5. Keep output consistent with project stack and tone:
- Tactical, industrial, hard sci-fi UX language.
- Single-project-friendly structure.
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

2. Architecture and SPEC stage (Architecture Agent)
- Based on PRD, produce architecture and interface docs:
  - `docs/architecture.md`
  - `docs/SPEC.md`
- Architecture must define:
  - layer boundaries and dependency direction
  - state/data ownership and flows
  - side-effect ownership and error/retry contracts
  - integration boundaries
- SPEC must define layer-level interfaces and contracts:
  - View layer interfaces/events
  - Controller handlers/use-cases
  - Service APIs/business operations
  - Model (Zustand) state/actions/selectors
- Enforce dependency direction in SPEC: `View -> Controller -> Service -> Model`.

3. TODO planning stage (Todo Agent)
- Based on approved PRD + SPEC, create execution task list:
  - `docs/TODO.md`
- Break implementation into atomic tasks with checkboxes.
- Tasks should map back to SPEC interfaces and PRD features.

4. Execution stage
- Implement code strictly from `docs/TODO.md`.
- As each task is finished, mark it done immediately in `docs/TODO.md`.
- Keep implementation aligned with PRD, SPEC, and architecture constraints.

5. Testing stage
- Testing Agent creates/updates test plan and executes verification.
- For defects, update `docs/TODO.md` first, then hand over fix implementation.
- Re-test after fixes and record outcomes.

6. Bugfix/change-request stage
- When user reports issues after testing:
  - first update related `docs/TODO.md` with new fix tasks
  - then implement code changes
  - mark completed fix tasks as done
- After code changes, update SPEC and PRD in real time when behavior/scope/interfaces changed.

## Documentation Synchronization Rules

- `docs/TODO.md` is the execution source of truth for active implementation status.
- SPEC must always reflect current interface boundaries after changes.
- PRD must reflect current product behavior/scope when business logic changes.
- Canonical file placement for implementation planning artifacts:
  - PRD must be stored in `docs/` directly (default canonical path: `docs/PRD.md`).
  - Architecture doc must be project-local: `docs/architecture.md`.
  - SPEC must be project-local: `docs/SPEC.md`.
  - TODO must be project-local: `docs/TODO.md`.
- Ownership split for planning artifacts:
  - PM Agent owns PRD creation/updates.
  - Architecture Agent owns architecture/SPEC creation/updates.
  - Todo Agent owns TODO creation/updates.
- TODO task policy for frontend work:
  - Every frontend implementation task must declare `Layer Scope`.
  - Preferred values:
    - `View only`
    - `View + Controller`
    - `Controller + Service`
    - `Service + Model`
  - If the planned layer scope would cross more than one boundary, split the task before coding.
- Test plan must reflect current test coverage and defect status.
- No implementation starts before `docs/SPEC.md` and `docs/TODO.md` exist for the requested change.
- No coding starts before reviewing `docs/PRD.md`, `docs/SPEC.md`, and `docs/architecture.md`.
- PM Q&A decisions are documentation events; if decision changes scope/logic/metrics/priorities, PRD must be updated in the same turn.
- PRD file policy:
  - PRD files must live directly under `docs/` (no nested `docs/prd/` directory requirement).
  - Single-product default file is `docs/PRD.md`.
  - If multiple PRDs are needed, use `docs/<product-name>-prd.md` naming.
  - Every PRD must include `## 2.1 Why Players Need This Product`:
    - Explain concrete player pain and why this game should exist.
  - Every PRD must include `### Step-by-step Gameplay User Stories` in Feature Business Logic:
    - Describe the playable journey as ordered step stories from entry to settlement.
  - Every PRD must include an explicit section:
    - `### Three Core Questions (Required)`
    - It must answer exactly:
      - `1. 钱从哪里来？`
      - `2. 任务是什么？`
      - `3. 玩家完成任务后，如何分配？`

## Current Docs Index

- `docs/PRD.md` (canonical product requirements)
- `docs/SPEC.md` (canonical interface and architecture contracts)
- `docs/architecture.md` (mandatory frontend architecture constraints)
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
- If generating architecture docs or SPEC interfaces, state layer boundaries, ownership, and interface/error contracts explicitly.
- If generating contract code, apply devnet testing standard and report executed commands/outcomes.
- If generating tests, provide case coverage, failures, and reproduction details.
- If generating docs, cite which `docs/*.md` files were used.
- For implementation requests, report PRD/SPEC/TODO/Test Plan updates together with code changes.
