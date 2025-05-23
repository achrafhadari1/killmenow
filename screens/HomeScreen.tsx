import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import * as trackPlayerService from "@/services/trackPlayerService";
import { signIn, listMusicFiles } from "../services/googleDriveService";
import { usePlayerStore } from "../store/player";
import TrackCard from "../components/TrackCard";
import AlbumCard from "../components/AlbumCard";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;

export default function HomeScreen() {
  const { library, setLibrary, setCurrentTrack, setIsPlaying } =
    usePlayerStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchLibrary = async () => {
    try {
      setIsLoading(true);
      await signIn();
      const files = await listMusicFiles();
      setLibrary(files);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch music library");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!library.length) {
      fetchLibrary();
    }
  }, []);

  // Get recently added tracks
  const recentTracks = [...library]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 6);

  // Group tracks by artist
  const artistsMap = {};
  library.forEach((track) => {
    if (!artistsMap[track.artist]) {
      artistsMap[track.artist] = [];
    }
    artistsMap[track.artist].push(track);
  });

  // Get a list of all artists
  const artists = Object.keys(artistsMap);
  console.log(`Found ${artists.length} artists in library`);

  // Group tracks by album (if album info is available)
  const albumsMap = {};
  library.forEach((track) => {
    if (track.album) {
      const albumKey = `${track.artist} - ${track.album}`;
      if (!albumsMap[albumKey]) {
        albumsMap[albumKey] = {
          name: track.album,
          artist: track.artist,
          artwork: track.artwork,
          tracks: [],
        };
      }
      albumsMap[albumKey].tracks.push(track);
    }
  });

  // Convert albums map to array
  const albums = Object.values(albumsMap);
  console.log(`Found ${albums.length} albums in library`);

  // If no albums were found, create "albums" based on artists
  const featuredItems =
    albums.length > 0
      ? albums.slice(0, 6)
      : artists.slice(0, 6).map((artistName) => {
          const artistTracks = artistsMap[artistName];
          return {
            name: artistName,
            artist: artistName,
            artwork: artistTracks[0]?.artwork,
            tracks: artistTracks,
            isArtist: true,
          };
        });

  const playTrack = async (track) => {
    console.log("Playing track from HomeScreen:", track.title);

    // Set the current track in the store
    await setCurrentTrack(track);

    // Start playback using the TrackPlayer service
    try {
      await trackPlayerService.playTrack({
        id: track.id,
        url: track.streamUrl,
        title: track.title,
        artist: track.artist,
        album: track.album || "",
        artwork: track.artwork || "",
      });

      // Update playing state
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Listen Now</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Added</Text>
        <View style={styles.grid}>
          {recentTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlay={() => playTrack(track)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {albums.length > 0 ? "Featured Albums" : "Featured Artists"}
        </Text>
        <View style={styles.grid}>
          {featuredItems.map((item) => (
            <AlbumCard key={`${item.artist}-${item.name}`} album={item} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 16,
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
});
