# SPEC Template (Per Project)

> Canonical file location: `apps/<project-name>/spec.md` (do not place project SPEC under `docs/`).

## 0. One-Screen Implementation Summary (Problem / Why / How)

- Problem being implemented:
- Why this scope now:
- How architecture solves it (3-step mechanism):
  1.
  2.
  3.
- Expected implementation outcome:

## 0.1 PRD Alignment Snapshot

| PRD Feature | User Value | Implementation Strategy |
|---|---|---|
| F-001 |  |  |

## 1. Document Control

- Project/App:
- Related PRD:
- Version:
- Status: Draft | Review | Approved
- Owner (PM Agent / Architect):
- Last Updated:
- Related TODO:
- Related Test Plan:

## 2. Scope and Traceability

- Scope summary:
- PRD features covered:
  - F-001:
  - F-002:
- Out of scope:
- Non-functional targets:
  - Performance:
  - Reliability:
  - Security:

## 3. Architecture Compliance

- Must follow `docs/architecture.md`
- Mandatory dependency flow: `View -> Controller -> Service -> Model`
- Model implementation: Zustand only
- Boundary checks:
  - View must not import Service/Model directly
  - Controller must not import Model directly
  - Service must be side-effect owner

## 4. Layer Interface Contracts

### 4.1 View Layer

- Responsibilities:
- Inputs (props/state):
- Outputs (events/callbacks):
- Allowed imports:
- Forbidden imports:

### 4.2 Controller Layer

- Responsibilities:
- Public handlers/use-cases:
- Input contracts:
- Output contracts:
- Orchestration sequence:
- Allowed imports:
- Forbidden imports:

### 4.3 Service Layer

- Responsibilities:
- Service APIs:
- Business rules:
- Side-effects (network/chain):
- Idempotency/retry policy:
- Allowed imports:
- Forbidden imports:

### 4.4 Model Layer (Zustand)

- Store slices:
- State schema:
- Actions/mutations:
- Selectors:
- Persistence/cache strategy:
- State transition rules:

## 5. Data and Error Contracts

- DTO/Type definitions:
- Validation rules:
- Error taxonomy:
- Retry/fallback behavior:
- Contract versioning policy:

## 5.1 Runtime Flow and State Machines

- Key use-cases sequence (request -> processing -> response):
- State machine definitions:
  - Entity:
  - Valid transitions:
  - Invalid transitions handling:

## 6. UI and Interaction Constraints

- Must follow `docs/eve-frontier-ui-style-guide.md`
- Key component states:
- Motion/feedback rules:
- Empty/loading/error states:
- Accessibility checks:

## 7. Test Plan

### Frontend

- Unit tests:
- Integration tests:
- Manual verification checklist:
- Critical-path regression checklist:

### Contract (If Applicable)

- Must follow `docs/sui-devnet-testing-standard.md`
- Local test commands:
- Devnet verification commands:
- Expected outcomes:
- Security test cases:
  - Replay / duplicate settlement
  - Permission bypass
  - Boundary value checks

## 8. TODO Mapping

- Every interface/feature in this SPEC must map to an actionable item in project `todo.md`.

| TODO ID | Linked Layer | Linked Feature | Linked PRD AC | Description | Status |
|---|---|---|---|---|---|
| T-001 | View | F-001 | AC-001 |  | Todo |

## 9. Delivery Readiness Checklist

- [ ] All PRD features in scope mapped to interfaces.
- [ ] All interfaces mapped to TODO tasks.
- [ ] All TODO tasks have acceptance signals.
- [ ] Risky flows covered by test cases.
