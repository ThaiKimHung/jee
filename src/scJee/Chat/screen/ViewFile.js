
import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList } from 'react-native'
import Utils from '../../../app/Utils';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { Height, nstyles, Width } from '../../../styles/styles';
import { GetAllFile } from '../../../apis/JeePlatform/API_JeeChat/apiJeeChat';
import { reText, sizes } from '../../../styles/size';
import moment from 'moment'
import ListEmptyLottie from '../../../components/NewComponents/ListEmptyLottie';
import { RootLang } from '../../../app/data/locales';
import IsLoading from '../../../components/IsLoading';
import UtilsApp from '../../../app/UtilsApp';
export class ViewFile extends Component {
    constructor(props) {
        super(props);
        this.refLoading = React.createRef()
        this.IdGroup = Utils.ngetParam(this.props.nthis, 'IdGroup') //item 
        this.state = {
            dataFile: []
        }
    }

    componentDidMount() {
        this.GetAllFile()
    }

    GetAllFile = async () => {
        this.refLoading.current.show()
        let res = await GetAllFile(this.IdGroup)
        if (res.status == 1) {
            this.setState({ dataFile: res.data })
            this.refLoading.current.hide()
        }
        else {
            this.setState({ dataFile: [] })
            this.refLoading.current.hide()
        }

    }
    _renderFile = ({ item, index }) => {
        let dateFile = moment(item.createdDate).format("DD/MM/YYYY")
        let dateCheck = index == 0 ? null : moment(this.state.dataFile[index - 1].createdDate).format("DD/MM/YYYY")
        let iconFile = UtilsApp._returnImageFile(item.path)
        return (
            <View key={index} style={{ marginTop: 10 }}>
                {index == 0 || dateCheck != dateFile ?
                    <Text style={{ fontSize: reText(16), fontWeight: 'bold', marginTop: 15, marginBottom: 10 }}>{dateFile}</Text> : null}
                <TouchableOpacity onPress={() => Utils.openUrl(item.path)} key={index} style={{ flexDirection: 'row' }}>
                    <Image source={iconFile} style={{ width: Width(8), height: Width(8) }} />
                    <Text numberOfLines={2} style={{ width: Width(84), alignSelf: 'center', marginLeft: Width(2), fontSize: reText(14), color: colors.black_70 }} > {item.filename}</Text>
                </TouchableOpacity>
                <View style={{ width: Width(84), height: 0.5, backgroundColor: colors.black_20_2, alignSelf: 'flex-end' }} />
            </View>
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
                    data={this.state.dataFile}
                    renderItem={this._renderFile}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={this.state.dataFile.length == 0 ? this.renderListEmpty : null}
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

export default Utils.connectRedux(ViewFile, mapStateToProps, true)
