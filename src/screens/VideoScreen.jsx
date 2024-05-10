import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { ScreenOrientation } from 'expo-screen-orientation';

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    return () => {
      videoRef.current && videoRef.current.unloadAsync(); // Cleanup video when component unmounts
    };
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullScreen = async () => {
    if (!isFullScreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      await ScreenOrientation.unlockAsync();
    }
    setIsFullScreen(!isFullScreen);
  };

  const videoStyle = isFullScreen ? styles.videoFullScreen : styles.video;

  return (
    <View style={styles.contentContainer}>
      <Video
        ref={videoRef}
        source={{ uri: videoSource }}
        style={videoStyle}
        resizeMode="contain"
        shouldPlay={isPlaying}
      />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={togglePlayPause}
        />
        <Button
          title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          onPress={toggleFullScreen}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 350,
    height: 275,
  },
  videoFullScreen: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  controlsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
