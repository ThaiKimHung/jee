import React, { Component } from 'react';
import { View } from 'react-native';
import SystemSetting from 'react-native-system-setting'
import RNShake from 'react-native-shake';
import NetworkLogger from 'react-native-network-logger';
import { Height, Width } from '../src/styles/styles';


class FunctionHiden extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0,
            bright: 0,
            bluetooth: 0,
        }
    }

    componentWillMount() {

    }

    _checkShake() {
        RNShake.addEventListener('ShakeEvent', async () => {
            await SystemSetting.getVolume().then(async (volumeSetting) => {
                this.setState({ volume: volumeSetting })
            });
            await SystemSetting.getBrightness().then(async (brightSetting) => {
                this.setState({ bright: brightSetting })
            });

        });

    }


    render() {
        const { volume, bright } = this.state
        this._checkShake()
        let showlog = volume == 1 && bright == 1 ? true : false
        return (
            <View style={{ position: showlog ? "absolute" : 'relative', height: showlog ? Height(100) : null, width: showlog ? Width(100) : null }}>
                {showlog ? <View style={{ position: showlog ? "absolute" : 'relative', height: showlog ? Height(100) : null, width: showlog ? Width(100) : null, marginTop: 20 }}>
                    <NetworkLogger theme="dark" />
                </View> : null

                }
            </View>
        )
    }
}


export default FunctionHiden


