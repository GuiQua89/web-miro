// Serverless function for contact form — forwards validated data to N8N
// Implements rate limiting, CORS, and server-side validation
// See skills-astro/astro-forms/SKILL.md for full implementation

const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function getRateLimitKey(ip) {
    return `contact:${ip}`;
}

function checkRateLimit(ip) {
    const key = getRateLimitKey(ip);
    const now = Date.now();
    const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

    if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
    }

    entry.count += 1;
    rateLimitMap.set(key, entry);

    return entry.count <= RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
    // Only POST allowed
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS — restrict to own domain
    const origin = req.headers.origin || '';
    const allowedOrigins = [
        'https://www.miro.agency', // REVISAR: dominio real
        'http://localhost:4321',
    ];

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Rate limiting
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
    }

    const { name, email, phone, message, timestamp, source } = req.body || {};

    // Server-side validation
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    if (!message || message.trim().length < 10) {
        return res.status(400).json({ error: 'Message too short' });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('N8N_WEBHOOK_URL not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone?.trim() || '',
                message: message.trim(),
                timestamp: timestamp || new Date().toISOString(),
                source: source || 'contact-form',
                ip: clientIp,
            }),
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('N8N webhook error:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}
