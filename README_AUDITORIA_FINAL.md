# Auditoría de Mantenibilidad y Diseño Completa

## Problema Identificado
Varias páginas como `sobre.astro`, `publicacoes.astro` y `contato.astro` eran monolíticas y estaban acopladas a la vista en bruto, sumado a clases y colores "hardcodeados" que no reaccionaban ante el cambio a *Dark Mode*.

## Solución Integrada
1. Componentizamos las secciones en subdirectorios `src/components/sobre`, `src/components/publicacoes`, y `src/components/contato`.
2. Se arreglaron las importaciones de `@lucide/astro` como se detectó en errores y warnings de TypeScrtipt, pasando de alias inline (`<Calendar as CalendarIcon />`) a una versión robusta de JSX.
3. Se reemplazaron más de 50 hexadecimales absolutos por nuestras variables de diseño (ej: `bg-brand-dark-card` en lugar de `bg-[#151515]`), añadiendo prefijos `dark:bg-*` y `dark:text-*`.

## Checks
- `npx astro check --yes` sin errores.
- `npm run build` generado correctamente en la arquitectura de `Vercel / Server`.

El diseño ahora es verdaderamente *Potente, organizado y consistente visualmente para los temas light y dark*.
