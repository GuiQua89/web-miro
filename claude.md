# CLAUDE.md — Proyecto Astro + Tailwind CSS v4

## Sobre el desarrollador

Soy Guido Quagliardi. Dirijo una agencia de diseño web, marketing digital y automatizaciones. Creo y rediseño páginas web para clientes (negocios locales, empresas de servicios, profesionales). Mis clientes están en España/Europa, por lo que todo debe cumplir con el RGPD, LOPDGDD y LSSI-CE.

## Stack tecnológico de este proyecto

Este proyecto usa **Astro + Tailwind CSS v4**.

- **Astro** (última versión estable) como framework de generación estática
- **Tailwind CSS v4** via plugin Vite (`@tailwindcss/vite`), NO la integración legacy `@astrojs/tailwind`
- **Componentes .astro** para todo elemento reutilizable
- **Layouts** con `<slot />` para plantillas de página
- **Despliegue**: Vercel o Cloudflare Pages (preferido) / Hostinger (alternativa)
- **Formularios**: Conectados a N8N via función serverless de Vercel
- **CRM**: Airtable
- **Sitemap**: Generado automáticamente con `@astrojs/sitemap`

## Reglas generales OBLIGATORIAS

### Idioma
- Respóndeme SIEMPRE en español
- Comentarios dentro del código en inglés
- Los textos visibles para el usuario final (contenido de la web) en español salvo que indique otro idioma

### Arquitectura Astro
- Cada página en `src/pages/` como archivo `.astro`
- Componentes reutilizables en `src/components/`
- Un layout base en `src/layouts/BaseLayout.astro` que define `<html>`, `<head>`, `<body>`
- El layout base importa `src/styles/global.css` (donde vive la configuración de Tailwind)
- Las meta tags SEO se pasan como props al layout desde cada página
- Los scripts de interactividad van en `<script>` dentro de los componentes `.astro` (Astro los bundlea y optimiza)

### Estructura de archivos
```
proyecto/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ServiceCard.astro
│   │   ├── ContactForm.astro
│   │   └── Breadcrumbs.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── servicios.astro
│   │   ├── nosotros.astro
│   │   ├── contacto.astro
│   │   ├── aviso-legal.astro
│   │   ├── privacidad.astro
│   │   └── cookies.astro
│   ├── styles/
│   │   └── global.css          ← @import "tailwindcss" + @theme
│   └── assets/
│       └── images/             ← Astro las optimiza automáticamente
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── og-image.jpg
├── api/                        ← Funciones serverless (Vercel)
│   └── contact.js
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .env                        ← Variables de entorno (NO subir a Git)
├── .env.example                ← Referencia de variables (SÍ subir)
└── .gitignore
```

### Tailwind CSS v4
- Configuración CSS-first con `@theme` en `src/styles/global.css`
- Clases de utilidad directamente en el HTML de los componentes
- NO usar `@astrojs/tailwind` (deprecado) — usar `@tailwindcss/vite` como plugin Vite
- Extraer componentes con `@apply` SOLO cuando un patrón se repite en más de 3 lugares
- Responsive siempre mobile-first con prefijos (`md:`, `lg:`)

### Contenido del cliente
- NUNCA inventar contenido, datos, testimonios ni información del cliente
- Si falta información, marcar con `<!-- REVISAR: [qué falta] -->`
- Usar SOLO el contenido real proporcionado por el cliente
- Preservar nombres, teléfonos, direcciones y textos exactos del cliente

### SEO
- Title y description como props del layout, únicos por página
- NO incluir `<meta name="keywords">` (Google lo ignora desde 2009)
- Schema.org JSON-LD adaptado al sector del negocio (pasado como prop `schemaData`)
- BreadcrumbList como componente en páginas interiores
- `site` en `astro.config.mjs` configurado con el dominio real del cliente
- Sitemap generado automáticamente por `@astrojs/sitemap`
- `robots.txt` en `public/` con URL absoluta al `sitemap-index.xml`

### Accesibilidad (WCAG 2.2 AA)
- Todas las imágenes con `alt` descriptivo usando el componente `<Image>` de Astro
- Etiquetas semánticas: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- `aria-label` en navegaciones y botones
- Contraste mínimo 4.5:1 para texto
- Targets táctiles mínimo 44×44px (`min-h-11` en Tailwind)
- Formularios con `<label>` visible en cada input
- Enlace "Saltar al contenido" con `sr-only focus:not-sr-only`
- Respetar `prefers-reduced-motion` con `motion-reduce:` de Tailwind
- Estilos de foco con `focus-visible:outline-2 focus-visible:outline-primary`

### Rendimiento de imágenes
- Usar el componente `<Image>` de Astro (`import { Image } from 'astro:assets'`)
- Las imágenes en `src/assets/` son optimizadas automáticamente por Astro (WebP/AVIF)
- Imagen hero: `loading="eager"`
- Resto de imágenes: `loading="lazy"` (es el default de Astro)
- Las imágenes en `public/` NO se optimizan — usar solo para OG image y favicon

### Islas de interactividad
- Por defecto, todo es HTML estático (CERO JavaScript al navegador)
- Usar `client:load` solo para componentes que necesitan JS inmediatamente
- Usar `client:visible` para componentes interactivos debajo del pliegue
- Usar `client:idle` para componentes de baja prioridad
- Para interactividad simple (menú móvil, scroll), usar `<script>` en componentes Astro en vez de islas con framework

### Formularios y seguridad
- URL del webhook de N8N en variable de entorno `.env` → `N8N_WEBHOOK_URL`
- En Vercel: configurar en Settings → Environment Variables
- Función serverless en `api/contact.js` que valida y reenvía a N8N
- Honeypot con nombre realista y posicionamiento off-screen
- Validación en cliente Y en servidor
- Checkbox RGPD obligatorio (sin pre-marcar) con enlace a política de privacidad

### Cumplimiento legal (España/Europa)
- Incluir SIEMPRE: aviso-legal.astro, privacidad.astro, cookies.astro
- Enlaces en el Footer.astro (se aplican a todas las páginas automáticamente)
- Banner de cookies: usar CMP externo si hay scripts de tracking
- Checkbox de consentimiento en el componente ContactForm.astro

### Git y despliegue
- `.gitignore` DEBE excluir: `node_modules/`, `dist/`, `.astro/`, `.env`, `.claude/`
- Las skills están en `.claude/skills/` y NO se suben a GitHub
- Antes de cada push, verificar con `git status` que no se suban archivos sensibles
- Despliegue: conectar repo GitHub a Vercel → despliegue automático en cada push

## Skills disponibles

Este proyecto tiene las siguientes skills en `.claude/skills/`:

1. `astro-project` — Estructura de proyecto, componentes, layouts, islas
2. `tailwind-design` — Sistema de diseño Tailwind v4, @theme, responsive, accesibilidad
3. `astro-seo` — SEO dinámico, Schema.org, BreadcrumbList, sitemap, accesibilidad WCAG
4. `astro-forms` — Formularios seguros como componente Astro, webhook oculto
5. `astro-rebuilder` — Flujo de reconstrucción de web de cliente
6. `astro-deploy` — Instalación, Git, .gitignore, despliegue
7. `legal-compliance` — Páginas legales, cookies, RGPD

**Lee la skill correspondiente ANTES de empezar a trabajar en esa área.** Las skills contienen reglas específicas, plantillas de código y checklists que DEBEN seguirse.

## Flujo de trabajo

### Para crear una web desde cero:
1. Lee `astro-deploy` → instala el proyecto (si no está creado)
2. Lee `astro-project` → crea layout base, componentes, páginas
3. Lee `tailwind-design` → define sistema de diseño en @theme
4. Lee `astro-seo` → configura SEO, Schema, accesibilidad
5. Lee `astro-forms` → implementa formulario de contacto
6. Lee `legal-compliance` → agrega páginas legales y banner de cookies
7. Lee `astro-deploy` → configura Git, .gitignore, y despliega

### Para rediseñar una web existente:
1. Lee `astro-deploy` → instala el proyecto
2. Lee `astro-rebuilder` → extrae contenido y estilos del cliente
3. Sigue pasos 2-7 del flujo anterior

### Antes de entregar:
- Ejecutar `npm run build` sin errores
- Ejecutar checklist de cada skill
- Verificar con Lighthouse (objetivo: 90+ en todo)
- Confirmar al usuario los archivos creados, contenido usado y datos pendientes de revisión
- Verificar `.gitignore` antes del primer push
