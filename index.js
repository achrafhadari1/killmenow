import "expo-router/entry";
import TrackPlayer from "react-native-track-player";

// This is the entry point for the app
// Register the TrackPlayer service
TrackPlayer.registerPlaybackService(() =>
  require("./services/trackPlayerPlaybackService")
);
