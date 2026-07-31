import React, { useState } from 'react';
import { TemplateCard, Occasion } from '../types';
import { TEMPLATE_CARDS } from '../data';

interface TemplatesViewProps {
  onSelectTemplate: (template: TemplateCard) => void;
  onCreateCustom: () => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectTemplate,
  onCreateCustom,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All Occasions');

  const occasions: string[] = ['All Occasions', 'Birthday', 'Apology', 'Asking Out', 'Anniversary', 'General'];

  const filteredTemplates = TEMPLATE_CARDS.filter((tpl) => {
    if (selectedOccasion === 'All Occasions') return true;
    return tpl.occasion === selectedOccasion;
  });

  return (
    <div className="pt-24 pb-32 px-6 max-w-7xl mx-auto w-full">
      {/* Hero Banner / Headline */}
      <div className="text-center mb-8 max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold font-headline-md text-[#5E1E24]">
          Choose Your Occasion &amp; Card
        </h2>
        <p className="font-body-lg text-[#5c614d] italic">
          Select a hand-crafted template to start your sentimental letter and melody.
        </p>
      </div>

      {/* Occasion Filter Tabs */}
      <section className="mb-8 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-2 items-center justify-center min-w-max">
          {occasions.map((occ) => {
            const isActive = selectedOccasion === occ;
            return (
              <button
                key={occ}
                onClick={() => setSelectedOccasion(occ)}
                className={`px-6 py-2 rounded-full font-label-caps text-xs tracking-wider transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-[#8c2f39] text-white shadow-sm'
                    : 'bg-[#ebe8e3] text-[#564242] hover:bg-[#FFB7B2] hover:text-[#6d1824]'
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </section>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTemplates.map((template, idx) => {
          // slight rotation variations for hand-placed aesthetic
          const rotations = ['rotate-0', '-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'];
          const rotClass = rotations[idx % rotations.length];

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`group relative bg-white p-4 shadow-sm border border-[#dcc0c0]/30 card-stack-effect deckled-edge cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-md ${rotClass}`}
            >
              <div className="aspect-3/4 bg-[#f1ede8] mb-3 overflow-hidden relative rounded-xs">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold font-label-caps text-[#A5A58D] tracking-widest uppercase">
                  {template.occasion}
                </span>
                <h3 className="text-lg font-bold font-headline-md text-[#5E1E24]">
                  {template.title}
                </h3>
                <p className="text-sm font-body-md text-[#564242] line-clamp-1 italic">
                  {template.quote}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Creation / View All Button */}
      <div className="mt-12 flex flex-col items-center gap-3 py-6">
        <p className="text-sm font-body-md text-[#564242] italic">Don't see the right words?</p>
        <button
          onClick={onCreateCustom}
          className="sticker-btn bg-white border-2 border-[#5E1E24] text-[#5E1E24] px-8 py-3 rounded-xl font-bold font-headline-md flex items-center gap-2 group hover:bg-[#F9F5F0] transition-all active:scale-95 cursor-pointer"
        >
          <span>Start From Scratch</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};
