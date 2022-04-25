
import React, { Component } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, FlatList, Text } from 'react-native'
import { GetImage } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import { RootLang } from '../../../app/data/locales';
import Utils from '../../../app/Utils';
import UtilsApp from '../../../app/UtilsApp';
import IsLoading from '../../../components/IsLoading';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { sizes } from '../../../styles/size';
import { Width } from '../../../styles/styles';
import ImageCus from '../../../components/NewComponents/ImageCus'
export class ViewImage extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.IdGroup = Utils.ngetParam(this.props.nthis, 'IdGroup') //item 
        this.state = {
            dataImage: []
        }
    }

    componentDidMount() {
        this.GetImage()
    }

    GetImage = async () => {
        this.refLoading.current.show()
        let res = await GetImage(this.IdGroup)
        if (res.status == 1) {
            this.setState({ dataImage: res.data })
            this.refLoading.current.hide()
        }
        else {
            this.setState({ dataImage: [] })
            this.refLoading.current.hide()
        }

    }
    _renderImage = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => UtilsApp.showImageZoomViewer(this.props.nthis, encodeURI(item.hinhanh))} key={index} style={{ width: Width(30), height: Width(30), marginRight: Width(2), marginTop: 5, backgroundColor: colors.black_10 }}>
                <ImageCus
                    defaultSourceCus={Images.icListEmpty}
                    source={{ uri: item.hinhanh }}
                    style={{ width: Width(30), height: Width(30), backgroundColor: colors.black_10 }}
                    resizeMode='cover'
                />
            </TouchableOpacity>
        )
    }
    renderListEmpty = () => {
        return (
            <View style={{ flex: 1, marginTop: "50%", alignItems: 'center' }}>
                <Image source={Images.icListEmpty} style={{ width: sizes.nImgSize200, height: sizes.nImgSize200 }} resizeMode={'cover'} />
                <Text style={{ fontSize: sizes.sText16, color: colors.brownGreyTwo }}>{RootLang.lang.thongbaochung.khongcodulieu}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={{ paddingHorizontal: Width(3) }}
                    // horizontal={true}
                    numColumns={3}
                    data={this.state.dataImage}
                    renderItem={this._renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={this.state.dataImage.length == 0 ? this.renderListEmpty : null}
                />
                <IsLoading ref={this.refLoading} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: colors.white
    },
})


const mapStateToProps = state => ({
    lang: state.changeLanguage.language,
});

export default Utils.connectRedux(ViewImage, mapStateToProps, true)
