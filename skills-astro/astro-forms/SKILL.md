---
name: astro-forms
description: >
  Usa esta skill siempre que crees formularios de contacto en proyectos Astro que se conecten a N8N, Make, Zapier
  o cualquier webhook. Cubre: componente de formulario .astro, honeypot anti-spam, detección de comportamiento humano,
  validación cliente/servidor, función serverless para ocultar webhook, rate limiting, y accesibilidad de formularios.
  Se activa con: "formulario en Astro", "contacto con N8N", "formulario webhook", "form Astro",
  "conectar formulario a automatización". Reemplaza a secure-forms cuando se trabaja con Astro.
---

# Formularios Seguros en Astro

Los formularios en Astro funcionan igual que en HTML puro con una diferencia: se crean como componentes `.astro` reutilizables. La seguridad (honeypot, webhook oculto, validación) es idéntica.

## REGLA DE SEGURIDAD CRÍTICA

**NUNCA poner una URL de webhook directamente en JavaScript del lado del cliente.** Siempre usar un intermediario del lado del servidor (función serverless o PHP).

## Componente de Formulario

```astro
---
// src/components/ContactForm.astro
---

<section id="contacto" class="section-padding bg-surface-alt" aria-labelledby="contact-heading">
    <div class="container-max">
        <h2 id="contact-heading" class="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            Contáctanos
        </h2>

        <form id="contactForm" class="max-w-xl mx-auto space-y-5" novalidate>

            <!-- HONEYPOT: Campo invisible que solo bots rellenan -->
            <div class="absolute -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
                <label for="company_url">URL de empresa</label>
                <input type="text" id="company_url" name="company_url" autocomplete="off" tabindex="-1">
            </div>

            <!-- Nombre -->
            <div class="flex flex-col gap-1">
                <label for="name" class="text-sm font-semibold text-text">
                    Nombre <span class="text-error" aria-label="obligatorio">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    minlength="2"
                    maxlength="100"
                    autocomplete="name"
                    placeholder="Tu nombre completo"
                    class="px-4 py-3 border border-border rounded-md text-base
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                           transition-colors"
                >
                <span class="form-error text-xs text-error min-h-[1.2em]" role="alert" aria-live="polite"></span>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1">
                <label for="email" class="text-sm font-semibold text-text">
                    Email <span class="text-error" aria-label="obligatorio">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autocomplete="email"
                    placeholder="tu@email.com"
                    class="px-4 py-3 border border-border rounded-md text-base
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                           transition-colors"
                >
                <span class="form-error text-xs text-error min-h-[1.2em]" role="alert" aria-live="polite"></span>
            </div>

            <!-- Teléfono (opcional) -->
            <div class="flex flex-col gap-1">
                <label for="phone" class="text-sm font-semibold text-text">Teléfono</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autocomplete="tel"
                    placeholder="+34 600 000 000"
                    class="px-4 py-3 border border-border rounded-md text-base
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                           transition-colors"
                >
            </div>

            <!-- Mensaje -->
            <div class="flex flex-col gap-1">
                <label for="message" class="text-sm font-semibold text-text">
                    Mensaje <span class="text-error" aria-label="obligatorio">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    minlength="10"
                    maxlength="2000"
                    rows="5"
                    placeholder="¿En qué podemos ayudarte?"
                    class="px-4 py-3 border border-border rounded-md text-base resize-y min-h-[120px]
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                           transition-colors"
                ></textarea>
                <span class="form-error text-xs text-error min-h-[1.2em]" role="alert" aria-live="polite"></span>
            </div>

            <!-- RGPD: Checkbox de consentimiento (OBLIGATORIO — ver skill legal-compliance) -->
            <div class="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="privacyConsent"
                    name="privacy_consent"
                    required
                    class="mt-1 min-w-5 min-h-5"
                >
                <label for="privacyConsent" class="text-sm text-text-light leading-relaxed">
                    He leído y acepto la
                    <a href="/privacidad" target="_blank" rel="noopener" class="text-primary underline hover:text-primary-dark">
                        Política de Privacidad</a>.
                    Autorizo el tratamiento de mis datos para gestionar mi consulta.
                    <span class="text-error" aria-label="obligatorio">*</span>
                </label>
            </div>

            <!-- Botón enviar -->
            <button type="submit" id="submitBtn" class="btn-primary w-full min-h-11">
                <span class="submit-text">Enviar mensaje</span>
                <span class="submit-loading hidden">Enviando...</span>
            </button>

            <!-- Estado del formulario -->
            <div id="formStatus" class="text-sm text-center rounded-md p-3 hidden" role="alert" aria-live="polite"></div>
        </form>
    </div>
</section>

<script>
    // ============================================
    // MANEJO DEL FORMULARIO — Se ejecuta en el navegador
    // ============================================

    const form = document.getElementById('contactForm') as HTMLFormElement;
    if (form) {
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
        const formStatus = document.getElementById('formStatus') as HTMLDivElement;
        let lastSubmitTime = 0;
        const SUBMIT_COOLDOWN = 5000;

        // Detección de comportamiento humano
        let hasMouseMoved = false;
        let hasKeyPressed = false;
        const formLoadTime = Date.now();
        document.addEventListener('mousemove', () => { hasMouseMoved = true; }, { once: true });
        document.addEventListener('keydown', () => { hasKeyPressed = true; }, { once: true });

        // Validadores
        const validators: Record<string, (v: string) => string> = {
            name: (v) => !v.trim() ? 'El nombre es obligatorio.' : v.trim().length < 2 ? 'Mínimo 2 caracteres.' : '',
            email: (v) => !v.trim() ? 'El email es obligatorio.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email no válido.' : '',
            message: (v) => !v.trim() ? 'El mensaje es obligatorio.' : v.trim().length < 10 ? 'Mínimo 10 caracteres.' : '',
        };

        function validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
            const validator = validators[field.name];
            if (!validator) return true;
            const error = validator(field.value);
            const errorEl = field.closest('.flex')?.querySelector('.form-error');
            if (error) {
                field.classList.add('border-error');
                if (errorEl) errorEl.textContent = error;
                return false;
            }
            field.classList.remove('border-error');
            if (errorEl) errorEl.textContent = '';
            return true;
        }

        // Validación en tiempo real
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => validateField(input as HTMLInputElement));
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Rate limiting
            if (Date.now() - lastSubmitTime < SUBMIT_COOLDOWN) {
                showStatus('Espera unos segundos antes de enviar de nuevo.', 'warning');
                return;
            }

            // Honeypot
            const honeypot = form.querySelector('input[name="company_url"]') as HTMLInputElement;
            if (honeypot?.value) {
                showStatus('¡Mensaje enviado con éxito!', 'success');
                form.reset();
                return;
            }

            // Detección humana
            const timeSpent = Date.now() - formLoadTime;
            if (!(hasMouseMoved || hasKeyPressed) || timeSpent < 3000) {
                showStatus('¡Mensaje enviado con éxito!', 'success');
                return;
            }

            // Validar todos los campos
            let isValid = true;
            form.querySelectorAll('input:not([name="company_url"]), textarea').forEach(input => {
                if (!validateField(input as HTMLInputElement)) isValid = false;
            });
            if (!isValid) return;

            // Enviar
            setLoading(true);
            lastSubmitTime = Date.now();

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: (form.querySelector('#name') as HTMLInputElement).value.trim(),
                        email: (form.querySelector('#email') as HTMLInputElement).value.trim(),
                        phone: (form.querySelector('#phone') as HTMLInputElement)?.value.trim() || '',
                        message: (form.querySelector('#message') as HTMLTextAreaElement).value.trim(),
                        timestamp: new Date().toISOString(),
                        source: window.location.href
                    })
                });

                if (response.ok) {
                    showStatus('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                    form.reset();
                } else {
                    showStatus('Error al enviar. Inténtalo de nuevo.', 'error');
                }
            } catch {
                showStatus('Error de conexión. Inténtalo más tarde.', 'error');
            } finally {
                setLoading(false);
            }
        });

        function setLoading(loading: boolean) {
            submitBtn.disabled = loading;
            submitBtn.querySelector('.submit-text')?.classList.toggle('hidden', loading);
            submitBtn.querySelector('.submit-loading')?.classList.toggle('hidden', !loading);
        }

        function showStatus(msg: string, type: 'success' | 'error' | 'warning') {
            formStatus.textContent = msg;
            formStatus.className = `text-sm text-center rounded-md p-3 ${
                type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                'bg-yellow-50 text-yellow-800 border border-yellow-200'
            }`;
            setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'hidden'; }, 5000);
        }
    }
</script>
```

## Función Serverless (Vercel)

Para despliegue en Vercel, crear `api/contact.js` en la raíz del proyecto:

```javascript
// api/contact.js — Función serverless de Vercel
// La URL del webhook de N8N está en variable de entorno, NUNCA en el cliente

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 5;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    res.setHeader('Access-Control-Allow-Origin', 'https://tu-dominio.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    const requests = (rateLimitMap.get(clientIP) || []).filter(t => now - t < RATE_LIMIT_WINDOW);
    if (requests.length >= RATE_LIMIT_MAX) {
        return res.status(429).json({ message: 'Demasiadas solicitudes.' });
    }
    requests.push(now);
    rateLimitMap.set(clientIP, requests);

    try {
        const { name, email, phone, message, timestamp, source } = req.body;

        // Validación servidor
        if (!name || name.trim().length < 2) return res.status(400).json({ message: 'Nombre requerido.' });
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Email válido requerido.' });
        if (!message || message.trim().length < 10) return res.status(400).json({ message: 'Mensaje mínimo 10 caracteres.' });

        // Reenviar a N8N (URL en variable de entorno)
        const webhookResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone?.trim() || '', message: message.trim(), timestamp, source, ip: clientIP })
        });

        return webhookResponse.ok
            ? res.status(200).json({ message: 'Enviado correctamente.' })
            : res.status(500).json({ message: 'Error del servidor.' });
    } catch {
        return res.status(500).json({ message: 'Error del servidor.' });
    }
}
```

**Configurar en Vercel**: Settings → Environment Variables → `N8N_WEBHOOK_URL` = `https://tu-n8n.com/webhook/xxxxx`

## Alternativa: PHP para Hostinger

Si despliegas el build estático en Hostinger, el formulario llama a `/api/contact.php`. El archivo PHP es idéntico al de la skill secure-forms del pack HTML puro. Simplemente cambia la URL en el `fetch` del script del formulario de `/api/contact` a `/api/contact.php`.

## Checklist de Seguridad

- [ ] URL de webhook NO está en ningún archivo del lado del cliente
- [ ] URL de webhook está en variable de entorno (Vercel) o en archivo PHP del servidor (Hostinger)
- [ ] Honeypot presente con nombre realista (`company_url`)
- [ ] Detección de comportamiento humano activa (mousemove, keydown, tiempo)
- [ ] Validación en cliente Y en servidor
- [ ] Rate limiting activo en el servidor
- [ ] CORS restringido al dominio del sitio
- [ ] Formulario accesible: labels visibles, errores anunciados, target 44px
