import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from 'react-native-maps';

const GOOGLE_MAPS_API_KEY = "AIzaSyBMxEhoXsi6NADSY-yNlubcUg8I1S2wLDg";
const TMDB_API_KEY = "3c49560e86e331cecaa85fb1f10031fa";

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
          const cinemas = data.results;
          const cinemasWithMovies = await Promise.all(cinemas.map(async (cinema) => {
            const movies = await fetchMoviesForCinema(cinema.place_id);
            return { ...cinema, movies };
          }));
          setLocations(cinemasWithMovies);
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

  const fetchMoviesForCinema = async (cinemaId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=fr&page=1&region=MA&with_cinema=${cinemaId}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching movies for cinema:", error);
      return [];
    }
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
      <MapView style={styles.map}>
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.geometry.location.lat,
              longitude: location.geometry.location.lng,
            }}
            title={location.name}
            description={location.formatted_address}
          >
            {location.movies.map((movie, index) => (
              <View key={index}>
                <Text>{movie.title}</Text>
              </View>
            ))}
          </Marker>
        ))}
      </MapView>
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
  map: {
    flex: 1,
  },
});

export default MapScreen;

