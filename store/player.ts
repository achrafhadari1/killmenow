import { create } from "zustand";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_KEY = "@music_library";

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
  isLoading: boolean;
  queue: Track[];
  library: Track[];
  lastFetched: string | null;
  cachedArtists: Record<string, any>;
  cachedAlbums: Record<string, any>;
  setCurrentTrack: (track: Track) => Promise<void>;
  setIsPlaying: (isPlaying: boolean) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
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
  isLoading: false,
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

  setIsLoading: (isLoading) => set({ isLoading }),

  setQueue: (queue) => set({ queue }),

  addToQueue: (tracks) =>
    set((state) => ({
      queue: [...state.queue, ...(Array.isArray(tracks) ? tracks : [tracks])],
    })),

  setLibrary: async (library) => {
    const timestamp = new Date().toISOString();
    set({ library, lastFetched: timestamp });

    try {
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          library,
          timestamp,
        })
      );
      console.log("Library cached successfully");
    } catch (error) {
      console.error("Failed to cache library:", error);
    }
  },

  setCachedArtist: (artistName, data) =>
    set((state) => ({
      cachedArtists: { ...state.cachedArtists, [artistName]: data },
    })),

  setCachedAlbum: (albumName, data) =>
    set((state) => ({
      cachedAlbums: { ...state.cachedAlbums, [albumName]: data },
    })),
}));
