import { supabase } from '../lib/supabase';
import { CardData, Song } from '../types';

/**
 * Promise wrapper to add a timeout to any promise
 */
function withTimeout<T>(
  promise:
    | PromiseLike<T>
    | { then: (onfulfilled?: (value: T) => any, onrejected?: (reason: any) => any) => any },
  timeoutMs: number = 20000
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out after 20 seconds. Please check your connection.'));
    }, timeoutMs);
    Promise.resolve(promise).then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

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

  // If it's already a public Supabase URL, don't re-upload
  if (urlOrData.includes('.supabase.co/storage/v1/object/public/')) {
    return urlOrData;
  }

  // If it's an external URL (already hosted), check if we need to upload it
  if (urlOrData.startsWith('http') && !urlOrData.startsWith('blob:')) {
    try {
      const blob = await urlToBlob(urlOrData);
      const filename = `${prefix}_${Date.now()}.${defaultExtension}`;
      const uploadPromise = supabase.storage
        .from(bucketName)
        .upload(filename, blob, {
          contentType: blob.type || undefined,
          cacheControl: '3600',
          upsert: false,
        });
      
      const { data, error } = await withTimeout(uploadPromise);

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

    const uploadPromise = supabase.storage
      .from(bucketName)
      .upload(filename, blob, {
        contentType: blob.type || undefined,
        cacheControl: '3600',
        upsert: false,
      });

    const { data, error } = await withTimeout(uploadPromise);

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
    // Parallelize uploads for photo and audio
    if (onProgress) onProgress('Securing media assets...');
    const [uploadedPhotoUrl, uploadedMusicUrl] = await Promise.all([
      this.uploadPhoto(card.photoUrl),
      card.song.audioUrl ? this.uploadMusic(card.song.audioUrl) : Promise.resolve(''),
    ]);

    // Serialize other visual and custom fields into "theme" JSON
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
        audioUrl: uploadedMusicUrl,
        songType: card.song.songType || 'upload',
        youtubeVideoId: card.song.youtubeVideoId || '',
      },
    };

    // Insert card into Postgres table
    const insertPromise = supabase
      .from('cards')
      .insert({
        title: card.title,
        message: card.message,
        image_url: uploadedPhotoUrl,
        music_url: uploadedMusicUrl,
        theme: themePayload,
      })
      .select('id')
      .single();

    const { data, error } = await withTimeout<{
      data: { id: string } | null;
      error: unknown;
    }>(insertPromise as unknown as Promise<any>);

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
      song: {
        id: themeObj.song?.id || 'external-song',
        title: themeObj.song?.title || 'Song',
        artist: themeObj.song?.artist || 'Unknown Artist',
        duration: themeObj.song?.duration || '',
        coverUrl:
          themeObj.song?.coverUrl ||
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCRHFzEa21WAv9_4Qp_f2I0o0soOKQexMtHmQT8G8xX92OsWC7-T6I_-VnMIcQCgJwkqP1HwEQlfVfoCm4mfRvjfAh9TqL5ElndVtC_uZPE5GLEBkxE-8WZq87tPMZADAjIDB2Ln74bbKKjHiLhY63LSIt_KaploiNtJ9lscS70LIhvqHjBkzuFpp-82qO1LO9I7qGP0n_rqeXB5AWp7aaAdJO2PoW-dU-I6PmQSUdgvW2FUyVQXxQs',
        audioUrl: themeObj.song?.audioUrl || data.music_url || '',
        songType:
          themeObj.song?.songType ||
          (themeObj.song?.youtubeVideoId ? 'youtube' : 'upload'),
        youtubeVideoId: themeObj.song?.youtubeVideoId || '',
      },
    };

    return reconstructedCard;
  },
};
