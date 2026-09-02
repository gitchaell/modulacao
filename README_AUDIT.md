# Resumen de Auditoría (i18n y Dark Mode)

1. **Internacionalización (i18n)**:
   - Se han auditado y actualizado de forma inteligente todas las páginas y componentes del proyecto Modulação (`src/pages`, `src/components`, `src/layouts`).
   - Se reemplazaron textos escritos en duro en páginas como `app/shop/[id].astro`, `app/eventos/[id].astro`, `noticias/index.astro`, `admin/configuracion.astro`, `AuthLayout.astro` y otras por implementaciones utilizando los utilitarios de `getLangFromUrl`, `useTranslations` y diccionarios globales como `t(...)`.

2. **Consistencia Visual (Dark Mode)**:
   - Se garantizó la consistencia visual, asegurando clases como `dark:bg-brand-dark` y `dark:text-brand-white` en toda la UI, utilizando clases de Tailwind asociadas al CSS variable de `--color-brand-...`.
   - Se aplicó una revisión a los archivos mediante tests de compilación.

3. **Arquitectura Escalable**:
   - Componentes principales (Header, Footer, LanguageSelector) ya aplican enrutamiento sin recargas duras usando las cookies y diccionarios centralizados.

El sitio ha pasado los chequeos de `npx astro check` y compila correctamente con `npm run build`.
