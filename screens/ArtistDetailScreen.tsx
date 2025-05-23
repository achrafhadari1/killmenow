import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialIcons";
import { usePlayerStore } from "../store/player";

const { width } = Dimensions.get("window");

export default function ArtistDetailScreen({ route }) {
  const { name } = route.params;
  const {
    library,
    setCurrentTrack,
    setIsPlaying,
    setQueue,
    addToQueue,
    cachedArtists,
    setCachedArtist,
  } = usePlayerStore();
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    if (cachedArtists[name]) {
      setArtistInfo(cachedArtists[name]);
    } else {
      // Fetch artist info from your API
      // For now, we'll use placeholder data
      const info = {
        name,
        image: null,
        bio: null,
        listeners: null,
      };
      setArtistInfo(info);
      setCachedArtist(name, info);
    }
  }, [name]);

  const artistTracks = library.filter((track) => track.artist === name);

  const albums = Object.values(
    artistTracks.reduce((acc, track) => {
      if (!track.album) return acc;

      if (!acc[track.album]) {
        acc[track.album] = {
          name: track.album,
          year: track.year,
          artwork: track.artwork,
          tracks: [],
        };
      }

      acc[track.album].tracks.push(track);
      return acc;
    }, {})
  );

  const playTrack = async (track, albumTracks) => {
    const trackIndex = albumTracks.findIndex((t) => t.id === track.id);
    await setCurrentTrack(track);
    setIsPlaying(true);
    setQueue([
      ...albumTracks.slice(trackIndex),
      ...albumTracks.slice(0, trackIndex),
    ]);
  };

  const playAlbum = async (albumTracks) => {
    if (albumTracks.length > 0) {
      await setCurrentTrack(albumTracks[0]);
      setIsPlaying(true);
      setQueue(albumTracks);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {artistInfo?.image ? (
          <FastImage
            source={{ uri: artistInfo.image }}
            style={styles.artistImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="person" size={80} color="#fff" />
          </View>
        )}
        <Text style={styles.artistName}>{name}</Text>
        {artistInfo?.listeners && (
          <Text style={styles.listeners}>
            {artistInfo.listeners.toLocaleString()} monthly listeners
          </Text>
        )}
      </View>

      {artistInfo?.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{artistInfo.bio}</Text>
        </View>
      )}

      <View style={styles.albumsSection}>
        {albums.map((album) => (
          <View key={album.name} style={styles.albumContainer}>
            <View style={styles.albumHeader}>
              <FastImage
                source={{ uri: album.artwork }}
                style={styles.albumArtwork}
              />
              <View style={styles.albumInfo}>
                <Text style={styles.albumName}>{album.name}</Text>
                {album.year && (
                  <Text style={styles.albumYear}>Album • {album.year}</Text>
                )}
                <View style={styles.albumActions}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => playAlbum(album.tracks)}
                  >
                    <Text style={styles.playButtonText}>Play</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.queueButton}
                    onPress={() => addToQueue(album.tracks)}
                  >
                    <Icon name="queue-music" size={16} color="#fff" />
                    <Text style={styles.queueButtonText}>Add to Queue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.trackList}>
              {album.tracks.map((track, index) => (
                <TouchableOpacity
                  key={track.id}
                  style={styles.trackItem}
                  onPress={() => playTrack(track, album.tracks)}
                >
                  <Text style={styles.trackNumber}>{index + 1}</Text>
                  <Text style={styles.trackTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={styles.trackDuration}>
                    {Math.floor(track.duration / 60)}:
                    {String(Math.floor(track.duration % 60)).padStart(2, "0")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    height: 300,
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "#1A1A1A",
  },
  artistImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  artistName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  listeners: {
    fontSize: 14,
    color: "#888",
  },
  bioSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20,
  },
  albumsSection: {
    padding: 16,
  },
  albumContainer: {
    marginBottom: 24,
  },
  albumHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  albumArtwork: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  albumInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  albumName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  albumYear: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  albumActions: {
    flexDirection: "row",
    gap: 8,
  },
  playButton: {
    backgroundColor: "#ff375f",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  queueButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  queueButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  trackList: {
    marginTop: 8,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  trackNumber: {
    width: 32,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  trackTitle: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
    marginRight: 16,
  },
  trackDuration: {
    fontSize: 14,
    color: "#888",
  },
});
