// PlayerScreen.js
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Slider,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePlayerStore } from "../store/player";
import PlayerControls from "../components/PlayerControls";
import { Ionicons } from "@expo/vector-icons";

export default function PlayerScreen() {
  const audioRef = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const { currentTrack, isPlaying, setIsPlaying, queue, setCurrentTrack } =
    usePlayerStore();

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.streamUrl;
    if (isPlaying) audioRef.current.play();
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      const currentIndex = queue.findIndex(
        (track) => track.id === currentTrack.id
      );
      if (currentIndex < queue.length - 1) {
        setCurrentTrack(queue[currentIndex + 1]);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [queue, currentTrack]);

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: currentTrack.albumArtUrl || "asset:/images/default-cover.png",
        }}
        style={styles.albumArt}
      />
      <Text style={styles.title}>{currentTrack.title}</Text>
      <Text style={styles.artist}>{currentTrack.artist}</Text>
      <Slider
        style={{ width: "90%", height: 40 }}
        minimumValue={0}
        maximumValue={duration || 1}
        value={currentTime}
        onValueChange={(value) => {
          audioRef.current.currentTime = value;
          setCurrentTime(value);
        }}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#888"
      />
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={() => {
          if (isPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
          setIsPlaying(!isPlaying);
        }}
        onNext={() => {
          const idx = queue.findIndex((track) => track.id === currentTrack.id);
          if (idx < queue.length - 1) setCurrentTrack(queue[idx + 1]);
        }}
        onPrevious={() => {
          const idx = queue.findIndex((track) => track.id === currentTrack.id);
          if (idx > 0) setCurrentTrack(queue[idx - 1]);
        }}
      />
    </View>
  );
}

function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  albumArt: { width: 260, height: 260, borderRadius: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "white" },
  artist: { fontSize: 18, color: "gray", marginBottom: 10 },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  time: { color: "gray", fontSize: 12 },
});
