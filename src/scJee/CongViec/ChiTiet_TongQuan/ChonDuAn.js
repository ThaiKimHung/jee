// import React, { Component, createRef } from 'react';
// import {
//     FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View
// } from "react-native";
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Utils from '../../../app/Utils';
// import HeaderComStackV2 from '../../../components/HeaderComStackV2';
// import { Images } from '../../../images';
// import { colors } from '../../../styles';
// import { sizes } from '../../../styles/size';
// import { Height, nstyles, Width } from '../../../styles/styles';
// const actionSheetRef = createRef();


// const loai = [
//     { id: '1', ten: 'ho van luc', noidung: 'Layout home ', trangthai: 'Mới tạo', comment: 12 },
//     { id: '2', ten: 'ho van luc', noidung: 'Layout home ', trangthai: 'Đang làm', comment: 0 },
//     { id: '3', ten: 'ho van luc', noidung: 'Layout home ', trangthai: 'Kiểm tra', comment: 0 },
//     { id: '4', ten: 'ho van luc', noidung: 'Layout home ', trangthai: 'Hoàn thành', comment: 0 },
// ]
// class ChonDuAn extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             noidung_Tk: '',
//         };

//     }

//     componentDidMount = async () => {


//     }


//     _renderItem = ({ item, index }) => {
//         return (
//             <View style={{
//                 backgroundColor: colors.white, flex: 1, height: Height(7), justifyContent: 'space-between', paddingHorizontal: 10,
//                 flexDirection: 'row', borderBottomWidth: 0.3, borderColor: '#D1D1D1'
//             }}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', }}>
//                     <View style={{ backgroundColor: item.trangthai == 'Mới tạo' ? '#0E72D8' : item.trangthai == 'Đang làm' ? '#EE9D01' : item.trangthai == 'Kiểm tra' ? '#EE2D41' : '#0BB7AF', height: 15, width: 15 }}></View>
//                     <Text style={{ fontSize: sizes.sText14, fontWeight: 'bold', paddingLeft: 10 }}>{item.noidung}</Text>

//                 </View>
//             </View>
//         );
//     };

//     render() {
//         const { noidung_Tk } = this.state;
//         return (
//             <View style={[nstyles.ncontainer, { backgroundColor: '#E4E6EB', width: Width(100), paddingBottom: 10 }]}>
//                 <KeyboardAwareScrollView
//                     keyboardDismissMode='on-drag'
//                     scrollEnabled={false}
//                     showsVerticalScrollIndicator={false}>
//                     <HeaderComStackV2
//                         nthis={this}
//                         title={'Chọn dự án'}
//                         iconRight={Images.ImageJee.icBaCham}
//                         // styIconRight={[nstyles.nIconH18W22, {}]}
//                         iconLeft={Images.ImageJee.icArrowNext}
//                         onPressLeft={this._goback}
//                         // onPressRight={() => { Utils.goscreen(this, 'Modal_LocBaiDang') }}
//                         styBorder={{
//                             borderBottomColor: colors.black_20_2,
//                             borderBottomWidth: 0.3
//                         }}
//                     />
//                     <View style={{ width: Width(100), height: Height(7), marginVertical: 10, backgroundColor: colors.white, flexDirection: 'row', padding: 10 }}  >
//                         {/* <View style={{ height: Height(7), backgroundColor: colors.white, justifyContent: 'center', flexDirection: 'row', flex: 1, borderWidth: 0.5, borderRadius: 20, }}>
//                             <View style={{ alignItems: 'center', marginHorizontal: 10, flexDirection: 'row', padding: 5 }}>
//                                 <Image source={Images.ImageJee.icTimKiemTextInput} resizeMode='cover' style={[{ marginLeft: 5 }]} />
//                                 <TextInput
//                                     placeholder={"Tìm kiếm..."}
//                                     value={noidung_Tk}
//                                     autoCorrect={false}
//                                     numberOfLines={2}
//                                     onChangeText={(text) => this.setState({ noidung_Tk: text })}
//                                     style={[{
//                                         paddingVertical: 11, paddingLeft: 11, fontSize: sizes.sText14,
//                                         color: colors.black
//                                     }]}
//                                 />
//                             </View>
//                             <TouchableOpacity>
//                                 <Image source={Images.ImageJee.icXoaLuaChon} resizeMode='cover' style={[, { marginLeft: 5 }]} />
//                             </TouchableOpacity>
//                         </View> */}
//                         <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', borderWidth: 0.5, borderRadius: 20, backgroundColor: '#F2F3F5', borderColor: '#F2F3F5' }}>
//                             <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
//                                 <Image source={Images.ImageJee.icTimKiemTextInput} resizeMode='cover' style={[{ marginLeft: 5 }]} />
//                                 <TextInput
//                                     placeholder={"Tìm kiếm..."}
//                                     value={noidung_Tk}
//                                     autoCorrect={false}
//                                     numberOfLines={2}
//                                     onChangeText={(text) => this.setState({ noidung_Tk: text })}
//                                     style={[{
//                                         paddingVertical: 11, paddingLeft: 11, fontSize: sizes.sText14,
//                                         color: colors.black
//                                     }]}
//                                 />
//                             </View>
//                             <TouchableOpacity style={{ paddingRight: 10 }}>
//                                 <Image source={Images.ImageJee.icXoaLuaChon} resizeMode='cover' style={[, { marginRight: 10 }]} />

//                             </TouchableOpacity>
//                         </View>
//                         <TouchableOpacity style={{ padding: 6, alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
//                             <Image source={Images.ImageJee.icLoc} resizeMode='cover' style={[, { marginLeft: 5 }]} />

//                         </TouchableOpacity>
//                     </View>
//                     <View style={{ flex: 1, backgroundColor: colors.white, }}>

//                         <View style={{}}>
//                             <FlatList
//                                 showsHorizontalScrollIndicator={false}
//                                 showsVerticalScrollIndicator={false}
//                                 data={loai}
//                                 renderItem={this._renderItem}
//                                 keyExtractor={(item, index) => index.toString()}
//                             />
//                         </View>
//                     </View>
//                 </KeyboardAwareScrollView>
//             </View >

//         );
//     }
// };


// const mapStateToProps = state => ({
//     lang: state.changeLanguage.language
// });

// const styles = StyleSheet.create({
//     card: {
//         borderRadius: 30
//     },
//     list: {
//         overflow: 'visible'
//     },
//     reactView: {
//         width: (Width(100) - 24) / 7,
//         height: 58,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     reaction: {
//         width: Width(20),
//         marginBottom: 4
//     }
// });

// export default Utils.connectRedux(ChonDuAn, mapStateToProps, true)


