import React, { Component } from 'react';
import { nstyles, nColors, paddingBotX, nwidth, nheight } from '../styles/styles'

import {
  Text, StyleSheet, View, StatusBar,
  TouchableOpacity, Image, Platform, Dimensions, BackHandler
} from 'react-native';

import Utils from '../app/Utils';
import { colors } from '../styles/color';
import VideoCus from '../Component_old/Video/VideoCus';
import { ImgComp } from '../images/ImagesComponent'

//styles màn hình popupMore
export const stPlayMedia = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },

  menuContain: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    right: 5,
    flexDirection: 'row'
  },
  controls: {
    backgroundColor: "transparent",
    borderRadius: 5,
    marginBottom: 5
  },
  trackingControls: {
    flex: 1
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 10,
    backgroundColor: nColors.main,
  },
  innerProgressRemaining: {
    height: 10,
    backgroundColor: '#4B4B4B',
  },
  texttime: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '500'
  },
  btnMedia: {
    marginHorizontal: 20,
    marginTop: 10
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: colors.black
  },
});
const stimeShow = 4;
let timeShow = stimeShow;
export default class PlayMedia extends Component {
  constructor(props) {
    super(props);
    this.isFullScreen = true;
    this.showClose = true;
    this.onSend = Utils.ngetParam(this, 'onSend', undefined);
    this.source = Utils.ngetParam(this, 'source', '');
    // Utils.nlog('sour:', this.source);
    this.state = {
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: false,
      isBuffering: false,
      isMenuOpen: true,
      isLandscape: false,
      //--
      volume: 1,
      muted: false,
      resizeMode: 'contain'
    };
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
    this.onRotate = this.onRotate.bind(this);
  }

  UNSAFE_componentWillMount() {
    var intervalId = setInterval(this.timer, 1000);
    this.setState({ intervalId: intervalId });
    Dimensions.addEventListener('change', this.onRotate);
  }

  componentWillUnmount() {
    // StatusBar.setHidden(false);
    clearInterval(this.state.intervalId);
    Dimensions.removeEventListener('change', this.onRotate)
    try {
      BackHandler.removeEventListener('hardwareBackPress', this._goback)
    }
    catch (error) {

    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this._goback);

  }

  _goback = async () => {
    Utils.goback(this, null)
    return true
  }

  onRotate = () => {
    this.setState({ isLandscape: nwidth() > nheight() });
  }

  timer = () => {
    if (this.onSend)
      return;
    if (timeShow == 0)
      return;
    timeShow--;
    if (timeShow == 0) {
      // StatusBar.setHidden(true);
      this.setState({ isMenuOpen: false });
    }
  }

  onPause = () => {
    if (this.state.isMenuOpen) {
      this.setState({ paused: !this.state.paused });
      timeShow = stimeShow;
    }
    else {
      // StatusBar.setHidden(false);
      this.setState({ isMenuOpen: true });
      timeShow = stimeShow;
    }
  }

  onLoad(data) {
    Utils.nlog(data);
    this.setState({ duration: data.duration });
  }

  onProgress(data) {
    this.setState({ currentTime: data.currentTime });
  }

  onBuffer({ isBuffering }: { isBuffering: boolean }) {
    this.setState({ isBuffering });
  }

  videoError(data) {
    Utils.nlog('error', data);
  }

  onFullScreen = () => {
    //this.setState({isFullScreen:!this.state.isFullScreen,});
    //this.player.presentFullscreenPlayer();
  }


  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  }

  //Format 2 chữ số. ex 9='09'
  format2ChuSo(num) {
    let snum = num.toString();
    if (snum.length == 1)
      return '0' + snum;
    return snum;
  }

  //Format number to time. ex: 90 = '01:30'
  formatTime(sec) {
    let house = parseInt(sec / 60 / 60);
    let minute = parseInt(sec / 60 % 60);
    minute = house != 0 ? this.format2ChuSo(minute) : minute.toString();
    minute = minute + ':';
    house = house != 0 ? (house.toString() + ':') : ''
    let second = this.format2ChuSo(parseInt(sec % 60));
    return house + minute + second;
  }

  //tua video đến vị trí time theo seconds 
  onSeek = (seconds) => () => {
    this.player.seek(this.state.currentTime + seconds);
    timeShow = stimeShow;
  }
  //-----------
  renderTimeline() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

    return (
      <View style={{ flex: 1, marginVertical: this.state.isLandscape ? 5 : 0 }}>
        <View style={[stPlayMedia.controls, nstyles.nrow]}>
          <View style={stPlayMedia.progress}>
            <View style={[stPlayMedia.innerProgressCompleted, { flex: flexCompleted }]} />
            <View style={[stPlayMedia.innerProgressRemaining, { flex: flexRemaining }]} />
          </View>
        </View>
        <View style={[nstyles.nrow, { justifyContent: 'space-between' }]}>
          <Text style={stPlayMedia.texttime}>{this.formatTime(this.state.currentTime)}</Text>
          <Text style={stPlayMedia.texttime}>-{this.formatTime(this.state.duration - this.state.currentTime)}</Text>
        </View>
      </View>
    )
  }

  renderMenuMedia() {
    return (
      <View style={[nstyles.nrow, {
        justifyContent: 'center', alignItems: 'center',
        marginTop: this.state.isLandscape ? -10 : 0, marginLeft: this.state.isLandscape ? -20 : 0
      }]}>
        <TouchableOpacity activeOpacity={0.9} style={stPlayMedia.btnMedia}
          onPress={this.onSeek(-10)}>
          <Image style={nstyles.nIcon20} source={ImgComp.icRewind} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} style={[stPlayMedia.btnMedia, { marginHorizontal: this.state.isLandscape ? 5 : 20 }]}
          onPress={this.onPause}>
          <Image style={[nstyles.nIcon24, { tintColor: 'white' }]} source={this.state.paused ? ImgComp.icPlay : ImgComp.icPause} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} style={stPlayMedia.btnMedia}
          onPress={this.onSeek(10)}>
          <Image style={nstyles.nIcon20} source={ImgComp.icForward} />
        </TouchableOpacity>
      </View>
    )
  }

  onSendVideo = () => {
    this.onSend();
    Utils.goback(this);
  }

  //-----------
  render() {
    let tempUri = this.source;
    if (Platform.OS == 'ios' && tempUri != '' && tempUri.includes('ph://')) { //fix lỗi ios mới ko run uri dc
      const appleId = tempUri.substring(5, 41);
      let ext = 'mov';
      tempUri = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
    }
    Utils.nlog("vide0----", tempUri);
    return (
      <View style={nstyles.ncontainerX}>
        {
          this.source == '' ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.black }}>
              <Text style={[nstyles.ntext, { color: colors.white }]}>Can not open video!</Text>
            </View> :
            <View style={{ flex: 1 }}>
              <TouchableOpacity activeOpacity={0.97} style={stPlayMedia.fullScreen}
                onPress={this.onPause}>
                <VideoCus
                  // source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                  source={{ uri: tempUri }}
                  //source={require('../datatest/mvtest.mp4')} 
                  //{{uri: urlTest}}   // Can be a URL or a local file.
                  ref={(ref) => {
                    this.player = ref
                  }}
                  onLoad={this.onLoad}
                  onBuffer={this.onBuffer}
                  onProgress={this.onProgress}
                  paused={this.state.paused}                                  // Store reference
                  style={stPlayMedia.backgroundVideo}
                  repeat={true}
                  resizeMode="contain"
                  // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                  // onEnd={this.onEnd}                      // Callback when playback finishes
                  onError={this.videoError}               // Callback when video cannot be loaded
                // onFullscreenPlayerWillPresent={this.fullScreenPlayerWillPresent} // Callback before fullscreen starts
                // onFullscreenPlayerDidPresent={this.fullScreenPlayerDidPresent}   // Callback after fullscreen started
                // onFullscreenPlayerWillDismiss={this.fullScreenPlayerWillDismiss} // Callback before fullscreen stops
                // onFullscreenPlayerDidDismiss={this.fullScreenPlayerDidDismiss}  // Callback after fullscreen stopped

                />
              </TouchableOpacity>
              {/* Menu controls media */}
              {
                !this.onSend ?
                  <View style={[stPlayMedia.menuContain, { bottom: this.state.isMenuOpen ? 5 : -100 }]}>
                    <View style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.grayLight, borderRadius: 20
                    }} />
                    {
                      this.state.isLandscape ?
                        <View style={[nstyles.nrow, {
                          width: '100%', padding: 15,
                          paddingVertical: 8
                        }]}>
                          {/* nút điều khiển media */}
                          {
                            this.renderMenuMedia()
                          }
                          {/* thanh time line */}
                          {
                            this.renderTimeline()
                          }
                        </View> :
                        <View style={[nstyles.ncol, {
                          width: '100%', padding: 15,
                          paddingVertical: 15
                        }]}>
                          {/* thanh time line */}
                          {
                            this.renderTimeline()
                          }
                          {/* nút điều khiển media */}
                          {
                            this.renderMenuMedia()
                          }
                        </View>
                    }
                  </View>
                  :
                  <TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 20 + paddingBotX }} //Nut chọn video đang record
                    onPress={this.onSendVideo}>
                    <Image source={ImgComp.icSendMsg} resizeMode='contain' style={nstyles.nAva60} />
                  </TouchableOpacity>
              }

            </View>
        }
        {/* btn close play video */}
        <View style={[nstyles.nrow, {
          position: 'absolute', top: 30, left: this.state.isMenuOpen ? 5 : -100,
          justifyContent: 'center', alignItems: 'center', margin: 15
        }]}>
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.grayLight, borderRadius: 10,
          }} />
          {
            this.showClose ?
              <TouchableOpacity style={{ padding: 10 }} activeOpacity={0.9}
                onPress={() => Utils.goback(this)}>
                <Image style={nstyles.nIcon24} source={ImgComp.icCloseWhite} />
              </TouchableOpacity> : null
          }

          {
            this.source == '' || this.isFullScreen ? null :
              <TouchableOpacity style={{ padding: 10 }} activeOpacity={0.9} style={{ marginLeft: 20 }}
                onPress={this.onFullScreen}>
                <Image style={nstyles.nIcon20} source={ImgComp.icFullScreen} />
              </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

