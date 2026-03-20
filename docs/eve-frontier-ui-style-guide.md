# EVE Frontier UI Style Guide

Version: 1.0  
Scope: Monorepo frontend game UIs (Next.js + TypeScript + Tailwind CSS + Zustand)

## 1. Core Identity

- Visual style: Industrial Brutalism, Hard Sci-Fi, Tactical Pragmatism.
- Keywords: modular, high-contrast, low-fault-tolerance, heavy industry, abyssal-space atmosphere.
- Design priority: readability and tactical clarity over decorative complexity.

## 2. Color Palette (Strict)

Use these exact hex values in CSS/Tailwind tokens.

| Usage | Color Name | Hex | Notes |
|---|---|---|---|
| Primary Accent | Industrial Yellow | `#E5B32B` | Ship body reference tone; CTA, titles, warnings |
| Primary Background | Deep Void Black | `#080808` | Deep space base background |
| Secondary Background | Gunmetal Grey | `#1A1A1A` | Module surfaces, panel layers, border surfaces |
| Hazard / Environment | Ember Orange | `#CC3300` | Critical alerts, hazard glow, environmental danger cues |
| Text / Information | Off White | `#E0E0E0` | High-contrast text on dark surfaces |

### CSS Tokens

```css
:root {
  --eve-yellow: #E5B32B;
  --eve-black: #080808;
  --eve-grey: #1A1A1A;
  --eve-red: #CC3300;
  --eve-offwhite: #E0E0E0;
}
```

## 3. Layout and Decor

### Borders

- Use hard edges only (`border-radius: 0` by default).
- Prefer `1px` solid borders in `#333` or `#E5B32B`.
- Encourage tactical detailing: clipped corners (`clip-path`) and ruler-like tick marks.

### Grid

- Background should include subtle 8px or 16px scan/grid texture.
- Keep texture low-opacity to avoid compromising readability.

### Panel Transparency

- Panel base recommendation: `rgba(8, 8, 8, 0.85)`.
- Use `backdrop-filter: blur(8px)` for frosted tactical glass effect.

## 4. Typography

- Titles / metrics: monospace only (`JetBrains Mono`, `Roboto Mono`, `Share Tech Mono`).
- Body: sans-serif with lighter weights (`Inter`, `Inter Tight`).
- Labels / micro metadata: uppercase (`UPPERCASE`) by default.

## 5. Interaction Language

- CTA states should feel mechanical and immediate.
- Hover: brighten or shift toward off-white with clear contrast change.
- Active: allow subtle downward translation (`translateY`) for physical feedback.
- Avoid soft, organic easing styles inconsistent with tactical UX.

## 6. Component Reference

### Base Tactical Button (React + Tailwind)

```tsx
<button className="bg-[#E5B32B] text-black font-mono font-bold px-4 py-2 uppercase border-r-4 border-b-4 border-black hover:bg-white active:translate-y-1">
  Initiate Warp
</button>
```

### Tactical Panel (Tailwind)

```tsx
<div className="bg-[#080808]/90 border-l-2 border-[#E5B32B] p-4 font-mono text-[#E0E0E0]">
  <div className="text-[10px] text-[#E5B32B] mb-1">SYSTEM_STATUS // ONLINE</div>
  <div className="text-xl font-bold">FRONTIER_CORE_V1</div>
</div>
```

## 7. Tailwind Mapping Recommendation

When extending `tailwind.config`, map tokens into semantic aliases:

- `eve.yellow` -> `#E5B32B`
- `eve.black` -> `#080808`
- `eve.grey` -> `#1A1A1A`
- `eve.red` -> `#CC3300`
- `eve.offwhite` -> `#E0E0E0`

## 8. Anti-Patterns (Do Not Use)

- Large rounded corners or card-like SaaS visuals.
- Low-contrast text on dark backgrounds.
- Pastel or gradient palettes that weaken industrial tone.
- Overly playful animation curves and bouncy interaction physics.

## 9. Project Context

- Repository type: monorepo.
- Frontend stack: TypeScript, Next.js, Tailwind CSS, Zustand.
- Contract stack: Sui Move.
- First integrated EVE Frontier mini-game: `Neural Sync: Civilization Code Reconstruction`.

All UI output for this project should be evaluated against this guide before delivery.
