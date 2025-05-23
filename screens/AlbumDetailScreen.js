// screens/AlbumScreen.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { usePlayerStore } from "../store/player";
import { Ionicons } from "@expo/vector-icons";

export default function AlbumScreen() {
  const route = useRoute();
  const { name } = route.params;
  const decodedName = decodeURIComponent(name);

  const {
    library,
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setIsPlaying,
    setQueue,
    addToQueue,
    cachedAlbums,
    setCachedAlbum,
  } = usePlayerStore();

  const albumTracks = library.filter((track) => track.album === decodedName);
  const albumInfo = albumTracks[0] || {};

  useEffect(() => {
    if (!cachedAlbums[decodedName] && albumTracks.length > 0) {
      setCachedAlbum(decodedName, {
        name: decodedName,
        artist: albumInfo.artist,
        tracks: albumTracks,
        artwork: albumInfo.albumArtUrl,
        year: albumInfo.year,
      });
    }
  }, [decodedName, albumTracks]);

  const isTrackPlaying = (track) => currentTrack?.id === track.id && isPlaying;

  const playTrack = (track, index) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      const newQueue = [
        ...albumTracks.slice(index),
        ...albumTracks.slice(0, index),
      ];
      setQueue(newQueue);
    }
  };

  const playAlbum = () => {
    if (albumTracks.length > 0) {
      setCurrentTrack(albumTracks[0]);
      setIsPlaying(true);
      setQueue(albumTracks);
    }
  };

  const addAlbumToQueue = () => {
    addToQueue(albumTracks);
  };

  const renderTrack = ({ item, index }) => (
    <TouchableOpacity
      style={styles.trackRow}
      onPress={() => playTrack(item, index)}
    >
      {isTrackPlaying(item) ? (
        <Ionicons name="pause" size={20} color="red" />
      ) : (
        <Text style={styles.trackIndex}>{index + 1}</Text>
      )}

      <View style={styles.trackInfo}>
        <Text
          style={[styles.trackTitle, isTrackPlaying(item) && { color: "red" }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </View>

      <Text style={styles.trackDuration}>
        {Math.floor(item.duration / 60)}:
        {String(Math.floor(item.duration % 60)).padStart(2, "0")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {albumInfo.albumArtUrl ? (
          <Image
            source={{ uri: albumInfo.albumArtUrl }}
            style={styles.albumArt}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>💿</Text>
          </View>
        )}
        <View style={styles.meta}>
          <Text style={styles.albumName}>{decodedName}</Text>
          <Text style={styles.artistName}>{albumInfo.artist}</Text>
          <Text style={styles.details}>
            {albumInfo.year} • {albumTracks.length} songs
          </Text>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.playBtn} onPress={playAlbum}>
              <Text style={styles.playBtnText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.queueBtn} onPress={addAlbumToQueue}>
              <Ionicons name="add" size={16} color="white" />
              <Text style={styles.queueBtnText}>Queue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={albumTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderTrack}
        contentContainerStyle={styles.trackList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 16 },
  header: { flexDirection: "row", marginBottom: 24 },
  albumArt: {
    width: 150,
    height: 150,
    borderRadius: 16,
    marginRight: 16,
  },
  placeholder: {
    width: 150,
    height: 150,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  meta: { flex: 1, justifyContent: "space-between" },
  albumName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  artistName: {
    fontSize: 16,
    color: "gray",
    marginTop: 4,
  },
  details: {
    color: "gray",
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  playBtn: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  playBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  queueBtn: {
    backgroundColor: "white",
    opacity: 0.1,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  queueBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  trackList: {
    paddingBottom: 80,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },
  trackIndex: {
    width: 24,
    color: "gray",
    textAlign: "center",
  },
  trackInfo: {
    flex: 1,
    paddingLeft: 8,
  },
  trackTitle: {
    color: "white",
  },
  trackDuration: {
    width: 48,
    textAlign: "right",
    color: "gray",
  },
});
