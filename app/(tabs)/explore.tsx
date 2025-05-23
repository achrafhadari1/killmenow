import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { usePlayerStore } from '@/store/player';
import { Image } from 'expo-image';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { library } = usePlayerStore();

  const filteredTracks = library.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (track.album?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Songs, artists, or albums"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.results}>
        {filteredTracks.map(track => (
          <TouchableOpacity key={track.id} style={styles.trackItem}>
            {track.artwork ? (
              <Image source={{ uri: track.artwork }} style={styles.trackArtwork} />
            ) : (
              <View style={[styles.trackArtwork, styles.placeholderArtwork]}>
                <Text style={styles.placeholderText}>🎵</Text>
              </View>
            )}
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackArtist}>{track.artist}</Text>
              {track.album && <Text style={styles.trackAlbum}>{track.album}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  results: {
    flex: 1,
    padding: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackArtwork: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  trackInfo: {
    marginLeft: 12,
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  trackArtist: {
    color: '#888',
    fontSize: 14,
  },
  trackAlbum: {
    color: '#666',
    fontSize: 12,
  },
  placeholderArtwork: {
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
});
