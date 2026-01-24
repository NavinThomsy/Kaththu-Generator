/**
 * Compresses an image to reduce its size for URL encoding.
 * Uses canvas to resize and convert to JPEG with aggressive compression.
 */

// Relaxed settings for ImgBB upload (preserving reasonable quality)
const MAX_DIMENSION = 800; // Max width/height in pixels
const JPEG_QUALITY = 0.8; // High quality

export async function compressImage(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            // Calculate new dimensions maintaining aspect ratio
            let { width, height } = img;

            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width > height) {
                    height = Math.round((height / width) * MAX_DIMENSION);
                    width = MAX_DIMENSION;
                } else {
                    width = Math.round((width / height) * MAX_DIMENSION);
                    height = MAX_DIMENSION;
                }
            }

            // Create canvas and draw resized image
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw the image onto the canvas (CRITICAL: was missing previously!)
            ctx.drawImage(img, 0, 0, width, height);

            // Export as PNG for non-JPEGs to strictly preserve transparency
            let mimeType = 'image/png';
            if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) {
                mimeType = 'image/jpeg';
            }

            // For PNGs, quality is ignored but transparency is preserved.
            const compressedDataUrl = canvas.toDataURL(mimeType, mimeType === 'image/jpeg' ? JPEG_QUALITY : undefined);
            resolve(compressedDataUrl);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = dataUrl;
    });
}

/**
 * Reads a file and returns a compressed data URL.
 */
export async function readAndCompressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
            if (ev.target?.result) {
                try {
                    const compressed = await compressImage(ev.target.result as string);
                    resolve(compressed);
                } catch (err) {
                    reject(err);
                }
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
