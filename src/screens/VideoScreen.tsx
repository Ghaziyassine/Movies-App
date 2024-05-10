import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video, { VideoProperties } from 'react-native-video';

interface Props {}

interface State {
  player?: VideoProperties;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  onBuffer = () => {
    // Your buffering logic here
  };

  videoError = () => {
    // Your video error handling logic here
  };

  render() {
    return (
      <View style={styles.container}>
        <Video
          source={require('./video.mp4')} // Assuming video.mp4 is in your project
          ref={(ref) => {
            this.setState({ player: ref });
          }}
          onBuffer={this.onBuffer}
          onError={this.videoError}
          style={styles.backgroundVideo}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
