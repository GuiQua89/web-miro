---
name: astro-project
description: >
  Usa esta skill siempre que crees un proyecto con Astro framework. Cubre la estructura de archivos, componentes .astro,
  layouts con <slot />, sistema de páginas, islas de interactividad (client:load, client:visible, client:idle),
  optimización de imágenes con componente <Image>, View Transitions, y despliegue en Vercel/Cloudflare Pages.
  Se activa con: "crea un sitio con Astro", "proyecto Astro", "landing con Astro", "configura Astro",
  "componente Astro", "layout Astro". SIEMPRE usar junto con tailwind-design y astro-seo.
  También usar cuando el usuario mencione framework, SSG, generación estática, o sitios de contenido.
---

# Proyecto Astro — Estructura y Arquitectura

Astro es un framework de generación estática que envía CERO JavaScript al navegador por defecto. Solo carga JS donde explícitamente lo necesitas (islas de interactividad). Esto lo hace ideal para landing pages, webs corporativas y sitios de contenido.

## Requisitos Previos

- Node.js 18+ instalado
- npm o pnpm como gestor de paquetes

## Instalación

**Ver la skill `astro-deploy` para el proceso completo de instalación paso a paso**, incluyendo la forma correcta de instalar Tailwind v4 (via plugin Vite, NO la integración legacy), configuración de Git, .gitignore, y despliegue.

Resumen rápido:
```bash
npm create astro@latest nombre-proyecto
cd nombre-proyecto
npx astro add tailwind    # Instala @tailwindcss/vite (Tailwind v4)
npx astro add sitemap     # Sitemap automático
npm run dev               # Servidor en localhost:4321
```

**IMPORTANTE**: `npx astro add tailwind` en Astro 5.2+ instala el plugin Vite de Tailwind v4, que es la forma recomendada. La integración `@astrojs/tailwind` está deprecada para Tailwind v4.

## Estructura de Archivos

```
nombre-proyecto/
├── src/
│   ├── components/          — Componentes reutilizables (.astro)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ServiceCard.astro
│   │   ├── ContactForm.astro
│   │   └── MobileMenu.astro
│   ├── layouts/             — Layouts base (plantillas de página)
│   │   └── BaseLayout.astro
│   ├── pages/               — Cada archivo = una ruta/página (OBLIGATORIO)
│   │   ├── index.astro      — Página principal (/)
│   │   ├── servicios.astro  — Página de servicios (/servicios)
│   │   ├── nosotros.astro   — Página nosotros (/nosotros)
│   │   └── contacto.astro   — Página de contacto (/contacto)
│   └── styles/
│       └── global.css       — CSS global + configuración Tailwind
├── public/                  — Assets estáticos (NO procesados por Astro)
│   ├── robots.txt
│   ├── favicon.svg
│   └── og-image.jpg
├── astro.config.mjs         — Configuración de Astro
├── package.json
└── tsconfig.json
```

### Reglas importantes de estructura:
- `src/pages/` es el ÚNICO directorio obligatorio — cada archivo aquí se convierte en una ruta
- `src/components/` y `src/layouts/` son convención, no obligación, pero SIEMPRE seguir esta convención
- `public/` es para archivos que se sirven tal cual: robots.txt, favicon, imágenes OG
- Las imágenes que quieres que Astro optimice van en `src/` (ej: `src/assets/images/`), NO en `public/`

## Anatomía de un Componente .astro

Un archivo `.astro` tiene dos partes: el script (entre `---`) y el template HTML:

```astro
---
// SCRIPT: Se ejecuta en el servidor durante el build. NUNCA llega al navegador.
// Aquí va: imports, lógica, datos, props.

// Importar otros componentes
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

// Recibir props del componente padre
const { title, description } = Astro.props;

// Variables y lógica
const currentYear = new Date().getFullYear();
const services = ['Diseño Web', 'Marketing Digital', 'Automatizaciones'];
---

<!-- TEMPLATE: HTML estándar con expresiones JavaScript entre {} -->
<Header />

<main>
    <h1>{title}</h1>
    <p>{description}</p>

    <ul>
        {services.map(service => (
            <li>{service}</li>
        ))}
    </ul>

    <p>&copy; {currentYear} Mi Empresa</p>
</main>

<Footer />

<!-- Estilos con scope (solo afectan a ESTE componente) -->
<style>
    h1 {
        color: var(--color-primary);
    }
</style>
```

### Reglas clave de componentes:
- El código entre `---` es el "frontmatter" — se ejecuta en el servidor, NO en el navegador
- Se puede usar JavaScript/TypeScript en el frontmatter
- Las expresiones `{variable}` funcionan como en JSX
- Los estilos `<style>` son scoped por defecto (solo afectan al componente)
- Para estilos globales, usar `<style is:global>` o importar CSS en el layout

## Layout Base (la plantilla que comparten todas las páginas)

Este es el archivo más importante. Define el `<html>`, `<head>` y `<body>` que usan todas las páginas:

```astro
---
// src/layouts/BaseLayout.astro

// Props que cada página puede enviar al layout
interface Props {
    title: string;
    description: string;
    ogImage?: string;
    canonicalUrl?: string;
}

const {
    title,
    description,
    ogImage = '/og-image.jpg',
    canonicalUrl
} = Astro.props;

// Obtener la URL actual de la página
const currentUrl = canonicalUrl || Astro.url.href;

// Importar componentes compartidos
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO — Ver skill astro-seo para detalles completos -->
    <title>{title}</title>
    <meta name="description" content={description}>
    <link rel="canonical" href={currentUrl}>

    <!-- Open Graph -->
    <meta property="og:title" content={title}>
    <meta property="og:description" content={description}>
    <meta property="og:image" content={ogImage}>
    <meta property="og:url" content={currentUrl}>
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_ES">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content={title}>
    <meta name="twitter:description" content={description}>
    <meta name="twitter:image" content={ogImage}>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Seguridad -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
</head>
<body>
    <!-- Enlace saltar al contenido (accesibilidad) -->
    <a href="#contenido-principal" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary focus:text-white focus:p-2">
        Saltar al contenido principal
    </a>

    <Header />

    <main id="contenido-principal">
        <!-- <slot /> inyecta el contenido de cada página aquí -->
        <slot />
    </main>

    <Footer />
</body>
</html>
```

### Cómo usar el layout en una página:

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Services from '../components/Services.astro';
---

<BaseLayout
    title="Diseño Web Profesional en Madrid | Mi Agencia"
    description="Creamos páginas web profesionales, marketing digital y automatizaciones para tu negocio."
>
    <!-- Todo esto se inyecta en el <slot /> del layout -->
    <Hero />
    <Services />
</BaseLayout>
```

**Ventaja clave**: Si cambias el Header en `Header.astro`, se actualiza en TODAS las páginas automáticamente. No hay que tocar 4 archivos como con HTML puro.

## Islas de Interactividad (client: directives)

Por defecto, los componentes Astro se renderizan como HTML estático sin JavaScript. Para agregar interactividad, usas directivas `client:`:

```astro
---
// Importar un componente que necesita JavaScript
// Puede ser React, Svelte, Vue, o incluso vanilla JS
import ContactForm from '../components/ContactForm.astro';
import BookingCalendar from '../components/BookingCalendar.jsx'; // React
---

<!-- Esto se renderiza como HTML estático, sin JS -->
<ContactForm />

<!-- Esto carga el JS inmediatamente (para elementos críticos) -->
<BookingCalendar client:load />

<!-- Esto carga el JS cuando el usuario hace scroll hasta el componente -->
<BookingCalendar client:visible />

<!-- Esto carga el JS cuando el navegador está idle (baja prioridad) -->
<BookingCalendar client:idle />
```

### Cuándo usar cada directiva:
- **Sin directiva** (por defecto): Para todo el contenido estático. Headers, footers, textos, imágenes, tarjetas. Es la mayoría de tu landing.
- **`client:load`**: Para elementos interactivos que deben funcionar inmediatamente. Formularios de contacto con validación en tiempo real.
- **`client:visible`**: Para elementos interactivos debajo del pliegue. Calendarios de reservas, widgets de chat, carruseles de testimonios.
- **`client:idle`**: Para elementos de baja prioridad. Analytics, botones de compartir en redes.

**REGLA**: Usa la menor cantidad de `client:` posible. Cada una agrega JavaScript. Si puedes resolver algo con HTML/CSS puro (menú hamburguesa, acordeones), hazlo sin `client:`.

## Optimización de Imágenes

Astro tiene un componente `<Image>` que optimiza imágenes automáticamente:

```astro
---
import { Image } from 'astro:assets';
// Importar imagen desde src/ (Astro la optimiza)
import heroImage from '../assets/images/hero.jpg';
---

<!-- Astro genera automáticamente WebP/AVIF, múltiples tamaños, y lazy loading -->
<Image
    src={heroImage}
    alt="Descripción de la imagen"
    width={1200}
    height={600}
    loading="eager"
/>

<!-- Para imágenes debajo del pliegue, loading="lazy" (es el default) -->
<Image
    src={aboutImage}
    alt="Nuestro equipo"
    width={800}
    height={500}
/>
```

### Reglas de imágenes en Astro:
- Las imágenes en `src/` son procesadas y optimizadas por Astro (formato, tamaño, compresión)
- Las imágenes en `public/` se sirven tal cual, SIN optimización
- SIEMPRE usar el componente `<Image>` para imágenes que necesiten optimización
- Para la imagen hero, agregar `loading="eager"` (Astro usa `lazy` por defecto)
- El `alt` es OBLIGATORIO — ver skill astro-seo para reglas de accesibilidad

## View Transitions (transiciones entre páginas)

Astro soporta transiciones suaves entre páginas de forma nativa:

```astro
---
// En el BaseLayout.astro, agregar:
import { ViewTransitions } from 'astro:transitions';
---
<head>
    <!-- Agregar esto en el <head> del layout -->
    <ViewTransitions />
</head>
```

Esto hace que la navegación entre páginas se sienta como una SPA, sin recargas completas.

## Configuración de Astro (astro.config.mjs)

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    // URL del sitio en producción (OBLIGATORIO para sitemap y URLs canónicas)
    site: 'https://www.tu-dominio.com',

    integrations: [
        tailwind(),
        sitemap(), // Genera sitemap.xml automáticamente
    ],

    // Output estático (por defecto, ideal para landing pages)
    output: 'static',
});
```

## Build y Despliegue

```bash
# Generar sitio estático
npm run build

# El resultado está en dist/ — son archivos HTML/CSS/JS estáticos
# Subir dist/ a Vercel, Cloudflare Pages, Hostinger, o cualquier hosting
```

### Despliegue en Vercel:
1. Subir proyecto a GitHub
2. Conectar repositorio en vercel.com
3. Vercel detecta Astro automáticamente
4. Cada push a GitHub despliega automáticamente

### Despliegue en Hostinger:
1. Ejecutar `npm run build`
2. Subir el contenido de `dist/` al directorio público de Hostinger
3. Funciona igual que archivos HTML estáticos

## Scripts en Componentes Astro (interactividad sin frameworks)

Para interactividad simple (menú móvil, scroll animations), puedes usar `<script>` directamente en componentes Astro sin necesidad de React o similares:

```astro
---
// src/components/MobileMenu.astro
---

<button class="menu-toggle" aria-expanded="false" aria-label="Abrir menú">
    <span class="hamburger"></span>
</button>

<nav class="mobile-nav" id="mobile-menu">
    <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/servicios">Servicios</a></li>
        <li><a href="/contacto">Contacto</a></li>
    </ul>
</nav>

<script>
    // Este script se ejecuta EN EL NAVEGADOR (no en el servidor)
    // Se bundlea y optimiza automáticamente por Astro
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.mobile-nav');

    toggle?.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        nav?.classList.toggle('open');
    });
</script>
```

**IMPORTANTE**: Los `<script>` en componentes Astro se procesan por Astro (bundled, deduplicados). Si necesitas que se ejecute exactamente como está, usa `<script is:inline>`.

## Checklist de Proyecto Astro

Antes de entregar un proyecto, verificar:

- [ ] Todas las páginas usan el layout base con meta tags correctas
- [ ] `site` está configurado en `astro.config.mjs` con el dominio real
- [ ] La integración de sitemap está instalada y genera `sitemap.xml`
- [ ] `robots.txt` está en la carpeta `public/`
- [ ] Las imágenes en `src/` usan el componente `<Image>`
- [ ] La imagen hero tiene `loading="eager"`
- [ ] Los componentes interactivos usan la directiva `client:` mínima necesaria
- [ ] El formulario de contacto funciona (ver skill astro-forms)
- [ ] El sitio se ha probado con `npm run build` sin errores
- [ ] Lighthouse score es 90+ en Performance, Accessibility, SEO y Best Practices
