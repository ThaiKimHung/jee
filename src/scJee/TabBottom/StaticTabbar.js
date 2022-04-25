import * as React from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { nGlobalKeys } from "../../app/keys/globalKey";
import Utils from "../../app/Utils";
import { colors } from '../../styles/color';
import { nstyles } from '../../styles'
import { Get_ThongBao, Get_ThongBaoChat } from "../../srcRedux/actions";
import { connect } from "react-redux";
import { reText } from "../../styles/size";
import { Get_Contact_Chat } from "../../apis/JeePlatform/API_JeeChat/apiJeeChat";
import { ROOTGlobal } from "../../app/data/dataGlobal";

const { width } = Dimensions.get("window");

interface Tab {
    name: string;
}
interface StaticTabbarProps {
    tabs: Tab[];
    value: Animated.Value;
}
class StaticTabbar extends React.PureComponent<StaticTabbarProps> {
    values: Animated.Value[] = [];
    constructor(props: StaticTabbarProps) {
        super(props);
        nthistab = this;
        const { tabs, indexTab } = this.props;
        this.values = tabs.map((tab, index) => new Animated.Value(index === indexTab ? 1 : 0));
        this.state = { indexTabTemp: this.props.indexTab }
    }
    componentDidMount() {
        this.onPress(this.props.indexTab);
    }

    onPress = (index: number) => {
        if (index == 3)
            ROOTGlobal.GetListMessage.GetListMess()
        this.setState({ indexTab: index })
        const { value, tabs } = this.props;
        const tabWidth = width / 5// tabs.length;
        Animated.sequence([
            Animated.parallel(
                this.values.map(v => Animated.timing(v, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                })),
            ),
            Animated.parallel([
                Animated.spring(value, {
                    toValue: tabWidth * index,
                    useNativeDriver: true,
                }),
                Animated.spring(this.values[index], {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
        let isDeeplink = Utils.getGlobal(nGlobalKeys.isDeeplink, false);
        if (!isDeeplink) {
            Utils.goscreen(this.props.nthisTabBarHome, tabs[index].screen);
        } else {
            Utils.setGlobal(nGlobalKeys.isDeeplink, false);
        }
    }
    render() {
        const { onPress } = this;
        const { tabs, value, indexTab } = this.props;
        const { indexTabTemp } = this.state
        return (
            <View style={styles.container}>
                {
                    tabs.map((tab, key) => {
                        // if (tab.LoaiHinh == 1) {
                        //     return <View key={key}></View>;
                        // }
                        const tabWidth = width / 5//tabs.length;
                        const translateY = this.values[key].interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, -1],
                            extrapolate: "extend",
                        });
                        const opacity1 = this.values[key].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: "extend",
                        });
                        return (
                            <React.Fragment {...{ key }}>
                                <TouchableWithoutFeedback onPress={() => onPress(key, true)}>
                                    <View style={[styles.tab]}>
                                        <Image
                                            source={tab.icon}
                                            resizeMode={'cover'}
                                            style={nstyles.nstyles.nIconW26H20}
                                        />
                                        {key === 1 && this.props.ListThongBao.length > 0 ? <View style={{
                                            position: 'absolute',
                                            backgroundColor: colors.redStar, top: 3, right: 22,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            ...nstyles.nstyles.nAva18

                                        }}>{
                                                <Text style={{ fontSize: reText(11), color: colors.white }}>
                                                    {this.props.ListThongBao.length < 99 ? this.props.ListThongBao.length : 'N'}
                                                </Text>}
                                        </View> : null}
                                        {key === 3 && this.props.ListThongBaoChat > 0 ? <View style={{
                                            position: 'absolute',
                                            backgroundColor: colors.redStar, top: 3, right: 22,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            ...nstyles.nstyles.nAva18

                                        }}>{
                                                <Text style={{ fontSize: reText(11), color: colors.white }}>
                                                    {this.props.ListThongBaoChat < 99 ? this.props.ListThongBaoChat : 'N'}
                                                </Text>}
                                        </View> : null}
                                        <Text style={{ fontSize: 10, textAlign: 'center', color: '#b3b3b3', marginTop: 5 }}>{tab.name}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Animated.View
                                    style={{
                                        position: "absolute",
                                        left: tabWidth * key,
                                        width: tabWidth,
                                        top: 2,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: opacity1,
                                        transform: [{ translateY }],
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => onPress(key, true)}
                                        style={styles.activeIcon}>
                                        <View style={[styles.tab]}>
                                            <Image
                                                source={tab.iconA}
                                                resizeMode={'cover'}
                                                style={nstyles.nstyles.nIconW26H20}
                                            />
                                            <Text style={{ fontSize: 12, fontWeight: "600", textAlign: 'center', color: "#0A9562", marginTop: 5 }}>{tab.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            </React.Fragment>
                        );
                    })
                }
            </View >
        );
    }
}


const mapStateToProps = state => ({
    ListThongBao: state.ThongBao.dataThongBao,
    ListThongBaoChat: state.ThongBaoChat.numChat
});
const mapDispatchToProps = (dispatch) => {
    return {
        GetThongBao: () => dispatch(Get_ThongBao()),
        GetThongBaoChat: () => dispatch(Get_ThongBaoChat())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StaticTabbar)

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: 'white',
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 8,

    },
    activeIcon: {
        backgroundColor: "white",
        width: 70,
        height: 54,
        paddingBottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },

});