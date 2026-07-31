import React from 'react';
import { CardData, StickerItem } from '../types';

interface CanvasEditorViewProps {
  cardData: CardData;
  onUpdateCard: (updated: Partial<CardData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CanvasEditorView: React.FC<CanvasEditorViewProps> = ({
  cardData,
  onUpdateCard,
  onNext,
  onBack,
}) => {
  // Sticker Types
  const STICKER_TYPES = [
    { icon: 'favorite', label: 'Heart', color: '#FFB7B2' },
    { icon: 'local_florist', label: 'Flower', color: '#A5A58D' },
    { icon: 'star', label: 'Star', color: '#FFD166' },
    { icon: 'local_cafe', label: 'Coffee', color: '#8c2f39' },
  ];

  const handleAddSticker = (type: typeof STICKER_TYPES[0]) => {
    const newSticker: StickerItem = {
      id: `st-${Date.now()}`,
      icon: type.icon,
      color: type.color,
      x: Math.floor(Math.random() * 60) + 20,
      y: Math.floor(Math.random() * 60) + 20,
      rotation: Math.floor(Math.random() * 30) - 15,
    };
    onUpdateCard({ stickers: [...cardData.stickers, newSticker] });
  };

  const handleRemoveSticker = (id: string) => {
    onUpdateCard({ stickers: cardData.stickers.filter((s) => s.id !== id) });
  };

  return (
    <main className="flex-grow pt-20 pb-32 px-4 md:px-8 max-w-6xl mx-auto w-full">
      {/* Top Header / Status */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-headline-md text-[#5E1E24]">
            Tactile Canvas Editor
          </h2>
          <p className="text-xs font-body-md text-[#564242]">
            Craft your photo, letter, ink tone, and stickers on the tabletop.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-white/80 backdrop-blur-xs p-2 rounded-2xl shadow-xs border border-[#dcc0c0]/30">
          {/* Font Picker */}
          <div className="flex items-center bg-[#f7f3ee] rounded-xl p-1 gap-1">
            <button
              onClick={() => onUpdateCard({ fontStyle: 'serif' })}
              className={`px-3 py-1 rounded-lg text-xs font-body-md ${
                cardData.fontStyle === 'serif' ? 'bg-[#5E1E24] text-white' : 'text-[#564242]'
              }`}
            >
              Serif
            </button>
            <button
              onClick={() => onUpdateCard({ fontStyle: 'handwritten' })}
              className={`px-3 py-1 rounded-lg text-xs font-handwritten-note ${
                cardData.fontStyle === 'handwritten' ? 'bg-[#5E1E24] text-white' : 'text-[#564242]'
              }`}
            >
              Hand
            </button>
            <button
              onClick={() => onUpdateCard({ fontStyle: 'script' })}
              className={`px-3 py-1 rounded-lg text-xs font-script ${
                cardData.fontStyle === 'script' ? 'bg-[#5E1E24] text-white' : 'text-[#564242]'
              }`}
            >
              Script
            </button>
          </div>

          {/* Ink Color Picker */}
          <div className="flex items-center gap-1 px-2 border-l border-[#dcc0c0]/40">
            <button
              onClick={() => onUpdateCard({ inkColor: '#5E1E24' })}
              className={`w-6 h-6 rounded-full border-2 ${
                cardData.inkColor === '#5E1E24' ? 'border-black scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: '#5E1E24' }}
              title="Berry Ink"
            />
            <button
              onClick={() => onUpdateCard({ inkColor: '#3D3D3D' })}
              className={`w-6 h-6 rounded-full border-2 ${
                cardData.inkColor === '#3D3D3D' ? 'border-black scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: '#3D3D3D' }}
              title="Vintage Ink"
            />
            <button
              onClick={() => onUpdateCard({ inkColor: '#5c614d' })}
              className={`w-6 h-6 rounded-full border-2 ${
                cardData.inkColor === '#5c614d' ? 'border-black scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: '#5c614d' }}
              title="Sage Ink"
            />
          </div>

          {/* AI Helper */}
        </div>
      </div>

      {/* Main Tabletop Canvas Workspace */}
      <div className="canvas-bg min-h-[600px] p-6 md:p-12 rounded-2xl border-2 border-[#dcc0c0]/40 shadow-inner relative overflow-hidden flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
        {/* Floating Stickers Container */}
        {cardData.stickers.map((st) => (
          <div
            key={st.id}
            className="absolute z-20 cursor-pointer group hover:scale-125 transition-transform"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              transform: `rotate(${st.rotation}deg)`,
            }}
            onClick={() => handleRemoveSticker(st.id)}
            title="Click to remove sticker"
          >
            <span
              className="material-symbols-outlined text-3xl drop-shadow-md"
              style={{ color: st.color }}
            >
              {st.icon}
            </span>
          </div>
        ))}

        {/* Polaroid Attachment */}
        <div className="w-full max-w-sm flex flex-col items-center">
          <div
            className="polaroid-frame w-full max-w-[300px] transition-transform duration-300 hover:rotate-0 shadow-lg relative"
            style={{ transform: `rotate(${cardData.photoRotation || -2}deg)` }}
          >
            <div className="aspect-square bg-[#f1ede8] overflow-hidden mb-3 relative group">
              <img
                src={cardData.photoUrl}
                alt="Selected Memory"
                className="w-full h-full object-cover"
              />
              <button
                onClick={onBack}
                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-label-caps text-xs gap-1"
              >
                <span className="material-symbols-outlined text-base">sync</span>
                Change Photo
              </button>
            </div>

            {/* Photo Caption */}
            <input
              type="text"
              value={cardData.photoCaption}
              onChange={(e) => onUpdateCard({ photoCaption: e.target.value })}
              placeholder="Add photo caption..."
              className="w-full text-center font-handwritten-note text-[#3D3D3D] text-lg bg-transparent border-b border-dashed border-[#dcc0c0] focus:outline-none focus:border-[#5E1E24]"
            />
          </div>

          {/* Sticker Addition Controls */}
          <div className="mt-6 flex gap-2 bg-white/90 p-2 rounded-full border border-[#dcc0c0]/40 shadow-xs">
            <span className="text-[10px] font-bold font-label-caps text-[#A5A58D] self-center px-2">
              Add Stamp:
            </span>
            {STICKER_TYPES.map((st, i) => (
              <button
                key={i}
                onClick={() => handleAddSticker(st)}
                className="p-1 rounded-full hover:bg-[#ebe8e3] transition-transform active:scale-90"
                title={`Add ${st.label}`}
              >
                <span className="material-symbols-outlined text-xl" style={{ color: st.color }}>
                  {st.icon}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Handwritten Letter Note (Lined Paper Effect) */}
        <div className="w-full max-w-xl bg-[#fffcf9] p-8 md:p-10 shadow-xl rounded-lg border border-[#dcc0c0]/40 relative deckled-edge">
          {/* Top Date & Location Bar */}
          <div className="flex justify-between items-center text-xs font-label-caps text-[#897272] mb-6 pb-2 border-b border-[#dcc0c0]/40">
            <input
              type="text"
              value={cardData.dateStr}
              onChange={(e) => onUpdateCard({ dateStr: e.target.value })}
              placeholder="Date..."
              className="bg-transparent focus:outline-none text-left w-1/2"
            />
            <input
              type="text"
              value={cardData.location}
              onChange={(e) => onUpdateCard({ location: e.target.value })}
              placeholder="Location..."
              className="bg-transparent focus:outline-none text-right w-1/2"
            />
          </div>

          {/* Letter Headline */}
          <input
            type="text"
            value={cardData.headline}
            onChange={(e) => onUpdateCard({ headline: e.target.value })}
            placeholder="Salutation or headline..."
            style={{ color: cardData.inkColor }}
            className={`w-full text-xl md:text-2xl font-bold mb-4 bg-transparent border-b border-transparent focus:border-[#dcc0c0] focus:outline-none ${
              cardData.fontStyle === 'script'
                ? 'font-script text-3xl'
                : cardData.fontStyle === 'handwritten'
                ? 'font-handwritten-note'
                : 'font-body-md'
            }`}
          />

          {/* Letter Body (Lined Paper lines) */}
          <textarea
            value={cardData.message}
            onChange={(e) => onUpdateCard({ message: e.target.value })}
            placeholder="Write your heartfelt message here..."
            rows={8}
            style={{ color: cardData.inkColor }}
            className={`w-full bg-transparent resize-none leading-relaxed focus:outline-none ${
              cardData.fontStyle === 'script'
                ? 'font-script text-2xl'
                : cardData.fontStyle === 'handwritten'
                ? 'font-handwritten-note text-xl'
                : 'font-body-md text-base'
            }`}
          />

          {/* Sender Sign-off */}
          <div className="mt-6 pt-4 flex justify-end items-center gap-2">
            <span className="text-xs font-label-caps text-[#897272]">Yours,</span>
            <input
              type="text"
              value={cardData.senderName}
              onChange={(e) => onUpdateCard({ senderName: e.target.value })}
              placeholder="Your name or initial..."
              style={{ color: cardData.inkColor }}
              className={`w-32 text-right bg-transparent border-b border-dashed border-[#dcc0c0] focus:outline-none ${
                cardData.fontStyle === 'script'
                  ? 'font-script text-2xl'
                  : cardData.fontStyle === 'handwritten'
                  ? 'font-handwritten-note text-xl'
                  : 'font-body-md text-base'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Selected Melody Vinyl Badge */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#dcc0c0]/30 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center p-1 relative shadow-sm">
            <img
              src={cardData.song.coverUrl}
              alt="Album cover"
              className="w-full h-full rounded-full object-cover vinyl-spin"
            />
            <div className="w-3 h-3 bg-white rounded-full absolute" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-label-caps text-[#A5A58D] uppercase tracking-wider block">
              Attached Melody
            </span>
            <p className="font-bold font-headline-md text-[#5E1E24] text-sm">
              {cardData.song.title} — {cardData.song.artist}
            </p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="sticker-btn bg-[#8c2f39] text-white px-6 py-2 rounded-xl text-xs font-bold font-label-caps hover:bg-[#5E1E24] transition-all flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          Change Melody
        </button>
      </div>

      {/* Footer Navigation Bar */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-[#564242] font-label-caps text-xs tracking-wider hover:text-[#6d1824] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_left</span>
          Back to Photo
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider shadow-md hover:bg-[#5E1E24] transition-all active:scale-95 cursor-pointer"
        >
          Next: Melody &amp; Atmosphere
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

    </main>
  );
};
