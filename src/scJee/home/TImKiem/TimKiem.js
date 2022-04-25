import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Platform, TextInput, Animated, StatusBar, ScrollView
} from 'react-native';
import IsLoading from '../../../components/IsLoading'
import { Images } from '../../../images'
import { colors, fonts } from '../../../styles'
import { reText, sizes } from '../../../styles/size'
import { Height, nstyles, Width, paddingBotX } from '../../../styles/styles'
import { ROOTGlobal } from '../../../app/data/dataGlobal'
import { RootLang } from '../../../app/data/locales'
import Utils from '../../../app/Utils'
import UtilsApp from '../../../app/UtilsApp'
import { LayMenuChucNang_MobileApp } from '../../../apis/JeePlatform/API_JeeWork/apiMenu';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { objectMenuGlobal } from '../AllMenu/MenuGlobal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { nkey } from '../../../app/keys/keyStore';

const SPACING = 20
const AVATAR_SIZE = 22
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3
const paddingTopMul = isIphoneX() ? 30 : 15
const TimKiem = (props) => {
  const [menu, setMenu] = useState([])
  const [searchText, setSearchText] = useState("")
  const [menuPhoBien, setmenuPhoBien] = useState([])
  const [filteredData, setfilteredData] = useState([])
  const scrollY = React.useRef(new Animated.Value(0)).current
  const refLoading = useRef(null)


  useEffect(() => {
    _layMenuChucNang_MobileApp()
  }, [])

  useEffect(() => {
    _layMenuPhoBien()
  }, [])

  const _layMenuChucNang_MobileApp = async () => {
    refLoading.current.show()
    const res = await LayMenuChucNang_MobileApp()
    // Utils.nlog('res: ', res)
    let menuTong = []
    if (res.status == 1) {
      res.data?.map(item => {
        menuTong.push(...ganItem(item.Child))
      })
      setMenu(menuTong)
      refLoading.current.hide();
    } else {
      refLoading.current.hide();
    }
  }

  const _layMenuPhoBien = async () => {
    let dataMenu = await Utils.ngetStorage(nkey.dataMenuPhoBien, [])
    setmenuPhoBien(dataMenu)
  }

  const ganItem = (mang) => {
    const menuTong = []
    let temp = []
    temp = objectMenuGlobal.AllMenu
    mang.map(item => {
      for (let i = 0; i <= temp.length; ++i) {
        if (item?.RowID == temp[i]?.RowID) {
          const data = temp[i]
          menuTong.push(data)
        }
      }
    })
    return menuTong
  }

  const _goBack = () => {
    Utils.goback({ props });
  }

  const _search = (searchText) => {
    setSearchText(searchText)
    let filteredData = menu.filter((item) =>
      Utils.removeAccents(props.lang == "vi" ? item['Title'] : item['nameEN'])
        .toUpperCase()
        .includes(Utils.removeAccents(searchText.toUpperCase())),
    );
    setfilteredData(filteredData)
  };

  const _goscreen = (item) => {
    if (item.screen) {
      Utils.goscreen({ props: props }, item.goscreen, { screen: item.screen, params: item.params })
      if (item.RowID == 1) {
        Utils.setGlobal('_dateDkLocCongViec', '')
        Utils.setGlobal('typeChoiceLocCongViec', 'CreatedDate')
        Utils.setGlobal('_dateKtLocCongViec', '')
        Utils.setGlobal('searchStringCongViec', '')
        Utils.setGlobal('hoanthanhcv', true)
        Utils.setGlobal('hancv', false)
      }
    }
    else if (item.params.isMode == 3) {
      Utils.showMsgBoxYesNo({ props: props }, RootLang.lang.thongbaochung.thongbao, RootLang.lang.thongbaochung.bancomuonchuyensangchedomaychamcongkhong, RootLang.lang.thongbaochung.xacnhan, RootLang.lang.thongbaochung.xemlai, () => {
        Utils.goscreen({ props: props }, item.goscreen, item.params)
      })
    }
    else {
      Utils.goscreen({ props: props }, item.goscreen, item.params)
    }
  }

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={{ width: '50%', justifyContent: 'center' }}
        onPress={() => { _goscreen(item) }}
      >
        <View style={{
          flex: 1, width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 15, borderWidth: 0.5, borderColor: colors.colorButtonGray, paddingVertical: 18
        }}>
          <Image
            style={nstyles.nIcon29}
            source={item.linkicon}
            resizeMode={'contain'} />

          <Text style={{ flex: 1, paddingLeft: 8, fontSize: reText(12) }}>{props.lang == "vi" ? item.Title : item.nameEN}</Text>

        </View>
      </TouchableOpacity>
    )
  }

  const _setStoreTimKiemPhoBien = async (item) => {
    let dataMenu = await Utils.ngetStorage(nkey.dataMenuPhoBien, [])
    _goscreen(item)

    let mang = []
    if (dataMenu.length == 0) {
      mang.push(item)
    }
    else {
      for (let i = 0; i < dataMenu.length; i++) {
        if (dataMenu[i].RowID == item.RowID) {
          setSearchText('')
          setfilteredData([])
          return
        }
        else {
          if (dataMenu.length >= 6) {
            let chuoiDacat = dataMenu.slice(0, -1)
            mang = [item].concat(chuoiDacat)
          }
          else {
            mang = [item].concat(dataMenu)
          }
        }
      }
    }
    await Utils.nsetStorage(nkey.dataMenuPhoBien, mang)
    await _layMenuPhoBien()
    setSearchText('')
    setfilteredData([])
  }

  const _renderItemSearch = ({ item, index }) => {
    const inputRange = [
      -1,
      0,
      ITEM_SIZE * index,
      ITEM_SIZE * (index + 2),
    ]
    const opacityInputRange = [
      -1,
      0,
      ITEM_SIZE * index,
      ITEM_SIZE * (index + .5),
    ]


    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0]
    })

    const opacity = scrollY.interpolate({
      inputRange: opacityInputRange,
      outputRange: [1, 1, 1, 0]
    })
    return (
      <Animated.View style={[styles.itemContainer, { transform: [{ scale }], opacity }]}>
        <TouchableOpacity onPress={() => { _setStoreTimKiemPhoBien(item) }}
          style={styles.touchContainer}>
          <View style={{ padding: 2 }}>
            <Image
              source={item.linkicon}
              style={[, { width: AVATAR_SIZE + 3, height: AVATAR_SIZE + 5, }]}></Image>
          </View>
          <View>
            <Text style={styles.itemTitle}>{props.lang == "vi" ? item.Title : item.nameEN}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <View style={[nstyles.ncontainer, {}]}>
      <View style={[styles.nHcontent, { paddingHorizontal: 15, height: isIphoneX() ? 100 : 65, width: '100%', paddingBottom: 5 }]} resizeMode='cover' >
        <View style={[nstyles.nrow, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <View style={styles.search}>
            <Image source={Images.icSearch} />
            <TextInput
              autoFocus={true}
              value={searchText} numberOfLines={1}
              style={styles.textInput}
              placeholder={RootLang.lang.thongbaochung.timkiem}
              onChangeText={_search} />
            {searchText != "" ?
              <TouchableOpacity onPress={() => {
                setSearchText(''), setfilteredData([]), _layMenuPhoBien()
              }}
                style={styles.xoa}>
                <Text style={{ fontSize: reText(12), fontWeight: 'bold' }}>X</Text>
              </TouchableOpacity> : null}
          </View>
          <TouchableOpacity style={styles.touchThoat}
            activeOpacity={0.5}
            onPress={() => { _goBack() }}>
            <Text style={[styles.textThoat]}>{RootLang.lang.thongbaochung.thoat}</Text>
          </TouchableOpacity>
        </View>
      </View >
      {
        searchText.length > 0 ?
          (
            <View style={styles.searchContainer}>
              <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{}}
                data={filteredData}
                renderItem={_renderItemSearch}
                onEndReachedThreshold={0.01}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={7}
                updateCellsBatchingPeriod={100}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
                )}
                contentContainerStyle={{
                  padding: 10,
                  // paddingTop: 30
                }}
                ListEmptyComponent={filteredData.length == 0 ? <EmptyList title={RootLang.lang.thongbaochung.khongcodulieu}></EmptyList> : null}
              />
            </View>
          ) :
          (
            <View style={styles.timkiemContainer}>
              <KeyboardAwareScrollView
                extraHeight={0}
                enableAutomaticScroll={true}
                // extraScrollHeight={Platform.OS == 'ios' ? Height(2) : 0}
                enableOnAndroid={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps={"handled"}
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ backgroundColor: '#F4F4F4', marginBottom: paddingBotX }}
              >
                <View style={styles.marginTop}>
                  <View style={{ backgroundColor: colors.white, }}>
                    <View style={styles.textPhobienContainer}>
                      <Text style={styles.textPhobien}>{RootLang.lang.thongbaochung.truycapganday}</Text>
                    </View>
                    <View style={{}}>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{}}
                        data={menuPhoBien}
                        renderItem={_renderItem}
                        onEndReachedThreshold={0.01}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        updateCellsBatchingPeriod={100}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                      // ListEmptyComponent={}
                      />
                    </View>
                  </View>
                  <View style={styles.danhMucContainer}>
                    <View style={styles.textPhobienContainer}>
                      <Text style={styles.textPhobien}>{RootLang.lang.thongbaochung.chucnang}</Text>
                    </View>
                    <View style={{}}>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{}}
                        data={menu}
                        renderItem={_renderItem}
                        onEndReachedThreshold={0.01}
                        initialNumToRender={5}
                        maxToRenderPerBatch={10}
                        windowSize={7}
                        updateCellsBatchingPeriod={100}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                      // ListEmptyComponent={}
                      />
                    </View>
                  </View>
                </View>
              </KeyboardAwareScrollView>
              <IsLoading ref={refLoading} />

            </View>
          )
      }


    </View>
  )
}
const mapStateToProps = state => ({
  lang: state.changeLanguage.language
});

export const styles = StyleSheet.create({
  nHcontent: {
    // height: heightHed,
    paddingTop: paddingTopMul + 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white
  },
  touchThoat: {
    alignSelf: 'center', justifyContent: 'center', padding: 10,
  },
  textThoat: {
    textAlign: 'center',
    color: 'red',
    fontSize: reText(15)
  },
  searchContainer: {
    flex: 1, backgroundColor: '#F4F4F4',
  },
  timkiemContainer: {
    flex: 1
  },
  marginTop: {
    marginTop: 8
  },

  textPhobienContainer: {
    borderBottomWidth: 1, padding: 10, borderColor: colors.colorButtonGray
  },
  textPhobien: {
    fontWeight: 'bold'
  },
  danhMucContainer: {
    marginTop: 8, backgroundColor: colors.white,
    flex: 1
  },
  search: {
    flexDirection: 'row', backgroundColor: colors.black_5, paddingHorizontal: 10, borderRadius: 10,
    alignItems: 'center', flex: 1
  },
  xoa: {
    width: Width(5), backgroundColor: colors.black_20_2, height: Width(5), borderRadius: 10, justifyContent: 'center', alignItems: 'center'
  },
  textInput: {
    flex: 1, paddingVertical: Platform.OS == 'ios' ? 10 : 5, paddingHorizontal: 5, fontSize: reText(16)
  },
  itemContainer: {
    // padding: SPACING,
    marginBottom: SPACING,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12, shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 }, shadowOpacity: .3, shadowRadius: 20,
    paddingVertical: 10, paddingLeft: 10
  },
  touchContainer: {
    flexDirection: 'row', paddingVertical: 5, opacity: 1, alignItems: 'center'
  },
  itemTitle: {
    flexShrink: 1, paddingLeft: 5, opacity: .7
  }
})
export default Utils.connectRedux(TimKiem, mapStateToProps, true)

const EmptyList = (props) => {
  let { title } = props
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text> {title}</Text>
    </View>
  )
}
