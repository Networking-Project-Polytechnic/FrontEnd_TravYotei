import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TravYotei Agency Hub',
    short_name: 'TravYotei',
    description: 'Your travel companion',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
    //   {
    //     src: '/PWA-icon/logo.svg',
    //     sizes: '192x192',
    //     type: 'image/svg+xml',
    //   },
      {
        src: '/PWA-icon/travyotei.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}