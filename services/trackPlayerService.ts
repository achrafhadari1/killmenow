import TrackPlayer from "react-native-track-player";

export async function setupPlayer() {
  try {
    await TrackPlayer.setupPlayer({
      maxBuffer: 50,
    });

    // Skip capabilities configuration for now as it's causing issues
    console.log(
      "Track player setup complete - skipping capabilities configuration"
    );
  } catch (error) {
    console.error("Error setting up player:", error);
  }
}

// Get the access token from the googleDriveService
import { getAccessToken } from "./googleDriveService";

export async function playTrack(track) {
  try {
    console.log("Playing track:", track.title);

    // Get the current access token
    const accessToken = getAccessToken();

    // Reset the player first
    await TrackPlayer.reset();

    // Add the track with headers for authorization
    await TrackPlayer.add({
      id: track.id,
      url: track.url,
      title: track.title,
      artist: track.artist,
      album: track.album || "",
      artwork: track.artwork || "",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Start playback
    await TrackPlayer.play();
    console.log("Playback started");
  } catch (error) {
    console.error("Error playing track:", error);
  }
}
