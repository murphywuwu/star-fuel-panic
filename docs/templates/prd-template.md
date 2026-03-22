# Product Requirements Document (PRD) Template

## 0. One-Screen Summary (Problem / Why / How / Outcome)

- Product Name:
- Version:
- Status: Draft | Review | Approved
- Owner (PM):
- Last Updated:
- Problem being solved:
- Why now:
- How it works (3-step mechanism):
  1.
  2.
  3.
- Expected outcome (player + business):

## 0.1 Before vs After Value

| Dimension | Before | After |
|---|---|---|
| Player clarity |  |  |
| Player success rate |  |  |
| Session quality |  |  |
| Revenue quality |  |  |

## 1. Document Control

- Canonical PRD Path: `docs/PRD.md`
- Related Docs:
  - SPEC: `docs/SPEC.md`
  - TODO: `docs/TODO.md`
  - Test Plan:
- Stakeholders:
  - Product:
  - Design:
  - Engineering:
  - QA:

## 2. Background and Product Vision

- Context and trigger:
- Product vision:
- Problem statement:
- Why this product is worth solving now:
- Non-goals:

## 2.1 Why Players Need This Product (Required)

- Target player segments:
- Current pain points:
- Why current alternatives fail:
- Why players will return:

## 2.2 Personas and JTBD

| Persona | Context | JTBD | Current Friction | Desired Outcome |
|---|---|---|---|---|
| P-001 |  |  |  |  |

## 2.3 Success Metrics and Guardrails

- North Star Metric:
- Primary metrics:
  - M-001:
  - M-002:
- Guardrail metrics:
  - G-001:
  - G-002:
- Measurement source (events/logs/queries):
- Target window:

## 3. Scope and Release Strategy

### In Scope

- 

### Out of Scope

- 

### Scope by Phase

| Phase | Objective | Must-have | Nice-to-have | Exit Criteria |
|---|---|---|---|---|
| P0 |  |  |  |  |
| P1 |  |  |  |  |

### Dependencies and Constraints

- Internal dependencies:
- External dependencies:
- Compliance/security constraints:
- Key assumptions:

## 4. User Journey and Core Experience

### End-to-end Journey

1. Entry
2. Match/mission preparation
3. Core action loop
4. Resolution/settlement
5. Re-engagement

### Step-by-step Gameplay User Stories (Required)

1. As a player, I want to ..., so that ...
2. As a player, I want to ..., so that ...
3. As a player, I want to ..., so that ...
4. As a player, I want to ..., so that ...

### Core Loop Mapping

- Trigger:
- Action:
- Immediate feedback:
- Reward:
- Progression hook:

## 5. Requirements

## 5.1 Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | User Value | Business Value | Status |
|---|---|---|---|---|---|
| F-001 |  |  |  |  | Planned |

## 5.2 Functional Requirements and Business Rules

### F-001 <Feature Name>

- Objective:
- User story:
- Trigger:
- Preconditions:
- Main flow:
  1.
  2.
  3.
- Alternative flows/exceptions:
- Postconditions:
- Business rules:
  - BR-001:
  - BR-002:
- Data requirements:
- Error handling:
- Acceptance criteria:
  - AC-001:
  - AC-002:

## 5.3 Non-functional Requirements

- Performance:
- Reliability:
- Security/anti-abuse:
- Observability:
- Accessibility:

## 6. Monetization and Economy (Required)

### Three Core Questions (Required)

- 1. 钱从哪里来？
  - Base pool source:
  - Optional seed/subsidy/sponsor source:
  - Pool lock timing:
- 2. 任务是什么？
  - Core mission statement:
  - Completion condition:
  - Failure condition:
- 3. 玩家完成任务后，如何分配？
  - Settlement order:
  - Team/member split rule:
  - Traceable billing fields:

### Revenue Mechanism Breakdown (Required)

- Who pays:
- Who receives:
- Platform fee model:
- Host/organizer fee model:
- Fee boundaries/caps:
- Settlement formula:
  - gross_pool =
  - platform_fee =
  - host_fee =
  - payout_pool =

### Numeric Worked Example (Required)

- Scenario input:
- Calculation:
  1.
  2.
  3.
- Final split output:
  - Player payout total:
  - Host revenue:
  - Platform revenue:

## 7. UX and UI Requirements

- Must follow: `docs/eve-frontier-ui-style-guide.md`
- UX objective:
- UX quality bar:
  - First-time user understands win condition in <= 30s.
  - Critical state changes have immediate feedback.
- Accessibility baseline:

### 7.1 Screen Inventory

| Screen ID | Screen Name | Goal | Entry Trigger | Exit Trigger | Priority |
|---|---|---|---|---|---|
| S-001 |  |  |  |  | P0 |

### 7.2 Screen-level Requirements

#### S-001 <Screen Name>

- Screen intent:
- Layout zones:
  - Top:
  - Center:
  - Bottom:
- Key modules:
- Primary CTA and secondary actions:
- Empty/loading/error states:
- Responsive notes:
- Accessibility notes:

## 8. Technical and Architecture Constraints

- Must follow: `docs/architecture.md`
- Layering contract: `View -> Controller -> Service -> Model`
- State management: Zustand only in Model layer
- Integration boundaries:
- Data ownership:

## 9. Risks, Assumptions, and Open Questions

- Risks:
  - R-001:
- Mitigations:
  - M-001:
- Assumptions:
  - A-001:
- Open questions:
  - Q-001:

## 10. Release Plan and Validation

- Milestones:
- Launch strategy:
- Rollback strategy:
- Validation plan:
- Go/No-Go criteria:

## 11. Handoff Notes for Engineering

- Planning input for SPEC (`docs/SPEC.md`):
  - Required interfaces:
  - Key state transitions:
  - Error contracts:
- Planning input for TODO (`docs/TODO.md`):
  - P0 implementation slices:
  - Acceptance signals:
  - Dependency order:

## 12. PM Discussion Log

| Date | User Question Summary | PM Answer Summary | Decision Type | Changed Sections |
|---|---|---|---|---|
| YYYY-MM-DD |  |  | Scope / Logic / Metrics / Priority |  |

## 12.1 Pending Discussion Items

- D-001:
- D-002:
