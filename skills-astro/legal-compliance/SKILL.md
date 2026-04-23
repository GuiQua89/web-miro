---
name: legal-compliance
description: >
  Usa esta skill siempre que construyas una web para un cliente en España o Europa. Cubre las páginas legales
  obligatorias (aviso legal, política de privacidad, política de cookies), el banner de cookies conforme al RGPD,
  el checkbox de consentimiento en formularios, y el bloqueo de scripts antes del consentimiento.
  Se activa con: "páginas legales", "aviso legal", "política de privacidad", "cookies", "RGPD", "GDPR",
  "LOPD", "LSSI", "cumplimiento legal", "protección de datos", "banner de cookies", "consentimiento".
  SIEMPRE usar esta skill como paso final antes del despliegue de CUALQUIER web de cliente en España/Europa.
  Aplica tanto al pack de HTML/CSS/JS puro como al pack de Astro + Tailwind.
---

# Cumplimiento Legal — RGPD, LSSI-CE y Cookies

## IMPORTANTE: Esta skill NO es asesoramiento jurídico

Esta skill proporciona la estructura técnica y las páginas necesarias para el cumplimiento legal básico. Los textos legales definitivos deben ser revisados y aprobados por un abogado especializado en protección de datos o, como mínimo, generados con un servicio legal acreditado. NUNCA copiar textos legales de otra web.

## Marco Legal en España (2026)

Toda web de empresa o profesional en España debe cumplir con:

1. **RGPD** (Reglamento General de Protección de Datos) — Normativa europea sobre protección de datos personales
2. **LOPDGDD** (Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales) — Complementa el RGPD en España
3. **LSSI-CE** (Ley de Servicios de la Sociedad de la Información y Comercio Electrónico) — Regula la actividad comercial en internet

**Sanciones por incumplimiento:**
- Infracciones leves: hasta 40.000€
- Infracciones graves: 40.001€ a 300.000€
- Infracciones muy graves: 300.001€ a 20.000.000€ o 4% de la facturación anual global

---

## Páginas Legales Obligatorias

Toda web necesita como MÍNIMO estas 3 páginas legales:

### 1. Aviso Legal (obligatorio por LSSI-CE)

Página que identifica al titular de la web. Debe contener:

- Nombre o razón social del titular
- NIF/CIF
- Domicilio social
- Email de contacto
- Datos de inscripción en el Registro Mercantil (si aplica)
- Número de colegiado (si aplica a profesiones reguladas)
- Condiciones de uso del sitio web
- Propiedad intelectual e industrial
- Limitación de responsabilidad
- Legislación aplicable y jurisdicción

**URL recomendada**: `/aviso-legal` o `/legal`

### 2. Política de Privacidad (obligatoria por RGPD + LOPDGDD)

Debe informar sobre:

- Identidad del responsable del tratamiento (nombre, NIF, dirección, email)
- Datos personales que se recogen (nombre, email, teléfono, IP, cookies)
- Finalidad del tratamiento (responder consultas, enviar presupuestos, newsletter)
- Base legal del tratamiento (consentimiento del usuario, interés legítimo, ejecución de contrato)
- Plazo de conservación de los datos
- Destinatarios (si se comparten con terceros como N8N, Airtable, etc.)
- Derechos del usuario: acceso, rectificación, supresión, limitación, portabilidad, oposición
- Cómo ejercer esos derechos (email, formulario)
- Derecho a reclamar ante la AEPD (agpd.es)
- Transferencias internacionales de datos (si los datos salen de la UE)

**URL recomendada**: `/privacidad` o `/politica-de-privacidad`

### 3. Política de Cookies (obligatoria por LSSI-CE + RGPD)

Debe detallar:

- Qué son las cookies
- Qué cookies usa el sitio (tabla con: nombre, proveedor, finalidad, duración, tipo)
- Tipos de cookies: técnicas/necesarias, analíticas, de marketing/publicidad
- Cómo el usuario puede aceptar, rechazar o configurar las cookies
- Cómo desactivar cookies en cada navegador (enlaces a guías de Chrome, Firefox, Safari, Edge)
- Terceros que instalan cookies (Google Analytics, Meta Pixel, etc.)

**URL recomendada**: `/cookies` o `/politica-de-cookies`

### Ubicación de los enlaces

Los enlaces a estas 3 páginas DEBEN estar visibles en TODAS las páginas del sitio, generalmente en el footer:

```html
<footer>
    <nav aria-label="Enlaces legales">
        <a href="/aviso-legal">Aviso Legal</a>
        <a href="/privacidad">Política de Privacidad</a>
        <a href="/cookies">Política de Cookies</a>
    </nav>
</footer>
```

---

## Banner de Cookies

### Requisitos legales del banner (RGPD 2026):

1. **Debe aparecer antes de que se instale NINGUNA cookie no esencial** — las cookies de analítica y marketing solo se activan DESPUÉS de que el usuario acepte
2. **Botón "Aceptar" y botón "Rechazar" con la misma prominencia** — no puede ser más fácil aceptar que rechazar (las últimas directrices de 2025-2026 exigen paridad visual)
3. **Opción de configurar por categorías** — el usuario debe poder elegir qué tipos acepta (necesarias, analíticas, marketing)
4. **Informar brevemente** qué cookies se usan y para qué, con enlace a la política de cookies completa
5. **No usar casillas pre-marcadas** — todo debe estar desmarcado por defecto excepto las cookies necesarias
6. **Permitir cambiar preferencias después** — un botón o enlace accesible desde cualquier página para re-abrir el panel de cookies
7. **Guardar registro del consentimiento** — poder demostrar que el usuario consintió si la AEPD lo solicita

### Opciones de implementación:

**Opción A: Servicio CMP externo (RECOMENDADA para la mayoría de clientes)**

Usar una Consent Management Platform como:
- **CookieScript** (cookiescript.com) — Gratuito hasta cierto tráfico, escanea cookies automáticamente
- **Iubenda** (iubenda.com) — Genera textos legales + banner, muy usado en España
- **CookieYes** (cookieyes.com) — Plan gratuito disponible
- **Usercentrics** (usercentrics.com) — Para proyectos más grandes

Estas plataformas proporcionan un snippet de JavaScript que se agrega al `<head>` y gestionan todo automáticamente: banner, bloqueo de scripts, registro de consentimiento, y escaneo de cookies.

Ejemplo de implementación (el script exacto lo proporciona el servicio):
```html
<head>
    <!-- CMP Script — DEBE ir ANTES de cualquier otro script de tracking -->
    <script src="https://cdn.cookiescript.com/s/tu-id-unico.js" type="text/javascript"></script>

    <!-- Google Analytics — Solo se carga si el usuario acepta -->
    <!-- El CMP se encarga de bloquearlo/desbloquearlo automáticamente -->
    <script type="text/plain" data-cookiescript="accepted" data-cookiecategory="analytics">
        // Código de Google Analytics aquí
    </script>
</head>
```

**Opción B: Banner propio (para sitios sin scripts de terceros)**

Si el sitio es completamente estático y NO usa Google Analytics, Meta Pixel, ni ningún script de tracking, puede implementarse un banner simple. Pero SOLO en este caso, porque si hay scripts de terceros, necesitas bloquearlos antes del consentimiento, y eso requiere un CMP.

### Regla de decisión:

- ¿El sitio usa Google Analytics, Meta Pixel, o cualquier script de tracking? → **Usar CMP externo**
- ¿El sitio es 100% estático sin ningún script de terceros? → **Banner propio basta** (solo cookies técnicas de sesión)
- ¿No estás seguro? → **Usar CMP externo** (es más seguro legalmente)

---

## Consentimiento en Formularios

Todo formulario que recoja datos personales (nombre, email, teléfono, mensaje) DEBE incluir:

### Checkbox de consentimiento (OBLIGATORIO)

```html
<div class="flex items-start gap-3 mt-4">
    <input
        type="checkbox"
        id="privacy-consent"
        name="privacy_consent"
        required
        class="mt-1 min-w-[20px] min-h-[20px]"
    >
    <label for="privacy-consent" class="text-sm text-text-light leading-relaxed">
        He leído y acepto la
        <a href="/privacidad" target="_blank" class="text-primary underline hover:text-primary-dark">
            Política de Privacidad
        </a>.
        Autorizo el tratamiento de mis datos para gestionar mi consulta.
        <span class="text-error" aria-label="obligatorio">*</span>
    </label>
</div>
```

### Reglas del checkbox:
- NUNCA pre-marcado — el usuario debe marcarlo activamente
- El formulario NO puede enviarse si no está marcado (`required`)
- Debe enlazar a la política de privacidad
- Debe indicar la finalidad del tratamiento ("gestionar mi consulta", "enviar presupuesto", etc.)
- Registrar el consentimiento: guardar en la base de datos (Airtable) la fecha, hora, IP y texto del consentimiento aceptado

### Texto informativo bajo el formulario (recomendado):

```html
<p class="text-xs text-text-light mt-4 leading-relaxed">
    <strong>Responsable:</strong> [Nombre empresa] |
    <strong>Finalidad:</strong> Gestionar tu consulta y contactar contigo |
    <strong>Legitimación:</strong> Consentimiento del interesado |
    <strong>Destinatarios:</strong> No se ceden datos a terceros |
    <strong>Derechos:</strong> Acceso, rectificación, supresión y otros derechos detallados en la
    <a href="/privacidad" class="underline">información adicional</a>.
</p>
```

---

## Integración con las Otras Skills

### En la skill secure-forms / astro-forms:

Agregar el checkbox de consentimiento ANTES del botón de envío. En el JavaScript de validación, verificar que el checkbox está marcado antes de permitir el envío. Enviar el valor del consentimiento (fecha + texto aceptado) junto con los datos del formulario a N8N/Airtable.

### En la skill html-seo-structure / astro-seo:

Agregar las 3 páginas legales en la estructura del sitio. Incluir los enlaces en el footer de todas las páginas.

### En la skill web-rebuilder / astro-rebuilder:

Agregar las páginas legales al checklist de finalización. Preguntar al cliente por los datos del aviso legal (NIF, razón social, dirección, etc.) si no están en la web original. Marcar con `<!-- REVISAR: datos del aviso legal -->` si no se tienen.

### En la skill sitemap-robots / astro-deploy:

Las páginas legales SÍ deben incluirse en el sitemap (Google las indexa). Usar prioridad baja en `<lastmod>` ya que cambian raramente.

---

## Checklist Legal Pre-Despliegue

Antes de publicar CUALQUIER web de cliente:

- [ ] **Aviso Legal** creado con datos reales del cliente (NIF, dirección, etc.)
- [ ] **Política de Privacidad** completa con todos los campos requeridos por RGPD
- [ ] **Política de Cookies** con tabla de cookies usadas y sus finalidades
- [ ] Enlaces a las 3 páginas visibles en el footer de TODAS las páginas
- [ ] **Banner de cookies** implementado (CMP externo o propio según necesidad)
- [ ] Cookies de analítica/marketing BLOQUEADAS hasta que el usuario acepte
- [ ] Botón "Aceptar" y "Rechazar" con misma prominencia visual en el banner
- [ ] Opción de cambiar preferencias de cookies accesible desde cualquier página
- [ ] **Checkbox de consentimiento** en TODOS los formularios, sin pre-marcar
- [ ] Texto informativo de protección de datos bajo los formularios
- [ ] El consentimiento (fecha, texto, IP) se registra junto con los datos del formulario
- [ ] Si se usa newsletter: doble opt-in implementado y opción de baja clara
- [ ] Si el sitio envía datos fuera de la UE (ej: Airtable está en EEUU): informado en la política de privacidad y verificar que el proveedor tiene acuerdo de transferencia (DPF, SCCs)

---

## Nota sobre Airtable y N8N

Si usas Airtable como CRM y N8N para automatizaciones:

**Airtable**: Los servidores están en EEUU. Airtable participa en el EU-US Data Privacy Framework (DPF), lo que permite la transferencia legal de datos. Esto debe mencionarse en la política de privacidad como transferencia internacional de datos.

**N8N**: Si usas N8N Cloud, los datos pasan por sus servidores. Si usas N8N self-hosted en un servidor europeo, los datos no salen de la UE. Esto también debe mencionarse en la política de privacidad.

En ambos casos, informar al usuario y tener un acuerdo de procesamiento de datos (DPA) con estos proveedores.
