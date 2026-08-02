# Design System & Visual Identity: Modulating Waves

## Concept
The "Modulating Waves" design system is inspired by audio waveforms, signal modulation, and fluid dynamics. It embodies a premium, modern, and highly technical aesthetic that balances rigid structure with organic motion. The visual language conveys connectivity, flow, and continuous transformation.

## Color Palette
The color scheme is designed for a premium SaaS application, emphasizing high contrast, elegant accents, and full support for Light and Dark modes.

### Primary Colors
*   **Brand Black:** `#0A0A0A` (Deep background for dark mode, strong typography in light mode)
*   **Brand Dark:** `#121212` (Elevated surface color)
*   **Brand Dark Card:** `#1F1F1F` (Component background in dark mode)
*   **Brand White:** `#FFFFFF` (Primary text in dark mode, main background in light mode)
*   **Brand Offwhite:** `#F8F9FA` (Soft background for light mode)

### Accent Colors
*   **Brand Gold:** `#D4AF37` (Primary interactive color, premium accent)
*   **Brand Gold Dark:** `#B8860B` (Hover states, deeper accents)

## Typography
The system uses a highly technical yet readable typography stack.
*   **Base/Body (`Geist Sans`):** Clean, modern, highly legible sans-serif for UI elements and reading.
*   **Headings/Display (`Space Grotesk`):** Technical, slightly geometric sans-serif for striking headers and titles.
*   **Monospace (`Geist Mono`):** For code, technical data, and precise alignments.

## Visual Motifs: Modulating Waves & Background Pattern
The defining feature of this identity is the continuous presence of modulating waves.

### Global Background Pattern
*   A subtle, intricate pattern must be present on the `body` background across the entire site.
*   **Structure:** It combines a faint, precise grid (representing structure and digital precision) overlayed with organic, overlapping wave forms (representing modulation and flow).
*   **Implementation:** Achieved via CSS background images (inline SVGs) and radial gradients to create depth without distracting from content.
*   **Opacity:** The pattern remains highly transparent (e.g., `3%` to `10%` opacity) to ensure perfect legibility of the content above it.
*   **Theme Support:** The pattern adapts dynamically to Light and Dark modes using CSS variables and Tailwind classes.

### Micro-interactions & Animation
*   **Smooth Fade:** Content elements should enter the viewport with a subtle upward fade (`animate-smooth-fade`).
*   **Focus States:** Strict WCAG AA compliance with a distinct Brand Gold focus ring.
*   **Hover States:** Interactive elements (buttons, cards) should feature slight elevation and subtle glow effects using the premium shadow system.

## Accessibility
*   Maintain a minimum contrast ratio of 4.5:1 for standard text and 3:1 for large text and UI components.
*   The global background pattern must never interfere with text contrast. Ensure the background gradient overlay softens the pattern behind main content areas.