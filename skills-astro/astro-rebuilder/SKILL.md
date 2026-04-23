---
name: astro-rebuilder
description: >
  Usa esta skill cuando el usuario quiera reconstruir o rediseñar la web de un cliente usando Astro + Tailwind CSS.
  Se activa con: "reconstruye la web del cliente con Astro", "rediseña con Astro y Tailwind",
  "usa astro-rebuilder", "moderniza esta web con Astro". Combina la extracción de contenido real del cliente
  con la arquitectura de Astro (componentes, layouts, páginas) y Tailwind v4 (sistema de diseño adaptado a la marca).
  SIEMPRE usar junto con astro-project, tailwind-design y astro-seo.
---

# Astro Rebuilder — Reconstrucción de Web de Cliente con Astro + Tailwind

## Principio Fundamental

**NUNCA inventar contenido. NUNCA usar texto placeholder.** Todo viene del material original del cliente. Lo que no esté disponible se marca con `<!-- REVISAR: [qué falta] -->`.

---

## Paso 1 — Leer y Extraer Contenido Real

Leer el archivo original del cliente completamente y extraer:

**Identidad del negocio:** nombre exacto, slogan, años de experiencia
**Contacto:** teléfono(s), email(s), dirección, redes sociales
**Servicios:** lista completa con nombres exactos, zonas/ciudades, precios si aparecen
**Confianza:** testimonios (citas exactas), certificaciones, estadísticas
**Assets:** logo, imágenes, videos, archivos descargables

Cualquier dato no claro → `<!-- REVISAR: [detalle] -->`

---

## Paso 1B — Extraer Identidad Visual del Cliente

1. **Colores**: buscar valores hex/rgb en el CSS/HTML original → definir en `@theme` de Tailwind
2. **Fuentes**: buscar `font-family` y enlaces Google Fonts → definir en `@theme`
3. **Tono visual**: ¿corporativo, divertido, minimalista, oscuro, claro?
4. **Logo**: ¿fondo claro u oscuro? Esto afecta al diseño del header

Aplicar en `src/styles/global.css`:
```css
@import "tailwindcss";

@theme {
    --color-primary: #[color extraído del cliente];
    --color-primary-dark: #[tono más oscuro];
    --color-secondary: #[si existe];
    --font-heading: '[Fuente del cliente o upgrade]', sans-serif;
    --font-body: '[Fuente del cliente o upgrade]', sans-serif;
}
```

---

## Paso 2 — Crear Proyecto Astro

```bash
npm create astro@latest nombre-cliente
cd nombre-cliente
npx astro add tailwind
npx astro add sitemap
```

Configurar `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://www.dominio-cliente.com',
    integrations: [tailwind(), sitemap()],
});
```

---

## Paso 3 — Estructura de Archivos

```
nombre-cliente/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── WhyChooseUs.astro
│   │   ├── ServiceCard.astro
│   │   ├── TrustNumbers.astro
│   │   ├── Testimonials.astro
│   │   ├── CtaSection.astro
│   │   ├── ContactForm.astro    — (ver skill astro-forms)
│   │   └── Breadcrumbs.astro    — (ver skill astro-seo)
│   ├── layouts/
│   │   └── BaseLayout.astro     — (ver skill astro-project)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── servicios.astro
│   │   ├── nosotros.astro
│   │   └── contacto.astro
│   ├── assets/
│   │   └── images/              — Imágenes del cliente (Astro las optimiza)
│   └── styles/
│       └── global.css           — Configuración Tailwind + @theme
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── og-image.jpg
└── astro.config.mjs
```

---

## Paso 4 — Páginas (estructura de contenido)

### index.astro — Página Principal
Secciones obligatorias en orden:
1. **Hero**: imagen/video de fondo, título (h1), subtítulo (slogan), CTA primario + teléfono
2. **Por qué elegirnos**: 3-4 puntos diferenciales extraídos del contenido real
3. **Servicios principales**: tarjetas con los servicios más importantes (máx 6), enlazando a /servicios
4. **Números de confianza**: estadísticas reales (años, trabajos, zonas) — SOLO si existen
5. **Testimonios**: citas reales — SOLO si existen en el original
6. **CTA final**: sección de llamada a la acción con teléfono y botón
7. **Footer**: (componente compartido)

### servicios.astro — Servicios
- Breadcrumbs (componente)
- h1 con keyword de servicio + ciudad
- Cada servicio como sección con h2
- CTA al final

### nosotros.astro — Nosotros
- Breadcrumbs
- Historia, equipo, valores — del contenido original
- Fotos si disponibles

### contacto.astro — Contacto
- Breadcrumbs
- Formulario (componente ContactForm.astro, ver skill astro-forms)
- Teléfono, email, dirección
- Mapa embebido si hay dirección
- Horario si se conoce, si no `<!-- REVISAR: horario -->`

---

## Paso 5 — Reglas de Diseño

### SÍ usar:
- Tailwind CSS via clases de utilidad directamente en el HTML
- Google Fonts importadas en el layout
- Componentes Astro para todo elemento reutilizable
- Mobile-first con prefijos responsive (`md:`, `lg:`)
- Transiciones suaves (`transition-*`, `hover:`)
- Padding generoso entre secciones (`py-16 md:py-24`)
- Sombras suaves en tarjetas (`shadow-card`)

### NO usar:
- CSS inline con atributo `style=""`
- Bootstrap, frameworks CSS externos
- Imágenes de stock o placeholder
- Contenido inventado
- Arial, Roboto, Inter como fuente principal

### Video hero (si aplica):
```astro
<video
    class="absolute inset-0 w-full h-full object-cover"
    playsinline muted loop
    preload="metadata"
    poster="/hero-poster.jpg"
>
    <source src="/hero.mp4" type="video/mp4">
</video>
```
Usar `preload="metadata"` NO `"auto"`.

---

## Paso 6 — Navegación Consistente

El Header y Footer son componentes Astro compartidos. Se definen una vez y se usan en el layout base.

**Header.astro** debe incluir:
- Logo enlazando a `/`
- Menú: Inicio | Servicios | Nosotros | Contacto
- Teléfono visible y clickable (`<a href="tel:...">`)
- Header sticky (`class="sticky top-0 z-50"`)
- Menú hamburguesa accesible en móvil

**Footer.astro** debe incluir:
- Logo, navegación, teléfono, email
- Copyright con año dinámico:
```astro
<p>&copy; {new Date().getFullYear()} {nombreEmpresa}</p>
```

---

## Paso 7 — Checklist de Finalización

Al terminar, confirmar al usuario:

1. **Archivos creados**: listar todos los componentes, páginas y archivos de configuración
2. **Contenido real usado**: resumir nombre, servicios, teléfono, etc.
3. **Marcados para revisión**: listar cada `<!-- REVISAR -->` y qué información falta
4. **SEO incluido**: confirmar titles únicos, descriptions, OG tags, Schema.org por sector
5. **Sitemap**: confirmar que la integración de sitemap está instalada y configurada
6. **Accesibilidad**: confirmar estructura semántica, alt texts, labels, contraste
7. **Pasos siguientes**: "Configura el dominio en astro.config.mjs, sube a GitHub, conecta con Vercel"
8. **Preview**: "Ejecuta `npm run dev` para ver el sitio en localhost:4321"
