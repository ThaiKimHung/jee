import React, { Component } from 'react';
import Player from './Player';
import { BackHandler } from 'react-native';
import Utils from '../../app/Utils';
// import i18n from '../../Assets/I18n/i18n';
export default class MusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.url = Utils.ngetParam(this, "url", "")
        this.name = Utils.ngetParam(this, "name", "")
        this.artist = Utils.ngetParam(this, "artist", "")
        this.image = Utils.ngetParam(this, "image", "")
        this.isVideo = Utils.ngetParam(this, "isVideo", false)

    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        Utils.goback(this, null)

    };
    render() {
        const TRACKS = [
            {

                title: this.name ? this.name : "",
                artist: this.artist ? this.artist : 'Jee Work',
                albumArtUrl: this.image ? this.image : "https://shyamh.com/images/blog/music.jpg",
                audioUrl: this.url,
                isVideo: this.isVideo
            },

        ];
        return <Player tracks={TRACKS} this={this} />
    }
}

