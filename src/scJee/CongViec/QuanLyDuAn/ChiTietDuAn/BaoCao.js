import React, { Component } from 'react';
import { Text, View } from "react-native";
import Utils from '../../../../app/Utils';
class BaoCao extends Component {
    constructor(props) {
        super(props);
        this.nthis = this.props.nthis

        this.state = {
        };

    }

    async componentDidMount() {


    }



    render() {
        const { listBaiDang, showload, refreshing } = this.state;

        return (

            <View>
                <Text>bao cáo</Text>
            </View>

        );
    }
};


const mapStateToProps = state => ({
    lang: state.changeLanguage.language
});


export default Utils.connectRedux(BaoCao, mapStateToProps, true)


