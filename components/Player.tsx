import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  State,
} from "react-native-track-player";
import { usePlayerStore } from "../store/player";

const { width } = Dimensions.get("window");

export default function Player() {
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(1);
  const { position, duration } = useProgress();
  const playbackState = usePlaybackState();

  const { currentTrack, isPlaying, queue, setCurrentTrack, setIsPlaying } =
    usePlayerStore();

  useEffect(() => {
    TrackPlayer.setVolume(volume);
  }, [volume]);

  if (!currentTrack) return null;

  const handleSeek = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = async () => {
    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    if (currentIndex < queue.length - 1) {
      await setCurrentTrack(queue[currentIndex + 1]);
    }
  };

  const playPrevious = async () => {
    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    if (currentIndex > 0) {
      await setCurrentTrack(queue[currentIndex - 1]);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.miniPlayer}
        onPress={() => setExpanded(true)}
      >
        <View style={styles.miniContent}>
          {currentTrack.artwork ? (
            <FastImage
              source={{ uri: currentTrack.artwork }}
              style={styles.miniArtwork}
            />
          ) : (
            <View style={styles.miniPlaceholder}>
              <Icon name="music-note" size={24} color="#fff" />
            </View>
          )}
          <View style={styles.miniInfo}>
            <Text style={styles.miniTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.miniArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>
          <TouchableOpacity style={styles.miniPlayButton} onPress={togglePlay}>
            <Icon
              name={isPlaying ? "pause" : "play-arrow"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Modal
        visible={expanded}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setExpanded(false)}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>

          <View style={styles.artworkContainer}>
            {currentTrack.artwork ? (
              <FastImage
                source={{ uri: currentTrack.artwork }}
                style={styles.artwork}
              />
            ) : (
              <View style={styles.placeholderArtwork}>
                <Icon name="music-note" size={80} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {currentTrack.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>

          <View style={styles.controls}>
            <Slider
              style={styles.progressBar}
              value={position}
              maximumValue={duration}
              minimumValue={0}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#ff375f"
              maximumTrackTintColor="#4a4a4a"
              thumbTintColor="#ff375f"
            />
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formatTime(position)}</Text>
              <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>

            <View style={styles.mainControls}>
              <TouchableOpacity onPress={playPrevious}>
                <Icon name="skip-previous" size={40} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePlay}
              >
                <Icon
                  name={isPlaying ? "pause" : "play-arrow"}
                  size={48}
                  color="#000"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={playNext}>
                <Icon name="skip-next" size={40} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.volumeControl}>
              <Icon name="volume-down" size={24} color="#888" />
              <Slider
                style={styles.volumeSlider}
                value={volume}
                maximumValue={1}
                minimumValue={0}
                onValueChange={setVolume}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#4a4a4a"
                thumbTintColor="#fff"
              />
              <Icon name="volume-up" size={24} color="#888" />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  miniContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  miniArtwork: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  miniPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  miniInfo: {
    flex: 1,
    marginLeft: 12,
  },
  miniTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  miniArtist: {
    color: "#888",
    fontSize: 12,
  },
  miniPlayButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 40,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 1,
  },
  closeButtonText: {
    color: "#888",
    fontSize: 16,
  },
  artworkContainer: {
    width: width - 80,
    aspectRatio: 1,
    marginTop: 40,
    marginBottom: 32,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholderArtwork: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  trackInfo: {
    alignItems: "center",
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  artist: {
    color: "#888",
    fontSize: 18,
  },
  controls: {
    width: "100%",
    paddingHorizontal: 32,
  },
  progressBar: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  time: {
    color: "#888",
    fontSize: 12,
  },
  mainControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    marginTop: 16,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  volumeControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 8,
  },
});
