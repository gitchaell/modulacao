# Propuesta del Proyecto: Plataforma Web Modulação

A continuación, se detalla la propuesta técnica y arquitectónica para el desarrollo de la plataforma oficial de **Modulação**, priorizando escalabilidad, rendimiento, una arquitectura limpia y una excelente experiencia de usuario bajo los estándares solicitados (Astro, TypeScript, Tailwind CSS v4, TursoDB, y Vercel Blob).

---

## 1. Arquitectura del Proyecto

La arquitectura se basará en el principio de **Separación de Responsabilidades** (Separation of Concerns), utilizando un enfoque modular basado en *Domain-Driven Design (DDD)* simplificado y Arquitectura Hexagonal.

*   **Capa de Presentación (UI):** Renderizado híbrido mediante Astro. Las páginas estáticas (institucional, catálogo, perfiles públicos) usarán SSG (Static Site Generation), mientras que la comunidad, el dashboard y módulos dinámicos usarán SSR (Server-Side Rendering). Componentes construidos nativamente en Astro y, cuando se requiera interactividad en el cliente (islas), se pueden incluir componentes de Preact/React/Svelte (opcional) o Web Components puros bajo demanda.
*   **Capa de Dominio:** Lógica de negocio core (reglas de campeonatos, grupos, comunidad) escrita en TypeScript de forma agnóstica a la infraestructura.
*   **Capa de Acceso a Datos (Infraestructura):** Conexión con TursoDB usando Drizzle ORM (tipado fuerte, edge-compatible). Integración directa con Vercel Blob para la gestión de medios.
*   **Capa de API (Endpoints):** Astro Endpoints (`/api/...`) para manejar mutaciones de datos, invitaciones y notificaciones de forma segura.

---

## 2. Estructura de Carpetas

Basada en la separación entre dominio, UI y datos para un proyecto Astro escalable:

```
├── src/
│   ├── assets/           # Recursos estáticos (imágenes locales, fuentes, íconos)
│   ├── components/       # Componentes visuales puros (UI)
│   │   ├── core/         # Botones, inputs, modales (Design System)
│   │   ├── layouts/      # Cabeceras, pies de página, sidebars
│   │   └── modules/      # Componentes específicos de dominio (Ej. FeedComunidad, TablaPosiciones)
│   ├── data/             # Capa de Infraestructura
│   │   ├── db/           # Configuración de Turso y Drizzle (schema, migraciones)
│   │   └── storage/      # Clientes e integración con Vercel Blob
│   ├── domain/           # Lógica de Negocio
│   │   ├── auth/         # Lógica de invitaciones y sesiones
│   │   ├── community/    # Posts, reacciones, comentarios
│   │   ├── sports/       # Campeonatos, equipos, estadísticas
│   │   └── users/        # Roles, perfiles
│   ├── layouts/          # Layouts de Astro (Base, Admin, Public, App)
│   ├── pages/            # Enrutamiento basado en archivos de Astro
│   │   ├── admin/        # Dashboard administrativo
│   │   ├── api/          # Endpoints de API pública/privada
│   │   ├── app/          # Zona privada de miembros (comunidad, grupos)
│   │   └── index.astro   # Inicio (Public)
│   ├── styles/           # Tailwind v4 globals y tokens
│   └── utils/            # Helpers compartidos (formato de fechas, validaciones)
├── package.json
├── astro.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Modelo de Datos

La base de datos (TursoDB/SQLite) será diseñada de forma relacional y normalizada, optimizada para lecturas y escalabilidad edge. Se usará **Drizzle ORM** para el esquema tipado.

---

## 4. Entidades Principales

*   **User / Profile:** ID, nombre, email, password_hash, biografía, foto_url, ciudad, país, fecha_ingreso, etc.
*   **Role / Permission:** Sistema RBAC (Role-Based Access Control). Roles iniciales: Admin, Member.
*   **Invitation:** Token de registro, email destino, estado (pendiente/usado), fecha_expiracion.
*   **Post / Comment / Reaction:** Para noticias, comunicados y la comunidad.
*   **Event:** Título, descripción, fecha, hora, mapa, organizador_id.
*   **EventAttendance:** Relación de usuarios con eventos (asistirá, lista_espera).
*   **Group:** Entidad de agrupación (ciudad, país).
*   **Championship / Season / Team / Player:** Estructura deportiva.
*   **Match / Statistic:** Partidos, resultados, goles, tarjetas.
*   **Product:** Catálogo, variantes, descripción, imágenes.

---

## 5. Relaciones

*   Un **User** tiene un único **Profile** (1:1).
*   Un **User** pertenece a muchos **Groups** y a muchos **Teams** (N:N).
*   Un **Group** tiene múltiples **Posts** y **Events** (1:N).
*   Un **Post** puede tener múltiples **Comments** y **Reactions** (1:N).
*   Un **Championship** tiene una **Season** y agrupa muchos **Teams** (1:N).
*   Un **Match** relaciona dos **Teams** (Local/Visitante) y genera **Statistics** para N **Players** (1:N).

---

## 6. Diseño del Sistema de Permisos

Implementaremos **RBAC (Role-Based Access Control) con soporte ABAC (Attribute-Based Access Control)** para el futuro.

*   **Roles Base:**
    *   `ADMIN`: Permisos completos en el CRUD de todas las entidades.
    *   `MEMBER`: Permisos de lectura pública y privada. Creación/edición de contenido propio (posts, comentarios). Modificación de su propio perfil.
*   **Implementación:**
    *   **Middleware:** Un middleware global en Astro evaluará la sesión (cookies o JWT seguro) y el rol antes de renderizar rutas protegidas (ej. `/admin/*` o `/app/*`).
    *   **Directivas de UI:** Componentes utilitarios (ej. `<RequireRole role="ADMIN">`) para ocultar/mostrar elementos en la interfaz sin lógica compleja repetida.

---

## 7. Arquitectura de Componentes

Se utilizará el patrón **Atomic Design** ajustado para componentes reutilizables y altamente mantenibles:

*   **Base UI (Core):** Componentes visuales genéricos sin lógica de estado. (Ej. `Button.astro`, `Card.astro`, `Input.astro`, `Badge.astro`).
*   **Modulares (Smart):** Componentes que se conectan al dominio, reciben propiedades específicas y emiten acciones, como `PostCard.astro`, `MatchResultCard.astro`, `ProfileHeader.astro`.
*   **Contenedores:** Vistas de página completa que obtienen los datos de Drizzle (SSR) y se los pasan a los componentes visuales.

---

## 8. Diseño del Sistema de Layouts

El enrutamiento usará Layouts anidados en Astro para evitar repetir lógica de encabezados y menús:

1.  **PublicLayout:** Header transparente/dinámico, hero components, footer corporativo y metadatos SEO/Open Graph completos. Utilizado en `/`, `/nosotros`, `/noticias`.
2.  **AppLayout (Miembros):** Sidebar o Bottom Navigation (mobile), enfocado en la comunidad, sin el ruido institucional. Usado en `/comunidad`, `/eventos`, `/@usuario`.
3.  **AdminLayout:** Dashboard de ancho completo, Sidebar denso con las herramientas CRUD, Breadcrumbs y header con búsqueda rápida. Usado en `/admin/*`.
4.  **AuthLayout:** Diseño minimalista (mitad imagen de marca/ondas moduladoras, mitad formulario) para la creación de contraseña con token.

---

## 9. Design System

El diseño se basará en la estética "Modulação": premium, tecnológica y elegante (inspirada en la indumentaria oficial, sin ser copia literal).

*   **Paleta de Colores:**
    *   *Primario (Gold):* Acentos, botones primarios, iconos de jerarquía (`#D4AF37` / `#B8860B` - variantes ajustadas para contraste AA).
    *   *Fondo (Dark Mode default):* Tonos de negro profundo y gris muy oscuro (`#0A0A0A`, `#121212`, `#1F1F1F` para tarjetas).
    *   *Fondo (Light Mode):* Blanco puro (`#FFFFFF`) y grises crema muy sutiles (`#F8F9FA`).
*   **Tipografía:**
    *   *Headings:* Sans-serif geométrica y moderna (ej. *Inter*, *Outfit* o *Clash Display*) con pesos en Bold y ExtraBold para títulos impactantes.
    *   *Body:* Sans-serif altamente legible (ej. *Inter* o *Geist*).
*   **Motivos Visuales:**
    *   Uso de ondas (Sine/Modulation waves) sutiles como patrones de fondo SVG con baja opacidad.
    *   Modos claro/oscuro soportados nativamente por Tailwind `dark:class`.
*   **Interactividad:** Animaciones fluidas (Transiciones CSS, View Transitions API nativo de Astro) para una sensación de SPA (Single Page Application).

---

## 10. Mapa Completo del Sitio

*   **Público (Visitante & Miembro):**
    *   `/` - Inicio
    *   `/nosotros` - Quiénes somos
    *   `/noticias` - Feed de noticias
    *   `/noticias/[slug]` - Detalle de noticia
    *   `/comunicados` - Oficial
    *   `/eventos` - Próximos eventos y calendario
    *   `/campeonatos` - Hub deportivo (Tablas, fixtures)
    *   `/catalogo` - Productos y servicios (Contactar por WhatsApp)
    *   `/@usuario` - Perfil público del miembro
*   **Privado (Solo Miembros - App):**
    *   `/comunidad` - Feed de red social
    *   `/grupos` - Grupos por país/ciudad
    *   `/directorio` - Búsqueda de miembros
    *   `/ajustes` - Edición de perfil, notificaciones
*   **Administrativo (Solo Admin):**
    *   `/admin/dashboard`
    *   `/admin/miembros` - Invitaciones y roles
    *   `/admin/contenido` - Blog, eventos, comunicados
    *   `/admin/deportes` - Gestión de campeonatos y estadísticas
    *   `/admin/catalogo` - Gestión de productos
*   **Sistema:**
    *   `/invitacion/[token]` - Set password

---

## 11. Flujo de Navegación

1.  **Onboarding:** El Admin genera invitación -> Email con link `/invitacion/abc-123` -> Usuario establece clave -> Redirección a `/comunidad`.
2.  **Navegación Pública:** Usuario aterriza en `/` -> Hero lo dirige al `/catalogo` o `/campeonatos` -> Navega a perfiles públicos (`/@juanperez`).
3.  **App Experience:** Miembro entra a `/comunidad` -> Lee post -> Comenta -> Visita el perfil del autor -> Ve el grupo del autor -> Se inscribe a un evento de ese grupo -> Recibe notificación in-app/email.

---

## 12. Roadmap (Fases de Implementación)

*   **Fase 1: Foundations & Auth**
    *   Setup de Astro, Tailwind v4, Turso, Vercel Blob.
    *   Configuración de ESLint/Prettier, estructura de carpetas.
    *   Sistema de layouts base y UI Kit inicial (Design System).
    *   Sistema de Invitaciones, Auth (sesiones, middleware, protección de rutas).
*   **Fase 2: Sitio Institucional & SEO**
    *   Home (Hero, resúmenes estáticos), Quiénes Somos.
    *   Motor de Noticias y Comunicados (Editor visual, tags).
    *   Metadatos SEO, Open Graph, Sitemap.
*   **Fase 3: Red Social / Comunidad**
    *   Directorio de Miembros, Perfiles Públicos Completos (`/@usuario`).
    *   Feed de Comunidad (Posts, imágenes con Vercel Blob, comentarios, reacciones).
*   **Fase 4: Eventos y Grupos**
    *   Módulo de Grupos (País, Ciudad).
    *   Módulo de Eventos (Asistencia, lista de espera, mapas, galería).
*   **Fase 5: Panel Administrativo y Catálogo**
    *   Dashboard administrativo (CRUD completo de usuarios, noticias, eventos).
    *   Catálogo de Productos (Links a WhatsApp).
*   **Fase 6: Plataforma Deportiva (Campeonatos)**
    *   Dominio complejo: Torneos, Equipos, Jugadores, Fixtures, Estadísticas, Tablas automáticas.
*   **Fase 7: Pulido, Búsqueda y Notificaciones**
    *   Implementación de Buscador Global.
    *   Sistema centralizado de Notificaciones (In-app y correos transaccionales).
    *   Auditoría de rendimiento (Lighthouse, Accesibilidad AA) y lanzamiento.
