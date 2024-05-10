import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VideoScreen from '../screens/VideoScreen'; // Import the VideoScreen component
import YoutubePlayer from "react-native-youtube-iframe";
import MovieCredits from "./MovieCredits";
import Movie from "../types/Movie";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import { Button, Alert } from "react-native";
import ytdl from "react-native-ytdl";

interface MovieInfoModalProps {
  movie: Movie;
}

// Function to fetch the movie trailer
export async function getMovieTrailer(movieTitle: string) {
  const apiKey = "AIzaSyB4uQe8mnKYoqbss4x-6Mbw28gbSoaPdns"; // Replace with your YouTube Data API key
  const url = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
    movieTitle + " trailer"
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
const MovieInfoModal: React.FC<MovieInfoModalProps> = ({ movie }) => {
  const imageSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const releaseYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : 'No release date';
  const [playing, setPlaying] = useState<boolean>(true);
  const [videoId, setVideoId] = useState<string>('');
  const navigation = useNavigation();
  const [ytVideoLink, setYtVideoLink] = useState("");
  const [ytAudioLink, setYtAudioLink] = useState("");
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const fetchedVideoId = await getMovieTrailer(movie.title);
        setVideoId(fetchedVideoId);
      } catch (error) {
        console.error('Error fetching movie trailer:', error);
      }
    };

    fetchTrailer();
  }, [movie.title]);
  // Inside the MovieInfoModal component
  
  
  const handleMapIconPress = () => {
    navigation.navigate('Map' as never);
  };
  const downloadFromUrl = async () => {
   
      const youtubeURL = "https://www.youtube.com/watch?v=dYPM5Ry3SDc";
      const basicInfo = await ytdl.getBasicInfo(youtubeURL);
      const title = basicInfo.player_response.videoDetails.title;
      const videoUrls = await ytdl(youtubeURL, { quality: '134' });
      const audioUrls = await ytdl(youtubeURL, {
        quality: "highestaudio",
        filter: "audioonly",
        format: "m4a",
      });
      const videoFinalUri = videoUrls[0].url;
      const audioFinalUri = audioUrls[0].url;

      Alert.alert(
        "Link Generated",
        "Link has been generated, tap download now to download video",
        [{ text: "OK", onPress: () => "" }]
      );
      setYtVideoLink(videoFinalUri + "&title=" + title);
      setYtAudioLink(audioFinalUri + "&title=" + title);
    
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
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={downloadFromUrl}>
            <Ionicons name="download" size={24} color="#FFF" style={styles.linkIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleMapIconPress}>
            <Ionicons name="map" size={24} color="#FFF" style={styles.linkIcon} />
          </TouchableOpacity>
          </View>
        </View>
      </View>
      <MovieCredits movieId={movie.id} />
      {videoId !== '' && (
        <View style={styles.youtubeContainer}>
          <YoutubePlayer
            height={300}
            play={playing}
            videoId={videoId}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#252525',
    bottom: 0,
    width: '100%',
    height: 720,
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
  youtubeContainer: {
    marginTop: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 10, // Add margin as needed
    justifyContent: 'space-between', // Add this line
  },
  linkIcon: {
    marginTop: 10, // Adjust spacing as needed
    alignSelf: 'flex-start',
  },
});

export default MovieInfoModal;