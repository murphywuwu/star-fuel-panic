# PRD Template

## 0. One-Screen Summary (Problem / Why / How)

- Problem it solves:
- Why this matters now:
- How it solves it (3-step mechanism):
  1. 
  2. 
  3. 
- Expected player/business outcome:

## 0.1 Before vs After

| Dimension | Before | After |
|---|---|---|
| Player clarity |  |  |
| Player outcome |  |  |
| Business outcome |  |  |

## 1. Document Control

- Product Name:
- Project/App Path:
- Version:
- Status: Draft | Review | Approved
- Owner (PM Agent):
- Last Updated:
- Related Docs:
  - SPEC:
  - TODO:
  - Test Plan:

## 2. Background and Goal

- Problem Statement:
- Target Users:
- Product Goal:
- Non-Goals:
- Strategic Fit (why now for this hackathon/project):

## 2.1 Why Players Need This Product

- Player pain points:
- Why existing solutions are insufficient:
- Why this product is worth repeating:

## 2.2 Player Segments and JTBD

| Segment | Context | Job-to-be-done | Current Friction |
|---|---|---|---|
| S-001 |  |  |  |

## 2.3 Success Metrics and Guardrails

- North Star Metric:
- Primary metrics:
  - M-001:
  - M-002:
- Guardrail metrics:
  - G-001:
  - G-002:
- Measurement method (event/log/query source):

## 3. Scope

### In Scope

- 

### In Scope by Phase

| Phase | Timebox | Must-have |
|---|---|---|
| P0 |  |  |
| P1 |  |  |

### Out of Scope

- 

## 3.1 Dependencies and Constraints

- Internal dependencies:
- External dependencies (API/network/team):
- Critical assumptions:

## 4. Feature List

| Feature ID | Feature Name | Priority (P0/P1/P2) | Value Hypothesis | Status |
|---|---|---|---|---|
| F-001 |  |  |  | Planned |

## 5. Feature Business Logic

### F-001 <Feature Name>

- User Story:
- Trigger:
- Preconditions:
- Main Flow:
1. 
2. 
3. 
- Alternative Flow / Exceptions:
- Postconditions:
- Data Rules:
- Error Handling:
- Acceptance Criteria:
  - AC-001:
  - AC-002:

### Step-by-step Gameplay User Stories

1. As a player, I want to ..., so that ...
2. As a player, I want to ..., so that ...
3. As a player, I want to ..., so that ...

### Core Loop Mapping

- Entry:
- Action:
- Feedback:
- Reward:
- Re-engagement trigger:

### Monetization and Economy Notes (If Applicable)

- Monetization touchpoint:
- Pricing / fee logic:
- Sink/faucet impact:
- Anti-abuse rule:

### Three Core Questions (Required)

- 1. 钱从哪里来？
  - Base pool source:
  - Optional seed/subsidy/sponsor sources:
  - Pool lock timing:
- 2. 任务是什么？
  - Core mission statement:
  - Completion condition:
  - Failure condition:
- 3. 玩家完成任务后，如何分配？
  - Settlement order:
  - Team/member split rule:
  - Traceable bill fields:

### Revenue Mechanism Breakdown (Required)

- Who pays:
- Who receives:
- Platform fee model:
- Host/organizer revenue model:
- Fee boundary (max caps):
- Settlement formula:
  - gross_pool =
  - platform_fee =
  - host_fee =
  - payout_pool =

### Revenue Example (Required)

- Scenario input:
- Step-by-step calculation:
  1.
  2.
  3.
- Final split result:
  - Player total payout:
  - Host/organizer revenue:
  - Platform revenue:

## 6. UX and UI Constraints

- Must follow: `docs/eve-frontier-ui-style-guide.md`
- Key interaction requirements:
- Accessibility baseline:
- UX quality bar:
  - First-time user can understand win condition in <= 30s.
  - Critical state changes have immediate visual feedback.

### 6.1 Design Agent Output Scope (Required)

- Output location:
  - Design description must be updated directly in this PRD.
- Mandatory references:
  - `docs/eve-frontier-ui-style-guide.md`
- Design output quality bar:
  - Reviewer can understand core screens and user actions in <= 60s.
  - Each key screen has clear state behavior and CTA definition.
  - Visual language explicitly maps to EVE Frontier style tokens.

### 6.2 Screen Inventory and Information Architecture

| Screen ID | Screen Name | Primary User Goal | Entry Trigger | Exit Trigger | Priority |
|---|---|---|---|---|---|
| S-001 |  |  |  |  | P0 |

### 6.3 Screen-by-screen Design Description

#### S-001 <Screen Name>

- Screen intent:
- Layout structure:
  - Top zone:
  - Core zone:
  - Bottom zone:
- Key UI modules:
  - Module A:
  - Module B:
- Primary CTA / Secondary actions:
- User interaction flow (step-by-step):
1.
2.
3.
- Data binding requirements:
- Empty/loading/error states:
- Accessibility notes:

### 6.4 Visual Token and Component Mapping (Style-guide Aligned)

- Color token mapping:
  - Primary CTA:
  - Background:
  - Panel:
  - Warning/Error:
  - Text:
- Typography mapping:
  - Headline / Metrics:
  - Body:
  - Label / Metadata:
- Component style rules:
  - Buttons:
  - Panels:
  - Tables/Lists:
  - Alerts:
- Explicit anti-patterns to avoid in this product:
  - 

### 6.5 Interaction and Motion Description

- Hover/Active feedback:
- Transition style:
- Critical event feedback:
  - Success:
  - Warning:
  - Failure:
- Timing guidance:
  - Entry animations:
  - In-match updates:

### 6.6 Responsive and Adaptation Strategy

- Desktop behavior:
- Tablet behavior:
- Mobile behavior:
- Priority downgrades for small screens:

### 6.7 Design QA Checklist (Required)

- [ ] All P0 screens have design descriptions.
- [ ] CTA and state transitions are unambiguous.
- [ ] Color/typography/interaction language follow style guide.
- [ ] Empty/loading/error states are defined for key screens.
- [ ] Design descriptions remain consistent with feature business logic and monetization flow.

## 7. Architecture Constraints

- Must follow: `docs/architecture.md`
- Required layer ownership:
  - View:
  - Controller:
  - Service:
  - Model (Zustand):

## 8. Contract / Chain Considerations (If Applicable)

- Move module impacts:
- On-chain/off-chain boundary:
- Must follow testing standard: `docs/sui-devnet-testing-standard.md`
- Security and abuse considerations:
  - Replay:
  - Double settlement:
  - Privilege checks:

## 9. Risks and Assumptions

- Assumptions:
- Risks:
- Mitigations:

## 9.1 Open Questions

- Q-001:
- Q-002:

## 10. Release and Validation

- Milestones:
- Validation approach:
- Exit criteria:

## 11. Traceability

| PRD Item | Linked SPEC Section | Linked TODO IDs |
|---|---|---|
| F-001 |  |  |

## 12. PM Discussion Log

| Date | User Question Summary | PM Answer Summary | Decision Type | PRD Changes |
|---|---|---|---|---|
| YYYY-MM-DD |  |  | Scope / Logic / Metrics / Priority | Section refs |

## 12.1 Pending Discussion Items

- D-001:
- D-002:
