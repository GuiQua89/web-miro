---
name: astro-deploy
description: >
  Usa esta skill para todo lo relacionado con la instalación de un proyecto Astro + Tailwind CSS, configuración de Git,
  subida a GitHub, .gitignore, seguridad de archivos sensibles, y despliegue en Vercel, Cloudflare Pages o Hostinger.
  Se activa con: "instala Astro", "crea proyecto Astro", "sube a GitHub", "despliega en Vercel",
  "configura Git", "gitignore", "deploy", "subir proyecto", "publicar web".
  SIEMPRE usar al inicio de un proyecto nuevo (instalación) y al final (despliegue).
---

# Instalación, Git y Despliegue de Proyectos Astro + Tailwind

## Parte 1 — Instalación Completa (paso a paso)

### Requisitos previos
- **Node.js 18+** instalado (verificar con `node --version`)
- **npm** o **pnpm** como gestor de paquetes
- **Git** instalado (verificar con `git --version`)
- **VS Code** con las extensiones:
  - Astro (oficial de Astro)
  - Tailwind CSS IntelliSense (oficial de Tailwind Labs)

### Paso 1: Crear el proyecto Astro

```bash
# Crear proyecto nuevo (seguir las opciones interactivas)
npm create astro@latest nombre-cliente

# Opciones recomendadas durante la creación:
# - Template: Empty (empezar limpio)
# - TypeScript: Yes, default (strict)
# - Install dependencies: Yes
# - Initialize git: Yes
```

### Paso 2: Instalar Tailwind CSS v4

**IMPORTANTE**: En 2026, la forma correcta de instalar Tailwind en Astro es via el plugin Vite de Tailwind, NO la integración antigua `@astrojs/tailwind`. La integración legacy está deprecada para Tailwind v4.

```bash
# Entrar al proyecto
cd nombre-cliente

# Opción A (RECOMENDADA): Usar el comando astro add (Astro 5.2+)
# Esto instala @tailwindcss/vite automáticamente y configura todo
npx astro add tailwind

# Opción B (manual, si astro add falla):
npm install tailwindcss @tailwindcss/vite
```

Si usaste la Opción B manual, configura manualmente en `astro.config.mjs`:

```javascript
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
});
```

### Paso 3: Crear archivo CSS global

Crear `src/styles/global.css`:

```css
/* src/styles/global.css */
@import "tailwindcss";

/* Sistema de diseño del proyecto — adaptar a cada cliente */
@theme {
    --color-primary: #2563EB;
    --color-primary-dark: #1D4ED8;
    --color-secondary: #10B981;
    --font-heading: 'Inter', sans-serif;
    --font-body: 'Inter', sans-serif;
}
```

### Paso 4: Importar CSS en el layout base

En `src/layouts/BaseLayout.astro`, agregar la importación:

```astro
---
import "../styles/global.css";
// ... resto del layout
---
```

**IMPORTANTE**: Importar el CSS en el layout base asegura que Tailwind carga en TODAS las páginas. Solo necesitas importarlo una vez, en el layout.

### Paso 5: Instalar integración de sitemap

```bash
npx astro add sitemap
```

Esto agrega automáticamente la integración en `astro.config.mjs`.

### Paso 6: Configurar astro.config.mjs completo

```javascript
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    // URL del sitio en producción (OBLIGATORIO para sitemap y URLs canónicas)
    site: "https://www.dominio-cliente.com",

    integrations: [
        sitemap(),  // Genera sitemap-index.xml automáticamente
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});
```

### Paso 7: Verificar que todo funciona

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:4321 en el navegador
# Verificar que Tailwind funciona escribiendo clases como "text-red-500" en algún componente

# Hacer un build de prueba
npm run build

# Previsualizar el build
npm run preview
```

### Resumen de estructura tras la instalación

```
nombre-cliente/
├── src/
│   ├── components/
│   ├── layouts/
│   │   └── BaseLayout.astro    ← Importa global.css aquí
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   └── global.css          ← @import "tailwindcss" + @theme
│   └── assets/
│       └── images/
├── public/
│   ├── robots.txt
│   └── favicon.svg
├── astro.config.mjs            ← Tailwind Vite plugin + sitemap
├── package.json
├── tsconfig.json
└── .gitignore                  ← Configurar ANTES de subir a GitHub
```

---

## Parte 2 — Git, GitHub y .gitignore

### Configurar .gitignore ANTES del primer commit

Crear o verificar que `.gitignore` en la raíz del proyecto contiene:

```gitignore
# ============================================
# .gitignore para proyecto Astro + Tailwind
# ============================================

# --- DEPENDENCIAS ---
node_modules/

# --- BUILD OUTPUT ---
dist/

# --- CACHE DE ASTRO ---
.astro/

# --- ARCHIVOS DE ENTORNO (SEGURIDAD CRÍTICA) ---
# NUNCA subir archivos .env — contienen URLs de webhooks, API keys, etc.
.env
.env.local
.env.development
.env.production
.env.*

# --- SKILLS DE CLAUDE CODE ---
# Las skills son herramientas de desarrollo, NO parte del sitio web
.claude/

# --- LOGS ---
*.log
npm-debug.log*
pnpm-debug.log*

# --- SISTEMA OPERATIVO ---
.DS_Store
.DS_Store?
Thumbs.db
ehthumbs.db
Desktop.ini

# --- EDITORES / IDEs ---
.vscode/
.idea/
*.swp
*.swo
*~

# --- PLATAFORMAS DE DESPLIEGUE ---
.vercel/
.netlify/

# --- TYPESCRIPT CACHE ---
*.tsbuildinfo

# --- TURBO ---
.turbo/
```

### Archivos que NUNCA deben subirse a GitHub

| Archivo/Carpeta | Razón |
|---|---|
| `node_modules/` | Dependencias — se reinstalan con `npm install` |
| `dist/` | Build output — se regenera con `npm run build` |
| `.astro/` | Cache interno de Astro |
| `.env` y variantes | **SEGURIDAD**: contienen URLs de webhooks, API keys, contraseñas |
| `.claude/` | Skills de Claude Code — herramienta de desarrollo, no código del sitio |
| `.vscode/` | Configuración personal del editor |
| `.DS_Store` | Archivos de macOS |

### Archivos que SÍ deben subirse

| Archivo | Razón |
|---|---|
| `package.json` | Define dependencias — el equipo necesita esto para instalar |
| `package-lock.json` | Garantiza versiones exactas de dependencias |
| `astro.config.mjs` | Configuración del proyecto |
| `tsconfig.json` | Configuración de TypeScript |
| `.gitignore` | Define qué ignorar — es parte del proyecto |
| `src/**` | Todo el código fuente |
| `public/**` | Assets estáticos (robots.txt, favicons) |

### Archivo .env para variables de entorno

Crear `.env` en la raíz (este archivo NO se sube a GitHub):

```env
# Variables de entorno — NUNCA subir a GitHub
N8N_WEBHOOK_URL=https://tu-n8n.com/webhook/tu-id-secreto
```

Crear `.env.example` como referencia (este SÍ se sube):

```env
# Ejemplo de variables necesarias — copiar a .env y rellenar con valores reales
N8N_WEBHOOK_URL=https://tu-n8n.com/webhook/XXXXXXX
```

### Flujo de Git para subir a GitHub

```bash
# 1. Verificar que .gitignore está configurado
cat .gitignore

# 2. Inicializar Git (si no se hizo al crear el proyecto)
git init

# 3. Agregar todos los archivos (respetando .gitignore)
git add .

# 4. Verificar qué se va a subir (MUY IMPORTANTE)
git status
# Revisar que NO aparezcan: node_modules, .env, dist, .claude/

# 5. Primer commit
git commit -m "Proyecto inicial: Astro + Tailwind CSS"

# 6. Crear repositorio en GitHub (via web o CLI)
# Opción CLI:
gh repo create nombre-cliente --private --source=. --push

# Opción manual:
# - Crear repo vacío en github.com
# - Luego conectar:
git remote add origin https://github.com/tu-usuario/nombre-cliente.git
git branch -M main
git push -u origin main
```

### Seguridad: verificar antes de cada push

```bash
# Ver qué archivos están trackeados
git ls-files

# Si accidentalmente se subió un archivo sensible:
git rm --cached .env
git commit -m "Eliminar archivo .env del tracking"
git push

# El archivo .env seguirá en tu disco pero ya no se sube
```

---

## Parte 3 — Despliegue

### Opción A: Vercel (RECOMENDADA para Astro)

**Primer despliegue:**
1. Ve a vercel.com e inicia sesión con GitHub
2. Click en "Add New" → "Project"
3. Selecciona el repositorio del cliente
4. Vercel detecta Astro automáticamente — no necesitas configurar nada
5. Click "Deploy"

**Configurar variables de entorno en Vercel:**
- Settings → Environment Variables
- Agregar `N8N_WEBHOOK_URL` con el valor real del webhook
- Esto es seguro — Vercel encripta las variables y nunca se exponen en el código

**Despliegues automáticos:**
- Cada `git push` a la rama `main` despliega automáticamente
- Vercel genera una URL de preview para cada push a ramas no-main
- Plan gratuito: suficiente para sitios estáticos de clientes

**Dominio personalizado:**
- Settings → Domains → agregar dominio del cliente
- Vercel genera certificado SSL automáticamente

### Opción B: Hostinger

```bash
# 1. Build local
npm run build

# 2. El resultado está en dist/
# Subir TODO el contenido de dist/ al directorio público de Hostinger
# Usar File Manager de Hostinger o FTP

# 3. Si hay formulario con PHP:
# Subir también el archivo api/contact.php al directorio público
```

Con Hostinger no hay despliegue automático — cada cambio requiere un build manual y subida.

### Opción C: Cloudflare Pages

```bash
# Similar a Vercel:
# 1. Conectar repositorio de GitHub a Cloudflare Pages
# 2. Framework preset: Astro
# 3. Build command: npm run build
# 4. Output directory: dist
# 5. Agregar variables de entorno en el dashboard
```

Cloudflare Pages es gratuito y tiene CDN global. Especialmente interesante desde que Cloudflare adquirió Astro en enero 2026.

---

## Checklist Pre-Despliegue

Antes de desplegar cualquier proyecto a producción:

- [ ] `site` en `astro.config.mjs` tiene el dominio real del cliente
- [ ] `.gitignore` configurado correctamente (node_modules, .env, dist, .claude/)
- [ ] Variables de entorno configuradas en la plataforma de despliegue (NO en el código)
- [ ] `npm run build` ejecuta sin errores
- [ ] `robots.txt` en `public/` con URL absoluta del sitemap
- [ ] Sitemap se genera correctamente (verificar en `dist/sitemap-index.xml` tras build)
- [ ] SSL/HTTPS activo en el dominio
- [ ] El formulario funciona conectado a N8N (probar envío real)
- [ ] Lighthouse score 90+ en Performance, Accessibility, SEO, Best Practices
- [ ] Verificar en móvil que todo se ve correctamente
- [ ] Enviar sitemap a Google Search Console
