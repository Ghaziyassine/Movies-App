import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VideoScreen from '../screens/VideoScreen'; // Import the VideoScreen component

import MovieCredits from "./MovieCredits";
import Movie from "../types/Movie";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
interface VideoScreenRouteParams {
    videoUrl: string;
  }
  
// Function to fetch the movie trailer
export async function getMovieTrailer(movieTitle: string) {
    const apiKey = "AIzaSyCN2c76yvw5kr_KUik7bQ4mo8SydLJsoi4"; // Replace with your YouTube Data API key
    const url = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
        movieTitle + " full movie"
    )}&key=${apiKey}&part=snippet&type=video`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items[0].id.videoId;
        } else {
            throw new Error("Trailer not found");
        }
    } catch (error) {
        console.error("Error fetching movie trailer:", error);
        throw error;
    }
}

function MovieInfoModal({ movie }: { movie: Movie }) {
    const imageSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const releaseYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'No release date';
    const [videoUrl, setVideoUrl] = useState<string>('');
    const navigation = useNavigation();

    const handleVideoIconPress = async () => {
      try {
        const videoId = await getMovieTrailer(movie.title);
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        setVideoUrl(youtubeUrl);
        navigation.navigate('VideoScreen' as never);
      } catch (error) {
        console.error('Error opening YouTube video:', error);
      }
    };
      
      
      
      
      
      
      
      
    return (
        <View style={styles.container}>
          <View style={styles.topRow}>
            {movie.backdrop_path ? (
              <Image style={styles.image} source={{ uri: imageSrc }} />
            ) : (
              <View style={styles.viewAlt}>
                <Text style={styles.textAlt}>{movie.title}</Text>
              </View>
            )}
    
            <View style={styles.infosContainer}>
              <Text adjustsFontSizeToFit={true} numberOfLines={2} ellipsizeMode="clip" style={styles.title}>
                {movie.title}
              </Text>
    
              <View style={styles.subtitlesRow}>
                <Text style={styles.subtitle}>{releaseYear}</Text>
                <Text style={styles.subtitle}>{movie.vote_average}/10</Text>
                {movie.adult && <Text style={styles.adultLabel}>+18</Text>}
              </View>
    
              <Text style={styles.overview} numberOfLines={4}>
                {movie.overview}
              </Text>
    
              {/* Icon as link */}
              <TouchableOpacity onPress={handleVideoIconPress}>
                <Ionicons name="play-circle-sharp" size={24} color="#FFF" style={styles.linkIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <MovieCredits movieId={movie.id} />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        position: 'absolute',
        backgroundColor: '#252525',
        bottom: 0,
        width: '100%',
        height: 420,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 15,
      },
      infosContainer: {
        marginLeft: 10,
        marginBottom: 5,
        width: '65%',
      },
      topRow: {
        flexDirection: 'row',
        marginBottom: 12,
      },
      title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#FFF',
      },
      subtitlesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 6,
      },
      subtitle: {
        color: '#C1C1C1',
        marginRight: 12,
        fontSize: 14,
        fontWeight: '800',
      },
      overview: {
        color: '#C1C1C1',
        fontSize: 14,
        fontWeight: '500',
        maxHeight: 80,
      },
      image: {
        height: 182,
        width: 122,
        borderRadius: 5,
      },
      textAlt: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400',
      },
      viewAlt: {
        height: 182,
        width: 122,
        padding: 2,
        borderColor: '#FFF',
        borderWidth: 3,
        borderRadius: 10,
        backgroundColor: '#313131',
        display: 'flex',
        justifyContent: 'center',
      },
      adultLabel: {
        color: '#FF0000', // Customize the color as needed
        fontSize: 14,
        fontWeight: '800',
      },
      linkIcon: {
        marginTop: 10, // Adjust spacing as needed
        alignSelf: 'flex-start',
      },
    });
export default MovieInfoModal;
