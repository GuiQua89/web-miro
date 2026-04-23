---
name: tailwind-design
description: >
  Usa esta skill siempre que estilices con Tailwind CSS v4 en un proyecto Astro o cualquier proyecto web moderno.
  Cubre la configuración CSS-first con @theme, clases de utilidad, responsive mobile-first, dark mode,
  extracción de componentes con @apply, plugins oficiales, accesibilidad CSS, y directrices de diseño
  por tipo de proyecto (rediseño, landing, multi-página). Se activa con: "estiliza con Tailwind",
  "configura Tailwind", "diseño con Tailwind", "colores Tailwind", "responsive Tailwind", "tema Tailwind".
  Reemplaza a css-professional cuando se trabaja con Tailwind. SIEMPRE usar junto con astro-project.
---

# Diseño con Tailwind CSS v4

Tailwind CSS v4 es un framework utility-first que permite construir diseños directamente en el HTML con clases predefinidas. La v4 (lanzada enero 2025) trae configuración CSS-first, motor 5x más rápido, y soporte nativo para container queries y cascade layers.

## Configuración en Proyecto Astro

Después de `npx astro add tailwind`, crear o editar el archivo CSS global:

```css
/* src/styles/global.css */

/* Una sola línea importa todo Tailwind */
@import "tailwindcss";

/* ============================================
   SISTEMA DE DISEÑO — @theme
   Define tokens de diseño que generan clases de utilidad automáticamente.
   --color-* genera bg-*, text-*, border-*, etc.
   --font-* genera font-*
   --spacing-* genera p-*, m-*, gap-*, etc.
   ============================================ */
@theme {
    /* --- COLORES DE MARCA --- */
    --color-primary: #2563EB;
    --color-primary-light: #3B82F6;
    --color-primary-dark: #1D4ED8;
    --color-secondary: #10B981;
    --color-secondary-dark: #059669;

    /* Neutros */
    --color-surface: #FFFFFF;
    --color-surface-alt: #F9FAFB;
    --color-border: #E5E7EB;
    --color-text: #1F2937;
    --color-text-light: #6B7280;
    --color-text-inverse: #FFFFFF;

    /* Semánticos */
    --color-success: #10B981;
    --color-error: #EF4444;
    --color-warning: #F59E0B;

    /* --- TIPOGRAFÍA --- */
    --font-heading: 'Font Display', sans-serif;
    --font-body: 'Font Body', sans-serif;

    /* --- SOMBRAS --- */
    --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    --shadow-card-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

    /* --- BORDES --- */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;
}

/* ============================================
   ESTILOS BASE
   ============================================ */
@layer base {
    html {
        scroll-behavior: smooth;
    }

    body {
        font-family: var(--font-body);
        color: var(--color-text);
        -webkit-font-smoothing: antialiased;
    }
}

/* ============================================
   COMPONENTES EXTRAÍDOS
   Usar solo cuando un patrón se repite muchas veces.
   Preferir clases de utilidad inline para todo lo demás.
   ============================================ */
@layer components {
    .btn-primary {
        @apply inline-flex items-center justify-center px-6 py-3
               bg-primary text-text-inverse font-semibold rounded-md
               hover:bg-primary-dark transition-colors duration-200
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
               min-h-11;
    }

    .btn-outline {
        @apply inline-flex items-center justify-center px-6 py-3
               border-2 border-primary text-primary font-semibold rounded-md
               hover:bg-primary hover:text-text-inverse transition-colors duration-200
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
               min-h-11;
    }

    .section-padding {
        @apply py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8;
    }

    .container-max {
        @apply max-w-7xl mx-auto;
    }
}

/* ============================================
   ACCESIBILIDAD
   ============================================ */

/* Clase sr-only para contenido solo para lectores de pantalla */
/* Tailwind ya incluye sr-only por defecto, pero asegurar que está disponible */

/* Respetar preferencia de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Modo de alto contraste */
@media (forced-colors: active) {
    .btn-primary,
    .btn-outline {
        border: 2px solid ButtonText;
    }
}
```

### Reglas de @theme:
- `--color-*` genera clases `bg-*`, `text-*`, `border-*`, `ring-*`, etc.
- `--font-*` genera clases `font-*`
- `--shadow-*` genera clases `shadow-*`
- `--radius-*` genera clases `rounded-*`
- `--spacing-*` genera clases `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`
- ADAPTAR colores y fuentes a cada proyecto. Cada proyecto debe tener su propia personalidad.
- Usar cualquier formato de color (hex, rgb, hsl, oklch)

## Responsive: Mobile-First con Prefijos

Tailwind usa mobile-first. El estilo base es para móvil, los prefijos agregan complejidad:

```html
<!-- Móvil: 1 columna | Tablet: 2 columnas | Desktop: 3 columnas -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div>Tarjeta 1</div>
    <div>Tarjeta 2</div>
    <div>Tarjeta 3</div>
</div>

<!-- Texto: pequeño en móvil, más grande progresivamente -->
<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold">
    Título Principal
</h1>

<!-- Padding: ajustado en móvil, generoso en desktop -->
<section class="py-12 md:py-16 lg:py-24 px-4 md:px-8">
    <!-- contenido -->
</section>
```

### Breakpoints por defecto en Tailwind v4:
- (sin prefijo) — Móvil (base, todo lo que esté sin prefijo aplica desde 0px)
- `sm:` — 640px+
- `md:` — 768px+
- `lg:` — 1024px+
- `xl:` — 1280px+
- `2xl:` — 1536px+

## Patrones Comunes para Landing Pages

### Hero Section:
```html
<section class="relative min-h-[80vh] flex items-center justify-center bg-gray-900 text-text-inverse overflow-hidden">
    <!-- Imagen de fondo -->
    <img src="/hero.webp" alt="" class="absolute inset-0 w-full h-full object-cover opacity-40" loading="eager">

    <!-- Contenido sobre la imagen -->
    <div class="relative z-10 text-center max-w-3xl mx-auto px-4">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
            Tu Título Principal
        </h1>
        <p class="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Subtítulo con propuesta de valor clara y concisa.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contacto" class="btn-primary">Solicitar Presupuesto</a>
            <a href="tel:+34600000000" class="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
                Llamar Ahora
            </a>
        </div>
    </div>
</section>
```

### Tarjeta de Servicio:
```html
<article class="bg-surface rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-300 p-6 md:p-8">
    <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
        <!-- Icono -->
    </div>
    <h3 class="text-xl font-heading font-bold mb-3">Nombre del Servicio</h3>
    <p class="text-text-light leading-relaxed">
        Descripción del servicio.
    </p>
</article>
```

### Sección CTA:
```html
<section class="bg-primary text-text-inverse section-padding">
    <div class="container-max text-center">
        <h2 class="text-3xl md:text-4xl font-heading font-bold mb-4">
            ¿Listo para empezar?
        </h2>
        <p class="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Texto persuasivo.
        </p>
        <a href="/contacto" class="inline-flex items-center px-8 py-4 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors min-h-11">
            Contactar Ahora
        </a>
    </div>
</section>
```

## Adaptación de Estilos por Tipo de Proyecto

### Rediseño de web existente
1. **Extraer colores** del CSS/HTML original del cliente
2. **Definir en @theme** como `--color-primary`, `--color-secondary`, etc.
3. **Extraer fuentes** y definir como `--font-heading`, `--font-body`
4. **Mantener el tono visual** — solo modernizar layout, espaciado y componentes
5. **Lo que SÍ cambia**: responsive, calidad de componentes, velocidad, accesibilidad
6. **Lo que NO cambia**: colores de marca, personalidad visual

### Landing page desde cero
1. **Tipografía con personalidad** — Elegir fuente display distintiva para headings
2. **Paleta de alto contraste** — Color primario fuerte para CTAs
3. **Layout experimental** — Hero a pantalla completa, secciones amplias
4. **Mucho espacio** — `py-16 md:py-24` mínimo entre secciones
5. **Animaciones** — Usar `transition-*` y `hover:` generosamente
6. **Todo apunta al CTA** — Hero → Valor → Prueba social → Formulario

### Web multi-página
1. **Consistencia** — Mismos componentes en todas las páginas
2. **Extraer componentes** con `@apply` para botones, tarjetas, secciones
3. **Tipografía sobria** — Legibilidad sobre personalidad
4. **Header/footer idénticos** — En Astro, son componentes compartidos automáticamente
5. **Indicar página activa** en la navegación

## Accesibilidad en Tailwind

### Estilos de foco (OBLIGATORIO):
```html
<!-- Tailwind incluye focus-visible: por defecto -->
<button class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
    Botón
</button>

<!-- NUNCA hacer esto: -->
<button class="outline-none">  <!-- ¡NUNCA! Rompe navegación por teclado -->
```

### Contenido solo para lectores de pantalla:
```html
<!-- Tailwind incluye sr-only y not-sr-only -->
<span class="sr-only">Abrir menú de navegación</span>

<!-- Visible solo al recibir foco (skip link) -->
<a href="#contenido" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-2 focus:bg-primary focus:text-white">
    Saltar al contenido
</a>
```

### Contraste de colores:
- Verificar que los colores definidos en `@theme` cumplen con ratio 4.5:1 para texto normal
- Usar https://webaim.org/resources/contrastchecker/
- Tailwind no verifica contraste automáticamente — es responsabilidad del desarrollador

### Tamaño de targets táctiles:
```html
<!-- Mínimo 44px de altura para elementos interactivos (WCAG 2.2) -->
<button class="min-h-11 px-4 py-2">Botón</button>  <!-- 44px = min-h-11 en Tailwind -->
<a href="/contacto" class="inline-block min-h-11 leading-[44px]">Enlace</a>
```

### Movimiento reducido:
```html
<!-- Tailwind incluye el modificador motion-reduce: -->
<div class="transition-transform duration-300 motion-reduce:transition-none motion-reduce:transform-none">
    Contenido con animación
</div>
```

## Cuándo Usar @apply vs Clases Inline

**Usar clases inline** (directamente en el HTML) para:
- Todo por defecto — es la forma principal de trabajar con Tailwind
- Elementos únicos que no se repiten
- Componentes Astro (cada componente es reutilizable por sí mismo)

**Usar @apply** (extracción a clase CSS) SOLO cuando:
- Un patrón se repite en más de 3 lugares Y no puede ser un componente Astro
- Necesitas estilos que no se pueden expresar con utilidades (animaciones complejas)
- Quieres un nombre semántico para un patrón muy usado (`.btn-primary`)

**NUNCA** recrear todo tu CSS con @apply — eso anula el propósito de Tailwind.

## Plugins Oficiales Útiles

### @tailwindcss/typography (para contenido de texto largo):
```html
<!-- Aplica estilos tipográficos a contenido Markdown o CMS -->
<article class="prose lg:prose-xl">
    <h1>Título del artículo</h1>
    <p>Contenido con estilos automáticos...</p>
</article>
```

### @tailwindcss/forms (para formularios):
```html
<!-- Normaliza y estiliza elementos de formulario automáticamente -->
<input type="email" class="form-input rounded-md">
<textarea class="form-textarea rounded-md"></textarea>
```

## Rendimiento

- Tailwind v4 elimina automáticamente todas las clases no usadas — el CSS final es mínimo (10-20KB)
- No necesitas configurar PurgeCSS manualmente — es automático
- Los builds completos son 5x más rápidos que v3, los incrementales 100x+ más rápidos
- Detección automática de archivos template — no necesitas configurar rutas de contenido
