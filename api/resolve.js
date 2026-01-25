import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    const { code } = request.query;

    if (!code) {
        return response.status(400).send('Missing code');
    }

    try {
        // Select URL from Postgres
        const result = await sql`SELECT url FROM links WHERE code = ${code}`;
        const link = result.rows[0];

        if (link) {
            // Set Cache-Control for faster subsequent redirects (1 hour)
            response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
            return response.redirect(301, link.url);
        } else {
            return response.status(404).send('Link not found');
        }
    } catch (error) {
        console.error('Database Error:', error);
        return response.status(500).send('Internal Server Error');
    }
}
