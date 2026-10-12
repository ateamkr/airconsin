/**
 * Utility to compress and upload images for Netlify compatibility.
 * Keeps payloads lightweight and prevents 413 (Payload Too Large) errors.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    mimeType = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Better downsampling quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt webp or fallback to jpeg
        try {
          const compressed = canvas.toDataURL(mimeType, quality);
          resolve(compressed);
        } catch {
          const fallback = canvas.toDataURL('image/jpeg', quality);
          resolve(fallback);
        }
      };
      img.onerror = () => reject(new Error('이미지를 읽어오지 못했습니다.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image to the backend /api/upload endpoint if token is present,
 * or returns the compressed base64 dataUrl as safe fallback.
 */
export async function uploadOrCompressImage(
  file: File,
  token?: string | null,
  options?: CompressOptions
): Promise<string> {
  const compressedDataUrl = await compressImage(file, options);

  if (token) {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dataUrl: compressedDataUrl,
          fileName: file.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.url) {
          return data.url;
        }
      }
    } catch (err) {
      console.warn('API upload fallback to compressed base64:', err);
    }
  }

  return compressedDataUrl;
}
