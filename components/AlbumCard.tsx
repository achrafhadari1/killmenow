import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

interface AlbumCardProps {
  album: {
    name: string;
    artist: string;
    artwork?: string;
    year?: string;
    isArtist?: boolean;
    tracks?: any[];
  };
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (album.isArtist) {
      // Navigate to artist detail screen
      console.log(`Navigating to artist detail: ${album.name}`);
      router.push({
        pathname: "/artist/[id]",
        params: { id: album.name },
      });
    } else {
      // Navigate to album detail screen
      console.log(`Navigating to album detail: ${album.name}`);
      router.push({
        pathname: "/album/[id]",
        params: { id: album.name },
      });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.artworkContainer}>
        {album.artwork ? (
          <FastImage source={{ uri: album.artwork }} style={styles.artwork} />
        ) : (
          <View style={styles.placeholderArtwork}>
            <Icon
              name={album.isArtist ? "person" : "album"}
              size={40}
              color="#fff"
            />
          </View>
        )}
      </View>
      <Text style={styles.albumName} numberOfLines={1}>
        {album.name}
      </Text>
      {!album.isArtist && (
        <Text style={styles.artistName} numberOfLines={1}>
          {album.artist}
        </Text>
      )}
      {album.year && <Text style={styles.year}>{album.year}</Text>}
      {album.tracks && (
        <Text style={styles.trackCount}>
          {album.tracks.length} {album.tracks.length === 1 ? "track" : "tracks"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginBottom: 16,
    width: "48%",
  },
  artworkContainer: {
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
  albumName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  artistName: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  year: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  trackCount: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },
});
