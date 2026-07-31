import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#fdf9f4] shadow-[0_-4px_20px_rgba(61,61,61,0.1)] rounded-t-xl border-t border-[#dcc0c0]/40">
      <button
        onClick={() => onNavigate('wizard-visual')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all rounded-full ${
          currentView === 'wizard-visual' || currentView === 'canvas-editor'
            ? 'bg-[#ffdada] text-[#40000c]'
            : 'text-[#564242] hover:bg-[#ebe8e3]'
        }`}
      >
        <span className="material-symbols-outlined text-xl">edit_note</span>
        <span className="text-[10px] font-bold font-label-caps uppercase tracking-wider">Create</span>
      </button>

      <button
        onClick={() => onNavigate('wizard-melody')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all rounded-full ${
          currentView === 'wizard-melody'
            ? 'bg-[#ffdada] text-[#40000c]'
            : 'text-[#564242] hover:bg-[#ebe8e3]'
        }`}
      >
        <span className="material-symbols-outlined text-xl">queue_music</span>
        <span className="text-[10px] font-bold font-label-caps uppercase tracking-wider">Music</span>
      </button>

      <button
        onClick={() => onNavigate('templates')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all rounded-full ${
          currentView === 'templates'
            ? 'bg-[#ffdada] text-[#40000c]'
            : 'text-[#564242] hover:bg-[#ebe8e3]'
        }`}
      >
        <span className="material-symbols-outlined text-xl">auto_stories</span>
        <span className="text-[10px] font-bold font-label-caps uppercase tracking-wider">Library</span>
      </button>

      <button
        onClick={() => onNavigate('drafts')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all rounded-full ${
          currentView === 'drafts' || currentView === 'archive'
            ? 'bg-[#ffdada] text-[#40000c]'
            : 'text-[#564242] hover:bg-[#ebe8e3]'
        }`}
      >
        <span className="material-symbols-outlined text-xl">person</span>
        <span className="text-[10px] font-bold font-label-caps uppercase tracking-wider">Profile</span>
      </button>
    </nav>
  );
};
