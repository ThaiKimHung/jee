import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Images } from '../images';
class HeaderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <View style={{ paddingVertical: 5, width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                <Image
                    source={Images.icTopModal}
                    // style={{ height: 12, width: 50 }}
                    resizeMode={'cover'}>
                </Image>
            </View>
        );
    }
}
export default HeaderModal;
