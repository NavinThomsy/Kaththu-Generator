export default async function handler(request, response) {
    const { url } = request.query;

    if (!url) {
        return response.status(400).json({ error: 'Missing url parameter' });
    }

    const token = process.env.TINY_URL_TOKEN;

    try {
        let shortLink;

        if (token) {
            // Use V2 API (Official, Reliable)
            const response = await fetch('https://api.tinyurl.com/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    domain: 'tinyurl.com'
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`TinyURL V2 Error: ${response.statusText} - ${err}`);
            }

            const data = await response.json();
            shortLink = data.data.tiny_url;
        } else {
            // Fallback to Legacy API (No key required)
            // Note: This endpoint is deprecated and may show warnings
            const apiResponse = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

            if (!apiResponse.ok) {
                throw new Error(`TinyURL Legacy Error: ${apiResponse.statusText}`);
            }

            shortLink = await apiResponse.text();
        }

        // Set cache control
        response.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
        return response.status(200).json({ shortUrl: shortLink });

    } catch (error) {
        console.error('Shortening failed:', error);
        return response.status(500).json({ error: 'Failed to shorten link' });
    }
}
