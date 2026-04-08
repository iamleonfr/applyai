// Get API URL based on environment
export function getApiUrl(): string {
  // For production (Vercel), use the Railway backend
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://applyai-production-7884.up.railway.app';
  }

  // Import from Vite env var if available
  const viteUrl = import.meta.env.VITE_API_URL;
  if (viteUrl) {
    return viteUrl;
  }

  // Default fallback for local development
  return 'http://localhost:3001';
}
