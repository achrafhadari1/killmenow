import TrackPlayer, { Capability } from "react-native-track-player";

export async function setupPlayer() {
  try {
    await TrackPlayer.setupPlayer({
      maxBuffer: 50,
    });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
  } catch (error) {
    console.log("Error setting up player:", error);
  }
}

export async function playTrack(track) {
  try {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: track.id,
      url: track.url,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork,
    });
    await TrackPlayer.play();
  } catch (error) {
    console.log("Error playing track:", error);
  }
}
