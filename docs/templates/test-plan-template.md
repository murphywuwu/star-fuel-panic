# Test Plan Template (Per Project)

## 1. Document Control

- Project/App:
- Related PRD:
- Related SPEC:
- Related TODO:
- Version:
- Status: Draft | In Progress | Passed | Blocked
- Owner (Testing Agent):
- Last Updated:

## 2. Scope

- Features in scope:
- Out of scope:
- Test environment assumptions:

## 3. Traceability

| Test ID | Linked Feature (PRD) | Linked Interface (SPEC) | Linked TODO ID | Priority |
|---|---|---|---|---|
| TC-001 | F-001 | Controller: xxx | T-001 | P0 |

## 4. Test Strategy

### Functional

- Main flow validation:
- Error flow validation:
- Edge/boundary validation:

### Architecture Compliance

- View -> Controller only
- Controller -> Service only
- Service -> Model only
- Model implemented with Zustand only

### UI Compliance (If Applicable)

- Verify `docs/eve-frontier-ui-style-guide.md` token and typography usage.

### Contract Validation (If Applicable)

- Must follow `docs/sui-devnet-testing-standard.md`.
- Local Move unit tests:
```bash
sui move test
```
- Devnet integration checks:
```bash
sui client switch --env devnet
sui client envs
sui client publish --gas-budget 100000000
```

## 5. Test Cases

### TC-001 <Case Name>

- Preconditions:
- Steps:
1. 
2. 
3. 
- Expected Result:
- Actual Result:
- Status: Pass | Fail | Blocked
- Evidence (logs/screenshots/tx id):

## 6. Defect Management

When a defect is found:

1. Add a new bugfix task into the related `todo.md` first.
2. Include reproducible details:
- Repro steps
- Expected result
- Actual result
- Scope impact
- Evidence/logs/commands
3. Hand over to Coding Agent for implementation.
4. Re-run targeted regression and critical-path regression.

## 7. Exit Criteria

- All P0/P1 cases passed or explicitly waived.
- All linked TODO bugfix items closed.
- No unresolved blocker in critical path.
- Final verification summary delivered.

