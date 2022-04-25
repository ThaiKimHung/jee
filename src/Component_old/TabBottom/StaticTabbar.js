import * as React from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { nGlobalKeys } from "../../app/keys/globalKey";
import Utils from "../../app/Utils";
import { colors } from '../../styles/color';

const { width } = Dimensions.get("window");

interface Tab {
    name: string;
}
interface StaticTabbarProps {
    tabs: Tab[];
    value: Animated.Value;
}
export default class StaticTabbar extends React.PureComponent<StaticTabbarProps> {
    values: Animated.Value[] = [];
    constructor(props: StaticTabbarProps) {
        super(props);
        nthistab = this;
        const { tabs, indexTab } = this.props;
        // Utils.nlog("gia tri indexTa1111b", indexTab)
        this.values = tabs.map((tab, index) => new Animated.Value(index === indexTab ? 1 : 0));
    }
    componentDidMount() {
        this.onPress(this.props.indexTab);
    }
    componentDidUpdate() {
        // Utils.nlog("gia tri diaupdte 222")

    }
    onPress = (index: number) => {
        // Utils.nlog("vao on Press tab index------------------------", index)
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
            // Utils.nlog("tab index ---------------------", index, tabs[index].screen)
            Utils.goscreen(this.props.nthisTabBarHome, tabs[index].screen);
        } else {
            Utils.setGlobal(nGlobalKeys.isDeeplink, false);
        }
    }
    render() {
        const { onPress } = this;
        const { tabs, value } = this.props;
        return (
            <View style={styles.container}>
                {
                    tabs.map((tab, key) => {
                        // Utils.nlog("tab----------", tab)
                        // if (tab.LoaiHinh == 1) {
                        //     return <View key={key}></View>;
                        // }
                        const tabWidth = width / 5//tabs.length;
                        const cursor = tabWidth * key;
                        const opacity = value.interpolate({
                            inputRange: [cursor - tabWidth, cursor, cursor + tabWidth],
                            outputRange: [1, 0, 1],
                            extrapolate: "clamp",
                        });
                        const translateY = this.values[key].interpolate({
                            inputRange: [0, 1],
                            outputRange: [64, 0],
                            extrapolate: "clamp",
                        });
                        const opacity1 = this.values[key].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: "clamp",
                        });
                        return (
                            <React.Fragment {...{ key }}>
                                <TouchableWithoutFeedback onPress={() => onPress(key, true)}>
                                    <Animated.View style={[styles.tab, { opacity }]}>
                                        <Image
                                            source={tab.icon}
                                            resizeMode={'cover'}
                                        />
                                        <Text style={{ fontSize: 8, textAlign: 'center', color: '#b3b3b3' }}>{tab.name}</Text>
                                    </Animated.View>
                                </TouchableWithoutFeedback>
                                <Animated.View
                                    style={{
                                        position: "absolute",
                                        top: -20,
                                        left: tabWidth * key,
                                        width: tabWidth,
                                        height: 64,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: opacity1,
                                        transform: [{ translateY }],
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => onPress(key, true)}
                                        style={styles.activeIcon}>
                                        <View style={{
                                            width: 26, height: 30,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Image
                                                source={tab.iconA}
                                                resizeMode={'cover'}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            </React.Fragment>
                        );
                    })
                }
            </View>
        );
    }
}

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
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: "center",
        alignItems: "center",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowColor: colors.colorShadowTabJeeHR, // Màu mới của VHR
        elevation: 7,
    },
});