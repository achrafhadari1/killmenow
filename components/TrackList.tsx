import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface Track {
  id: string;
  title: string;
  duration: number;
}

interface TrackListProps {
  tracks: Track[];
  currentTrackId?: string;
  isPlaying?: boolean;
  onTrackPress: (track: Track, index: number) => void;
}

export default function TrackList({
  tracks,
  currentTrackId,
  isPlaying,
  onTrackPress,
}: TrackListProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {tracks.map((track, index) => (
        <TouchableOpacity
          key={track.id}
          style={styles.trackItem}
          onPress={() => onTrackPress(track, index)}
        >
          <Text style={styles.trackNumber}>{index + 1}</Text>
          <View style={styles.trackInfo}>
            <Text
              style={[
                styles.trackTitle,
                currentTrackId === track.id && styles.playingTrack,
              ]}
              numberOfLines={1}
            >
              {track.title}
            </Text>
          </View>
          <Text style={styles.trackDuration}>{formatTime(track.duration)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  trackNumber: {
    width: 32,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  trackInfo: {
    flex: 1,
    marginRight: 16,
  },
  trackTitle: {
    fontSize: 14,
    color: "#fff",
  },
  playingTrack: {
    color: "#ff375f",
  },
  trackDuration: {
    fontSize: 14,
    color: "#888",
  },
});
