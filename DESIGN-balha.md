---

version: 10.0.0 name: Balha description: A high-density, conversion-first interface anchored on soft off-white canvas with navy foreground and zero-shadow depth. The system reads as utilitarian-precision SaaS — tight spacing, card-based navigation, no scroll, progressive disclosure via tabs and accordions. Brand voltage comes from strict typographic hierarchy (Rethink Sans, max weight 600), color contrast between background and card surfaces, and the radical absence of shadows, gradients, and decorative elements. colors: primary: "\#0C228F" primary-hover: "\#091B6E" primary-foreground: "\#FFFFFF" secondary: "\#FF9500" secondary-foreground: "\#FFFFFF" foreground: "\#031525" background: "\#F9FAFB" card: "\#FFFFFF" card-foreground: "\#031525" muted: "\#EDEDED" muted-foreground: "\#6B7280" accent: "\#EBEDEF" accent-foreground: "\#031525" border: "\#E5E5E5" input: "\#F7F9FA" ring: "\#2E70FF" success: "\#10B981" warning: "\#F59E0B" error: "\#EF4444" destructive: "\#EF4444" destructive-foreground: "\#FFFFFF" sidebar: "\#F7F8F8" sidebar-foreground: "\#031525" sidebar-primary: "\#0C228F" sidebar-primary-foreground: "\#FFFFFF" sidebar-accent: "\#E3ECF6" sidebar-accent-foreground: "\#517AD2" sidebar-border: "\#E1E8ED" sidebar-ring: "\#2E70FF" chart-1: "\#1E9DF1" chart-2: "\#00B87A" chart-3: "\#F7B928" chart-4: "\#17BF63" chart-5: "\#E0245E"

typography: display: fontFamily: "Rethink Sans, sans-serif" fontSize: 48px fontWeight: 600 lineHeight: 1.1 letterSpacing: \-0.025em heading-1: fontFamily: "Rethink Sans, sans-serif" fontSize: 32px fontWeight: 600 lineHeight: 1.2 letterSpacing: 0.025em heading-2: fontFamily: "Rethink Sans, sans-serif" fontSize: 24px fontWeight: 600 lineHeight: 1.3 letterSpacing: 0.025em heading-3: fontFamily: "Rethink Sans, sans-serif" fontSize: 20px fontWeight: 600 lineHeight: 1.35 letterSpacing: 0.025em body: fontFamily: "Rethink Sans, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.025em body-small: fontFamily: "Rethink Sans, sans-serif" fontSize: 14px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.025em caption: fontFamily: "Rethink Sans, sans-serif" fontSize: 12px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.025em button: fontFamily: "Rethink Sans, sans-serif" fontSize: 16px fontWeight: 600 lineHeight: 1 letterSpacing: 0.025em button-small: fontFamily: "Rethink Sans, sans-serif" fontSize: 14px fontWeight: 600 lineHeight: 1 letterSpacing: 0.025em nav-link: fontFamily: "Rethink Sans, sans-serif" fontSize: 14px fontWeight: 500 lineHeight: 1.4 letterSpacing: 0.025em tabular: fontFamily: "Rethink Sans, sans-serif" fontSize: 16px fontWeight: 400 lineHeight: 1.5 letterSpacing: 0.025em fontVariantNumeric: "tabular-nums"

rounded: sm: 4px md: 8px lg: 12px xl: 16px full: 9999px

spacing: xs: 4px sm: 8px md: 16px lg: 24px xl: 32px xxl: 48px section: 64px

## components: button-primary: backgroundColor: "{colors.primary}" textColor: "{colors.primary-foreground}" typography: "{typography.button}" fontWeight: 600 rounded: "{rounded.md}" padding: 12px 24px minHeight: 48px button-primary-hover: backgroundColor: "{colors.primary-hover}" textColor: "{colors.primary-foreground}" rounded: "{rounded.md}" transition: "150ms" button-primary-disabled: backgroundColor: "{colors.muted}" textColor: "{colors.muted-foreground}" rounded: "{rounded.md}" opacity: 0.5 cursor: "not-allowed" button-secondary: backgroundColor: "transparent" textColor: "{colors.foreground}" typography: "{typography.button}" rounded: "{rounded.md}" borderColor: "{colors.border}" borderWidth: 1px padding: 12px 24px minHeight: 48px button-secondary-hover: backgroundColor: "{colors.muted}" textColor: "{colors.foreground}" rounded: "{rounded.md}" transition: "150ms" button-ghost: backgroundColor: "transparent" textColor: "{colors.foreground}" typography: "{typography.button-small}" rounded: "{rounded.md}" padding: 8px 16px button-icon: backgroundColor: "transparent" textColor: "{colors.foreground}" rounded: "{rounded.full}" width: 44px height: 44px minTouchTarget: "44x44px" text-link: backgroundColor: "transparent" textColor: "{colors.primary}" typography: "{typography.body}" textDecoration: "underline" card-container: backgroundColor: "{colors.card}" textColor: "{colors.card-foreground}" rounded: "{rounded.lg}" borderColor: "{colors.border}" borderWidth: 1px padding: "{spacing.lg}" card-interactive: backgroundColor: "{colors.card}" textColor: "{colors.card-foreground}" rounded: "{rounded.lg}" borderColor: "{colors.border}" borderWidth: 1px padding: "{spacing.lg}" cursor: "pointer" card-interactive-hover: backgroundColor: "{colors.muted}" transition: "150ms" card-grid: display: "grid" gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" gap: "{spacing.lg}" card-scroll-horizontal: display: "flex" overflowX: "auto" scrollSnapType: "x mandatory" gap: "{spacing.lg}" padding: "{spacing.md} 0" card-scroll-item: minWidth: "320px" maxWidth: "400px" scrollSnapAlign: "start" flexShrink: 0 hero-card: backgroundColor: "{colors.card}" textColor: "{colors.card-foreground}" rounded: "{rounded.xl}" borderColor: "{colors.border}" borderWidth: 1px padding: "{spacing.xl}" feature-card: backgroundColor: "{colors.card}" textColor: "{colors.card-foreground}" typography: "{typography.heading-3}" rounded: "{rounded.lg}" borderColor: "{colors.border}" borderWidth: 1px padding: "{spacing.lg}" metric-card: backgroundColor: "{colors.card}" textColor: "{colors.card-foreground}" rounded: "{rounded.lg}" borderColor: "{colors.border}" borderWidth: 1px padding: "{spacing.lg}" textAlign: "center" testimonial-card: backgroundColor: "{colors.card}" textColor: "{colors.card-foreground}" typography: "{typography.body}" rounded: "{rounded.lg}" borderColor: "{colors.border}" borderWidth: 1px padding: "{spacing.lg}" text-input: backgroundColor: "{colors.input}" textColor: "{colors.foreground}" typography: "{typography.body}" rounded: "{rounded.md}" borderColor: "{colors.border}" borderWidth: 1px padding: 12px 16px minHeight: 48px text-input-focus: backgroundColor: "{colors.input}" textColor: "{colors.foreground}" rounded: "{rounded.md}" borderColor: "{colors.ring}" borderWidth: 2px ringWidth: 2px ringColor: "{colors.ring}" text-input-error: backgroundColor: "{colors.input}" textColor: "{colors.foreground}" rounded: "{rounded.md}" borderColor: "{colors.error}" borderWidth: 1px textarea: backgroundColor: "{colors.input}" textColor: "{colors.foreground}" typography: "{typography.body}" rounded: "{rounded.md}" borderColor: "{colors.border}" borderWidth: 1px padding: 12px 16px minHeight: 96px select: backgroundColor: "{colors.input}" textColor: "{colors.foreground}" typography: "{typography.body}" rounded: "{rounded.md}" borderColor: "{colors.border}" borderWidth: 1px padding: 12px 16px minHeight: 48px checkbox: backgroundColor: "{colors.card}" borderColor: "{colors.border}" borderWidth: 1px rounded: "{rounded.sm}" width: 20px height: 20px checkbox-checked: backgroundColor: "{colors.primary}" borderColor: "{colors.primary}" textColor: "{colors.primary-foreground}" toggle: backgroundColor: "{colors.muted}" rounded: "{rounded.full}" width: 44px height: 24px toggle-active: backgroundColor: "{colors.primary}" label: typography: "{typography.body-small}" fontWeight: 600 textColor: "{colors.foreground}" marginBottom: "{spacing.sm}" error-message: typography: "{typography.caption}" textColor: "{colors.error}" marginTop: "{spacing.xs}" top-nav: backgroundColor: "{colors.background}" textColor: "{colors.foreground}" typography: "{typography.nav-link}" height: 64px borderBottomWidth: 1px borderColor: "{colors.border}" position: "sticky" top: 0 nav-pill: backgroundColor: "{colors.muted}" textColor: "{colors.foreground}" typography: "{typography.nav-link}" rounded: "{rounded.full}" padding: 6px 16px nav-pill-active: backgroundColor: "{colors.primary}" textColor: "{colors.primary-foreground}" rounded: "{rounded.full}" tab-group: display: "flex" gap: 0 borderBottomWidth: 1px borderColor: "{colors.border}" tab-item: backgroundColor: "transparent" textColor: "{colors.muted-foreground}" typography: "{typography.button-small}" padding: 12px 20px borderBottomWidth: 2px borderColor: "transparent" tab-item-active: backgroundColor: "transparent" textColor: "{colors.primary}" typography: "{typography.button-small}" fontWeight: 600 borderBottomWidth: 2px borderColor: "{colors.primary}" tab-item-hover: textColor: "{colors.foreground}" borderColor: "{colors.muted}" transition: "150ms" accordion-trigger: backgroundColor: "{colors.card}" textColor: "{colors.foreground}" typography: "{typography.heading-3}" padding: "{spacing.md}" borderBottomWidth: 1px borderColor: "{colors.border}" cursor: "pointer" width: "100%" textAlign: "left" accordion-content: backgroundColor: "{colors.card}" padding: "{spacing.md}" typography: "{typography.body}" sidebar: backgroundColor: "{colors.sidebar}" textColor: "{colors.sidebar-foreground}" width: "64px" borderRightWidth: 1px borderColor: "{colors.sidebar-border}" sidebar-expanded: backgroundColor: "{colors.sidebar}" width: "256px" sidebar-item: typography: "{typography.nav-link}" padding: "{spacing.sm} {spacing.md}" rounded: "{rounded.md}" sidebar-item-active: backgroundColor: "{colors.sidebar-primary}" textColor: "{colors.sidebar-primary-foreground}" rounded: "{rounded.md}" sidebar-item-hover: backgroundColor: "{colors.sidebar-accent}" transition: "150ms" breadcrumbs: typography: "{typography.caption}" textColor: "{colors.muted-foreground}" gap: "{spacing.sm}" badge: backgroundColor: "{colors.muted}" textColor: "{colors.foreground}" typography: "{typography.caption}" fontWeight: 600 rounded: "{rounded.full}" padding: 2px 10px badge-success: backgroundColor: "{colors.success}" textColor: "\#FFFFFF" badge-warning: backgroundColor: "{colors.warning}" textColor: "\#FFFFFF" badge-error: backgroundColor: "{colors.error}" textColor: "\#FFFFFF" toast: backgroundColor: "{colors.foreground}" textColor: "\#FFFFFF" typography: "{typography.body-small}" rounded: "{rounded.lg}" padding: "{spacing.md} {spacing.lg}" boxShadow: "none" borderWidth: 1px borderColor: "{colors.border}" toast-success: borderLeftWidth: 4px borderLeftColor: "{colors.success}" toast-error: borderLeftWidth: 4px borderLeftColor: "{colors.error}" toast-warning: borderLeftWidth: 4px borderLeftColor: "{colors.warning}" tooltip: backgroundColor: "{colors.foreground}" textColor: "\#FFFFFF" typography: "{typography.caption}" rounded: "{rounded.md}" padding: "{spacing.sm} {spacing.md}" modal-overlay: backgroundColor: "rgba(3, 21, 37, 0.5)" modal-content: backgroundColor: "{colors.card}" textColor: "{colors.card-foreground}" rounded: "{rounded.xl}" borderColor: "{colors.border}" borderWidth: 1px padding: "{spacing.xl}" skeleton: backgroundColor: "{colors.muted}" rounded: "{rounded.md}" animation: "pulse" divider: backgroundColor: "{colors.border}" height: "1px" width: "100%" progress-bar: backgroundColor: "{colors.muted}" rounded: "{rounded.full}" height: "8px" progress-bar-fill: backgroundColor: "{colors.primary}" rounded: "{rounded.full}" height: "100%" avatar: backgroundColor: "{colors.muted}" textColor: "{colors.foreground}" rounded: "{rounded.full}" width: "40px" height: "40px" typography: "{typography.body-small}" fontWeight: 600 cta-sticky: backgroundColor: "{colors.primary}" textColor: "{colors.primary-foreground}" typography: "{typography.button}" rounded: "{rounded.full}" padding: 16px 32px position: "fixed" bottom: "{spacing.xl}" right: "{spacing.xl}" zIndex: 50

## Overview

Balha is a high-density, conversion-first design system engineered for cognitive speed and minimal friction. Its surface reads as utilitarian-precision SaaS — a soft off-white canvas ({colors.background} — \#F9FAFB) with pure white cards ({colors.card} — \#FFFFFF) and deep navy foreground text ({colors.foreground} — \#031525). The system rejects decoration entirely: zero shadows, zero gradients, zero bold weights above 600\.

The singular typeface, **Rethink Sans**, handles every role — display, body, buttons, captions. At weight 600 maximum, it creates hierarchy through size and color contrast alone. No monospace, no serif, no second family. The result is unnervingly consistent.

Component voltage comes from **information density without overwhelm** — cards are the atomic unit of layout, organized in scrollable horizontal strips or 2-3 column grids. Content that would traditionally span multiple viewports is restructured into tabs, accordions, or steppers. The CTA is always visible, either contextually within each card or as a fixed global action button.

The system's radical constraint — no scroll — forces a discipline that benefits conversion: every decision point is visible simultaneously, parallel-comparable, and single-click accessible. Progressive disclosure hides complexity; cards expose opportunity.

**Key Characteristics:**

- Soft off-white canvas ({colors.background} — \#F9FAFB) with pure white cards ({colors.card} — \#FFFFFF). The two-tone surface creates elevation without shadows.  
- Navy foreground ({colors.foreground} — \#031525) for all text. Maximum contrast ratio (\>14:1 against card white), zero ambiguity.  
- Rethink Sans exclusively at weight 400-600. Tabular numbers required for all numeric data. No exceptions.  
- Cards as the molecular unit — feature cards, metric cards, testimonial cards, all with {rounded.lg} (12px), 1px {colors.border} outline, zero shadow.  
- Primary CTAs in Balha Blue ({colors.primary} — \#0C228F). One per card, one global sticky CTA per viewport.  
- Secondary accent ({colors.secondary} — \#FF9500) used only for urgency signals and warning states. Never decorative.  
- Scroll horizontal replaces scroll vertical. Card grids with scroll-snap and tab interfaces are the primary navigation method.  
- Sidebar collapses to icon-only (64px) and expands on hover/interaction. Active states use solid primary pill backgrounds.  
- Spacing rhythm is tight: {spacing.section} (64px) between major card groups, {spacing.lg} (24px) internal card padding.  
- Border radius hierarchy: {rounded.md} (8px) for buttons and inputs, {rounded.lg} (12px) for cards, {rounded.xl} (16px) for hero and modal containers, {rounded.full} for avatars, badges, and sticky CTAs.

## Colors

### Brand & Foreground

- **Primary** ({colors.primary} — \#0C228F): The sole action color. CTAs, active states, links. Hover darkens to {colors.primary-hover} (\#091B6E). Never used as decoration.  
- **Secondary** ({colors.secondary} — \#FF9500): Urgency, warnings, secondary highlights. Used sparingly — overuse dilutes its signal value.  
- **Foreground** ({colors.foreground} — \#031525): All body text, headings, labels. A deep navy that reads as nearly black while maintaining lower eye strain than pure \#000000.  
- **Ring** ({colors.ring} — \#2E70FF): Focus indicators only. A bright blue that contrasts against all surfaces.

### Surface Hierarchy

- **Background** ({colors.background} — \#F9FAFB): The page floor — soft off-white, never pure white. Reduces glare while keeping cards distinctly elevated.  
- **Card** ({colors.card} — \#FFFFFF): All content containers. Pure white on the off-white canvas creates the only "elevation" the system needs.  
- **Muted** ({colors.muted} — \#EDEDED): Neutral backgrounds for hover states, skeleton loaders, inactive toggles, badge pills.  
- **Accent** ({colors.accent} — \#EBEDEF): Subtle surface variation for sidebar hovers and secondary grouping.  
- **Border** ({colors.border} — \#E5E5E5): The universal 1px separator. Inputs, card borders, dividers, table lines.  
- **Input** ({colors.input} — \#F7F9FA): Form field backgrounds, slightly warmer than background to signal interactivity.

### Text Hierarchy

- **Foreground** ({colors.foreground} — \#031525): Headings, body text, primary content.  
- **Muted Foreground** ({colors.muted-foreground} — \#6B7280): Secondary text — descriptions, breadcrumbs, captions.  
- **Primary Foreground** ({colors.primary-foreground} — \#FFFFFF): Text on primary buttons and active nav pills.  
- **Secondary Foreground** ({colors.secondary-foreground} — \#FFFFFF): Text on orange urgency buttons.

### Semantic

- **Success** ({colors.success} — \#10B981): Confirmations, success toasts, green badges.  
- **Warning** ({colors.warning} — \#F59E0B): Warning callouts, attention states.  
- **Error / Destructive** ({colors.error} / {colors.destructive} — \#EF4444): Validation errors, destructive actions, error toasts.

### Sidebar Tokens

- **Sidebar** ({colors.sidebar} — \#F7F8F8): Slightly cooler than background for visual distinction.  
- **Sidebar Primary / Active** ({colors.sidebar-primary} — \#0C228F): Active nav item solid fill.  
- **Sidebar Accent Hover** ({colors.sidebar-accent} — \#E3ECF6): Hover state with a blue tint.  
- **Sidebar Border** ({colors.sidebar-border} — \#E1E8ED): Right-edge separator.

## Typography

### Font Family

The system runs **Rethink Sans** exclusively. No fallback families, no monospace for code, no serif for quotes. The constraint is radical and intentional: one typeface, 400-600 weight range, uniform letter-spacing of 0.025em across all sizes except display (-0.025em for tight impact).

The functional split is weight-based, not family-based:

- Weight 600 — display, headings, buttons, labels, active states  
- Weight 500 — navigation, captions  
- Weight 400 — body text, descriptions, input values

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
| :---- | :---- | :---- | :---- | :---- | :---- |
| {typography.display} | 48px | 600 | 1.1 | \-0.025em | Hero headlines, major section titles |
| {typography.heading-1} | 32px | 600 | 1.2 | 0.025em | Page titles, card group headers |
| {typography.heading-2} | 24px | 600 | 1.3 | 0.025em | Section headers, featured card titles |
| {typography.heading-3} | 20px | 600 | 1.35 | 0.025em | Card titles, accordion triggers |
| {typography.body} | 16px | 400 | 1.5 | 0.025em | Default running text, descriptions |
| {typography.body-small} | 14px | 400 | 1.5 | 0.025em | Secondary descriptions, metadata |
| {typography.caption} | 12px | 400 | 1.5 | 0.025em | Labels, breadcrumbs, fine print |
| {typography.button} | 16px | 600 | 1.0 | 0.025em | Primary and secondary button labels |
| {typography.button-small} | 14px | 600 | 1.0 | 0.025em | Tab items, ghost buttons |
| {typography.nav-link} | 14px | 500 | 1.4 | 0.025em | Navigation items, sidebar links |
| {typography.tabular} | 16px | 400 | 1.5 | 0.025em | Numeric data, tables, metrics (tabular-nums required) |

### Principles

Rethink Sans at 600 maximum is the system's typographic spine. Weight 700+ is **prohibited** — it reads as bombastic and breaks the utilitarian precision. The uniform 0.025em letter-spacing across almost all sizes creates a mechanical consistency. Display size inverts to \-0.025em for tight headlines.

Tabular numbers (font-variant-numeric: tabular-nums) are mandatory for any numeric data — metrics, prices, statistics, table columns. Proportional numbers create misalignment that undermines the system's precision character.

No monospace. No serif. No second family. The constraint forces hierarchy through size, weight, and color alone — and the result is cleaner than any multi-font system.

## Layout

### Spacing System

- **Base unit:** 4px.  
- **Tokens:** {spacing.xs} 4px · {spacing.sm} 8px · {spacing.md} 16px · {spacing.lg} 24px · {spacing.xl} 32px · {spacing.xxl} 48px · {spacing.section} 64px.  
- **Section padding:** {spacing.section} (64px) — vertical rhythm between card groups. Tighter than typical SaaS (often 96-120px) to maximize above-the-fold density.  
- **Card internal padding:** {spacing.lg} (24px) for standard cards; {spacing.xl} (32px) for hero and feature cards.  
- **Grid gaps:** {spacing.lg} (24px) between cards in grids; {spacing.md} (16px) within forms and button groups.

### Grid & Container

- **Max content width:** \~1280px centered. No full-bleed layouts — card grids should stay within readable bounds.  
- **Card grid:** repeat(auto-fill, minmax(320px, 1fr)) — responsive 2-3 column grids that collapse naturally.  
- **Horizontal scroll cards:** flex with overflow-x: auto and scroll-snap-type: x mandatory. Items at min-width: 320px, max-width: 400px. The partial reveal of the next card signals scrollability.  
- **Above the fold priority:** The first viewport must contain the complete value proposition — card grid, primary CTA, and navigation. No content essential to conversion may fall below the fold.  
- **Sidebar \+ Content:** Sidebar at 64px (icon-only) with a 256px expanded state. Content area fills remaining space with the card grid.

### Whitespace Philosophy

Balha's whitespace is calibrated for density, not luxury. Section padding at 64px is deliberately tighter than the industry-standard 96px. Internal card padding at 24px provides adequate breathing room without wasting viewport space. The system prioritizes "all decision points visible simultaneously" over "generous breathing room." Every pixel of whitespace must justify its existence against the conversion cost of pushing content down.

## Cards (The Atomic Unit)

Cards are the core layout molecule in Balha — every piece of content lives in a card, and every card lives in a grid or horizontal scroll strip. Cards replace traditional \<section\> elements entirely.

### Card Anatomy

1. **Container:** {component.card-container} — {colors.card} background, 1px {colors.border} border, {rounded.lg} (12px), {spacing.lg} (24px) internal padding. Zero shadow.  
2. **Header (Optional):** Card title in {typography.heading-3} (20px, 600 weight), with optional badge or status indicator aligned right.  
3. **Body:** Short description in {typography.body} or {typography.body-small}. Maximum 2-3 lines. Longer content belongs in an accordion or modal.  
4. **Footer (Optional):** Action button, metadata, or secondary link. Right-aligned CTAs, left-aligned metadata.

### Card Variants

| Component | Surface | Radius | Use |
| :---- | :---- | :---- | :---- |
| {component.card-container} | White | 12px | Default content card, non-interactive |
| {component.card-interactive} | White → Muted hover | 12px | Clickable card, entire surface is a link |
| {component.hero-card} | White | 16px | Featured card with larger radius, key conversion zone |
| {component.feature-card} | White | 12px | Feature highlight with icon \+ title \+ description |
| {component.metric-card} | White | 12px | Single metric display, centered text, large number |
| {component.testimonial-card} | White | 12px | Quote card with avatar \+ attribution |

### Card Layout Modes

**Grid:**

{component.card-grid}

text Responsive grid: 3 columns at desktop, 2 at tablet, 1 at mobile. Cards fill available width.

**Horizontal Scroll:** {component.card-scroll-horizontal} \> {component.card-scroll-item}

text Horizontal strip with snap points. Items at 320-400px width. Ideal for "Recent Projects" or "Quick Actions" sections. The partial reveal of card N+1 signals scroll affordance.

**Featured Single:** A lone {component.hero-card} spanning full width, used for the primary conversion card above the fold. Contains headline, 3 key benefits, CTA, and social proof.

## Components

### Navigation

**top-nav** — Sticky header bar. {colors.background} surface, 64px height, 1px {colors.border} bottom edge. Carries logo (left), primary navigation links (center), and a CTA cluster (right) with optional secondary text-link and primary button. Stays fixed on scroll (though scroll should be minimal). At mobile, collapses to hamburger with slide-out drawer.

**nav-pill / nav-pill-active** — Rounded-full navigation chips used for sub-navigation or filter groups. Active state fills with {colors.primary} and white text. Inactive stays {colors.muted} with foreground text.

**sidebar / sidebar-expanded** — Left-edge vertical navigation. Default state: 64px icon-only column. Expanded state: 256px with icon \+ label. Active items use {colors.sidebar-primary} solid background with white text. Hover reveals {colors.sidebar-accent} background. Right edge has 1px {colors.sidebar-border}.

**sidebar-item / sidebar-item-active / sidebar-item-hover** — Individual navigation items within the sidebar. Active state is a solid primary pill. Hover transitions to accent blue-tinted background over 150ms.

**breadcrumbs** — Horizontal breadcrumb trail in {typography.caption} with {colors.muted-foreground}. Separator uses / or \> character. Required for any flow deeper than 2 levels. Each segment is a {component.text-link} except the current page (plain text).

**tab-group / tab-item / tab-item-active** — Horizontal tab bar with bottom-border active indicator. Tabs replace vertical scroll for related content sections. Active tab gets {colors.primary} bottom border (2px) and text color. Hover transitions to foreground text. Tab panel content renders immediately below.

### Buttons

**button-primary** — Solid Balha Blue background, white text, {typography.button} (16px, 600 weight), 12px × 24px padding, 48px minimum height for touch targets. Rounded 8px. One per card maximum.

**button-primary-hover** — Darkens to {colors.primary-hover} (\#091B6E) over 150ms.

**button-primary-disabled** — Switches to {colors.muted} background at 50% opacity, cursor: not-allowed.

**button-secondary** — Transparent background, 1px {colors.border} border, {colors.foreground} text. Same dimensions as primary. Hover fills with {colors.muted} background.

**button-ghost** — Transparent, no border. {typography.button-small} for lower visual weight. Used for tertiary actions in card footers.

**button-icon** — Circular 44×44px transparent button for icon-only actions. Ensures WCAG touch target minimum.

**cta-sticky** — Fixed-position floating action button. {colors.primary} background, {rounded.full} (pill shape), 16px × 32px padding. Positioned bottom: 32px; right: 32px. Always visible regardless of scroll position. The most important action on the page (e.g., "Create Project", "Generate Report").

### Forms & Inputs

**label** — Always-visible label above every input. {typography.body-small} at weight 600\. Never use placeholder-only labeling.

**text-input** — 48px minimum height, {colors.input} background, 1px {colors.border}, 12px × 16px padding, {rounded.md} (8px). Matches the system's utilitarian precision.

**text-input-focus** — Border thickens to 2px {colors.ring}, ring outline of 2px {colors.ring} for visible focus.

**text-input-error** — Border shifts to {colors.error}. Paired with {component.error-message} below.

**error-message** — {typography.caption} in {colors.error}, positioned immediately below the invalid input with 4px gap.

**textarea** — Same styling as text-input with 96px minimum height.

**select** — Native select styled to match text-input. Custom dropdown arrow via CSS.

**checkbox / checkbox-checked** — 20×20px box, 1px border, {rounded.sm} (4px). Checked state fills with {colors.primary} and displays white checkmark.

**toggle / toggle-active** — 44×24px pill. Inactive: {colors.muted}. Active: {colors.primary}. Inner knob is white circle, 20px diameter.

### Feedback & Status

**badge** — Small pill labels. {colors.muted} background, {typography.caption} at weight 600, 2px × 10px padding, {rounded.full}.

**badge-success / badge-warning / badge-error** — Semantic color variants with white text.

**toast** — Notification card. {colors.foreground} background (navy), white text, no shadow, 1px border. Left-edge color stripe (4px) indicates type: green for success, red for error, amber for warning.

**tooltip** — Small hover popup. Navy background, white text, {rounded.md}, 8px × 16px padding.

**progress-bar / progress-bar-fill** — 8px height, {rounded.full}. Track uses {colors.muted}. Fill uses {colors.primary}.

**skeleton** — \`  
