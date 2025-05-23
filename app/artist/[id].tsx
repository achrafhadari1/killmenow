import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { usePlayerStore } from "@/store/player";
import TrackItem from "@/components/TrackItem";
import { Feather } from "@expo/vector-icons";

function ArtistDetailScreen() {
  const { id } = useLocalSearchParams();
  const artistName = id as string;
  const router = useRouter();
  const { library, setCurrentTrack, isPlaying, setIsPlaying } =
    usePlayerStore();
  const [artistTracks, setArtistTracks] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // Find all tracks by this artist
    const tracks = library.filter((track) => track.artist === artistName);
    console.log(`Found ${tracks.length} tracks for artist: ${artistName}`);
    setArtistTracks(tracks);

    // Group tracks by album
    const albumsMap = {};
    tracks.forEach((track) => {
      if (track.album) {
        if (!albumsMap[track.album]) {
          albumsMap[track.album] = {
            name: track.album,
            artwork: track.artwork,
            tracks: [],
          };
        }
        albumsMap[track.album].tracks.push(track);
      }
    });

    // Convert to array
    const albumsArray = Object.values(albumsMap);
    console.log(`Found ${albumsArray.length} albums for artist: ${artistName}`);
    setAlbums(albumsArray);
  }, [artistName, library]);

  const playArtist = () => {
    if (artistTracks.length > 0) {
      setCurrentTrack(artistTracks[0]);
      setIsPlaying(true);
    }
  };

  const navigateToAlbum = (albumName) => {
    router.push({
      pathname: "/album/[id]",
      params: { id: albumName },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: artistName,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#1A1A1A",
          },
          headerTintColor: "#fff",
        }}
      />

      <View style={styles.artistHeader}>
        <View style={styles.artistImageContainer}>
          {artistTracks.length > 0 && artistTracks[0].artwork ? (
            <Image
              source={{ uri: artistTracks[0].artwork }}
              style={styles.artistImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Feather name="user" size={50} color="#fff" />
            </View>
          )}
        </View>

        <Text style={styles.artistName}>{artistName}</Text>
        <Text style={styles.trackCount}>
          {artistTracks.length} {artistTracks.length === 1 ? "track" : "tracks"}
        </Text>

        <TouchableOpacity style={styles.playButton} onPress={playArtist}>
          <Feather name="play" size={16} color="#fff" />
          <Text style={styles.playButtonText}>Play All</Text>
        </TouchableOpacity>
      </View>

      {albums.length > 0 && (
        <View style={styles.albumsSection}>
          <Text style={styles.sectionTitle}>Albums</Text>
          <FlatList
            data={albums}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.albumCard}
                onPress={() => navigateToAlbum(item.name)}
              >
                <View style={styles.albumArtContainer}>
                  {item.artwork ? (
                    <Image
                      source={{ uri: item.artwork }}
                      style={styles.albumArt}
                    />
                  ) : (
                    <View style={styles.placeholderArt}>
                      <Feather name="disc" size={30} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={styles.albumName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.albumTrackCount}>
                  {item.tracks.length}{" "}
                  {item.tracks.length === 1 ? "track" : "tracks"}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={styles.tracksSection}>
        <Text style={styles.sectionTitle}>Tracks</Text>
        <FlatList
          data={artistTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TrackItem track={item} />}
        />
      </View>
    </View>
  );
}

export default function Artist() {
  return <ArtistDetailScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  artistHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1A1A1A",
  },
  artistImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginBottom: 16,
  },
  artistImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  artistName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  trackCount: {
    color: "#999",
    fontSize: 16,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: "#ff375f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  playButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  albumsSection: {
    padding: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  albumCard: {
    width: 140,
    marginRight: 16,
  },
  albumArtContainer: {
    width: 140,
    height: 140,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
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
  albumName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  albumTrackCount: {
    color: "#999",
    fontSize: 12,
  },
  tracksSection: {
    flex: 1,
    padding: 16,
  },
});
