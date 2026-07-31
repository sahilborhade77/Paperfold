import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { AppView, CardData, TemplateCard, Song } from './types';
import { INITIAL_CARD_DATA } from './data';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { TemplatesView } from './components/TemplatesView';
import { WizardVisualView } from './components/WizardVisualView';
import { CanvasEditorView } from './components/CanvasEditorView';
import { WizardMelodyView } from './components/WizardMelodyView';
import { WizardSendView } from './components/WizardSendView';
import { RecipientView } from './components/RecipientView';
import { DraftsArchiveView } from './components/DraftsArchiveView';
import { cardService } from './services/cardService';

function SharedCardView({
  onEditCard,
  onSaveToLibrary,
}: {
  onEditCard: (card: CardData) => void;
  onSaveToLibrary: (card: CardData) => void;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    cardService.getCardById(id)
      .then((data) => {
        setCard(data);
      })
      .catch((err) => {
        console.error('Failed to load card:', err);
        setError(err instanceof Error ? err.message : 'Could not find or load the card.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-[#F9F5F0]">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-[#6d1824] animate-spin">sync</span>
          <h2 className="text-2xl font-bold font-headline-md text-[#5E1E24]">Unfolding your letter...</h2>
          <p className="text-sm text-[#564242]">Retrieving the custom theme and melody.</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-[#F9F5F0]">
        <div className="text-center bg-[#fffcf9] p-8 rounded-2xl border border-[#dcc0c0] shadow-xl max-w-md w-full space-y-6">
          <span className="material-symbols-outlined text-5xl text-[#ba1a1a]">sentiment_dissatisfied</span>
          <h2 className="text-2xl font-bold font-headline-md text-[#5E1E24]">Card Not Found</h2>
          <p className="text-sm text-[#564242]">{error}</p>
          <button
            onClick={() => {
              navigate('/');
            }}
            className="px-6 py-2.5 bg-[#6d1824] text-white rounded-full font-label-caps text-xs tracking-wider cursor-pointer"
          >
            Create Your Own Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <RecipientView
      cardData={card}
      onEditCard={() => onEditCard(card)}
      onSaveToLibrary={onSaveToLibrary}
    />
  );
}

export function App() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AppView>('templates');
  const [activeCard, setActiveCard] = useState<CardData>(INITIAL_CARD_DATA);
  const [draftsList, setDraftsList] = useState<CardData[]>(() => {
    try {
      const saved = localStorage.getItem('paperfold_drafts');
      return saved ? JSON.parse(saved) : [INITIAL_CARD_DATA];
    } catch {
      return [INITIAL_CARD_DATA];
    }
  });

  const [archiveList, setArchiveList] = useState<CardData[]>(() => {
    try {
      const saved = localStorage.getItem('paperfold_archive');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save drafts & archive to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('paperfold_drafts', JSON.stringify(draftsList));
    } catch (e) {
      console.error('Failed to save drafts:', e);
    }
  }, [draftsList]);

  useEffect(() => {
    try {
      localStorage.setItem('paperfold_archive', JSON.stringify(archiveList));
    } catch (e) {
      console.error('Failed to save archive:', e);
    }
  }, [archiveList]);

  // Update current active card helper
  const handleUpdateActiveCard = (updated: Partial<CardData>) => {
    setActiveCard((prev) => {
      const newCard = { ...prev, ...updated };
      // Also sync draft in list
      setDraftsList((list) =>
        list.map((d) => (d.id === newCard.id ? newCard : d))
      );
      return newCard;
    });
  };

  // Select Template
  const handleSelectTemplate = (template: TemplateCard) => {
    const newCard: CardData = {
      ...INITIAL_CARD_DATA,
      id: `card-${Date.now()}`,
      title: template.title,
      occasion: template.occasion,
      photoUrl: template.imageUrl,
      headline: template.defaultHeadline || template.title,
      message: template.defaultMessage || INITIAL_CARD_DATA.message,
      song: template.defaultSong,
      createdAt: new Date().toISOString(),
    };
    setActiveCard(newCard);
    setDraftsList((prev) => [newCard, ...prev]);
    setCurrentView('canvas-editor');
  };

  // Start from scratch
  const handleCreateCustom = () => {
    const newCard: CardData = {
      ...INITIAL_CARD_DATA,
      id: `card-${Date.now()}`,
      title: 'Untitled Letter',
      occasion: 'General',
      createdAt: new Date().toISOString(),
    };
    setActiveCard(newCard);
    setDraftsList((prev) => [newCard, ...prev]);
    setCurrentView('wizard-visual');
  };

  // Save to Archive
  const handleSaveToArchive = (card: CardData) => {
    if (!archiveList.some((a) => a.id === card.id)) {
      setArchiveList((prev) => [card, ...prev]);
    }
  };

  // Delete Card
  const handleDeleteCard = (id: string, type: 'draft' | 'drafts' | 'archive') => {
    if (type === 'drafts' || type === 'draft') {
      setDraftsList((prev) => prev.filter((item) => item.id !== id));
    } else {
      setArchiveList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditCardFromShared = (card: CardData) => {
    setActiveCard(card);
    setCurrentView('canvas-editor');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-[#1c1c19] flex flex-col font-body-md relative selection:bg-[#FFB7B2]">
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        showBack={currentView !== 'templates'}
        onBack={() => {
          if (currentView === 'canvas-editor') setCurrentView('wizard-visual');
          else if (currentView === 'wizard-melody') setCurrentView('canvas-editor');
          else if (currentView === 'wizard-send') setCurrentView('wizard-melody');
          else if (currentView === 'recipient-view') setCurrentView('wizard-send');
          else setCurrentView('templates');
        }}
      />

      {/* View Router */}
      <Routes>
        <Route path="/card/:id" element={
          <SharedCardView
            onEditCard={handleEditCardFromShared}
            onSaveToLibrary={handleSaveToArchive}
          />
        } />
        <Route path="/*" element={
          <div className="flex-grow flex flex-col">
            {currentView === 'templates' && (
              <TemplatesView
                onSelectTemplate={handleSelectTemplate}
                onCreateCustom={handleCreateCustom}
              />
            )}

            {currentView === 'wizard-visual' && (
              <WizardVisualView
                currentPhotoUrl={activeCard.photoUrl}
                onUpdatePhoto={(url) => handleUpdateActiveCard({ photoUrl: url })}
                onNext={() => setCurrentView('canvas-editor')}
                onBack={() => setCurrentView('templates')}
              />
            )}

            {currentView === 'canvas-editor' && (
              <CanvasEditorView
                cardData={activeCard}
                onUpdateCard={handleUpdateActiveCard}
                onNext={() => setCurrentView('wizard-melody')}
                onBack={() => setCurrentView('wizard-visual')}
              />
            )}

            {currentView === 'wizard-melody' && (
              <WizardMelodyView
                currentSong={activeCard.song}
                onSelectSong={(song: Song) => handleUpdateActiveCard({ song })}
                onNext={() => setCurrentView('wizard-send')}
                onBack={() => setCurrentView('canvas-editor')}
              />
            )}

            {currentView === 'wizard-send' && (
              <WizardSendView
                cardData={activeCard}
                onUpdateCard={handleUpdateActiveCard}
                onConfirmSend={() => {
                  handleSaveToArchive(activeCard);
                  setCurrentView('recipient-view');
                }}
                onBack={() => setCurrentView('wizard-melody')}
              />
            )}

            {currentView === 'recipient-view' && (
              <RecipientView
                cardData={activeCard}
                onEditCard={() => setCurrentView('canvas-editor')}
                onSaveToLibrary={handleSaveToArchive}
              />
            )}

            {(currentView === 'drafts' || currentView === 'archive') && (
              <DraftsArchiveView
                drafts={draftsList}
                archive={archiveList}
                onOpenCard={(card) => {
                  setActiveCard(card);
                  setCurrentView('recipient-view');
                }}
                onEditDraft={(card) => {
                  setActiveCard(card);
                  setCurrentView('canvas-editor');
                }}
                onDeleteCard={handleDeleteCard}
                onCreateNew={handleCreateCustom}
              />
            )}
          </div>
        } />
      </Routes>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}

export default App;
