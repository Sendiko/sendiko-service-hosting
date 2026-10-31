---
name: Homelab Craft
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: '0'
  body-sm:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: '0'
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: '0'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.02em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets sovereign developers, self-hosters, and indie infrastructure engineers who demand total transparency, bare-metal telemetry, and utilitarian speed. The aesthetic merges technical precision with indie hacker craftsmanship—eschewing corporate enterprise abstraction in favor of raw architectural visibility, explicit resource specs, and hardware-level telemetry.

The design movement combines **Minimalist High-Density Utility** with **Monospaced Micro-Detailing**:
- **Utilitarian Discipline:** High density with generous structural breathing room. Interfaces act as cockpit dashboards rather than marketing fluff.
- **Hardware-Informed Tactility:** Dark, matte chassis backgrounds (deep slate and zinc) punctuated by high-fidelity status lights (pulsing telemetry emeralds and warning ambers).
- **Architectural Honesty:** Specs are never hidden behind vague tier names. RAM, CPU flags, thermal envelopes, and bandwidth allocations are displayed in crisp, tabular monospace format.

## Colors

The palette reproduces the tactile sensation of a server rack console running in a dim room. Deep zinc and slate layers build physical depth without visual clutter, while high-chroma functional accents deliver immediate semantic orientation.

- **Foundational Canvas (`#090A0F`):** Deep abyssal slate. Used for global application backgrounds, root canvas, and terminal viewports.
- **Surface Elevation 1 (`#0F1117`):** Base node chassis tone. Used for persistent navigation, cards, sidebar trays, and spec sheet containers.
- **Surface Elevation 2 (`#181B26`):** Raised interactive surface. Used for hover states, nested telemetry panels, code blocks, and micro-dialogs.
- **Border / Structural Grid (`#252A3A`):** Low-contrast structural perimeter. Defines hardware badges, card borders, and divider lines with razor-sharp 1px discipline.
- **Primary Interactive (`#6366F1`):** Electric indigo. Reserved for principal actions, primary deploy buttons, active link states, and network focus boundaries.
- **Telemetry Live (`#10B981`):** Bare-metal operational emerald. Exclusively signals verified uptime, healthy daemons, active VPN tunnels, and optimal thermal metrics.
- **Telemetry Warning / Notice (`#F59E0B`):** Warm amber. Flags throttling, pending kernel updates, resource constraints, and active provisioning states.
- **Foreground Neutral (`#F1F5F9`):** Zinc 100 for high-contrast primary text, coupled with `#94A3B8` (Zinc 400) for spec labels, hardware metadata, and inactive switches.

## Typography

The typographic hierarchy pairs the hyper-neutral, geometric precision of **Geist** for prose and navigational architecture with **JetBrains Mono** for all operational parameters, metrics, logs, and pricing data.

- **Geist (Headlines & Body):** Set with deliberate negative tracking at display scales to preserve mechanical cohesion. Body copy operates at standard tracking for readability during extended server management sessions.
- **JetBrains Mono (Metadata, Badges & Server Specs):** Used for IP addresses, CPU loads, memory usage, byte-counts, timestamps, and terminal interfaces. All tabular numeric displays must use tabular figures (`font-variant-numeric: tabular-nums`) to prevent layout shift during live socket streaming.

## Layout & Spacing

The layout is built on a 12-column modular grid designed to accommodate dense telemetry dashboards and multi-node rack views.

- **Grid Discipline:**
  - **Desktop (≥1200px):** 12 columns, 24px (`gutter-desktop`) gutters, max-width bounded container at 1440px with 48px (`margin-desktop`) outer padding.
  - **Tablet (768px – 1199px):** 8 columns, 16px (`gutter`) gutters, 32px (`margin-tablet`) outer margins. Multi-column specs collapse into two-up node comparisons.
  - **Mobile (<768px):** 4 columns, 16px gutters, 16px (`margin`) outer margins. Single column stack with horizontal swipe-scroll for hardware telemetry tables.
- **Spacing Rhythm:** Based on a strict 4px/8px incremental scale (`space-xs` through `space-xl`). Internal component padding uses `space-md` for standard density and `space-sm` for high-density hardware stat clusters.

## Elevation & Depth

This system avoids blurred corporate drop-shadows and skeuomorphic light sources. Elevation is achieved through **tonal stratification** and **subtle architectural borders**.

- **Level 0 (Canvas Base):** Solid `#090A0F`. The foundational floor.
- **Level 1 (Card & Chassis Panels):** `#0F1117` with a 1px solid border in `#252A3A`. Zero cast shadow. Depth is signaled purely by edge contrast.
- **Level 2 (Hover & Active Surfaces):** `#181B26` with a border transition to `#374151` (Zinc 700). Optional ambient under-glow: a subtle, concentrated border bloom using `rgba(99, 102, 241, 0.12)` for focused interactive elements.
- **Level 3 (Overlays & Modals):** `#0F1117` surface, wrapped in a 1px `#252A3A` perimeter with an ambient occluding backdrop blur (`backdrop-filter: blur(8px)`) over an 80% opacity dark canvas (`rgba(9, 10, 15, 0.8)`).

## Shapes

The design system enforces a compact radius scale (`roundedness: 1` — 4px / 0.25rem base) inspired by high-end server equipment faceplates and terminal windows.

- **Base Components (Buttons, Inputs, Metric Badges):** 4px (`rounded`). Clean, structured, industrial corners that maximize canvas efficiency.
- **Cards, Trays, and Terminal Windows:** 8px (`rounded-lg` / 0.5rem) maximum perimeter corner radius, housing internal elements with 4px radii to maintain nested concentricity.
- **Status Dots & Pill Tags:** Full rounded circular forms (`9999px`) are strictly limited to live ping indicators and hardware state lights.

## Components

### Buttons
- **Primary CTA:** Background `#6366F1`, text `#FFFFFF`, font `Geist` 500. Height 36px, horizontal padding 14px, radius 4px. Hover: `#4F46E5`. Active: `#4338CA`. Focus ring: 2px offset border in `#6366F1`.
- **Secondary / Node Action:** Background `#181B26`, text `#F1F5F9`, border 1px solid `#252A3A`. Hover: Background `#252A3A`, border `#374151`.
- **Ghost / Utility (Copy IP, SSH trigger):** Background transparent, text `#94A3B8`, font `JetBrains Mono` 12px. Hover: Background `#181B26`, text `#F1F5F9`.

### Badges & Hardware Status Indicators
- **Node Health Dot:** 6px × 6px circle. Live: `#10B981` with an outer pulsing halo (`box-shadow: 0 0 8px rgba(16, 185, 129, 0.4)`). Throttled: `#F59E0B`. Offline: `#64748B`.
- **Hardware Spec Badge:** Background `#181B26`, border 1px solid `#252A3A`, text `#94A3B8`, font `JetBrains Mono` 11px. Height 22px, padding 0 6px, radius 3px. Shows architecture specs (e.g., `ARM64`, `32GB ECC`, `NVMe-RAID1`).

### Cards & Homelab Node Tiles
- Constructed on `#0F1117` with a 1px `#252A3A` outline and 8px border radius.
- **Card Header:** Houses node hostname, region indicator, and operational status badge.
- **Card Body:** Tabular telemetry grid showcasing Real-Time CPU Load, RAM saturation bars, Disk I/O, and current temperature (`Tctl/Tdie`).
- **Footer:** Fixed network specs (IPv4/IPv6, bandwidth consumed) with one-click terminal SSH copy trigger.

### Input Fields & Terminal Emulators
- **Input Fields:** Background `#090A0F`, border 1px solid `#252A3A`, text `#F1F5F9`, placeholder `#475569`, font `Geist` 14px. Focus: Border `#6366F1` with zero box-shadow. Height 36px.
- **Inline CLI / Code Blocks:** Background `#090A0F`, inset 1px border `#252A3A`, font `JetBrains Mono` 13px, text `#38BDF8`. Integrated copy action in upper-right corner.

### Checkboxes, Switches & Radio Controls
- **Toggle Switch:** Chassis size 36px × 20px, background `#181B26`, border 1px solid `#252A3A`. Thumb: 14px circle, `#94A3B8`. Active state: Chassis `#6366F1`, thumb `#FFFFFF` positioned with a crisp 2px offset.
- **Checkboxes:** 16px × 16px square, radius 3px, border 1px solid `#252A3A`, background `#090A0F`. Checked: Background `#6366F1`, checkmark `#FFFFFF`.

### DevOps Service Tiers & Pricing Tables
- High-contrast, tabular format over typical marketing cards.
- Displays explicit cost per compute unit (e.g., `0.0084 / hr` or `$12 / mo`) alongside hardware specifics: CPU model, core frequency, RAM type, uplinks, and hypervisor stack (Proxmox / KVM / Nomad).
- Feature checks use monospace unicode glyphs (`+` for included, `-` for unavailable) inside a `JetBrains Mono` alignment grid.