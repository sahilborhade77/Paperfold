export const loadYouTubeIframeAPI = (): Promise<any> => {
  const win = window as any;

  if (win.YT?.Player) {
    return Promise.resolve(win.YT);
  }

  if (win.ytApiReadyPromise) {
    return win.ytApiReadyPromise;
  }

  win.ytApiReadyPromise = new Promise((resolve, reject) => {
    win.onYouTubeIframeAPIReady = () => {
      resolve(win.YT);
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.onerror = () => reject(new Error('Failed to load YouTube IFrame API'));
    document.body.appendChild(tag);
  });

  return win.ytApiReadyPromise;
};
