export default async function handler(request, response) {
    const { url } = request.query;

    if (!url) {
        return response.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        // Call TinyURL API (simple text response)
        const apiResponse = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

        if (!apiResponse.ok) {
            throw new Error(`TinyURL API error: ${apiResponse.statusText}`);
        }

        const shortUrl = await apiResponse.text();

        // Set cache control for performance (cache for 1 year)
        response.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');

        return response.status(200).json({ shortUrl });
    } catch (error) {
        console.error('Shortening failed:', error);
        return response.status(500).json({ error: 'Failed to shorten link' });
    }
}
