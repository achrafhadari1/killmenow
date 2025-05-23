import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { usePlayerStore } from '@/store/player';
import { Image } from 'expo-image';

export default function LibraryScreen() {
  const { library } = usePlayerStore();

  const artists = [...new Set(library.map(track => track.artist))];
  const albums = [...new Set(library.filter(track => track.album).map(track => track.album))];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Artists</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistList}>
          {artists.map(artist => {
            const artistTrack = library.find(track => track.artist === artist);
            return (
              <TouchableOpacity key={artist} style={styles.artistCard}>
                {artistTrack?.artwork ? (
                  <Image source={{ uri: artistTrack.artwork }} style={styles.artistImage} />
                ) : (
                  <View style={[styles.artistImage, styles.placeholderArtwork]}>
                    <Text style={styles.placeholderText}>👤</Text>
                  </View>
                )}
                <Text style={styles.artistName} numberOfLines={1}>{artist}</Text>
                <Text style={styles.artistTrackCount}>
                  {library.filter(track => track.artist === artist).length} songs
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Albums</Text>
        <View style={styles.albumGrid}>
          {albums.map(albumName => {
            const albumTrack = library.find(track => track.album === albumName);
            return (
              <TouchableOpacity key={albumName} style={styles.albumCard}>
                {albumTrack?.artwork ? (
                  <Image source={{ uri: albumTrack.artwork }} style={styles.albumArtwork} />
                ) : (
                  <View style={[styles.albumArtwork, styles.placeholderArtwork]}>
                    <Text style={styles.placeholderText}>💿</Text>
                  </View>
                )}
                <Text style={styles.albumTitle} numberOfLines={1}>{albumName}</Text>
                <Text style={styles.albumArtist} numberOfLines={1}>{albumTrack?.artist}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  artistList: {
    paddingLeft: 20,
  },
  artistCard: {
    width: 120,
    marginRight: 16,
    alignItems: 'center',
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  artistName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  artistTrackCount: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  albumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  albumCard: {
    width: '50%',
    padding: 4,
    marginBottom: 16,
  },
  albumArtwork: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  albumTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  albumArtist: {
    color: '#888',
    fontSize: 12,
  },
  placeholderArtwork: {
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
});