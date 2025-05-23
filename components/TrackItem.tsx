import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { usePlayerStore } from "@/store/player";
import { playTrack } from "@/services/trackPlayerService";

interface TrackItemProps {
  track: {
    id: string;
    title: string;
    artist: string;
    album?: string;
    artwork?: string;
    streamUrl: string;
  };
  showArtist?: boolean;
}

export default function TrackItem({
  track,
  showArtist = true,
}: TrackItemProps) {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying } =
    usePlayerStore();

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePress = async () => {
    console.log("Playing track:", track.title);

    // Set the current track in the store
    setCurrentTrack(track);

    // Start playback using the TrackPlayer service
    try {
      await playTrack({
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
    <TouchableOpacity
      style={[styles.container, isCurrentTrack && styles.currentTrack]}
      onPress={handlePress}
    >
      <View style={styles.trackInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        {showArtist && (
          <Text style={styles.artist} numberOfLines={1}>
            {track.artist}
          </Text>
        )}
      </View>

      <View style={styles.controls}>
        {isCurrentTrack && isPlaying && (
          <View style={styles.playingIndicator}>
            <Feather name="music" size={16} color="#ff375f" />
          </View>
        )}
        <Feather name="more-vertical" size={20} color="#888" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  currentTrack: {
    backgroundColor: "rgba(255, 55, 95, 0.1)",
  },
  trackInfo: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  artist: {
    color: "#999",
    fontSize: 14,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  playingIndicator: {
    marginRight: 16,
  },
});
