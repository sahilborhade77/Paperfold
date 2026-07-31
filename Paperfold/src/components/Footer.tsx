import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | 'story' | null>(null);

  return (
    <>
      <footer className="w-full py-12 flex flex-col items-center gap-2 text-center opacity-80 mt-auto">
        <p className="text-2xl font-bold font-headline-md text-[#5E1E24]">Paperfold</p>
        <p className="text-sm font-body-md text-[#A5A58D]">Hand-crafted with heart by Paperfold</p>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setModalType('terms')}
            className="text-xs font-label-caps text-[#564242] hover:text-[#5E1E24] transition-colors"
          >
            Terms
          </button>
          <button
            onClick={() => setModalType('privacy')}
            className="text-xs font-label-caps text-[#564242] hover:text-[#5E1E24] transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={() => setModalType('story')}
            className="text-xs font-label-caps text-[#564242] hover:text-[#5E1E24] transition-colors"
          >
            Our Story
          </button>
        </div>
      </footer>

      {/* Info Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#fdf9f4] p-8 rounded-2xl max-w-md w-full hand-drawn-border relative shadow-2xl space-y-4">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-[#564242] hover:text-[#5E1E24] p-1"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {modalType === 'story' && (
              <>
                <h3 className="text-2xl font-bold font-headline-md text-[#5E1E24]">Our Story</h3>
                <p className="font-body-md text-[#3D3D3D] leading-relaxed">
                  Paperfold was created out of a desire to restore tactility and intimacy to modern digital correspondence.
                  In an era of disposable instant messages, we wanted a space where memories feel like physical letters, complete with custom melodies, handwritten notes, and quiet reflection.
                </p>
              </>
            )}

            {modalType === 'terms' && (
              <>
                <h3 className="text-2xl font-bold font-headline-md text-[#5E1E24]">Terms of Sentiment</h3>
                <p className="font-body-md text-[#3D3D3D] leading-relaxed">
                  Cards created on Paperfold are private, digital keepsakes meant for sharing personal goodwill, affection, and genuine sentiment. Respect recipient privacy and share responsibility.
                </p>
              </>
            )}

            {modalType === 'privacy' && (
              <>
                <h3 className="text-2xl font-bold font-headline-md text-[#5E1E24]">Privacy Promise</h3>
                <p className="font-body-md text-[#3D3D3D] leading-relaxed">
                  Your custom notes, photos, and chosen music belong solely to you and your recipient. Data is saved locally in your browser session for privacy and easy access.
                </p>
              </>
            )}

            <button
              onClick={() => setModalType(null)}
              className="w-full py-2 bg-[#5E1E24] text-white rounded-full font-label-caps text-xs tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
