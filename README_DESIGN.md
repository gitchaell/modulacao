# Resumen de Auditoría (Diseño y Componentes)

1. **Componentización de Páginas Complejas**:
   - `sobre.astro`: Refactorizado. Se extrajeron `Stats.astro` y `MissionVisionValues.astro`.
   - `publicacoes.astro`: Refactorizado. Se extrajeron `PostFeed.astro` y `Sidebar.astro`.
   - `contato.astro`: Refactorizado. Se extrajeron `ContactForm.astro` y `ContactInfoGrid.astro`.

2. **Consistencia Visual (Light/Dark Theme)**:
   - Se removieron los colores hexadecimales en duro (ej. `[#0a0a0a]`, `[#111]`, `[#0F0F0F]`, `[#151515]`, etc.) en 17 archivos.
   - Se reemplazaron por las variables semánticas de Tailwind v4 definidas en `src/styles/global.css` (`bg-brand-black`, `bg-brand-dark`, `bg-brand-dark-card`, etc.), asegurando un comportamiento unificado y perfecto al hacer el switch entre Light y Dark mode.

El sitio superó con éxito las comprobaciones locales mediante `npx astro check --yes` y la compilación `npm run build`.
