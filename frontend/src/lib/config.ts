// Get API URL based on environment
export function getApiUrl(): string {
  // Use Vite env var - this will be set to Railway URL in production
  const viteUrl = import.meta.env.VITE_API_URL;
  if (viteUrl) {
    return viteUrl;
  }

  // Default fallback for local development
  return 'http://localhost:3001';
}
}
