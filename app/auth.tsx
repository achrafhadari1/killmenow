import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAccessToken,
  listMusicFiles,
  getStreamUrl,
} from "@/services/googleDriveService";
import { getLastFMAlbumInfo } from "@/services/lastfm";
import { usePlayerStore } from "@/store/player";
import { Feather } from "@expo/vector-icons";

const CLIENT_ID =
  "1034492045840-qo10kjp52v4i6gg1qff03tnll9gdvpht.apps.googleusercontent.com";
// For Android clients, you may need to provide a client secret
// In a production app, you should NEVER store this directly in your code
// Instead, use a secure server-side endpoint or a secure storage solution
const CLIENT_SECRET = ""; // You'll need to fill this with your actual client secret
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = "@music_library";
// Using the native redirect URI instead of proxy for better token handling
const redirectUri = AuthSession.makeRedirectUri({
  native: "com.achraf.musicdrive:/oauthredirect", // must match your app.json scheme
});

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export default function AuthScreen() {
  const router = useRouter();
  const { setLibrary, setIsLoading } = usePlayerStore();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri,
      usePKCE: true,
      responseType: "code", // This avoids code exchange manually
    },
    discovery
  );

  useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === "success" && response.params?.code) {
        const code = response.params.code;
        const codeVerifier = request?.codeVerifier; // REQUIRED

        try {
          const tokenResponse = await fetch(discovery.tokenEndpoint!, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              code,
              client_id: CLIENT_ID,
              redirect_uri: redirectUri,
              grant_type: "authorization_code",
              code_verifier: codeVerifier!,
            }).toString(),
          });

          const tokenData = await tokenResponse.json();
          console.log("Token Response:", tokenData);

          if (tokenData.access_token) {
            setAccessToken(tokenData.access_token);
            await fetchFilesAndNavigate();
          } else {
            console.warn("Access token not received", tokenData);
          }
        } catch (error) {
          console.error("Token exchange failed:", error);
        }
      }
    };

    handleAuthResponse();
  }, [response]);

  const checkCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { library, timestamp } = JSON.parse(cached);
        const age = Date.now() - new Date(timestamp).getTime();

        console.log("Cache age:", Math.round(age / 1000 / 60), "minutes");

        if (age < CACHE_EXPIRY && library.length > 0) {
          console.log("Using cached library with", library.length, "tracks");
          setLibrary(library);
          return true;
        }
      }
      console.log("No valid cache found");
      return false;
    } catch (error) {
      console.error("Cache check failed:", error);
      return false;
    }
  };

  async function fetchFilesAndNavigate() {
    try {
      setIsLoading(true);
      console.log("Starting library fetch");

      const isCached = await checkCache();
      if (isCached) {
        console.log("Navigating due to cache"); // ADD THIS
        router.replace("/(tabs)");
        return;
      }

      console.log("Fetching files from Google Drive..."); // ADD THIS
      const files = await listMusicFiles();
      console.log("Found", files.length, "music files"); // YOU HAVE THIS

      const tracks = await Promise.all(
        files.map(async (file) => {
          console.log("Processing file:", file.name); // ADD THIS
          const streamUrl = await getStreamUrl(file.id);
          const nameComponents = file.name.split("-").map((s) => s.trim());
          const artist = nameComponents[0] || "Unknown Artist";
          const title =
            nameComponents[1]?.replace(".mp3", "").trim() || file.name;

          const albumInfo = await getLastFMAlbumInfo(artist, title);
          console.log("Processed track:", title, "by", artist); // YOU HAVE THIS

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

      console.log("Successfully processed", tracks.length, "tracks");
      setLibrary(tracks);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to load files:", error); // YOU HAVE THIS
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Feather name="music" size={64} color="#ff375f" />
        <Text style={styles.title}>Music Drive</Text>
        <Text style={styles.subtitle}>
          Listen to your Google Drive music library
        </Text>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => promptAsync()}
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
