export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  audioUrl?: string;
}

export type Occasion = 'Birthday' | 'Apology' | 'Asking Out' | 'Anniversary' | 'General';

export interface TemplateCard {
  id: string;
  title: string;
  occasion: Occasion;
  quote: string;
  imageUrl: string;
  defaultSong: Song;
  defaultMessage?: string;
  defaultHeadline?: string;
}

export interface StickerItem {
  id: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
}

export interface CardData {
  id: string;
  title: string;
  occasion: string;
  photoUrl: string;
  photoCaption: string;
  photoRotation: number;
  message: string;
  headline: string;
  senderName: string;
  dateStr: string;
  location: string;
  song: Song;
  inkColor: string;
  fontStyle: 'serif' | 'handwritten' | 'script';
  stickers: StickerItem[];
  createdAt: string;
  expiresInDays: number;
}

export type AppView = 
  | 'templates' 
  | 'wizard-visual' 
  | 'canvas-editor' 
  | 'wizard-melody' 
  | 'wizard-send' 
  | 'recipient-view' 
  | 'drafts' 
  | 'archive';
