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

  const recentTracks = [...library]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 6);

  const featuredAlbums = [
    ...new Set(
      library.filter((track) => track.album).map((track) => track.album)
    ),
  ].slice(0, 6);

  const albums = featuredAlbums.map((albumName) => {
    const albumTracks = library.filter((track) => track.album === albumName);
    return {
      name: albumName,
      artist: albumTracks[0].artist,
      artwork: albumTracks[0].artwork,
      tracks: albumTracks,
    };
  });

  const playTrack = async (track) => {
    await setCurrentTrack(track);
    setIsPlaying(true);
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
        <Text style={styles.sectionTitle}>Featured Albums</Text>
        <View style={styles.grid}>
          {albums.map((album) => (
            <AlbumCard key={album.name} album={album} />
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
