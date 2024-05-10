import React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SearchScreen from "./src/screens/SearchScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MapScreen from "./src/screens/MapScreen"; 
import VideoScreen from "./src/screens/VideoScreen"; // Import the VideoScreen component

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />

        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "turquoise",
            tabBarStyle: {
              height: "7%",
              backgroundColor: "#222222",
              position: "absolute",
              borderTopWidth: 0,
            },
          }}
        >
          <Tab.Screen
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name="home"
                  size={focused ? size * 1.3 : size}
                  color={color}
                />
              ),
            }}
            name="Home"
            component={HomeScreen}
          />

          <Tab.Screen
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name="search-sharp"
                  size={focused ? size * 1.3 : size}
                  color={color}
                />
              ),
            }}
            name="Search"
            component={SearchScreen}
          />

          <Tab.Screen
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name="map"
                  size={focused ? size * 1.3 : size}
                  color={color}
                />
              ),
            }}
            name="Map"
            component={MapScreen}
          />

          {/* Add the VideoScreen tab */}
          <Tab.Screen
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name="play-circle"
                  size={focused ? size * 1.3 : size}
                  color={color}
                />
              ),
            }}
            name="VideoScreen"
            component={VideoScreen}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
