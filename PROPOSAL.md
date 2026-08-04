# Propuesta de Arquitectura y Desarrollo: Plataforma Web Modulação

A continuación se detalla la propuesta técnica, de arquitectura y roadmap para la construcción de la plataforma web oficial de Modulação, asegurando escalabilidad, rendimiento, mantenibilidad y una experiencia de usuario premium.

---

## 1. Arquitectura del Proyecto

El proyecto se estructurará siguiendo los principios de **Domain-Driven Design (DDD)** adaptado al ecosistema de Astro. Esto garantiza que la lógica de negocio esté completamente desacoplada de la interfaz de usuario (Astro components) y de la infraestructura (Base de datos, almacenamiento).

- **Framework Frontend/Backend:** Astro (SSR - Server-Side Rendering).
- **Lenguaje:** TypeScript estricto.
- **Estilos:** Tailwind CSS v4.
- **Base de Datos:** TursoDB (SQLite) con Drizzle ORM.
- **Almacenamiento de Archivos:** Vercel Blob.
- **Autenticación:** Sesiones basadas en cookies encriptadas (usando `iron-session`) y middleware de Astro (`src/middleware.ts`). Registro exclusivo por enlaces tokenizados enviados por email.
- **Despliegue:** Vercel (Edge/Serverless).

---

## 2. Estructura de Carpetas

```text
/src
  /application       # Casos de uso (ej. InviteUserUseCase, CreatePostUseCase)
  /components        # Componentes UI de Astro y React/Solid (si es necesario por interactividad)
    /core            # Design System (Button, Input, Modal, Icon)
    /domain          # Componentes específicos de dominio (EventCard, PlayerProfile)
    /layout          # Componentes de estructura (Navbar, Footer, Sidebar)
  /config            # Configuraciones globales y variables de entorno (tenant.ts)
  /domain            # Entidades, Tipos y Puertos/Interfaces (ej. IUserRepository)
  /infrastructure    # Implementaciones técnicas (Drizzle repos, Vercel Blob, Email, Turso)
    /db              # Esquemas de Drizzle ORM y migraciones
  /i18n              # Textos e internacionalización
  /layouts           # Layouts de Astro (BaseLayout, AppLayout, AdminLayout)
  /pages             # Enrutamiento basado en archivos de Astro
    /api             # Endpoints (v1/) para uso del cliente y webhooks
    /admin           # Rutas del panel de administración
    /[username]      # Rutas dinámicas de perfiles
  /styles            # CSS global, variables de Tailwind v4 y @theme
  /utils             # Funciones utilitarias (formatters, SEO helpers)
```

---

## 3. Modelo de Datos y 4. Entidades Principales

El esquema se definirá mediante Drizzle ORM.

**Usuarios y Accesos**
- `users`: id, email, password_hash, role_id, status (INVITED, ACTIVE, BANNED), created_at.
- `roles` y `permissions`: Gestión granular (RBAC).
- `invitations`: id, email, token, expires_at, used_at.

**Perfiles y Comunidad**
- `profiles`: user_id, username, first_name, last_name, bio, avatar_url, country, city, group_id.
- `groups`: id, name, type (COUNTRY, CITY), parent_group_id.
- `posts` (Comunidad): id, author_id, content, media_urls.
- `comments` y `reactions`: Para posts, noticias y eventos.

**Contenido (Noticias, Comunicados, Eventos)**
- `content`: id, type (NEWS, ANNOUNCEMENT), title, slug, body, author_id, published_at.
- `events`: id, title, slug, description, location, date, capacity, organizer_id.
- `event_attendees`: event_id, user_id, status (ATTENDING, WAITLIST) -> Clave primaria compuesta.

**Deportes (Campeonatos)**
- `seasons`: id, name, year.
- `championships`: id, name, season_id.
- `teams`: id, name, logo_url.
- `team_players`: team_id, user_id (vinculado al perfil).
- `matches`: id, championship_id, home_team, away_team, date, status, home_score, away_score.
- `match_events`: match_id, player_id, type (GOAL, YELLOW_CARD, RED_CARD, ASSIST), minute.

**Catálogo**
- `products`: id, name, description, price, active.
- `product_images` y `product_variants`.

---

## 5. Relaciones

- **Usuario 1:1 Perfil:** Cada cuenta tiene un perfil único asociado a un `@username`.
- **Evento 1:N Asistentes:** Un evento tiene múltiples usuarios (limitados por la capacidad, el resto va a lista de espera).
- **Equipo N:M Jugadores:** Gestionado por `team_players`. Los jugadores son instancias del `Profile`.
- **Campeonato 1:N Partidos:** Un campeonato organiza muchos partidos.

---

## 6. Diseño del Sistema de Permisos

Implementaremos **RBAC (Role-Based Access Control)** extensible:
- **Roles base:** `ADMIN`, `MEMBER`, `GUEST` (implícito).
- En la base de datos se definirán banderas de permisos (ej. `can_manage_events`, `can_publish_news`).
- El `middleware.ts` interceptará peticiones a `/admin/*` validando que la sesión tenga el rol/permisos adecuados. De lo contrario, retorna 403 o redirige a login.

---

## 7. Arquitectura de Componentes

- **Agnósticos de Dominio:** En `src/components/core/` (Ej. `<Button>`, `<Badge>`, `<Card>`). Solo reciben props de UI y no saben nada de la base de datos.
- **De Dominio:** En `src/components/domain/` (Ej. `<ChampionshipTable championshipId={12} />`). Estos componentes consumirán los Casos de Uso desde `src/application` en el servidor (Astro SSR) para renderizar HTML final.
- **Interactividad:** Usaremos componentes de cliente (React, Preact, o Vanilla JS con Web Components) de forma muy aislada (Islands Architecture) para editores WYSIWYG, subida de archivos o pasarela de comentarios dinámica.

---

## 8. Diseño del Sistema de Layouts

- `BaseLayout.astro`: Contiene el cascarón HTML, el componente `<SEO />` (OpenGraph, JSON-LD, Canonical), inyección del fondo de "ondas moduladoras" (`body::before`) e inicialización del modo Dark/Light.
- `PublicLayout.astro`: Navegación principal, Footer.
- `AppLayout.astro`: Layout para miembros con Sidebar/Navegación contextual a la comunidad y perfil.
- `AdminLayout.astro`: Panel de control, minimalista y maximizado para visualizar datos (Tablas, Formularios CRUD).

---

## 9. Design System

- **Colores:**
  - Negro: Fondos base y superficies oscuras.
  - Blanco: Textos principales, fondos en modo claro.
  - Dorado (Gold): Acentos, botones primarios, focus rings e iconografía destacada.
- **Tipografía:** Moderna y geométrica para un look premium (ej. *Geist*, *Inter* o *Manrope*).
- **Tema (Tailwind v4):** Las variables CSS estarán definidas en `src/styles/global.css` dentro de un bloque `@theme`.
- **Patrón Visual:** Las "ondas moduladoras" serán un fondo global fijo, con capas semi-transparentes (`backdrop-blur`) en las tarjetas y contenedores para dar profundidad técnica y elegante.
- **Banderas:** Implementación estricta de `flag-icons` CSS.
- **Accesibilidad:** Soporte ARIA y anillos de foco visibles en todos los elementos interactivos.

---

## 10. Mapa Completo del Sitio

- `/` (Home)
- `/nosotros` (Acerca de, FAQ)
- `/noticias` y `/noticias/[slug]`
- `/comunicados` y `/comunicados/[slug]`
- `/eventos` y `/eventos/[slug]`
- `/comunidad` (Feed de publicaciones)
- `/directorio` (Filtros por país, ciudad)
- `/[username]` (Perfil público)
- `/campeonatos` y `/campeonatos/[slug]`
- `/catalogo`
- `/admin` (Dashboard)
  - `/admin/usuarios`, `/admin/eventos`, `/admin/noticias`, `/admin/campeonatos`, etc.

---

## 11. Flujo de Navegación

1. **Visitante:** Aterriza en Home. Ve últimos resultados, eventos futuros, noticias. Puede navegar por perfiles (vista reducida) y catálogo (ver e ir a WhatsApp).
2. **Registro/Ingreso:** El visitante no puede registrarse por sí mismo. El Admin le envía invitación -> Recibe email -> Hace clic en link -> Crea contraseña -> Entra al sistema.
3. **Miembro:** Entra. Accede a `/comunidad` para ver feed. Puede dar RSVP a eventos. Puede editar su biografía.
4. **Admin:** Navega a `/admin` mediante un botón en el menú de usuario. Accede a las tablas CRUD para gestionar toda la plataforma.

---

## 12. Roadmap y Fases de Implementación

**Fase 1: Fundación y Autenticación (Core)**
- Configuración de Astro, Tailwind v4, Drizzle, Turso (modo en memoria por ahora) e i18n base.
- Diseño del BaseLayout, componentes Core UI básicos.
- Sistema de usuarios, invitaciones, login e `iron-session`.
- Middleware de protección de rutas y perfiles de usuario básicos (vista `/[username]`).

**Fase 2: Sitio Institucional y Contenido**
- Homepage (Hero, secciones dinámicas integradas).
- Página de "Quiénes Somos".
- Módulo de Noticias y Comunicados (Listado, Detalle, SEO estricto).
- Módulo de Eventos (Listado, Detalle, Registro Asistencia / Lista de Espera).

**Fase 3: Comunidad y Directorio**
- Directorio global de miembros con filtros y páginas de Grupo (País/Ciudad).
- Módulo de Comunidad (Creación de posts tipo red social, adjuntos, comentarios, reacciones).
- Expansión de perfiles (actividad reciente, galerías, insignias).

**Fase 4: Sistema Deportivo y Catálogo**
- Módulo de Campeonatos (Temporadas, equipos, calendarios, partidos, tabla de posiciones automática, goleadores).
- Catálogo de productos (Variantes, galerías, contacto directo por WhatsApp).

**Fase 5: Panel de Administración, Búsqueda y Refinamiento**
- Panel Backoffice completo (CRUD exhaustivo protegido con validaciones fuertes y errores JSON).
- Buscador global implementado (búsqueda cruzada en DB para posts, usuarios, noticias).
- Sistema de Notificaciones (internas y por email).
- Auditoría final: Performance (LCP, SEO JSON-LD), Accesibilidad (AA), revisión de diseño y QA.

---

Por favor, revisa esta propuesta. Si estás de acuerdo con la arquitectura y el roadmap trazado, confirmaremos este plan y comenzaremos de inmediato con la **Fase 1** y los primeros pasos del desarrollo.
