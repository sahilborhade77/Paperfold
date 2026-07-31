import React, { useState } from 'react';
import { CardData } from '../types';
import { cardService } from '../services/cardService';

interface WizardSendViewProps {
  cardData: CardData;
  onUpdateCard: (updated: Partial<CardData>) => void;
  onConfirmSend: () => void;
  onBack: () => void;
}

export const WizardSendView: React.FC<WizardSendViewProps> = ({
  cardData,
  onUpdateCard,
  onConfirmSend,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCopyLink = async () => {
    setError(null);
    setLoadingStatus('Initializing...');
    try {
      const cardId = await cardService.createCard(cardData, (status) => {
        setLoadingStatus(status);
      });
      const url = `${window.location.origin}/card/${cardId}`;
      await navigator.clipboard.writeText(url);
      setLoadingStatus('Link copied.');
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setLoadingStatus(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to save card and copy link.');
      setLoadingStatus(null);
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
        <div className="flex flex-col items-center opacity-80">
          <div className="w-8 h-8 rounded-full bg-[#A5A58D] text-white flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <span className="text-[11px] font-bold font-label-caps mt-1 uppercase tracking-wider text-[#A5A58D]">
            Melody
          </span>
        </div>
        <div className="w-12 h-[1px] bg-[#dcc0c0]" />
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#6d1824] text-white flex items-center justify-center font-bold shadow-md">
            3
          </div>
          <span className="text-[11px] font-bold font-label-caps mt-1 text-[#6d1824] uppercase tracking-wider">
            Send
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#fdf9f4] p-6 md:p-8 rounded-xl shadow-[0_4px_20px_rgba(61,61,61,0.1)] relative overflow-hidden space-y-6">
        <header className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-[#3D3D3D] mb-1">
            The Finishing Touch
          </h2>
          <p className="text-sm font-body-md text-[#564242]">
            Review your letter and melody before sealing your digital envelope.
          </p>
        </header>

        {/* Card Preview Tabletop */}
        <div className="canvas-bg p-6 md:p-8 rounded-2xl border border-[#dcc0c0]/40 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
          {/* NOW PLAYING Vinyl Badge */}
          <div className="bg-white/90 backdrop-blur-xs px-4 py-2 rounded-full shadow-sm border border-[#dcc0c0]/30 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-black p-0.5 relative shrink-0">
              <img
                src={cardData.song.coverUrl}
                alt="Vinyl"
                className="w-full h-full rounded-full object-cover vinyl-spin"
              />
            </div>
            <span className="text-xs font-headline-md text-[#5E1E24]">
              NOW PLAYING: <strong>{cardData.song.title}</strong> — {cardData.song.artist}
            </span>
          </div>

          {/* Tabletop Paper Card Preview */}
          <div className="bg-[#fffcf9] p-6 md:p-8 rounded-lg shadow-xl max-w-lg w-full border border-[#dcc0c0]/40 deckled-edge space-y-4 relative">
            <div className="flex justify-between items-center text-xs font-label-caps text-[#897272]">
              <span>{cardData.dateStr}</span>
              <span>{cardData.location}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="polaroid-frame w-32 shrink-0">
                <img
                  src={cardData.photoUrl}
                  alt="Memory"
                  className="w-full aspect-square object-cover"
                />
                <p className="text-[10px] font-handwritten-note text-center mt-1 text-[#3D3D3D]">
                  {cardData.photoCaption}
                </p>
              </div>

              <div className="space-y-2 flex-grow">
                <h4
                  style={{ color: cardData.inkColor }}
                  className={`text-lg font-bold ${
                    cardData.fontStyle === 'script'
                      ? 'font-script text-2xl'
                      : cardData.fontStyle === 'handwritten'
                      ? 'font-handwritten-note'
                      : 'font-body-md'
                  }`}
                >
                  {cardData.headline}
                </h4>
                <p
                  style={{ color: cardData.inkColor }}
                  className={`text-xs line-clamp-4 leading-relaxed ${
                    cardData.fontStyle === 'script'
                      ? 'font-script text-base'
                      : cardData.fontStyle === 'handwritten'
                      ? 'font-handwritten-note text-sm'
                      : 'font-body-md'
                  }`}
                >
                  {cardData.message}
                </p>
                <p
                  style={{ color: cardData.inkColor }}
                  className="text-right text-xs font-handwritten-note font-bold pt-2"
                >
                  — {cardData.senderName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expiry Settings */}
        <div className="bg-white p-4 rounded-xl border border-[#dcc0c0]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold font-headline-md text-[#5E1E24]">
              Whisper Memory Expiry
            </h4>
            <p className="text-xs font-body-md text-[#564242]">
              How long should this letter remain accessible to your recipient?
            </p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => onUpdateCard({ expiresInDays: days })}
                className={`px-3 py-1.5 rounded-lg text-xs font-label-caps cursor-pointer ${
                  cardData.expiresInDays === days
                    ? 'bg-[#6d1824] text-white font-bold'
                    : 'bg-[#f7f3ee] text-[#564242] hover:bg-[#ebe8e3]'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading / Error States */}
      {(loadingStatus || error) && (
        <div className="mt-6 p-4 rounded-xl text-center bg-white border border-[#dcc0c0]/30 shadow-xs max-w-md mx-auto">
          {loadingStatus && (
            <p className="text-xs font-label-caps text-[#6d1824] animate-pulse flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
              {loadingStatus}
            </p>
          )}
          {error && (
            <p className="text-xs font-body-md text-[#ba1a1a] flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </p>
          )}
        </div>
      )}

      {/* Copy / Share Actions & Next Button */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#fdf9f4] p-4 rounded-full shadow-lg border border-[#dcc0c0]/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 text-[#564242] font-label-caps text-xs tracking-wider hover:text-[#6d1824] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">chevron_left</span>
          Back to Melody
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            disabled={loadingStatus !== null}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f7f3ee] text-[#5E1E24] rounded-full font-label-caps text-xs tracking-wider border border-[#dcc0c0] hover:bg-[#ebe8e3] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'link'}
            </span>
            {copied ? 'Link Copied!' : 'Copy Share Link'}
          </button>

          <button
            onClick={onConfirmSend}
            className="flex items-center gap-2 px-8 py-3 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider shadow-md hover:bg-[#5E1E24] transition-all active:scale-95 cursor-pointer"
          >
            Open Recipient View
            <span className="material-symbols-outlined">mark_email_read</span>
          </button>
        </div>
      </div>
    </main>
  );
};
