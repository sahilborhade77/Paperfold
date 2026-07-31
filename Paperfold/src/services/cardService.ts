import { supabase } from '../lib/supabase';
import { CardData, Song } from '../types';

/**
 * Utility to convert data URLs or blob URLs to a Blob
 */
async function urlToBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  return await res.blob();
}

/**
 * Helper to upload a file to a Supabase bucket
 */
async function uploadToBucket(
  bucketName: string,
  urlOrData: string,
  prefix: string,
  defaultExtension: string
): Promise<string> {
  if (!urlOrData) return '';

  // If it's already a public Supabase URL or external URL, check if we need to upload it
  if (urlOrData.startsWith('http') && !urlOrData.startsWith('blob:')) {
    // If it's a preset URL, we can attempt to fetch it and upload it so it's hosted in the user's bucket.
    // If CORS prevents fetching, we fall back to the original URL.
    try {
      const blob = await urlToBlob(urlOrData);
      const filename = `${prefix}_${Date.now()}.${defaultExtension}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filename, blob, {
          contentType: blob.type || undefined,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    } catch (e) {
      console.warn(`Failed to copy external/preset url to bucket ${bucketName}. Using original URL.`, e);
      return urlOrData;
    }
  }

  // Handle data-url or blob-url
  try {
    const blob = await urlToBlob(urlOrData);
    let extension = defaultExtension;
    if (blob.type) {
      const typeParts = blob.type.split('/');
      if (typeParts.length > 1) {
        extension = typeParts[1].split(';')[0]; // strip parameters if any
      }
    }
    const filename = `${prefix}_${Date.now()}.${extension}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, blob, {
        contentType: blob.type || undefined,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error(`Error uploading to bucket ${bucketName}:`, err);
    throw new Error(`Failed to upload media: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export const cardService = {
  /**
   * Upload the selected photo to "photos" bucket
   */
  async uploadPhoto(photoUrl: string): Promise<string> {
    return uploadToBucket('photos', photoUrl, 'photo', 'jpg');
  },

  /**
   * Upload the selected music to "music" bucket
   */
  async uploadMusic(audioUrl: string): Promise<string> {
    return uploadToBucket('music', audioUrl, 'audio', 'mp3');
  },

  /**
   * Create a card in Supabase
   */
  async createCard(
    card: CardData,
    onProgress?: (status: string) => void
  ): Promise<string> {
    // Step 1: Upload photo
    if (onProgress) onProgress('Uploading image...');
    const uploadedPhotoUrl = await this.uploadPhoto(card.photoUrl);

    // Step 2: Upload music
    let uploadedMusicUrl = card.song.audioUrl || '';
    if (uploadedMusicUrl) {
      if (onProgress) onProgress('Uploading music...');
      uploadedMusicUrl = await this.uploadMusic(uploadedMusicUrl);
    }

    // Step 3: Serialize other visual and custom fields into "theme" JSON
    if (onProgress) onProgress('Saving card...');
    const themePayload = {
      occasion: card.occasion,
      photoCaption: card.photoCaption,
      photoRotation: card.photoRotation,
      headline: card.headline,
      senderName: card.senderName,
      dateStr: card.dateStr,
      location: card.location,
      inkColor: card.inkColor,
      fontStyle: card.fontStyle,
      stickers: card.stickers,
      expiresInDays: card.expiresInDays,
      song: {
        id: card.song.id,
        title: card.song.title,
        artist: card.song.artist,
        duration: card.song.duration,
        coverUrl: card.song.coverUrl,
        audioUrl: uploadedMusicUrl, // store the uploaded bucket URL inside the song object
      },
    };

    // Step 4: Insert card into Postgres table
    const { data, error } = await supabase
      .from('cards')
      .insert({
        title: card.title,
        message: card.message,
        image_url: uploadedPhotoUrl,
        music_url: uploadedMusicUrl,
        theme: JSON.stringify(themePayload),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting card to database:', error);
      throw error;
    }

    if (onProgress) onProgress('Generating link...');
    return data.id;
  },

  /**
   * Fetch a card by UUID from Supabase
   */
  async getCardById(id: string): Promise<CardData> {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching card by id:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Card not found.');
    }

    // Deserialize properties stored in theme JSON
    let themeObj: any = {};
    if (data.theme) {
      try {
        themeObj = typeof data.theme === 'string' ? JSON.parse(data.theme) : data.theme;
      } catch (e) {
        console.error('Error parsing theme JSON:', e);
      }
    }

    // Reconstruct CardData structure
    const reconstructedCard: CardData = {
      id: data.id,
      title: data.title || '',
      occasion: themeObj.occasion || 'General',
      photoUrl: data.image_url || '',
      photoCaption: themeObj.photoCaption || '',
      photoRotation: typeof themeObj.photoRotation === 'number' ? themeObj.photoRotation : 0,
      message: data.message || '',
      headline: themeObj.headline || '',
      senderName: themeObj.senderName || '',
      dateStr: themeObj.dateStr || '',
      location: themeObj.location || '',
      inkColor: themeObj.inkColor || '#5E1E24',
      fontStyle: themeObj.fontStyle || 'serif',
      stickers: Array.isArray(themeObj.stickers) ? themeObj.stickers : [],
      createdAt: data.created_at || new Date().toISOString(),
      expiresInDays: typeof themeObj.expiresInDays === 'number' ? themeObj.expiresInDays : 7,
      song: themeObj.song || {
        id: 'external-song',
        title: 'Song',
        artist: 'Unknown Artist',
        duration: '',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRHFzEa21WAv9_4Qp_f2I0o0soOKQexMtHmQT8G8xX92OsWC7-T6I_-VnMIcQCgJwkqP1HwEQlfVfoCm4mfRvjfAh9TqL5ElndVtC_uZPE5GLEBkxE-8WZq87tPMZADAjIDB2Ln74bbKKjHiLhY63LSIt_KaploiNtJ9lscS70LIhvqHjBkzuFpp-82qO1LO9I7qGP0n_rqeXB5AWp7aaAdJO2PoW-dU-I6PmQSUdgvW2FUyVQXxQs',
        audioUrl: data.music_url || '',
      },
    };

    return reconstructedCard;
  },
};
