import React, { useState, useRef, useEffect } from 'react';
import { CardData } from '../types';

interface RecipientViewProps {
  cardData: CardData;
  onEditCard: () => void;
  onSaveToLibrary: (card: CardData) => void;
}

export const RecipientView: React.FC<RecipientViewProps> = ({
  cardData,
  onEditCard,
  onSaveToLibrary,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showExpiryPill, setShowExpiryPill] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Hide expiry pill after 5 seconds
    setShowExpiryPill(true);
    const timer = setTimeout(() => {
      setShowExpiryPill(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [cardData.id]);

  const handleOpen = () => {
    setIsOpened(true);
    // Tiny delay to ensure browser register interaction before play call
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay blocked:', err);
            setIsPlaying(false);
          });
      }
    }, 50);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSave = () => {
    onSaveToLibrary(cardData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isOpened) {
    return (
      <main className="flex-grow pt-24 pb-36 px-4 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        {/* Hidden Audio Player so it is ready in the DOM */}
        <audio
          ref={audioRef}
          src={cardData.song.audioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'}
          loop
        />
        
        <div className="bg-[#fffcf9] border border-[#dcc0c0]/50 shadow-2xl rounded-2xl p-8 text-center space-y-6 w-full deckled-edge transition-all duration-300 hover:scale-[1.02]">
          <div className="w-20 h-20 mx-auto bg-[#FFB7B2]/30 rounded-full flex items-center justify-center animate-bounce">
            <span className="material-symbols-outlined text-4xl text-[#6d1824]">drafts</span>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold font-label-caps text-[#A5A58D] uppercase tracking-widest block">
              You've Received a Letter
            </span>
            <h2 className="text-2xl font-bold font-headline-md text-[#5E1E24]">
              {cardData.senderName ? `From ${cardData.senderName}` : 'A Message for You'}
            </h2>
            <p className="text-xs font-body-md text-[#564242]">
              Open to read the custom letter and listen to the attached melody.
            </p>
          </div>
          <button
            onClick={handleOpen}
            className="w-full py-3 bg-[#6d1824] hover:bg-[#5E1E24] text-white rounded-full font-label-caps text-xs tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            Open Letter
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-20 pb-36 px-4 md:px-8 max-w-4xl mx-auto w-full relative">
      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={cardData.song.audioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'}
        loop
      />

      {/* Top Banner & Music Controller */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <span className="text-[10px] font-bold font-label-caps text-[#A5A58D] uppercase tracking-widest block">
            A Sentimental Letter
          </span>
          <h2 className="text-2xl font-bold font-headline-md text-[#5E1E24]">
            A Message for You
          </h2>
        </div>

        {/* Music Play / Pause Control Pill */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer ${
            isPlaying ? 'bg-[#5E1E24] text-white' : 'bg-white text-[#5E1E24] border border-[#dcc0c0]'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-black/30 p-0.5 relative shrink-0">
            <img
              src={cardData.song.coverUrl}
              alt="Song cover"
              className={`w-full h-full rounded-full object-cover ${isPlaying ? 'vinyl-spin' : ''}`}
            />
          </div>
          <span className="text-xs font-bold font-headline-md">
            {isPlaying ? 'Playing Melody' : 'Play Attached Song'}
          </span>
          <span className="material-symbols-outlined text-sm">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </div>

      {/* Floating Whisper Notification Pill */}
      {showExpiryPill && (
        <div className="mb-6 mx-auto max-w-md bg-[#FFB7B2]/30 border border-[#FFB7B2] text-[#5E1E24] px-4 py-2 rounded-full text-center text-xs font-body-md whisper-fade flex items-center justify-center gap-2 animate-pulse">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span>This card will whisper its last words in {cardData.expiresInDays || 7} days.</span>
        </div>
      )}

      {/* Main Recipient Card Container */}
      <div className="canvas-bg p-6 md:p-12 rounded-3xl border-2 border-[#dcc0c0]/40 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Render Floating Stamps */}
        {cardData.stickers.map((st) => (
          <div
            key={st.id}
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              transform: `rotate(${st.rotation}deg)`,
            }}
          >
            <span
              className="material-symbols-outlined text-4xl drop-shadow-md"
              style={{ color: st.color }}
            >
              {st.icon}
            </span>
          </div>
        ))}

        {/* Card Body */}
        <div className="bg-[#fffcf9] p-8 md:p-12 rounded-xl shadow-xl max-w-2xl w-full border border-[#dcc0c0]/40 relative deckled-edge space-y-6">
          {/* Top Location & Date */}
          <div className="flex justify-between items-center text-xs font-label-caps text-[#897272] border-b border-[#dcc0c0]/30 pb-3">
            <span>{cardData.dateStr}</span>
            <span>{cardData.location}</span>
          </div>

          {/* Polaroid Photo Memory */}
          <div className="flex justify-center my-4">
            <div
              className="polaroid-frame w-56 shadow-md transition-transform hover:scale-105 duration-300"
              style={{ transform: `rotate(${cardData.photoRotation || -2}deg)` }}
            >
              <img
                src={cardData.photoUrl}
                alt="Memory"
                className="w-full aspect-square object-cover"
              />
              <p className="text-center text-xs font-handwritten-note text-[#3D3D3D] mt-2">
                {cardData.photoCaption}
              </p>
            </div>
          </div>

          {/* Headline */}
          <h3
            style={{ color: cardData.inkColor }}
            className={`text-2xl font-bold ${
              cardData.fontStyle === 'script'
                ? 'font-script text-3xl'
                : cardData.fontStyle === 'handwritten'
                ? 'font-handwritten-note'
                : 'font-body-md'
            }`}
          >
            {cardData.headline}
          </h3>

          {/* Message Content */}
          <div
            style={{ color: cardData.inkColor }}
            className={`whitespace-pre-line leading-relaxed text-base md:text-lg ${
              cardData.fontStyle === 'script'
                ? 'font-script text-2xl'
                : cardData.fontStyle === 'handwritten'
                ? 'font-handwritten-note text-xl'
                : 'font-body-md'
            }`}
          >
            {cardData.message}
          </div>

          {/* Sign-off */}
          <div className="text-right pt-4 border-t border-[#dcc0c0]/30">
            <p
              style={{ color: cardData.inkColor }}
              className={`text-lg font-bold ${
                cardData.fontStyle === 'script'
                  ? 'font-script text-2xl'
                  : cardData.fontStyle === 'handwritten'
                  ? 'font-handwritten-note text-xl'
                  : 'font-body-md'
              }`}
            >
              Yours, {cardData.senderName}
            </p>
          </div>

          {/* Vinyl Record Footer Badge inside card */}
          <div className="mt-8 pt-4 border-t border-dashed border-[#dcc0c0]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#8c2f39]">music_note</span>
              <span className="text-xs font-headline-md text-[#5E1E24]">
                <strong>{cardData.song.title}</strong> — {cardData.song.artist}
              </span>
            </div>
            <button
              onClick={toggleAudio}
              className="text-xs font-label-caps text-[#8c2f39] underline cursor-pointer"
            >
              {isPlaying ? 'Pause Song' : 'Play Song'}
            </button>
          </div>
        </div>
      </div>

      {/* Recipient Action Bar */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={handleSave}
          className="sticker-btn bg-white border border-[#dcc0c0] text-[#5E1E24] px-6 py-3 rounded-full font-label-caps text-xs flex items-center gap-2 hover:bg-[#F9F5F0] cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">
            {saved ? 'bookmark_added' : 'bookmark'}
          </span>
          {saved ? 'Saved to Library!' : 'Save to My Library'}
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="sticker-btn bg-white border border-[#dcc0c0] text-[#5E1E24] px-6 py-3 rounded-full font-label-caps text-xs flex items-center gap-2 hover:bg-[#F9F5F0] cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">qr_code_2</span>
          Keep the Echo (Share / QR)
        </button>

        <button
          onClick={onEditCard}
          className="sticker-btn bg-[#6d1824] text-white px-8 py-3 rounded-full font-label-caps text-xs flex items-center gap-2 hover:bg-[#5E1E24] cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          Edit or Reply
        </button>
      </div>

      {/* Share / QR Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#fdf9f4] p-6 rounded-2xl max-w-sm w-full hand-drawn-border relative shadow-2xl text-center space-y-4">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-[#564242] p-1 hover:text-black"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold font-headline-md text-[#5E1E24]">
              Keep the Echo
            </h3>
            <p className="text-xs font-body-md text-[#564242]">
              Scan QR code or share this direct link to listen to the melody and letter together.
            </p>

            {/* QR Code Graphic Placeholder */}
            <div className="w-40 h-40 mx-auto bg-white p-3 rounded-xl border border-[#dcc0c0] shadow-xs flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  window.location.href
                )}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowShareModal(false);
              }}
              className="w-full py-2.5 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
