import { sql } from '@vercel/postgres';
import { customAlphabet } from 'nanoid';

// Use URL-safe alphabet for short codes
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);

export default async function handler(request, response) {
    const { url } = request.query;

    if (!url) {
        return response.status(400).json({ error: 'Missing url parameter' });
    }

    // Attempt 1: Store in Vercel Postgres (Custom Domain)
    try {
        const code = nanoid();

        // This will throw if DB is not configured or table missing
        await sql`INSERT INTO links (code, url) VALUES (${code}, ${url})`;

        // Construct custom short URL (e.g., https://kathukal.vercel.app/l/abc)
        const protocol = request.headers['x-forwarded-proto'] || 'https';
        const host = request.headers.host;
        const shortUrl = `${protocol}://${host}/l/${code}`;

        response.setHeader('Cache-Control', 's-maxage=0, stale-while-revalidate'); // Do not cache creation
        return response.status(200).json({ shortUrl });

    } catch (dbError) {
        console.warn('Postgres failed, falling back to TinyURL:', dbError.message);

        // Attempt 2: Fallback to TinyURL (Legacy/V2 Code)
        const token = process.env.TINY_URL_TOKEN;
        try {
            let shortLink;

            if (token) {
                // Use V2 API (Official, Reliable)
                const apiRes = await fetch('https://api.tinyurl.com/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: url, domain: 'tinyurl.com' })
                });

                if (!apiRes.ok) {
                    throw new Error(`TinyURL V2 Error: ${apiRes.statusText}`);
                }
                const data = await apiRes.json();
                shortLink = data.data.tiny_url;
            } else {
                // Legacy Fallback
                const apiRes = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
                if (!apiRes.ok) throw new Error(`TinyURL Legacy Error: ${apiRes.statusText}`);
                shortLink = await apiRes.text();
            }

            response.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
            return response.status(200).json({ shortUrl: shortLink });

        } catch (fbError) {
            console.error('All shorteners failed:', fbError);
            return response.status(500).json({ error: 'Failed to shorten link' });
        }
    }
}
