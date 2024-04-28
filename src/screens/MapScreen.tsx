import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from 'react-native-maps';

const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";

function MapScreen() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!search) {
      setLocations([]);
      return;
    }

    setLoading(true);
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${GOOGLE_MAPS_API_KEY}&query=${search}`
        );
        const data = await response.json();
        if (data.results) {
          setLocations(data.results);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [search]);

  const renderLocations = () => {
    if (loading) {
      return <Text style={styles.mainContentText}>Loading...</Text>;
    }

    if (locations.length === 0) {
      return <Text style={styles.mainContentText}>No locations found for "{search}"</Text>;
    }

    return (
      <ScrollView>
        {locations.map((location) => (
          <View style={styles.locationItem} key={location.id}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationAddress}>{location.formatted_address}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons
          name="search-sharp"
          size={24}
          color="#C1C1C1"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          placeholderTextColor="#C1C1C1"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <MapView style={styles.map} />
      <View style={styles.resultsContainer}>{renderLocations()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#424242",
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    height: 60,
    color: "#FFF",
    fontSize: 18,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 10,
  },
  locationItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF",
  },
  locationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 16,
    color: "#FFF",
  },
  mainContentText: {
    fontSize: 25,
    fontWeight: "500",
    color: "#FFF"
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
