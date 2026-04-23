# Pack de Skills para Astro + Tailwind CSS v4 (Español)

## Contenido del Pack (6 skills)

1. **astro-project** — Estructura de proyecto Astro, componentes .astro, layouts con `<slot/>`, islas de interactividad, optimización de imágenes, View Transitions
2. **tailwind-design** — Sistema de diseño con Tailwind v4: @theme CSS-first, clases de utilidad, responsive mobile-first, accesibilidad CSS, adaptación por tipo de proyecto
3. **astro-seo** — SEO dinámico via layout props, Schema.org por sector, BreadcrumbList, sitemap automático, robots.txt, accesibilidad WCAG 2.2 AA
4. **astro-forms** — Formularios seguros como componente Astro: honeypot, detección humana, validación, función serverless Vercel, conexión a N8N
5. **astro-rebuilder** — Reconstrucción de web de cliente: extracción de contenido, identidad visual a @theme, estructura de 4 páginas, checklist
6. **astro-deploy** — Instalación paso a paso (Astro + Tailwind v4 via Vite plugin), Git, .gitignore (excluye skills y .env), variables de entorno seguras, despliegue en Vercel/Cloudflare/Hostinger

## Orden de Uso por Tipo de Proyecto

### Rediseño de web existente:
1. `astro-deploy` (instalación) → 2. `astro-rebuilder` → 3. `astro-project` → 4. `tailwind-design` → 5. `astro-seo` → 6. `astro-forms` → 7. `astro-deploy` (despliegue)

### Landing page desde cero:
1. `astro-deploy` (instalación) → 2. `astro-project` → 3. `tailwind-design` → 4. `astro-seo` → 5. `astro-forms` → 6. `astro-deploy` (despliegue)

### Web multi-página desde cero:
1. `astro-deploy` (instalación) → 2. `astro-project` → 3. `tailwind-design` → 4. `astro-seo` → 5. `astro-forms` → 6. `astro-deploy` (despliegue)

## Fuentes Consultadas

- Documentación oficial Tailwind CSS v4 — tailwindcss.com/docs/installation/framework-guides/astro
- Documentación oficial Astro 5.2+ — astro.build/blog/astro-520 (soporte nativo plugin Vite Tailwind)
- GitHub: withastro/astro (.gitignore oficial), SpillwaveSolutions, jezweb/claude-skills, blencorp/claude-code-kit
- Google Search Central (SEO y sitemap)
- WCAG 2.2 (accesibilidad)

## Instalación en Claude Code

```bash
cp -r skills-astro/ /ruta/a/tu/proyecto/.claude/skills/
```

## Nota sobre .gitignore

La skill `astro-deploy` incluye un .gitignore que excluye la carpeta `.claude/` (donde viven las skills). Esto asegura que al subir el proyecto a GitHub, las skills de desarrollo NO se suben — el repositorio queda limpio con solo el código del sitio.
