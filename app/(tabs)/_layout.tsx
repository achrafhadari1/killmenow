import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";
import { usePlayerStore } from "@/store/player";

export default function TabLayout() {
  const { isLoading } = usePlayerStore();

  return (
    <>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#ff375f",
            padding: 4,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ActivityIndicator color="#fff" />
        </View>
      )}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1A1A1A",
            borderTopColor: "rgba(255, 255, 255, 0.1)",
          },
          tabBarActiveTintColor: "#ff375f",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            tabBarIcon: ({ color, size }) => (
              <Feather name="folder" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
