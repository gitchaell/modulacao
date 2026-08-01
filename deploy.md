# Guía de Despliegue en Vercel

Este proyecto está construido con Astro y Turso (libSQL) para la base de datos, y está configurado para ser desplegado en Vercel.

## 1. Configuración de Base de Datos (Turso)

1. Crea una cuenta en [Turso](https://turso.tech/).
2. Crea una nueva base de datos para tu proyecto:
   ```bash
   turso db create modula-db
   ```
3. Obtén la URL de la base de datos:
   ```bash
   turso db show modula-db
   ```
4. Genera un token de autenticación:
   ```bash
   turso db tokens create modula-db
   ```

## 2. Variables de Entorno en Vercel

En el panel de configuración de tu proyecto en Vercel (Settings > Environment Variables), debes añadir las siguientes variables de entorno:

- `TURSO_DATABASE_URL`: La URL de tu base de datos Turso (ej. `libsql://modula-db-usuario.turso.io`).
- `TURSO_AUTH_TOKEN`: El token generado en el paso anterior.
- `SESSION_PASSWORD`: Una contraseña segura y compleja de al menos 32 caracteres para encriptar las sesiones de usuario (`iron-session`).
- `VERCEL_BLOB_READ_WRITE_TOKEN`: (Opcional, si usas Vercel Blob para subir imágenes).

## 3. Sincronizar el Esquema de la Base de Datos

Antes de que la aplicación pueda funcionar, debes enviar el esquema de la base de datos a Turso. En tu entorno local, configura `.env` con las variables de Turso y ejecuta:

```bash
npx drizzle-kit push
```

## 4. Crear el Usuario Administrador (Seed)

Dado que la plataforma funciona por invitación, necesitas un usuario administrador inicial para acceder al Backoffice.
Hemos incluido un script `seed.ts` para esto. Ejecútalo localmente (asegurándote de que tu `.env` apunte a la base de datos de producción o ejecuta local y luego sube a Vercel si usas una base compartida):

```bash
npx tsx seed.ts
```

Esto creará el usuario:
- **Email:** `admin@example.com`
- **Contraseña:** `password123`

## 5. Despliegue

Sube tu código a un repositorio de GitHub y conéctalo a Vercel. Vercel detectará automáticamente que es un proyecto Astro y lo construirá correctamente usando `npm run build`.

## Solución de Problemas (Internal Server Error)

Si ves un *Internal Server Error* en rutas como `/campeonatos`, asegúrate de que:
1. Las variables `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` están correctamente configuradas en Vercel.
2. Si no están, la aplicación intentará usar `file:local.db`, lo cual causará errores en el entorno serverless de Vercel porque el sistema de archivos es de solo lectura.
