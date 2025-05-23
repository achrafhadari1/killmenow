import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

interface ArtistCardProps {
  artist: {
    name: string;
    image?: string;
    albumArt?: string;
    trackCount: number;
  };
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("ArtistDetail", { name: artist.name })}
    >
      <View style={styles.artworkContainer}>
        {artist.image ? (
          <FastImage source={{ uri: artist.image }} style={styles.artwork} />
        ) : artist.albumArt ? (
          <FastImage source={{ uri: artist.albumArt }} style={styles.artwork} />
        ) : (
          <View style={styles.placeholderArtwork}>
            <Icon name="person" size={40} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.artistName} numberOfLines={1}>
        {artist.name}
      </Text>
      <Text style={styles.trackCount}>
        {artist.trackCount} {artist.trackCount === 1 ? "track" : "tracks"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginBottom: 16,
    alignItems: "center",
  },
  artworkContainer: {
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 100,
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
  artistName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  trackCount: {
    color: "#888",
    fontSize: 14,
    marginTop: 2,
    textAlign: "center",
  },
});
