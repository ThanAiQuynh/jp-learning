---
name: Minna no Nihongo Learning App
description: A structured, calm companion to the Minna no Nihongo curriculum
colors:
  primary: "#e82828"
  primary-deep: "#a22020"
  accent: "#aa3bff"
  indigo: "#6366f1"
  gold: "#f59e0b"
  success: "#107c10"
  success-bg: "#dff6dd"
  error: "#d13438"
  error-bg: "#fde7e9"
  neutral-bg: "#ffffff"
  neutral-bg-subtle: "#f4f3ec"
  neutral-surface: "#ffffff"
  neutral-ink: "#08060d"
  neutral-muted: "#6b6375"
  neutral-border: "#e5e4e7"
typography:
  caption:
    fontSize: "12px"
  subtext:
    fontSize: "14px"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontSize: "18px"
  headline:
    fontSize: "24px"
  display-sm:
    fontSize: "32px"
  display-lg:
    fontSize: "40px"
  japanese:
    fontFamily: "Noto Sans JP, sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
  kanji-grid:
    fontFamily: "Noto Sans JP, sans-serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.2
  kanji-display:
    fontFamily: "Noto Sans JP, sans-serif"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1.2
  kanji-hero:
    fontFamily: "Noto Sans JP, sans-serif"
    fontSize: "80px"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  card-base:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: Minna no Nihongo Learning App

## 1. Overview

**Creative North Star: "The Ink & Paper Ledger"**

The visual system is designed to evoke a pristine, crisp study desk. It pairs structured textbook rigor with modern digital precision. High-contrast typography and clear visual boundaries allow learners to focus deeply on Japanese text—kanji, hiragana, and grammar structures—without visual fatigue or unnecessary decoration.

The system rejects loud gamification tropes, heavy dark-mode chrome, neon status bars, and infantile mascot animations. The interface is composed, steady, and purposeful.

**Key Characteristics:**
- High-legibility Japanese typography (`Noto Sans JP`) paired with clean sans-serif UI type (`Inter`).
- Restrained color application anchored by traditional Japanese Red (朱色 Shu-iro).
- Flat-at-rest card layouts with crisp 1px borders and subtle elevation on state changes.
- Fixed, predictable scale and layout boundaries for focus and momentum.

## 2. Colors

The color palette uses Japanese Red (`#e82828` / `oklch(0.489 0.190 28.3)`) as its primary anchor, supported by restrained neutral surfaces and subtle semantic accents.

### Primary
- **Shu-iro Red** (`#e82828`): Used for primary CTAs, active study states, and key brand anchors. It embodies focused energy without feeling aggressive.

### Secondary
- **Indigo Ai-iro** (`#6366f1`): Used for secondary category badges (nouns, grammar connections).

### Accent & Semantic
- **Gold Kin-iro** (`#f59e0b`): Reserved for progress highlights, star ratings, and review notifications.
- **Purple Accent** (`#aa3bff`): Used sparingly for interactive highlights and interactive counter indicators.

### Neutral
- **Paper White** (`#ffffff`): Main content background for maximum contrast.
- **Ink Black** (`#08060d`): Primary text color for crisp, effortless reading.
- **Muted Charcoal** (`#6b6375`): Secondary body text, furigana annotations, and subtext.
- **Border Gray** (`#e5e4e7`): Crisp structural boundaries for cards and panels.

### Named Rules
**The Restrained Accent Rule.** Primary red and accent colors are restricted to ≤10% of any view. Neutral surfaces carry the content so the Japanese text remains the sole focal point.

## 3. Typography

**Display & Body Font:** Inter (Latin) paired with Noto Sans JP (Japanese).
**Mono Font:** ui-monospace / Consolas for code and counters.

### Hierarchy
- **Kanji Display** (Regular, 64px, line-height 1.2): Dedicated stroke and kanji inspection views.
- **Headline / H1** (Medium, 36px–56px, letter-spacing -0.03em): Page titles and major section headers.
- **Title / H2** (Medium, 20px–24px, letter-spacing -0.01em): Card headers and lesson pattern titles.
- **Body** (Regular, 16px, line-height 1.5): Standard prose and translations. Max line length 65–75ch.
- **Japanese Text** (Regular, 16px–24px, line-height 1.8): Japanese text requiring extra line height for furigana spacing.
- **Furigana / Subtext** (Regular, 10px–12px, line-height 1.0): Phonetic readings above kanji (`<ruby>` annotations).

### Named Rules
**The Furigana Line-Height Rule.** Any block containing ruby text must enforce a minimum line-height of 1.8 (`line-height-jp`) to prevent ruby text from colliding with preceding lines.

## 4. Elevation

The app uses flat-at-rest surfaces with crisp 1px borders. Elevation via drop shadows is reserved exclusively for interactive feedback (hover, focus, dragging) and modal popovers.

### Shadow Vocabulary
- **Card Hover** (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)`): Subtle lift when hovering over actionable lesson cards.
- **Modal / Popover** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)`): Used for detail drawers and dropdown menus.

### Named Rules
**The Border-First Depth Rule.** Surfaces establish separation through 1px solid `--border` boundaries at rest. Shadows never replace structural borders.

## 5. Components

### Buttons
- **Shape:** Rounded md (`8px`) or pill (`full` for tag toggles).
- **Primary:** Shu-iro Red background (`#e82828`), white text (`#ffffff`), 8px 16px padding. Hover transitions to deep red (`#a22020`).
- **Subtle / Ghost:** Transparent background with subtle border shift on hover.

### Cards / Containers
- **Corner Style:** Radius lg (`12px`).
- **Background:** Paper White (`#ffffff`) or subtle neutral background (`#f4f3ec`).
- **Border:** 1px solid `--border` (`#e5e4e7`).
- **Internal Padding:** 16px on mobile, 24px on desktop.

### Flashcards
- **Flip Behavior:** 3D transform (`preserve-3d`, 0.6s ease-out flip animation).
- **Surface:** Large centered Japanese typography with clear distinction between front and back.

### Inputs / Selects
- **Style:** 1px solid stroke, 8px radius, subtle background.
- **Focus State:** 2px primary accent ring with zero layout shift.

### Navigation
- **Desktop Sidebar:** 280px fixed width, structured links with Fluent icons.
- **Mobile Navigation:** 56px bottom bar with clear active indicators.

## 6. Do's and Don'ts

### Do:
- **Do** maintain a strict 4.5:1 WCAG AA contrast ratio between body text and backgrounds.
- **Do** allow toggle controls for furigana and romaji so learners can test their recall.
- **Do** use `Noto Sans JP` for proper Japanese character glyph rendering across all operating systems.
- **Do** keep spacing structured and predictable across mobile and desktop breakpoints.

### Don't:
- **Don't** use heavy game-UI aesthetics—no neon glow bars, dark chrome frames, or excessive XP reward popups.
- **Don't** pair colored side-stripe borders (`border-left > 1px`) on lesson cards or alerts.
- **Don't** use gradient text or decorative glassmorphism blurs.
- **Don't** use fluid clamp typography for product UI controls; stick to fixed pixel/rem steps.
