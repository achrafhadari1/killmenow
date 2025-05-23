import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialIcons";

interface TrackCardProps {
  track: {
    id: string;
    title: string;
    artist: string;
    artwork?: string;
  };
  onPlay: () => void;
}

export default function TrackCard({ track, onPlay }: TrackCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPlay}>
      <View style={styles.artworkContainer}>
        {track.artwork ? (
          <FastImage source={{ uri: track.artwork }} style={styles.artwork} />
        ) : (
          <View style={styles.placeholderArtwork}>
            <Icon name="music-note" size={40} color="#fff" />
          </View>
        )}
        <TouchableOpacity style={styles.playButton} onPress={onPlay}>
          <Icon name="play-arrow" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {track.title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {track.artist}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginBottom: 16,
  },
  artworkContainer: {
    position: "relative",
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  placeholderArtwork: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "#ff375f",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  artist: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
});
