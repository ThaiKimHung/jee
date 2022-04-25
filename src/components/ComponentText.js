import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { RootLang } from '../app/data/locales';
import Utils from '../app/Utils';
import { colors } from '../styles';

class ComponentText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onf: false
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return { onf: nextProps.onF }
    }
    render() {
        var { onf = false } = this.state
        var { text } = this.props
        //{RootLang.lang.bottomTitle.`${text}`}
        return (
            <View style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center', flex: 0.5, flexDirection: 'row' }}>
                <Text  style={[this.props.style, { color: onf == true ? colors.colorTextGreen : colors.colo, alignSelf: 'center' }]}>{RootLang.lang.bottomTitle[text]} </Text>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});
export default Utils.connectRedux(ComponentText, mapStateToProps, true)
