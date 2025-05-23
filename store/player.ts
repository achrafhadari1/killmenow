import { create } from 'zustand';
import { Audio } from 'expo-av';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  streamUrl: string;
}

interface PlayerState {
  currentTrack: Track | null;
  sound: Audio.Sound | null;
  isPlaying: boolean;
  queue: Track[];
  library: Track[];
  lastFetched: string | null;
  cachedArtists: Record<string, any>;
  cachedAlbums: Record<string, any>;
  setCurrentTrack: (track: Track) => Promise<void>;
  setIsPlaying: (isPlaying: boolean) => Promise<void>;
  setQueue: (queue: Track[]) => void;
  addToQueue: (tracks: Track | Track[]) => void;
  setLibrary: (library: Track[]) => void;
  setCachedArtist: (artistName: string, data: any) => void;
  setCachedAlbum: (albumName: string, data: any) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  sound: null,
  isPlaying: false,
  queue: [],
  library: [],
  lastFetched: null,
  cachedArtists: {},
  cachedAlbums: {},

  setCurrentTrack: async (track) => {
    const { sound: currentSound } = get();
    
    if (currentSound) {
      await currentSound.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.streamUrl },
      { shouldPlay: true }
    );

    set({ currentTrack: track, sound, isPlaying: true });
  },

  setIsPlaying: async (isPlaying) => {
    const { sound } = get();
    if (!sound) return;

    if (isPlaying) {
      await sound.playAsync();
    } else {
      await sound.pauseAsync();
    }
    set({ isPlaying });
  },

  setQueue: (queue) => set({ queue }),
  
  addToQueue: (tracks) => set((state) => ({
    queue: [...state.queue, ...(Array.isArray(tracks) ? tracks : [tracks])]
  })),

  setLibrary: (library) => set({ 
    library, 
    lastFetched: new Date().toISOString() 
  }),

  setCachedArtist: (artistName, data) => set((state) => ({
    cachedArtists: { ...state.cachedArtists, [artistName]: data }
  })),

  setCachedAlbum: (albumName, data) => set((state) => ({
    cachedAlbums: { ...state.cachedAlbums, [albumName]: data }
  }))
}));