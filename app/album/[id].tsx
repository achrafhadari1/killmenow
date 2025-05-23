import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { usePlayerStore } from "@/store/player";
import TrackItem from "@/components/TrackItem";
import { Feather } from "@expo/vector-icons";

const AlbumDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const albumName = id as string;
  const { library, setCurrentTrack, isPlaying, setIsPlaying } =
    usePlayerStore();
  const [albumTracks, setAlbumTracks] = useState([]);
  const [albumInfo, setAlbumInfo] = useState({
    name: albumName,
    artist: "",
    artwork: null,
  });

  useEffect(() => {
    // Find all tracks that belong to this album
    const tracks = library.filter((track) => track.album === albumName);
    console.log(`Found ${tracks.length} tracks for album: ${albumName}`);

    if (tracks.length > 0) {
      setAlbumTracks(tracks);
      setAlbumInfo({
        name: albumName,
        artist: tracks[0].artist,
        artwork: tracks[0].artwork,
      });
    }
  }, [albumName, library]);

  const playAlbum = () => {
    if (albumTracks.length > 0) {
      setCurrentTrack(albumTracks[0]);
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: albumName,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1A1A1A",
          },
          headerTintColor: "#fff",
        }}
      />

      <View style={styles.albumHeader}>
        <View style={styles.albumArtContainer}>
          {albumInfo.artwork ? (
            <Image
              source={{ uri: albumInfo.artwork }}
              style={styles.albumArt}
            />
          ) : (
            <View style={styles.placeholderArt}>
              <Feather name="disc" size={50} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle}>{albumInfo.name}</Text>
          <Text style={styles.albumArtist}>{albumInfo.artist}</Text>
          <Text style={styles.trackCount}>
            {albumTracks.length} {albumTracks.length === 1 ? "track" : "tracks"}
          </Text>

          <TouchableOpacity style={styles.playButton} onPress={playAlbum}>
            <Feather name="play" size={16} color="#fff" />
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={albumTracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrackItem track={item} />}
        style={styles.trackList}
      />
    </View>
  );
};

export default AlbumDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  albumHeader: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#1A1A1A",
  },
  albumArtContainer: {
    width: 120,
    height: 120,
    marginRight: 16,
    borderRadius: 6,
    overflow: "hidden",
  },
  albumArt: {
    width: "100%",
    height: "100%",
  },
  placeholderArt: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  albumInfo: {
    flex: 1,
    justifyContent: "center",
  },
  albumTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  albumArtist: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 4,
  },
  trackCount: {
    color: "#999",
    fontSize: 14,
    marginBottom: 12,
  },
  playButton: {
    backgroundColor: "#ff375f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  playButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  trackList: {
    flex: 1,
  },
});
