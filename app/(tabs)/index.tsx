import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { usePlayerStore } from "@/store/player";
import { Image } from "expo-image";

export default function HomeScreen() {
  const { library, setCurrentTrack, setIsPlaying } = usePlayerStore();

  const recentTracks = library.slice(0, 6);
  const featuredAlbums = [
    ...new Set(
      library.filter((track) => track.album).map((track) => track.album)
    ),
  ].slice(0, 6);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good evening</Text>
        <Text style={styles.title}>Your Music</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.trackList}
        >
          {recentTracks.map((track) => (
            <TouchableOpacity
              key={track.id}
              style={styles.trackCard}
              onPress={() => {
                setCurrentTrack(track);
                setIsPlaying(true);
                console.log(track);
              }}
            >
              {track.artwork ? (
                <Image
                  source={{ uri: track.artwork }}
                  style={styles.trackArtwork}
                />
              ) : (
                <View style={[styles.trackArtwork, styles.placeholderArtwork]}>
                  <Text style={styles.placeholderText}>🎵</Text>
                </View>
              )}
              <Text style={styles.trackTitle} numberOfLines={1}>
                {track.title}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {track.artist}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Albums</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.albumList}
        >
          {featuredAlbums.map((albumName) => {
            const albumTrack = library.find(
              (track) => track.album === albumName
            );
            return (
              <TouchableOpacity key={albumName} style={styles.albumCard}>
                {albumTrack?.artwork ? (
                  <Image
                    source={{ uri: albumTrack.artwork }}
                    style={styles.albumArtwork}
                  />
                ) : (
                  <View
                    style={[styles.albumArtwork, styles.placeholderArtwork]}
                  >
                    <Text style={styles.placeholderText}>💿</Text>
                  </View>
                )}
                <Text style={styles.albumTitle} numberOfLines={1}>
                  {albumName}
                </Text>
                <Text style={styles.albumArtist} numberOfLines={1}>
                  {albumTrack?.artist}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  trackList: {
    paddingLeft: 20,
  },
  trackCard: {
    width: 150,
    marginRight: 16,
  },
  trackArtwork: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  trackTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  trackArtist: {
    color: "#888",
    fontSize: 12,
  },
  albumList: {
    paddingLeft: 20,
  },
  albumCard: {
    width: 180,
    marginRight: 16,
  },
  albumArtwork: {
    width: 180,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  albumTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  albumArtist: {
    color: "#888",
    fontSize: 14,
  },
  placeholderArtwork: {
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
  },
});
