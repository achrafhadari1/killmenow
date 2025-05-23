import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import ArtistsScreen from "./src/screens/ArtistsScreen";
import AlbumsScreen from "./src/screens/AlbumsScreen";
import ArtistDetailScreen from "./src/screens/ArtistDetailScreen";
import AlbumDetailScreen from "./src/screens/AlbumDetailScreen";
import Player from "./src/components/Player";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1A1A1A",
          borderTopColor: "rgba(255, 255, 255, 0.1)",
        },
        tabBarActiveTintColor: "#ff375f",
        tabBarInactiveTintColor: "#888",
        headerStyle: {
          backgroundColor: "#1A1A1A",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tab.Screen
        name="Listen Now"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Artists"
        component={ArtistsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="people" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="album" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#1A1A1A",
            },
            headerTintColor: "#fff",
            contentStyle: {
              backgroundColor: "#000",
            },
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ArtistDetail"
            component={ArtistDetailScreen}
            options={({ route }) => ({
              title: route.params?.name || "Artist",
            })}
          />
          <Stack.Screen
            name="AlbumDetail"
            component={AlbumDetailScreen}
            options={({ route }) => ({
              title: route.params?.name || "Album",
            })}
          />
        </Stack.Navigator>
        <Player />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
