import React from "react";
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
const ITEM_WIDTH = (width - 48) / 2;

export default function ArtistsScreen({ navigation }) {
  const { library, cachedArtists } = usePlayerStore();

  const artists = Object.values(
    library.reduce((acc, track) => {
      if (!track.artist) return acc;

      if (!acc[track.artist]) {
        const cachedArtist = cachedArtists[track.artist];
        acc[track.artist] = {
          name: track.artist,
          tracks: [],
          albumArt: null,
          image: cachedArtist?.image || null,
        };
      }

      acc[track.artist].tracks.push(track);
      if (!acc[track.artist].image && track.artwork) {
        acc[track.artist].albumArt = track.artwork;
      }
      return acc;
    }, {})
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {artists.map((artist) => (
          <TouchableOpacity
            key={artist.name}
            style={styles.item}
            onPress={() =>
              navigation.navigate("ArtistDetail", { name: artist.name })
            }
          >
            <View style={styles.artworkContainer}>
              {artist.image ? (
                <FastImage
                  source={{ uri: artist.image }}
                  style={styles.artwork}
                />
              ) : artist.albumArt ? (
                <FastImage
                  source={{ uri: artist.albumArt }}
                  style={styles.artwork}
                />
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
              {artist.tracks.length}{" "}
              {artist.tracks.length === 1 ? "track" : "tracks"}
            </Text>
          </TouchableOpacity>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },
  item: {
    width: ITEM_WIDTH,
    marginHorizontal: 4,
    marginBottom: 16,
    alignItems: "center",
  },
  artworkContainer: {
    width: ITEM_WIDTH - 16,
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: ITEM_WIDTH / 2,
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
