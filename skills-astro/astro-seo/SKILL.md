---
name: astro-seo
description: >
  Usa esta skill para todo lo relacionado con SEO, accesibilidad WCAG 2.2 AA, Schema.org, y meta tags en proyectos Astro.
  Cubre: meta tags dinámicas via layout props, Schema.org por sector de negocio, BreadcrumbList, sitemap automático,
  robots.txt, Open Graph, accesibilidad para lectores de pantalla, contraste, navegación por teclado, y testing.
  Se activa con: "optimiza SEO en Astro", "agrega Schema", "meta tags", "accesibilidad", "WCAG",
  "posicionamiento", "sitemap", "robots.txt", "datos estructurados". SIEMPRE usar junto con astro-project.
  Esta skill reemplaza a html-seo-structure y sitemap-robots cuando se trabaja con Astro.
---

# SEO y Accesibilidad en Astro

En Astro, el SEO se gestiona a través del layout base y los props de cada página. El sitemap se genera automáticamente con la integración oficial. Las reglas de accesibilidad WCAG 2.2 son las mismas que en HTML puro.

## Meta Tags Dinámicas via Layout

Las meta tags se definen en el layout base y cada página las personaliza via props:

```astro
---
// src/layouts/BaseLayout.astro — El <head> con SEO completo

interface Props {
    title: string;            // Obligatorio: 50-60 caracteres, keyword primero
    description: string;      // Obligatorio: 140-160 caracteres con CTA
    ogImage?: string;         // Opcional: imagen para compartir en redes
    canonicalUrl?: string;    // Opcional: URL canónica si difiere
    noindex?: boolean;        // Opcional: true para páginas que no deben indexarse
    schemaData?: string;      // Opcional: JSON-LD como string
}

const {
    title,
    description,
    ogImage = '/og-image.jpg',
    canonicalUrl,
    noindex = false,
    schemaData
} = Astro.props;

const siteUrl = Astro.site?.href || 'https://www.tu-dominio.com';
const currentUrl = canonicalUrl || new URL(Astro.url.pathname, siteUrl).href;
const fullOgImage = new URL(ogImage, siteUrl).href;
---

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Básico -->
    <title>{title}</title>
    <meta name="description" content={description}>
    <link rel="canonical" href={currentUrl}>
    {noindex && <meta name="robots" content="noindex, nofollow">}
    <!-- NOTA: NO incluir <meta name="keywords"> — Google lo ignora desde 2009 -->

    <!-- Open Graph -->
    <meta property="og:title" content={title}>
    <meta property="og:description" content={description}>
    <meta property="og:image" content={fullOgImage}>
    <meta property="og:url" content={currentUrl}>
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_ES">
    <meta property="og:site_name" content="Nombre de Marca">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content={title}>
    <meta name="twitter:description" content={description}>
    <meta name="twitter:image" content={fullOgImage}>

    <!-- Seguridad -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta name="referrer" content="strict-origin-when-cross-origin">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Datos Estructurados (Schema.org) -->
    {schemaData && <script type="application/ld+json" set:html={schemaData} />}

    <slot name="head" />
</head>
```

### Uso en cada página:

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';

const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",  // Adaptar según sector
    "name": "Mi Empresa",
    "description": "Descripción del negocio",
    "url": "https://www.mi-dominio.com",
    "telephone": "+34600000000",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Madrid",
        "addressCountry": "ES"
    }
});
---

<BaseLayout
    title="Diseño Web en Madrid | Mi Empresa"
    description="Creamos webs profesionales para tu negocio en Madrid. Solicita presupuesto gratis."
    schemaData={schema}
>
    <!-- Contenido de la página -->
</BaseLayout>
```

## Schema.org — Selección por Sector

Detectar el tipo de negocio y usar el `@type` apropiado:

| Sector | Schema @type |
|---|---|
| Mudanzas / transporte | `MovingCompany` |
| Restaurante / bar | `Restaurant` |
| Clínica / médico / dentista | `MedicalBusiness` |
| Abogados | `LegalService` |
| Fontanería / electricidad | `HomeAndConstructionBusiness` |
| Tienda física | `Store` |
| Peluquería / belleza | `BeautySalon` |
| Gimnasio / fitness | `SportsActivityLocation` |
| Hotel / alojamiento | `LodgingBusiness` |
| Inmobiliaria | `RealEstateAgent` |
| Taller mecánico | `AutoRepair` |
| Educación / academia | `EducationalOrganization` |
| Cualquier otro servicio | `LocalBusiness` |

Campos adicionales cuando estén disponibles:
- `"openingHours"`: formato `"Mo-Fr 09:00-18:00"`
- `"priceRange"`: formato `"€€"` o `"€30-€200"`
- `"areaServed"`: array de ciudades/zonas
- `"sameAs"`: array de URLs de redes sociales
- `"email"`, `"image"`, `"logo"`: cuando estén disponibles

## BreadcrumbList (páginas interiores)

Crear un componente para breadcrumbs:

```astro
---
// src/components/Breadcrumbs.astro
interface Props {
    items: { name: string; url: string }[];
}
const { items } = Astro.props;
const siteUrl = Astro.site?.href || '';

const schemaData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": new URL(item.url, siteUrl).href
    }))
});
---

<nav aria-label="Migas de pan" class="text-sm text-text-light mb-8">
    <ol class="flex items-center gap-2">
        {items.map((item, i) => (
            <li class="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i < items.length - 1 ? (
                    <a href={item.url} class="hover:text-primary transition-colors">{item.name}</a>
                ) : (
                    <span aria-current="page" class="text-text">{item.name}</span>
                )}
            </li>
        ))}
    </ol>
</nav>

<script type="application/ld+json" set:html={schemaData} />
```

Uso: `<Breadcrumbs items={[{name: "Inicio", url: "/"}, {name: "Servicios", url: "/servicios"}]} />`

## Sitemap Automático

Instalar la integración oficial:

```bash
npx astro add sitemap
```

En `astro.config.mjs`:
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://www.tu-dominio.com', // OBLIGATORIO para sitemap
    integrations: [sitemap()],
});
```

Esto genera automáticamente `sitemap-index.xml` con URLs absolutas y lastmod. No necesitas crearlo manualmente.

## robots.txt

Crear en `public/robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://www.tu-dominio.com/sitemap-index.xml
```

**IMPORTANTE**: La URL del Sitemap debe ser absoluta y apuntar al archivo que genera la integración de Astro, que es `sitemap-index.xml` (no `sitemap.xml`).

## Accesibilidad WCAG 2.2 Nivel AA

Las reglas son idénticas a HTML puro. Resumen rápido:

### Estructura semántica:
- Usar `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` en el layout
- Un solo `<h1>` por página
- Jerarquía h1→h2→h3 sin saltar niveles
- `aria-label` en `<nav>` para distinguir navegaciones

### Imágenes:
- TODAS con `alt` descriptivo
- Decorativas: `alt=""`
- Logo: `alt="Nombre Empresa - Logo"`
- Iconos como botón: alt describe la acción, no el icono

### Enlaces:
- Texto descriptivo (no "Click aquí")
- Teléfono: `<a href="tel:+34..." aria-label="Llámanos al 600 000 000">`
- Nueva pestaña: indicar con texto `(abre en nueva pestaña)`

### Teclado:
- Todo alcanzable con Tab
- Foco nunca atrapado
- Escape cierra modales/menús
- Estilos de foco visibles (Tailwind: `focus-visible:outline-2 focus-visible:outline-primary`)

### Contraste:
- Texto normal: 4.5:1 mínimo
- Texto grande: 3:1 mínimo
- No transmitir info solo con color

### Formularios:
- `<label>` visible con `for` en cada input
- Errores con `role="alert"` y `aria-live="polite"`
- Placeholders NO sustituyen labels

### Targets táctiles:
- Mínimo 44×44px (`min-h-11` en Tailwind)

### Testing antes de desplegar:
- [ ] Navegar con solo teclado (Tab, Enter, Escape)
- [ ] Probar con lector de pantalla (VoiceOver/NVDA)
- [ ] Zoom 200% sin cortar contenido
- [ ] Contraste verificado con WebAIM Checker
- [ ] Lighthouse accesibilidad 90+
- [ ] Headings en jerarquía correcta
- [ ] Todas las imágenes con alt
- [ ] Formulario funcional con lector de pantalla

## Recordatorios SEO

- Title tag: 50-60 caracteres, keyword principal primero
- Meta description: 140-160 caracteres, incluir llamada a la acción
- Cada página tiene title y description ÚNICOS
- `site` en `astro.config.mjs` configurado con dominio real
- Imagen OG: 1200×630px mínimo
- URLs limpias y descriptivas (Astro las genera automáticamente desde nombres de archivo)
