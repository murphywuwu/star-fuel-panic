# Frontend Architecture Standard

Version: 1.0  
Scope: All frontend applications and mini-games in this monorepo.

## 1. Mandatory Layered Architecture

All frontend projects must use exactly four layers:

1. View Layer
2. Controller Layer
3. Service Layer
4. Model Layer

Dependency direction is strictly one-way:

`View -> Controller -> Service -> Model`

No reverse or cross-layer access is allowed.

## 2. Layer Responsibilities

### View Layer

- Contains presentational UI (Next.js pages/components).
- Handles rendering, user interaction capture, and visual state display only.
- Can access only the Controller layer.
- Must not call Service or Model directly.

### Controller Layer

- Receives UI events from View.
- Coordinates UI use-cases, orchestration, and interaction flow.
- Can access only the Service layer.
- Must not import Model directly.

### Service Layer

- Encapsulates business logic, domain operations, and external side-effects.
- Performs data transformations and policy enforcement.
- Can access only the Model layer.
- Must not be imported by View directly.

### Model Layer

- System of record for frontend runtime state.
- All Model implementations must be based on Zustand.
- Exposes state, selectors, and mutation actions.
- Must not depend on View/Controller/Service.

## 3. Hard Rules

- View can import Controller only.
- Controller can import Service only.
- Service can import Model only.
- Model is Zustand-based for every frontend project.
- Skipping layers is prohibited (for example: View -> Service).
- Circular dependencies are prohibited.

## 4. Recommended Monorepo Structure

```text
aapps/
  <mini-game>/
    src/
      view/
      controller/
      service/
      model/
```

Alternative naming is acceptable if boundaries remain equivalent and explicit.

## 5. Example Request Flow

1. User clicks action in View.
2. View calls Controller handler.
3. Controller calls Service use-case.
4. Service reads/writes Zustand Model.
5. Zustand Model updates state.
6. View re-renders from state changes.

## 6. State Management Standard (Zustand)

- Each domain should have a focused store slice.
- Keep store contracts explicit and typed (TypeScript interfaces/types).
- Business policies belong in Service; Model actions should remain composable and predictable.

## 7. What Not To Do

- Put business logic directly in React components.
- Access Zustand store from View when bypassing Controller/Service boundaries.
- Call blockchain/network side-effects from View.
- Couple one mini-game's Model directly to another mini-game's View.

## 8. Project Context

- Repository type: monorepo.
- Frontend stack: TypeScript, Next.js, Tailwind CSS, Zustand.
- Contract stack: Sui Move.
- First mini-game: `Neural Sync: Civilization Code Reconstruction`.

This document is mandatory for all new frontend implementation and refactor tasks.
