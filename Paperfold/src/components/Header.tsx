import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onBack,
  showBack = false,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#F9F5F0] shadow-xs transition-colors">
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center p-2 rounded-full hover:bg-[#ebe8e3] transition-all active:scale-90"
            title="Go Back"
          >
            <span className="material-symbols-outlined text-[#6d1824]">arrow_back</span>
          </button>
        )}
        <h1
          onClick={() => onNavigate('templates')}
          className="text-2xl font-bold font-headline-md text-[#5E1E24] cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <img src="/logo.png" alt="Paperfold Logo" className="w-8 h-8 object-contain" />
          <span>Paperfold</span>
        </h1>
      </div>

      <nav className="hidden md:flex gap-6 items-center">
        <button
          onClick={() => onNavigate('templates')}
          className={`font-label-caps text-xs tracking-wider transition-colors py-1 ${
            currentView === 'templates' || currentView.startsWith('wizard') || currentView === 'canvas-editor'
              ? 'text-[#6d1824] border-b-2 border-[#6d1824]'
              : 'text-[#564242] hover:text-[#6d1824]'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => onNavigate('drafts')}
          className={`font-label-caps text-xs tracking-wider transition-colors py-1 ${
            currentView === 'drafts'
              ? 'text-[#6d1824] border-b-2 border-[#6d1824]'
              : 'text-[#564242] hover:text-[#6d1824]'
          }`}
        >
          Drafts
        </button>
        <button
          onClick={() => onNavigate('archive')}
          className={`font-label-caps text-xs tracking-wider transition-colors py-1 ${
            currentView === 'archive'
              ? 'text-[#6d1824] border-b-2 border-[#6d1824]'
              : 'text-[#564242] hover:text-[#6d1824]'
          }`}
        >
          Archive
        </button>
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('drafts')}
          className="p-1 text-[#6d1824] hover:scale-105 transition-transform"
          title="Account / Saved Cards"
        >
          <span className="material-symbols-outlined text-3xl">account_circle</span>
        </button>
      </div>
    </header>
  );
};
