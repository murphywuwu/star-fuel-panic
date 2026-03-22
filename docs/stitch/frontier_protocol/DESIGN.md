# Design System Strategy: Industrial Brutalism & High-Fidelity Telemetry

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Hardened Interface."** 

This is not a "user-friendly" consumer app in the traditional sense; it is a high-fidelity tactical terminal designed for survival in deep space. We are moving away from the soft, rounded "SaaS" aesthetic toward a visual language of **Industrial Brutalism**. The interface must feel heavy, expensive, and utilitarian. 

To break the "template" look, we utilize **intentional asymmetry**. Layouts should feel like a series of interlocking hardware modules. We use sharp, 0px radiuses exclusively to convey structural rigidity. Elements should overlap with "glitch" offsets, and high-contrast telemetry data should populate the periphery to create a sense of overwhelming, yet organized, information density.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the void of deep space, punctuated by aggressive, functional signals.

### Color Tokens
- **Background & Surface:** We utilize `surface_container_lowest` (#0e0e0e) for the primary "void."
- **Primary (Caution Orange):** `primary_container` (#ff5f00) is reserved for critical actions and warnings.
- **Secondary (Lime Green):** `secondary_container` (#9df800) denotes active systems and positive telemetry.
- **Accents:** `tertiary` (#c6c6c7) is used for technical metadata and secondary labeling.

### The "No-Line" Rule & Surface Hierarchy
Traditional 1px borders are strictly prohibited for sectioning. Instead, we define boundaries through **Surface Tiers**:
- **Nesting:** Place a `surface_container_high` (#2a2a2a) module inside a `surface_container_low` (#1c1b1b) base to create depth.
- **The "Glass & Texture" Rule:** To achieve "expensive" tech, use `surface_variant` at 40% opacity with a `backdrop-filter: blur(12px)`. Overlay a subtle scanline or grid texture (using a 1px dot pattern) to give the digital surface a physical, tactile quality.
- **Signature Transitions:** For primary CTAs, use a linear gradient from `primary` (#ffb599) to `primary_container` (#ff5f00) at a 45-degree angle to simulate the glow of a physical LED panel.

---

## 3. Typography: Technical Authority
We use **Space Grotesk** across the entire system, but its application varies wildly to create a "Technical Editorial" feel.

- **Display & Headlines:** Use `display-lg` and `headline-lg` with a 700+ weight. Letter spacing should be tightened (-2%) to feel dense and heavy. Use all-caps for section headers to mimic industrial stamping.
- **Data & Telemetry:** Use `label-sm` and `body-sm` for technical readouts. These should be treated as "High-Fidelity Telemetry," often paired with `secondary` (#f9ffe8) for maximum legibility against the dark background.
- **The Hierarchy:** Large, heavy headers command authority, while tiny, hyper-detailed monospaced labels provide the "expensive" data-rich atmosphere.

---

## 4. Elevation & Depth: Tonal Layering
In this system, "Up" does not mean "Closer to a light source"; it means "Active and Powered."

- **The Layering Principle:** Stack `surface_container_highest` (#353534) on top of `surface` (#131313) to create a "lifted" module.
- **Ambient Glows (Not Shadows):** Instead of traditional black shadows, use a diffused glow of the `primary_container` (Orange) at 5% opacity for active elements. This mimics the light bleed of a high-end hardware console.
- **The "Ghost Border" Fallback:** If a separator is required, use the `outline_variant` token at 15% opacity. It should look like a faint etching on a metal plate, not a stroke.

---

## 5. Components

### Buttons: Hardware Switches
- **Primary:** High-contrast `primary_container` (#ff5f00) background. Sharp 0px corners. On hover, apply a "glitch" animation (a 2px horizontal shift).
- **Secondary:** Outlined with `outline` (#ab8a7d) at 40%. Text in `on_surface`.
- **Tertiary:** Ghost style, using `label-md` in all-caps with a leading [DIR] or [CMD] prefix to emphasize the terminal aesthetic.

### Progress Bars: Segmented Telemetry
Never use a smooth, continuous fill. Progress bars must be **segmented** into discrete blocks using the spacing-0.5 scale. Use `secondary_fixed` (#9ffb06) for the fill to indicate system health.

### Input Fields: Command Lines
- **Style:** Underlined only (2px `outline_variant`), or fully enclosed in a `surface_container_highest` block. 
- **Active State:** The bottom border shifts to `primary_container` (#ff5f00) with a faint outer glow.

### Cards & Lists: Modular Docking
- **Forbid Dividers:** Use `surface_container_low` for the list background and `surface_container_high` for individual list items. Separate items with `2.5` (0.5rem) of vertical space.
- **Header Accents:** Add a 4px vertical accent bar of `secondary_container` to the left side of active cards to denote "System Linked."

### New Component: The Telemetry Header
A specific component for this system: A thin bar (24px height) containing a scrolling "bitstream" of randomized hex codes and system status updates in `label-sm`, placed at the very top of modules.

---

## 6. Do’s and Don’ts

### Do:
- **Use Sharp Angles:** Every corner must be `0px`. Roundness is a sign of "soft" consumer tech; we are building "hard" industrial tech.
- **Embrace Asymmetry:** Align technical data to the right while headlines sit on the left. Let elements "hang" off the grid.
- **Incorporate "Glitch" Textures:** Use subtle 1px offset "ghosting" on large display type to suggest a high-energy environment.

### Don't:
- **Don't Use Pure White for Body Text:** Use `on_surface_variant` (#e4bfb1) to prevent eye strain and maintain the "weathered" feel.
- **Don't Use Standard Shadows:** Avoid the "Material Design" drop shadow. If it doesn't look like an LED glow or a physical stack, don't use it.
- **Don't Center Everything:** Centered layouts feel like marketing pages. Left-aligned or justified layouts feel like technical manuals. Use them.