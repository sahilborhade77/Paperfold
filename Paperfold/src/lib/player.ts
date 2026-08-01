import { loadYouTubeIframeAPI } from './youtube';

export async function createYouTubePlayer(
  container: HTMLElement,
  videoId: string,
  onStateChange: (state: number) => void,
  onReady?: (player: any) => void,
  playerVars: Record<string, any> = {}
) {
  const YT = await loadYouTubeIframeAPI();
  return new YT.Player(container, {
    height: '100%',
    width: '100%',
    videoId,
    playerVars: {
      playsinline: 1,
      modestbranding: 1,
      rel: 0,
      controls: 1,
      ...playerVars,
    },
    events: {
      onReady: (event: any) => onReady?.(event.target),
      onStateChange: (event: any) => onStateChange(event.data),
    },
  });
}
