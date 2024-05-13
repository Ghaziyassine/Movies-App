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
    const fileUri = 'https://rr3---sn-p5h-jhoe7.googlevideo.com/videoplayback?expire=1715615816&ei=6ONBZuTAJvT_xN8Pz7mDqAI&ip=160.178.80.61&id=o-AKEJKiBAxzNGHnUoWi3KA269Qm02-Rr-zsy0dZtL2kpq&itag=133&aitags=133%2C160&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=VQ&mm=31%2C29&mn=sn-p5h-jhoe7%2Csn-apn7en7e&ms=au%2Crdu&mv=m&mvi=3&pl=22&initcwndbps=765000&siu=1&bui=AWRWj2S4DFBTCD5EoXcliI7LfVFqnBGXcIxWZ7kkeqfacCfr6rG0s5az1zA6LCF1MNZh9Ss3kw&spc=UWF9f-0NDx-6AZxI5-v9g39a8P5etgqgfuKMYdUIZ7vU7y2sVv_-M7Bz45vVhfZp-Vfx&vprv=1&svpuc=1&mime=video%2Fmp4&ns=Uzmw0LTOwYeVVbj8eoxU3wgQ&rqh=1&gir=yes&clen=904881&dur=40.206&lmt=1709953666507387&mt=1715593725&fvip=4&keepalive=yes&c=WEB&sefc=1&txp=8219224&n=9Tu7uoQbCir36w&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cxpc%2Csiu%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgL42HvWkIvSLo_e-OL22IBMe3MjBss4xSs7InEq9kdOICIAfqwBeHUzzmO6hLl_C-ksciGJ4mdQ_xrPOxm7iXJMjK&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AHWaYeowRQIhAILpVT-6h-gkt4eoZQQcIxTelP5i1sDFCaHxOIn_ctE0AiBNW_nPVtP2k-nh7f6WeXgAhkrPP06TTWaMp6u6wGa-TQ%3D%3D&pot=Ih8UAhQDckPmEiUzJzsgNy02LTctMiM7LDIjMi0wIn5o'; // your video URL here
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