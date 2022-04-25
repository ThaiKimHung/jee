import React, { Component } from 'react';
import { Dimensions, Image, PixelRatio, Text, View } from 'react-native';
import Utils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles';
import { nstyles } from '../styles/styles';

// import { nstyles } from '../styles';
class NotificationBell extends Component {
    constructor(props) {
        super(props)
        this.state = {
            TongSoLuong: this.props.notification
        }
        timer = ''
    }

    componentDidMount() {
        // this.props.show_A();
    }

    render() {
        return (
            <View style={[nstyles.nIcon24,]}>
                <Image
                    style={{ height: 26 }}
                    source={this.props.notification > 0 ? Images.icNotificationBellA : Images.icNotificationBell}
                    resizeMode={'cover'}></Image>
                {this.props.notification ?
                    <View style={[nstyles.nIcon15, {
                        borderRadius: 10, backgroundColor: colors.coral,
                        position: "absolute", top: -3, right: -3,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }]}>
                        <View>
                            <Text style={{

                                color: "#fff",
                                fontSize: PixelRatio.get() * 4,
                                fontWeight: 'bold'
                            }}>{this.props.notification <= 9 ? this.props.notification : '9+'}</Text>
                        </View>
                    </View>
                    : null}
            </View>
        )
    }
}
const mapStateToProps = state => ({
    notification: state.Notifi.notification
});
export default Utils.connectRedux(NotificationBell, mapStateToProps, true)