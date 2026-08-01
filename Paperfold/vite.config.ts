import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const youtubeSearchPlugin = () => ({
  name: 'vite:youtube-search-proxy',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (!req.url?.startsWith('/api/youtube-search') || req.method !== 'GET') {
        next();
        return;
      }

      const url = new URL(req.url, 'http://localhost');
      const query = url.searchParams.get('query');
      if (!query) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing query parameter' }));
        return;
      }

      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'YouTube API key not configured' }));
        return;
      }

      const params = new URLSearchParams({
        key: apiKey,
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: '8',
      });

      try {
        const youtubeResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/search?${params}`);
        if (!youtubeResponse.ok) {
          const errorText = await youtubeResponse.text();
          res.statusCode = youtubeResponse.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'YouTube API request failed', details: errorText }));
          return;
        }

        const data = await youtubeResponse.json();
        const items = Array.isArray(data.items)
          ? data.items
              .map((item: any) => ({
                videoId: item.id?.videoId,
                title: item.snippet?.title,
                channelTitle: item.snippet?.channelTitle,
                thumbnailUrl:
                  item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
              }))
              .filter((item: any) => item.videoId)
          : [];

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ items }));
      } catch (error) {
        console.error('YouTube search failed:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Failed to fetch YouTube search results' }));
      }
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), youtubeSearchPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
