import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
} from 'react-native';
// import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import Video from 'react-native-video';
import HeaderComStackV2 from '../HeaderComStackV2';
import { Images } from '../../images';
import { colors } from '../../styles';
import HeaderComStackV4Animated from '../HeaderComStackV4Animated';
import LottieView from 'lottie-react-native';
import { Height, Width } from '../../styles/styles';
import Utils from '../../app/Utils';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paused: false,
            totalLength: 1,
            currentPosition: 0,
            selectedTrack: 0,
            repeatOn: false,
            shuffleOn: false,
        };
    }


    async componentDidMount() {
    }

    setDuration(data) {
        this.setState({ totalLength: Math.floor(data.duration) });
    }

    setTime(data) {
        this.setState({ currentPosition: Math.floor(data.currentTime) });
    }

    seek(time) {
        time = Math.round(time);
        this.refs.audioElement && this.refs.audioElement.seek(time);
        this.setState({
            currentPosition: time,
            paused: false,
        });
    }

    onBack() {
        if (this.state.currentPosition < 10 && this.state.selectedTrack > 0) {
            this.refs.audioElement && this.refs.audioElement.seek(0);
            this.setState({ isChanging: true });
            setTimeout(() => this.setState({
                currentPosition: 0,
                paused: false,
                totalLength: 1,
                isChanging: false,
                selectedTrack: this.state.selectedTrack - 1,
            }), 0);
        } else {
            this.refs.audioElement.seek(0);
            this.setState({
                currentPosition: 0,
            });
        }
    }

    onForward() {
        if (this.state.selectedTrack < this.props.tracks.length - 1) {
            this.refs.audioElement && this.refs.audioElement.seek(0);
            this.setState({ isChanging: true });
            setTimeout(() => this.setState({
                currentPosition: 0,
                totalLength: 1,
                paused: false,
                isChanging: false,
                selectedTrack: this.state.selectedTrack + 1,
            }), 0);
        }
    }



    render() {
        const track = this.props.tracks[this.state.selectedTrack];
        var isVideo = track.isVideo
        const video = this.state.isChanging ? null : (
            <Video source={{ uri: track.audioUrl }} // Can be a URL or a local file.
                ref="audioElement"
                paused={this.state.paused}               // Pauses playback entirely.
                resizeMode="contain"        // Fill the whole screen at aspect ratio.
                repeat={true}                // Repeat forever.
                onLoadStart={(error) => Utils.nlog(error)} // Callback when video starts to load
                onLoad={this.setDuration.bind(this)}    // Callback when video loads
                onProgress={this.setTime.bind(this)}    // Callback every ~250ms with currentTime
                onEnd={this.onEnd}           // Callback when playback finishes
                onError={(error) => Utils.nlog(error)}   // Callback when video cannot be loaded
                style={{ height: isVideo ? Height(60) : 0, width: isVideo ? "100%" : 0 }} />
        );

        return (
            <View style={styles.container}>
                {/* <StatusBar hidden={true} /> */}
                <HeaderComStackV4Animated
                    nthis={this}
                    title={track.title}
                    iconLeft={Images.ImageJee.icArrowNext}
                    onPressLeft={() => {
                        Utils.goback(this.props.this, null)
                    }}

                    styBorder={{
                        borderBottomColor: colors.black_20_2,
                        borderBottomWidth: 0.3
                    }}
                />

                <View style={{ marginTop: Width(2) }}>


                    {isVideo ? video :
                        <>
                            <AlbumArt url={track.albumArtUrl} />
                            {/* <LottieView
                                style={{ height: Width(13), marginTop: 10 }} source={require('../../images/lottieJee/music.json')}
                                ref={ref => this.Lottie = ref}
                                autoPlay
                                loop /> */}
                        </>
                    }
                    <SeekBar
                        onSeek={this.seek.bind(this)}
                        trackLength={this.state.totalLength}
                        onSlidingStart={() => this.setState({ paused: true })}
                        currentPosition={this.state.currentPosition}
                    />
                    <Controls
                        onPressRepeat={() => this.setState({ repeatOn: !this.state.repeatOn })}
                        repeatOn={this.state.repeatOn}
                        shuffleOn={this.state.shuffleOn}
                        forwardDisabled={this.state.selectedTrack === this.props.tracks.length - 1}
                        onPressShuffle={() => this.setState({ shuffleOn: !this.state.shuffleOn })}
                        // onPressPlay={() => this.setState({ paused: false }, () => {
                        //     this.Lottie.play()
                        // })}
                        // onPressPause={() => this.setState({ paused: true }, () => {
                        //     this.Lottie.pause()
                        // })}
                        onPressPlay={() => this.setState({ paused: false })}
                        onPressPause={() => this.setState({ paused: true })}
                        onBack={this.onBack.bind(this)}
                        onForward={this.onForward.bind(this)}
                        paused={this.state.paused} />
                    {isVideo ? null :
                        video
                    }

                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

};