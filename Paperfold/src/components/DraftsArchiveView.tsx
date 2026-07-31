import React, { useState } from 'react';
import { CardData } from '../types';

interface DraftsArchiveViewProps {
  drafts: CardData[];
  archive: CardData[];
  onOpenCard: (card: CardData) => void;
  onEditDraft: (card: CardData) => void;
  onDeleteCard: (id: string, type: 'drafts' | 'archive') => void;
  onCreateNew: () => void;
}

export const DraftsArchiveView: React.FC<DraftsArchiveViewProps> = ({
  drafts,
  archive,
  onOpenCard,
  onEditDraft,
  onDeleteCard,
  onCreateNew,
}) => {
  const [activeTab, setActiveTab] = useState<'drafts' | 'archive'>('drafts');

  const items = activeTab === 'drafts' ? drafts : archive;

  return (
    <div className="pt-24 pb-32 px-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-3xl font-bold font-headline-md text-[#5E1E24]">
          Your Memory Keepsakes
        </h2>
        <p className="font-body-md text-[#564242]">
          Access your saved letter drafts and received melody cards.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-[#dcc0c0]/40 mb-8">
        <button
          onClick={() => setActiveTab('drafts')}
          className={`pb-3 px-8 font-label-caps text-xs tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'drafts'
              ? 'border-[#6d1824] text-[#6d1824] font-bold'
              : 'border-transparent text-[#564242] hover:text-[#6d1824]'
          }`}
        >
          Draft Letters ({drafts.length})
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`pb-3 px-8 font-label-caps text-xs tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'archive'
              ? 'border-[#6d1824] text-[#6d1824] font-bold'
              : 'border-transparent text-[#564242] hover:text-[#6d1824]'
          }`}
        >
          Received / Sent Archive ({archive.length})
        </button>
      </div>

      {/* Grid of Keepsakes */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-[#fdf9f4] rounded-2xl border border-dashed border-[#897272] p-8 space-y-4">
          <span className="material-symbols-outlined text-5xl text-[#A5A58D]">
            mail_lock
          </span>
          <p className="font-headline-md text-lg text-[#3D3D3D]">
            No {activeTab === 'drafts' ? 'drafts' : 'archived cards'} found yet.
          </p>
          <button
            onClick={onCreateNew}
            className="px-6 py-2.5 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider shadow-md hover:bg-[#5E1E24] cursor-pointer"
          >
            Create Your First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((card) => (
            <div
              key={card.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-[#dcc0c0]/30 hover:shadow-md transition-shadow flex flex-col justify-between relative group"
            >
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#f1ede8] shrink-0 border border-[#dcc0c0]/30">
                    <img
                      src={card.photoUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-bold font-label-caps text-[#A5A58D] uppercase tracking-wider block">
                      {card.occasion}
                    </span>
                    <h4 className="font-bold font-headline-md text-[#5E1E24] text-base truncate">
                      {card.headline || card.title}
                    </h4>
                    <p className="text-xs font-body-md text-[#564242]">
                      {card.dateStr} — {card.song.title}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-body-md text-[#3D3D3D] line-clamp-2 italic bg-[#f7f3ee] p-3 rounded-lg">
                  "{card.message}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcc0c0]/30 flex justify-between items-center">
                <button
                  onClick={() => onDeleteCard(card.id, activeTab)}
                  className="text-xs text-[#ba1a1a] hover:underline font-label-caps flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </button>

                <button
                  onClick={() =>
                    activeTab === 'drafts' ? onEditDraft(card) : onOpenCard(card)
                  }
                  className="px-4 py-1.5 bg-[#5E1E24] text-white rounded-full text-xs font-label-caps flex items-center gap-1 hover:bg-[#8c2f39] transition-colors cursor-pointer"
                >
                  {activeTab === 'drafts' ? 'Resume Draft' : 'Open Card'}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
