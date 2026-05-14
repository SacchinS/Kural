import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kural',
    short_name: 'Kural',
    description: 'Voice communication for ALS patients',
    start_url: '/aac',
    display: 'fullscreen',
    background_color: '#1C1C1E',
    theme_color: '#00C9A7',
    orientation: 'landscape',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
