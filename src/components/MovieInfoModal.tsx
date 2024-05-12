import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Keyboard,Platform, ToastAndroid } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import MovieCredits from "./MovieCredits";
import Movie from "../types/Movie";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import { Button, Alert } from "react-native";
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';



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


 
  const handleDownloadPress = async () => {
    const filename = "trailler.mp4";
    const fileUri = 'https://rr2---sn-h5qzen7s.googlevideo.com/videoplayback?expire=1715532216&ei=WJ1AZu6tJe6WhcIPqcWwiAs&ip=197.253.228.62&id=o-AH0B7fi8AUtvQ9EanLNhSPKV-pZMEQpESuuoD7rY2JTb&itag=160&aitags=133%2C160&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&siu=1&bui=AWRWj2S41NCJeOHIOAaR_xhmx6SDQgVQCXGS4TchE3YI8AOuAlxGYOeX-R6VHyCB7ipYXEpg9Q&spc=UWF9f2EwqID5A_e2StBxcLvQ1S_-WnnpaV3JOE4uVJfX5rV0zTFxKG1c1cPq6gYUAtTu&vprv=1&svpuc=1&mime=video%2Fmp4&ns=BzHcmEwReND9ZWAOPJsfoQYQ&rqh=1&gir=yes&clen=451172&dur=40.206&lmt=1709953662379682&keepalive=yes&c=WEB&sefc=1&txp=8219224&n=W5D1qWlT5WkfhA&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Csiu%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgfJ4R1dP4sz4CliYOfkmKKHPDwbqwCSvlQGXLM-8eFCkCIFMIpwBQAL4DoZJUlzUY1_spbvvEt5R6cOXI0hqTopDa&pot=Ih86BzoGXEeReQs2CT4OMgMzAzIDNw0-AjcNNwM1DHtG&cm2rm=sn-hxqpuxa-jhod7e&req_id=b40f45367228a3ee&redirect_counter=2&rm=sn-h5q6s7l&cms_redirect=yes&cmsv=e&ipbypass=yes&mh=VQ&mip=197.253.220.94&mm=29&mn=sn-h5qzen7s&ms=rdu&mt=1715510442&mv=m&mvi=2&pl=19&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AHWaYeowRQIhAO5E2VGnfZhE3jtFs8DJpD_nB4B_zx98VlH5WIhiVGZdAiBfRivs5Sl-ot-yfAIXFIiHJuDbKWPiyNQUQLVYPORW1w%3D%3D'; // your video URL here
    Alert.alert(
      "Link Generated",
      "Downloading video...",
      [{ text: "Cancel", onPress: () => "" }]
    );
    try {
        const downloadResumable = FileSystem.createDownloadResumable(
            fileUri,
            FileSystem.documentDirectory + filename,
            {},
            (downloadProgress) => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                const progressPercentage = Math.round(progress * 100);
                Alert.alert(
                    "Downloading video...",
                    `Progress: ${progressPercentage}%`
                );
            }
        );
        const { uri } = await downloadResumable.downloadAsync();
        saveFile(uri, filename, 'video/mp4');
    } catch (error) {
        console.error('Error initiating video download:', error.message);
        Alert.alert('Error', 'Failed to initiate video download');
    }
};

async function saveFile(uri, filename, mimetype) {
    if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

            await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
                .then(async (uri) => {
                    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                })
                .catch(e => console.log(e));
                ToastAndroid.show('Download Complete', ToastAndroid.LONG);

        } else {
            shareAsync(uri);
        }
    } else {
        shareAsync(uri);
    }
}


  
    
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
            <TouchableOpacity onPress={handleDownloadPress}>
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