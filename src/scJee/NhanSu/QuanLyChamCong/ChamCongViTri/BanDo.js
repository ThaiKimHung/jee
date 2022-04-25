import React, { Component } from 'react';
import {
    Image,
    Keyboard, StyleSheet, Text,
    TouchableOpacity, View, ActivityIndicator, TextInput, ScrollView
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, {
    Marker,
    ProviderPropType, PROVIDER_GOOGLE
} from 'react-native-maps';
import { getAddressGG } from '../../../../apis/apiQLCC';
import { appConfig } from '../../../../app/Config';
import { RootLang } from '../../../../app/data/locales';
import Utils from '../../../../app/Utils';
import HeaderComStack from '../../../../components/HeaderComStack';
import { Images } from '../../../../images';
import { colors, nstyles, sizes } from '../../../../styles';
import apiViettelMaps from '../../../../apis/apiViettelMaps';
import { reText } from '../../../../styles/size';


const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

const ASPECT_RATIO = nstyles.nwidth / nstyles.nheight;
let LATITUDE_DELTA = 0.00922;
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let id = 0;
const Latitude = 10.762622;
const Longitude = 106.660172;

function randomColor() {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, 0)}`;
}
export default class BanDo_Root extends Component {

    constructor(props) {
        super(props);
        // this.callbackDataMapsMode0 = Utils.ngetParam(this, 'callbackDataMapsMode0');
        this.callbackDataMapsMode1 = Utils.ngetParam(this, 'callbackDataMapsMode1');

        this.mode = Utils.ngetParam(this, "mode", 1)
        this.state = {
            region: {
                latitude: Latitude,
                longitude: Longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            diaDiem: '',
            keyboard: false,
            search: false,
            markers: [],
            listmarkers: [],
            //
            dataMap: [],
            input: '',
            isLoad: false,
            isListDiaChi: false

        };
        this.checkAutoComplete = true;

    }
    componentDidMount() {
        let region = {
            latitude: Latitude,
            longitude: Longitude,
        }
        appConfig.isServiceViettel ? this.onPressFindLocationViettel(region) : this.onPressFindLocation(region)
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = async () => {
        await this.setState({ keyboard: true })
    }

    _keyboardDidHide = async () => {
        await this.setState({ keyboard: false })
    }

    onMapPress = async (e) => {
        // if (this.mode == 2) {
        //     if (this.state.markers.length > 3) {
        //         Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.banchonvuotqua4diem)
        //     }
        //     if (this.state.markers.length < 4) {
        //         this.setState({
        //             markers: [
        //                 ...this.state.markers,
        //                 {
        //                     coordinate: e.nativeEvent.coordinate,
        //                     key: id++,
        //                     color: randomColor(),
        //                 },
        //             ],
        //         });
        //         this.setState({
        //             listmarkers: this.state.listmarkers.concat(e.nativeEvent.coordinate)
        //         })
        //     }

        // }
        if (this.mode == 1) {
            this.setState({
                markers: [
                    {
                        coordinate: e.nativeEvent.coordinate,
                    },
                ],
            });
            let region = {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
            }
            await this.setState({ region: region })
            appConfig.isServiceViettel ? this.onPressFindLocationViettel(region) : this.onPressFindLocation(region)
        }
    }


    onPressFindLocation = async (region) => {
        let {
            latitude,
            longitude
        } = region
        let res = await getAddressGG(latitude, longitude);

        var { results = [] } = res;
        let display_name = '';
        if (results[1]) {
            display_name = results[1]?.formatted_address;
        }
        this.setState({ diaDiem: display_name });
    }

    //Viettel
    onPressFindLocationViettel = async (region) => {
        let {
            latitude,
            longitude
        } = region
        let res = await apiViettelMaps.getAddressViettel(latitude, longitude)
        if (res) {
            this.setState({ diaDiem: res.full_address });
        }
    }



    chonViTri = async () => {
        if (appConfig.isServiceViettel) {
            let res = await apiViettelMaps.getAddressViettel(this.state.region.latitude, this.state.region.longitude)
            if (res) {
                if (this.mode == 1) {
                    this.callbackDataMapsMode1(res.full_address, {
                        latitude: this.state.region.latitude,
                        longitude: this.state.region.longitude
                    }, Utils.goback(this));
                }
            }
        }
        else
            if (this.mode == 1) {
                this.callbackDataMapsMode1(this.state.diaDiem, {
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude
                }, Utils.goback(this));
            }
        // if (this.mode == 2) {
        //     if (this.state.markers.length < 4) {
        //         Utils.showMsgBoxOK(this, RootLang.lang.thongbaochung.thongbao, RootLang.lang.scQuanLyChamCong.banchuachondu4diem)
        //     }
        //     else
        //         this.callbackDataMapsMode0(this.state.listmarkers, this.state.diaDiem, Utils.goback(this));

        // }
    }


    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _selectAdd = (data, details = null) => {
        Keyboard.dismiss()
        const { lat, lng } = details.geometry.location;
        const region = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };

        this.Map.animateCamera({
            center: {
                latitude: lat,
                longitude: lng,
            }, pitch: 2, heading: 20, altitude: 200, zoom: 40
        }, 10000)
        // this.Map.setCamera(Camera)
        this.setState({
            region: region,
            diaDiem: data.description
            // }, () => {
            //     setTimeout(() => {
            //         this.checkAutoComplete = true;
            //     }, 200);
        });
        Utils.nlog('details', details, data.description, data)
    }

    getDetails = async (item, index) => {
        Keyboard.dismiss()
        this.setState({ isListDiaChi: false })
        let res = await apiViettelMaps.getDetailsAddress(item.placeId)
        if (res && res.data) {
            const { coordinates } = res.data.geometry
            const { full_address } = res.data.properties
            if (coordinates && full_address) {
                // Utils.nlog("VI TRI----properties:", full_address)
                let region = {
                    latitude: coordinates[1],
                    longitude: coordinates[0],
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                };
                this.Map.animateCamera({
                    center: {
                        latitude: coordinates[1],
                        longitude: coordinates[0],
                    }, pitch: 2, heading: 20, altitude: 200, zoom: 40
                }, 10000)
                this.setState({
                    region: region,
                    diaDiem: full_address
                }, () => {
                    setTimeout(() => {
                        this.checkAutoComplete = true;
                    }, 200);
                });
            }
        }
    }

    ItemAddress = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => this.getDetails(item, index)}
                style={{ marginBottom: 5 }} key={item.placeId}>
                <View style={[nstyles.nstyles.shadow, { backgroundColor: colors.white, padding: 5, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }]} >
                    <Image source={Images.icAddress} style={[nstyles.nstyles.nIcon20, { tintColor: colors.blueColor }]} resizeMode='contain' />
                    <Text style={{ fontSize: reText(13), color: 'gray', paddingHorizontal: 10, textAlign: 'justify', flex: 1 }}>{item.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    getListAddress = async () => {
        if (this.state.input) {
            this.setState({ isLoad: true })
            let res = await apiViettelMaps.getListAddressViettel(this.state.input)
            // Utils.nlog('[LOG data list address', res)
            if (res && res.data && res.data.length != 0) {
                this.setState({ dataMap: res.data, isLoad: false, isListDiaChi: true })
            } else {
                this.setState({ dataMap: [], isLoad: false, isListDiaChi: true })
            }
        } else {
            this.setState({ dataMap: [], isListDiaChi: true })
        }
    }



    render() {
        let {
            region,
            diaDiem,
            keyboard,
            search, listmarkers
        } = this.state;

        let {
            latitude,
            longitude
        } = region;

        let txtDiaDiem = diaDiem ? diaDiem : `(${latitude},${longitude})`
        let txtTitle = this.state.markers.length > 0 ? RootLang.lang.scQuanLyChamCong.vitri4gocduocdanhdau : RootLang.lang.scQuanLyChamCong.chonvitri4goc
        return (
            <View style={nstyles.nstyles.ncontainer}>
                {/* Header  */}
                <HeaderComStack
                    Screen={true}
                    iconRight={Images.icSearch}
                    nthis={this}
                    onPressRight={() => this.setState({ search: !search }, search == false ? Keyboard.dismiss() : null)}
                    styIconRight={{ width: 20, height: 20, tintColor: colors.black }}
                    title={RootLang.lang.scDangKyHanet.bando} />

                {/* Body */}
                <View style={nstyles.nstyles.nbody}>
                    {search == true ?
                        appConfig.isServiceViettel ?
                            <View style={{ zIndex: 3, flex: keyboard == true ? 0.4 : 0 }}>
                                <TextInput
                                    onChangeText={text => this.setState({ input: text }, this.getListAddress)}
                                    value={this.state.input}
                                    style={[nstyles.nstyles.shadow, { padding: 10, backgroundColor: colors.white, margin: 10, borderRadius: 5, }]}
                                    placeholder={'Nhập ví trí cần tìm kiếm...'}
                                />
                                {
                                    this.state.isLoad ?
                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start', margin: 10 }}>
                                            <ActivityIndicator size={'small'} color={colors.blueColor} />
                                            <Text style={{ fontSize: reText(12), color: colors.blueColor, paddingLeft: 10 }}>{'Đang tìm kiếm địa chỉ...'}</Text>
                                        </View>
                                        : null
                                }
                                {this.state.isListDiaChi ?
                                    <ScrollView style={{ padding: 10 }}>
                                        {
                                            this.state.dataMap.length > 0 ? this.state.dataMap.map((item, index) => {
                                                return this.ItemAddress(item, index)
                                            })
                                                : <Text style={{ textAlign: 'center', fontSize: reText(12), color: colors.blueColor, }}>{RootLang.lang.thongbaochung.khongcodulieu}...</Text>
                                        }
                                    </ScrollView> : null}
                                {/* <IsLoadind ref={this.refLoad} /> */}
                            </View>
                            :
                            <View style={{ zIndex: 3, flex: keyboard == true ? 0.4 : 0 }}>
                                <GooglePlacesAutocomplete
                                    placeholder={RootLang.lang.scQuanLyChamCong.timkiem}
                                    minLength={2} // minimum length of text to search
                                    autoFocus={true}
                                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                    listViewDisplayed='auto'    // true/false/undefined
                                    fetchDetails={true}
                                    // renderDescription={row => row.description} // custom description render
                                    onPress={this._selectAdd}
                                    getDefaultValue={() => ''}

                                    query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: appConfig.apiKeyGoogle,
                                        language: 'vi', // language of the results
                                        types: 'address' // default: 'geocode'
                                    }}

                                    styles={{
                                        textInputContainer: {
                                            width: '100%'
                                        },
                                        textInput: {
                                            color: colors.black_80
                                        },
                                        description: {
                                            fontWeight: 'bold'
                                        },
                                        predefinedPlacesDescription: {
                                            color: '#1faadb'
                                        },
                                        container: { backgroundColor: 'rgba(255,255,255,0.6)' },
                                        poweredContainer: { backgroundColor: 'transparent' },
                                    }}

                                    // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                                    // currentLocationLabel="Vị trí hiện tại"
                                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{
                                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                    }}
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        type: 'cafe'
                                    }}

                                    GooglePlacesDetailsQuery={{
                                        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                        fields: 'geometry',
                                    }}

                                    filterReverseGeocodingByTypes={['street_address']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                    // predefinedPlaces={[homePlace, workPlace]}

                                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                // renderLeftButton={() => <Image source={Images.icCamera} />}

                                />
                            </View> : null}
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        showsUserLocation={true}
                        ref={ref => this.Map = ref}
                        initialRegion={this.state.region}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        toolbarEnabled={false}
                        onPress={e => this.onMapPress(e)}
                    >


                        {this.state.markers.length > 0 ?
                            <>
                                {this.state.markers.map(marker => (
                                    <Marker
                                        key={marker.key}
                                        coordinate={marker.coordinate}

                                    >
                                        <Image source={Images.icPin} style={nstyles.nstyles.nIcon40} />
                                    </Marker>
                                ))}
                            </> :
                            this.mode == 1 ?
                                <>
                                    <Marker
                                        coordinate={this.state.region}
                                    >
                                        <Image source={Images.icPin} style={nstyles.nstyles.nIcon40} />

                                    </Marker>
                                </> : null

                        }

                    </MapView>

                    <View style={{
                        position: 'absolute', left: 0, right: 0,
                        bottom: 0, backgroundColor: colors.white,
                        paddingVertical: 20, borderTopLeftRadius: 10,
                        borderTopRightRadius: 10, paddingHorizontal: 13,
                        zIndex: 3
                    }}>

                        <View style={nstyles.nstyles.nrow}>
                            {/* {this.mode == 1 ? */}
                            <View style={{ flex: 1, marginLeft: 4 }}>
                                <Text style={[{
                                    color: colors.colorGrayText,
                                    fontSize: sizes.reText(14),
                                }]}>
                                    {RootLang.lang.scQuanLyChamCong.vitridanhdau}
                                </Text>

                                <Text style={{
                                    marginTop: 4,
                                    color: colors.black, fontWeight: 'bold',
                                    fontSize: sizes.reText(14),
                                }}>
                                    {txtDiaDiem}
                                </Text>
                                <TouchableOpacity
                                    onPress={this.chonViTri}>
                                    <Text style={[{
                                        textAlign: 'right',
                                        marginTop: 30,
                                        marginBottom: 30,
                                        color: colors.black, fontSize: sizes.reText(14),
                                    }]}>
                                        {RootLang.lang.scQuanLyChamCong.chamdechon}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {/* :
                                <View style={{ flex: 1, marginLeft: 4 }}>

                                    <Text style={[{
                                        color: colors.colorGrayText,
                                        fontSize: sizes.reText(14),
                                    }]}>
                                        {txtTitle}
                                    </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ marginTop: 5 }}>
                                            <Text style={[{
                                                color: colors.colorGrayText,
                                                marginTop: 6,
                                                fontSize: sizes.reText(12),
                                            }]}>
                                                {RootLang.lang.scQuanLyChamCong.toadoTB} :{this.state.listmarkers[0] ? this.state.listmarkers[0].latitude + "-" + this.state.listmarkers[0].longitude : null}
                                            </Text>
                                            <Text style={[{
                                                color: colors.colorGrayText,
                                                marginTop: 6,
                                                fontSize: sizes.reText(12),
                                            }]}>
                                                {RootLang.lang.scQuanLyChamCong.toadoDB} :{this.state.listmarkers[1] ? this.state.listmarkers[1].latitude + "-" + this.state.listmarkers[1].longitude : null}
                                            </Text>
                                            <Text style={[{
                                                color: colors.colorGrayText,
                                                marginTop: 6,
                                                fontSize: sizes.reText(12),
                                            }]}>
                                                {RootLang.lang.scQuanLyChamCong.toadoTN}:{this.state.listmarkers[2] ? this.state.listmarkers[2].latitude + "-" + this.state.listmarkers[2].longitude : null}
                                            </Text>
                                            <Text style={[{
                                                color: colors.colorGrayText,
                                                marginTop: 6,
                                                fontSize: sizes.reText(12),
                                            }]}>
                                                {RootLang.lang.scQuanLyChamCong.toadoDN}:{this.state.listmarkers[3] ? this.state.listmarkers[3].latitude + "-" + this.state.listmarkers[3].longitude : null}
                                            </Text>
                                        </View>
                                        {this.state.markers.map(marker => {
                                            <View>
                                                <Text>{marker.coordinate.latitude} - {marker.coordinate.longitude}</Text>
                                            </View>

                                        })}
                                    </View>


                                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 30 }}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ markers: [], listmarkers: [] })}>
                                            <Text style={[{
                                                textAlign: 'right',
                                                marginTop: 30,
                                                marginBottom: 30,
                                                color: colors.black, fontSize: sizes.reText(14),
                                            }]}>
                                                {RootLang.lang.scQuanLyChamCong.chamdexoa}
                                            </Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity
                                            onPress={this.chonViTri}>
                                            <Text style={[{
                                                textAlign: 'right',
                                                marginTop: 30,
                                                marginBottom: 30,
                                                color: colors.black, fontSize: sizes.reText(14),
                                            }]}>
                                                {RootLang.lang.scQuanLyChamCong.chamdechon}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>} */}


                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

BanDo_Root.propTypes = {
    provider: ProviderPropType,
};