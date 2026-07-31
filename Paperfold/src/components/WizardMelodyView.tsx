import React, { useState, useRef } from 'react';
import { Song } from '../types';
import { SAMPLE_SONGS } from '../data';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const filteredSongs = SAMPLE_SONGS.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlayPreview = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log('Audio error:', err));
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const customSong: Song = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Custom Recording',
        duration: 'Custom',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRHFzEa21WAv9_4Qp_f2I0o0soOKQexMtHmQT8G8xX92OsWC7-T6I_-VnMIcQCgJwkqP1HwEQlfVfoCm4mfRvjfAh9TqL5ElndVtC_uZPE5GLEBkxE-8WZq87tPMZADAjIDB2Ln74bbKKjHiLhY63LSIt_KaploiNtJ9lscS70LIhvqHjBkzuFpp-82qO1LO9I7qGP0n_rqeXB5AWp7aaAdJO2PoW-dU-I6PmQSUdgvW2FUyVQXxQs',
        audioUrl: url,
      };
      onSelectSong(customSong);
      setIsPlaying(false);
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

            {/* Song Catalog List */}
            <div className="divide-y divide-[#dcc0c0]/30 max-h-[320px] overflow-y-auto pr-1">
              {filteredSongs.map((song) => {
                const isSelected = currentSong.id === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      onSelectSong(song);
                      setIsPlaying(false);
                    }}
                    className={`p-3 flex items-center justify-between rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFB7B2]/30 border-l-4 border-[#6d1824]'
                        : 'hover:bg-[#f1ede8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/10 shrink-0 relative">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold font-headline-md text-sm text-[#3D3D3D]">
                          {song.title}
                        </p>
                        <p className="text-xs font-body-md text-[#564242]">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-label-caps text-[#A5A58D]">
                        {song.duration}
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
        ) : (
          <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-[#897272] rounded-xl bg-[#f7f3ee]">
            <input
              type="file"
              ref={audioFileInputRef}
              accept="audio/*"
              onChange={handleAudioFileUpload}
              className="hidden"
            />
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
              className="px-6 py-2 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider"
            >
              Choose Local Audio
            </button>
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
            <span className="text-[10px] font-bold font-label-caps text-[#A5A58D] uppercase tracking-wider">
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
          <audio
            ref={audioRef}
            src={currentSong.audioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'}
            onEnded={() => setIsPlaying(false)}
          />
          <button
            onClick={togglePlayPreview}
            className="w-10 h-10 rounded-full bg-[#6d1824] text-white flex items-center justify-center shadow-md hover:bg-[#5E1E24] transition-transform active:scale-90 cursor-pointer"
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
          className="flex items-center gap-2 px-8 py-3 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider shadow-md hover:bg-[#5E1E24] transition-all active:scale-95 cursor-pointer"
        >
          Next: Finishing Touch
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </main>
  );
};
