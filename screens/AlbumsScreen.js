// screens/AlbumsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePlayerStore } from "../store/player";
import { Ionicons } from "@expo/vector-icons";

export default function AlbumsScreen() {
  const { library, cachedAlbums, setCurrentTrack, setIsPlaying } =
    usePlayerStore();
  const [albums, setAlbums] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const albumMap = library.reduce((acc, track) => {
      if (!track.album) return acc;

      if (!acc[track.album]) {
        const cachedAlbum = cachedAlbums[track.album];
        acc[track.album] = cachedAlbum || {
          name: track.album,
          artist: track.artist,
          tracks: [],
          albumArtUrl: track.albumArtUrl,
          year: track.year,
        };
      }

      if (!cachedAlbums[track.album]) {
        acc[track.album].tracks.push(track);
      }

      return acc;
    }, {});

    setAlbums(Object.values(albumMap));
  }, [library, cachedAlbums]);

  const playAlbum = (album) => {
    if (album.tracks.length > 0) {
      setCurrentTrack(album.tracks[0]);
      setIsPlaying(true);
    }
  };

  const renderAlbum = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={
        () => navigation.navigate("Album", { name: item.name }) // Must match route name in navigator
      }
    >
      <View style={styles.imageContainer}>
        {item.albumArtUrl ? (
          <Image source={{ uri: item.albumArtUrl }} style={styles.albumArt} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>💿</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => playAlbum(item)}
        >
          <Ionicons name="play" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.albumName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.artistName} numberOfLines={1}>
        {item.artist}
      </Text>
      {item.year && <Text style={styles.year}>{item.year}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Albums</Text>
      <FlatList
        data={albums}
        renderItem={renderAlbum}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    width: "48%",
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 1,
    marginBottom: 8,
  },
  albumArt: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  playButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
  },
  albumName: {
    color: "white",
    fontWeight: "600",
  },
  artistName: {
    color: "gray",
    fontSize: 12,
  },
  year: {
    color: "gray",
    fontSize: 12,
  },
});
