
import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import Utils from '../../../app/Utils';
import HeaderComStackV2 from '../../../components/HeaderComStackV2';
import { Images } from '../../../images';
import { colors } from '../../../styles';
import { Height, nstyles, Width } from '../../../styles/styles';
import { SceneMap, TabView } from 'react-native-tab-view';
import { ViewImage } from './ViewImage';
import { ViewFile } from './ViewFile';
import { sizes } from '../../../styles/size';



export class ImageFile extends Component {
    constructor(props) {
        super(props);
        this.IdGroup = Utils.ngetParam(this, 'IdGroup') //item 
        this.state = {
            index: 0,
            routes: [
                { key: 'keyimage', title: 'Hình ảnh' },
                { key: 'keyfile', title: 'File' },
            ],
        }
    }

    _goback = () => {
        Utils.goback(this)
    }

    _renderScene = SceneMap({
        keyimage: () => <ViewImage nthis={this} />,
        keyfile: () => <ViewFile nthis={this} />,
    });

    _renderTabBar = props => {
        var { index = 0 } = props.navigationState
        return (<View style={[nstyles.shadowTabTop, {
            height: Height(6), flexDirection: 'row',
            width: Width(100),
        }]}>
            {
                props.navigationState.routes.map((x, i) => {
                    return (
                        <TouchableOpacity
                            key={i.toString()}
                            onPress={() => { this.setState({ index: i }) }}
                            style={{
                                flex: 1,
                                backgroundColor: colors.white,
                                flexDirection: 'row',
                                // height: Height(6),
                                borderBottomWidth: i == index ? 2 : 0,
                                borderColor: i == index ? '#0E72D8' : colors.white,
                                width: Width(100)

                            }}>
                            <View style={{ flex: 1, flexDirection: 'row', width: Width(100) }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: Width(25), maxWidth: Width(30) }}>
                                    {i == index ? (
                                        <Text style={{ fontWeight: 'bold', fontSize: sizes.sText14, color: '#0E72D8', textAlign: 'center', }}>{x.title}</Text>

                                    ) : (
                                            <Text style={{ fontWeight: 'bold', fontSize: sizes.sText12, textAlign: 'center', }}>{x.title}</Text>
                                        )}
                                    <View style={{ height: 2, backgroundColor: i == index ? '#0E72D8' : '#fff', }}></View>
                                </View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
        </View >)
    }


    render() {
        return (
            <View style={styles.container}>
                <HeaderComStackV2
                    nthis={this}
                    title={'Kho lưu trữ'}
                    iconLeft={Images.ImageJee.icBack}
                    onPressLeft={this._goback}
                />
                <TabView
                    lazy
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
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

export default Utils.connectRedux(ImageFile, mapStateToProps, true)
