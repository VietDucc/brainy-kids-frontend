/**
 * Get audio URL that works with i18n routing
 * @param filename - Audio filename (e.g., "correct.wav", "time-over.mp3")
 * @returns API route URL for the audio file
 */
export function getAudioUrl(filename: string): string {
  // Remove leading slash if present
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  return `/api/audio/${cleanFilename}`;
}

/**
 * Common audio files used throughout the app
 */
export const AUDIO_FILES = {
  CORRECT: getAudioUrl('correct.wav'),
  INCORRECT: getAudioUrl('incorrect.wav'),
  TIME_OVER: getAudioUrl('time-over.mp3'),
} as const;

/**
 * Create and preload an audio object
 * @param url - Audio URL
 * @param volume - Volume level (0-1)
 * @returns Audio object
 */
export function createAudio(url: string, volume = 0.8): HTMLAudioElement {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.preload = 'auto';
  return audio;
}

/**
 * Play audio safely with error handling
 * @param audio - Audio element or URL
 * @param volume - Optional volume override
 */
export async function playAudio(audio: HTMLAudioElement | string, volume?: number): Promise<void> {
  try {
    let audioElement: HTMLAudioElement;
    
    if (typeof audio === 'string') {
      audioElement = new Audio(audio);
    } else {
      audioElement = audio;
    }
    
    if (volume !== undefined) {
      audioElement.volume = volume;
    }
    
    await audioElement.play();
  } catch (error) {
    console.warn('Failed to play audio:', error);
  }
} 