const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const query = req.query?.query || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('query') : undefined);
  if (!query || typeof query !== 'string' || !query.trim()) {
    res.status(400).json({ error: 'Missing query parameter' });
    return;
  }

  if (!YOUTUBE_API_KEY) {
    res.status(500).json({ error: 'YouTube API key not configured' });
    return;
  }

  const params = new URLSearchParams({
    key: YOUTUBE_API_KEY,
    part: 'snippet',
    q: query.trim(),
    type: 'video',
    maxResults: '8',
  });

  try {
    const youtubeResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/search?${params}`);
    if (!youtubeResponse.ok) {
      const errorData = await youtubeResponse.text();
      res.status(youtubeResponse.status).json({ error: 'YouTube API request failed', details: errorData });
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
              item.snippet?.thumbnails?.medium?.url ||
              item.snippet?.thumbnails?.default?.url ||
              '',
          }))
          .filter((item: any) => item.videoId)
      : [];

    res.status(200).json({ items });
  } catch (error) {
    console.error('YouTube search failed:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube search results' });
  }
}
