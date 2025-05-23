import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import {
  setAccessToken,
  listMusicFiles,
  getStreamUrl,
} from "@/services/googleDriveService";
import { getLastFMAlbumInfo } from "@/services/lastfm";
import { usePlayerStore } from "@/store/player";
import { Feather } from "@expo/vector-icons";

// Constants
const CLIENT_ID =
  "1034492045840-l1qiqmg9o36bgjmeps2lrbo4la42vs64.apps.googleusercontent.com";
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
const projectNameForProxy = "@achrafhadari/music-drive";

// Discovery endpoints
const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function AuthScreen() {
  const router = useRouter();
  const { setLibrary } = usePlayerStore();

  // Redirect URI
  const redirectUri = "https://auth.expo.io/@achrafhadari/music-drive";

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri,
      responseType: "code",
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    console.log("Auth request object:", request);
    console.log(
      "Redirect URI used:",
      AuthSession.makeRedirectUri({ useProxy: true, projectNameForProxy })
    );
    console.log("App Ownership:", Constants.appOwnership);

    if (response?.type === "success") {
      const { access_token } = response.params;
      if (access_token) {
        setAccessToken(access_token);
        fetchFilesAndNavigate();
      }
    }
  }, [response, request]);

  async function fetchFilesAndNavigate() {
    try {
      const files = await listMusicFiles();

      const tracks = await Promise.all(
        files.map(async (file) => {
          const streamUrl = await getStreamUrl(file.id);
          const nameComponents = file.name.split("-").map((s) => s.trim());
          const artist = nameComponents[0] || "Unknown Artist";
          const title =
            nameComponents[1]?.replace(".mp3", "").trim() || file.name;

          const albumInfo = await getLastFMAlbumInfo(artist, title);

          return {
            id: file.id,
            title,
            artist,
            album: albumInfo?.album || undefined,
            artwork: albumInfo?.albumArtUrl,
            streamUrl,
          };
        })
      );

      setLibrary(tracks);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to load files:", error);
      Alert.alert("Error", "Failed to load your music files.");
    }
  }

  const handleSignIn = async () => {
    if (request) {
      await promptAsync();
    } else {
      Alert.alert(
        "Auth Request not ready",
        "Auth request is not ready yet. Try refreshing the page."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Feather name="music" size={64} color="#ff375f" />
        <Text style={styles.title}>Music Drive</Text>
        <Text style={styles.subtitle}>
          Listen to your Google Drive music library
        </Text>

        <TouchableOpacity
          style={[styles.signInButton, { opacity: request ? 1 : 0.5 }]}
          onPress={handleSignIn}
          disabled={!request}
        >
          <Feather
            name="log-in"
            size={24}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 40,
    textAlign: "center",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff375f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
