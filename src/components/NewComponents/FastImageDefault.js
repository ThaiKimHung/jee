import React, { Component } from 'react';
import { Image, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

export default class FastImagePlaceholder extends Component {
    constructor(props) {
        super(props);
        this.state = { loaded: false };
    }


    // onLoad = () => {
    //     this.setState({ loaded: true });
    // }

    render() {
        var { loaded } = this.state
        return (
            <View>
                <View>
                    <Image source={this.props.source.uri ? this.props.source : this.props.placeholder} resizeMode={this.props.resizeMode ? this.props.resizeMode : "contain"} style={this.props.style} />
                </View>
                {/* FastImage k work ở android tạm thời dùng IMAGE */}
                {/* {
                    (!loaded) && (
                        <View>
                            <Image source={this.props.placeholder} resizeMode={this.props.resizeMode ? this.props.resizeMode : "contain"} style={this.props.style} />
                        </View>
                    )
                }

                <FastImage
                    source={this.props.source}
                    style={[this.props.style, loaded ? {} : { width: 0, height: 0 }]}
                    resizeMode={this.props.resizeMode}
                    onLoad={this.onLoad}
                /> */}

            </View>
        );
    }
}

FastImagePlaceholder.defaultProps = {
    resizeMode: 'contain'
};

FastImagePlaceholder.propTypes = {
    placeholder: PropTypes.any,
    source: PropTypes.any,
    style: ViewPropTypes.style,
    resizeMode: PropTypes.any
};