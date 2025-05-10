import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/favicon.svg', 'icons/apple-touch-icon.png', 'robots.txt'],
            manifest: {
                name: 'Ghar Karcha',
                short_name: 'GharKarcha',
                description: 'Manage your household expenses with ease',
                theme_color: '#4F86C6',
                icons: [
                    {
                        src: 'icons/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),
    ],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
    server: {
        host: '0.0.0.0', // Allows access via LAN IP (e.g., 192.168.x.x)
        port: 5173, // Or any port you prefer
    },
});
