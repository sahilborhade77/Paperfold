import React, { useState, useRef, useEffect } from 'react';
import { Song } from '../types';
import { cardService } from '../services/cardService';
import { createYouTubePlayer } from '../lib/player';

interface YouTubeResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

interface WizardMelodyViewProps {
  currentSong: Song;
  onSelectSong: (song: Song) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WizardMelodyView: React.FC<WizardMelodyViewProps> = ({
  currentSong,
  onSelectSong,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'upload'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreviewVideoId, setCurrentPreviewVideoId] = useState<string | null>(
    currentSong.songType === 'youtube' ? currentSong.youtubeVideoId || null : null
  );
  const [shouldAutoPlayPreview, setShouldAutoPlayPreview] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerContainerRef = useRef<HTMLDivElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const searchDebounce = useRef<number | null>(null);
  const isYouTubeSong = currentSong.songType === 'youtube' && Boolean(currentSong.youtubeVideoId);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    if (searchDebounce.current) {
      window.clearTimeout(searchDebounce.current);
    }

    searchDebounce.current = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetch(`/api/youtube-search?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || 'YouTube search failed');
        }
        const data = await response.json();
        setSearchResults(data.items ?? []);
      } catch (error) {
        console.error(error);
        setSearchError(error instanceof Error ? error.message : 'Search failed');
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => {
      if (searchDebounce.current) {
        window.clearTimeout(searchDebounce.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (currentSong.songType === 'youtube') {
      setCurrentPreviewVideoId(currentSong.youtubeVideoId || null);
    } else {
      setCurrentPreviewVideoId(null);
    }
    setIsPlaying(false);
  }, [currentSong.songType, currentSong.youtubeVideoId]);

  useEffect(() => {
    if (!isYouTubeSong || !currentPreviewVideoId || !youtubePlayerContainerRef.current) {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy?.();
        youtubePlayerRef.current = null;
      }
      return;
    }

    let mounted = true;
    const setupPlayer = async () => {
      try {
        if (youtubePlayerRef.current) {
          youtubePlayerRef.current.loadVideoById(currentPreviewVideoId);
          if (shouldAutoPlayPreview) {
            youtubePlayerRef.current.playVideo();
            setIsPlaying(true);
            setShouldAutoPlayPreview(false);
          }
          return;
        }

        const player = await createYouTubePlayer(
          youtubePlayerContainerRef.current!,
          currentPreviewVideoId,
          (state) => {
            if (!mounted) return;
            const YT = (window as any).YT;
            if (state === YT?.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (state === YT?.PlayerState.PAUSED || state === YT?.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          },
          (player) => {
            if (!mounted) return;
            if (shouldAutoPlayPreview) {
              player.playVideo();
              setIsPlaying(true);
              setShouldAutoPlayPreview(false);
            }
          },
          {
            autoplay: shouldAutoPlayPreview ? 1 : 0,
          }
        );

        if (!mounted) {
          player.destroy?.();
          return;
        }

        youtubePlayerRef.current = player;
      } catch (err) {
        console.error('Failed to create YouTube player:', err);
      }
    };

    setupPlayer();

    return () => {
      mounted = false;
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy?.();
        youtubePlayerRef.current = null;
      }
    };
  }, [isYouTubeSong, currentPreviewVideoId, shouldAutoPlayPreview]);

  useEffect(() => {
    if (!shouldAutoPlayPreview) return;

    if (isYouTubeSong) {
      if (youtubePlayerRef.current?.playVideo) {
        youtubePlayerRef.current.playVideo();
        setIsPlaying(true);
        setShouldAutoPlayPreview(false);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setShouldAutoPlayPreview(false);
        })
        .catch((err) => {
          console.warn('Audio autoplay failed:', err);
          setShouldAutoPlayPreview(false);
        });
    }
  }, [shouldAutoPlayPreview, isYouTubeSong]);

  const togglePlayPreview = () => {
    if (isYouTubeSong) {
      if (!youtubePlayerRef.current) return;
      const playerState = youtubePlayerRef.current.getPlayerState?.();
      const YT = (window as any).YT;
      if (playerState === YT?.PlayerState.PLAYING) {
        youtubePlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        youtubePlayerRef.current.playVideo();
        setIsPlaying(true);
      }
      setShouldAutoPlayPreview(false);
      return;
    }

    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log('Audio error:', err));
    }
  };

  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus('uploading');
      setUploadError(null);
      const tempUrl = URL.createObjectURL(file);
      try {
        const uploadedUrl = await cardService.uploadMusic(tempUrl);
        const customSong: Song = {
          id: `custom-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Custom Recording',
          duration: 'Custom',
          coverUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCRHFzEa21WAv9_4Qp_f2I0o0soOKQexMtHmQT8G8xX92OsWC7-T6I_-VnMIcQCgJwkqP1HwEQlfVfoCm4mfRvjfAh9TqL5ElndVtC_uZPE5GLEBkxE-8WZq87tPMZADAjIDB2Ln74bbKKjHiLhY63LSIt_KaploiNtJ9lscS70LIhvqHjBkzuFpp-82qO1LO9I7qGP0n_rqeXB5AWp7aaAdJO2PoW-dU-I6PmQSUdgvW2FUyVQXxQs',
          audioUrl: uploadedUrl,
          songType: 'upload',
        };
        onSelectSong(customSong);
        setUploadStatus('success');
        setIsPlaying(false);
        setShouldAutoPlayPreview(true);
      } catch (err) {
        console.error(err);
        setUploadStatus('error');
        setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      }
    }
  };

  return (
    <main className="flex-grow pt-24 pb-36 px-6 max-w-4xl mx-auto w-full">
      {/* Step Indicator */}
      <div className="mb-6 flex justify-center items-center gap-4">
        <div className="flex flex-col items-center opacity-80">
          <div className="w-8 h-8 rounded-full bg-[#A5A58D] text-white flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <span className="text-[11px] font-bold font-label-caps mt-1 uppercase tracking-wider text-[#A5A58D]">
            Visual
          </span>
        </div>
        <div className="w-12 h-[1px] bg-[#dcc0c0]" />
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#6d1824] text-white flex items-center justify-center font-bold shadow-md">
            2
          </div>
          <span className="text-[11px] font-bold font-label-caps mt-1 text-[#6d1824] uppercase tracking-wider">
            Melody
          </span>
        </div>
        <div className="w-12 h-[1px] bg-[#dcc0c0]" />
        <div className="flex flex-col items-center opacity-50">
          <div className="w-8 h-8 rounded-full border-2 border-[#A5A58D] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <span className="text-[11px] font-bold font-label-caps mt-1 uppercase tracking-wider">
            Send
          </span>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-[#fdf9f4] p-6 md:p-8 rounded-xl shadow-[0_4px_20px_rgba(61,61,61,0.1)] relative overflow-hidden space-y-6">
        <header className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-[#3D3D3D] mb-1">
            Set the Atmosphere
          </h2>
          <p className="text-sm font-body-md text-[#564242]">
            Choose or upload a melody that echoes the sentiment of your letter.
          </p>
        </header>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#dcc0c0]/40 justify-center">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-3 px-6 font-label-caps text-xs tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'search'
                ? 'border-[#6d1824] text-[#6d1824] font-bold'
                : 'border-transparent text-[#564242] hover:text-[#6d1824]'
            }`}
          >
            Music Library &amp; Search
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-6 font-label-caps text-xs tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#6d1824] text-[#6d1824] font-bold'
                : 'border-transparent text-[#564242] hover:text-[#6d1824]'
            }`}
          >
            Upload Custom Audio (.mp3, .wav)
          </button>
        </div>

        {activeTab === 'search' ? (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#A5A58D]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search song title, artist, or mood..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#dcc0c0] rounded-xl text-sm focus:outline-none focus:border-[#6d1824]"
              />
            </div>

            <div className="space-y-3">
              {isSearching && (
                <div className="text-center text-xs text-[#564242]">
                  Searching YouTube for “{searchQuery}”...
                </div>
              )}
              {searchError && (
                <div className="text-center text-xs text-[#ba1a1a]">
                  {searchError}
                </div>
              )}
              {!isSearching && !searchError && searchQuery.trim() && searchResults.length === 0 && (
                <div className="text-center text-xs text-[#564242]">
                  No results found. Try a different song, artist, or mood.
                </div>
              )}

              <div className="divide-y divide-[#dcc0c0]/30 max-h-[320px] overflow-y-auto pr-1">
                {searchResults.map((result) => {
                  const isSelected =
                    currentSong.songType === 'youtube' &&
                    currentSong.youtubeVideoId === result.videoId;

                  return (
                    <div
                      key={result.videoId}
                      onClick={() => {
                        onSelectSong({
                          id: result.videoId,
                          title: result.title,
                          artist: result.channelTitle,
                          duration: 'Video',
                          coverUrl: result.thumbnailUrl,
                          audioUrl: '',
                          songType: 'youtube',
                          youtubeVideoId: result.videoId,
                        });
                        setCurrentPreviewVideoId(result.videoId);
                        setIsPlaying(false);
                        setShouldAutoPlayPreview(true);
                      }}
                      className={`p-3 flex items-center justify-between rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFB7B2]/30 border-l-4 border-[#6d1824]'
                          : 'hover:bg-[#f1ede8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/10 shrink-0 relative">
                          <img
                            src={result.thumbnailUrl}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold font-headline-md text-sm text-[#3D3D3D] truncate">
                            {result.title}
                          </p>
                          <p className="text-[11px] font-body-md text-[#564242] truncate">
                            {result.channelTitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-label-caps text-[#A5A58D]">
                          Video
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#6d1824] bg-[#6d1824]' : 'border-[#dcc0c0]'
                          }`}
                        >
                          {isSelected && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {currentPreviewVideoId && (
              <div className="mt-4">
                <p className="text-xs font-label-caps text-[#A5A58D] uppercase tracking-wider mb-2">
                  YouTube Preview
                </p>
                <div className="aspect-video rounded-3xl overflow-hidden border border-[#dcc0c0]">
                  <div ref={youtubePlayerContainerRef} className="w-full h-full bg-black" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-[#897272] rounded-xl bg-[#f7f3ee] relative min-h-[260px]">
            <input
              type="file"
              ref={audioFileInputRef}
              accept="audio/*"
              onChange={handleAudioFileUpload}
              className="hidden"
            />
            {uploadStatus === 'uploading' ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <span className="material-symbols-outlined text-5xl text-[#6d1824] animate-spin">sync</span>
                <p className="text-sm font-bold text-[#6d1824] animate-pulse">Uploading melody to vault...</p>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-5xl text-[#A5A58D] mb-3">
                  upload_file
                </span>
                <p className="text-lg font-bold font-headline-md text-[#3D3D3D]">
                  Select music from your computer
                </p>
                <p className="text-xs font-label-caps text-[#564242] mt-1 mb-2">
                  Browse to your music folder, such as <span className="font-semibold">E:\music</span>, then choose an audio file.
                </p>
                <p className="text-xs font-label-caps text-[#564242] mb-4">
                  MP3, WAV, AAC, M4A up to 25MB
                </p>
                <button
                  onClick={() => audioFileInputRef.current?.click()}
                  className="px-6 py-2 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider cursor-pointer"
                >
                  Choose Local Audio
                </button>
                {uploadStatus === 'success' && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[#14532D] font-semibold">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Melody added successfully!
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="mt-4 flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-xs text-[#ba1a1a] font-semibold">
                      <span className="material-symbols-outlined text-sm">error</span> Upload failed.
                    </div>
                    {uploadError && <p className="text-[11px] text-[#ba1a1a] mt-1">{uploadError}</p>}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Floating Melody Player Bar */}
      <div className="mt-6 bg-[#fffcf9] p-4 rounded-2xl shadow-lg border border-[#dcc0c0]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-black p-1 relative shadow-md shrink-0">
            <img
              src={currentSong.coverUrl}
              alt="Album Artwork"
              className={`w-full h-full rounded-full object-cover ${isPlaying ? 'vinyl-spin' : ''}`}
            />
            <div className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-label-caps text-[#A5A58D] uppercase tracking-wider block">
              Currently Selected
            </span>
            <h4 className="font-bold font-headline-md text-[#5E1E24] text-base">
              {currentSong.title}
            </h4>
            <p className="text-xs font-body-md text-[#564242]">{currentSong.artist}</p>
          </div>
        </div>

        {/* Audio Element & Controls */}
        <div className="flex items-center gap-3">
          {currentSong.audioUrl && (
            <audio
              ref={audioRef}
              src={currentSong.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
          )}
          <button
            onClick={togglePlayPreview}
            disabled={!currentSong.audioUrl && currentSong.songType !== 'youtube'}
            className="w-10 h-10 rounded-full bg-[#6d1824] text-white flex items-center justify-center shadow-md hover:bg-[#5E1E24] transition-transform active:scale-90 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title={isPlaying ? 'Pause' : 'Play Preview'}
          >
            <span className="material-symbols-outlined">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Nav Bar */}
      <div className="mt-8 flex justify-between items-center bg-[#fdf9f4] p-4 rounded-full shadow-lg border border-[#dcc0c0]/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-[#564242] font-label-caps text-xs tracking-wider hover:text-[#6d1824] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_left</span>
          Back to Canvas
        </button>

        <button
          onClick={onNext}
          disabled={uploadStatus === 'uploading'}
          className="flex items-center gap-2 px-8 py-3 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider shadow-md hover:bg-[#5E1E24] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Finishing Touch
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </main>
  );
};
