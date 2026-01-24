/**
 * ImgBB Image Upload Service
 * Uploads images to ImgBB and returns a hosted URL
 */

const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

// Get API key from environment variable
const getApiKey = (): string | undefined => {
    // @ts-ignore - Vite injects this at build time
    return import.meta.env?.VITE_IMGBB_API_KEY;
};

export interface ImgBBResponse {
    success: boolean;
    data?: {
        url: string;
        display_url: string;
        thumb: {
            url: string;
        };
        delete_url: string;
    };
    error?: {
        message: string;
    };
}

/**
 * Uploads a base64 image to ImgBB and returns the hosted URL.
 * @param base64Data - The base64 encoded image (with or without data URL prefix)
 * @param name - Optional name for the image
 * @returns The hosted image URL, or null if upload failed
 */
export async function uploadToImgBB(base64Data: string, name?: string): Promise<string | null> {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error('ImgBB API key not configured. Set VITE_IMGBB_API_KEY in .env');
        return null;
    }

    // Remove data URL prefix if present
    const base64 = base64Data.includes(',')
        ? base64Data.split(',')[1]
        : base64Data;

    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64);
    if (name) {
        formData.append('name', name);
    }

    try {
        const response = await fetch(IMGBB_API_URL, {
            method: 'POST',
            body: formData,
        });

        const result: ImgBBResponse = await response.json();

        if (result.success && result.data) {
            // Return the display URL (direct link to image)
            return result.data.display_url;
        } else {
            console.error('ImgBB upload failed:', result.error?.message);
            return null;
        }
    } catch (error) {
        console.error('ImgBB upload error:', error);
        return null;
    }
}

/**
 * Checks if a string is an ImgBB URL (or any hosted URL)
 */
export function isHostedUrl(src: string | undefined): boolean {
    if (!src) return false;
    // Allow:
    // 1. Hosted URLs (http/https)
    // 2. Local assets (starting with /)
    // 3. Data URLs (Safe now that we use Hash routing!)
    return src.startsWith('http') || src.startsWith('/') || src.startsWith('data:');
}
