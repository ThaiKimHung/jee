import LottieView from 'lottie-react-native';
import moment from "moment";
import React, { Fragment } from 'react';
import { AppState, ImageBackground, Text, TouchableOpacity, View, Alert, Image } from 'react-native';
import CodePush from 'react-native-code-push';
import * as Progress from 'react-native-progress';
import { appConfig } from './src/app/Config';
import { Images } from './src/images';
import { colors } from './src/styles';
import { Height, Width } from './src/styles/styles';
import RNRestart from 'react-native-restart';


const CODE_PUSH_OPTIONS = {
    checkFrequency: CodePush.CheckFrequency.MANUAL,
};


const withCodePush = WrappedComponent => {
    class WrappedApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isUpdate: false,
                acceptUpdate: false,
                totalBytes: 0,
                receivedBytes: 1,
                isLoad: false,
                ImageBG: '',
                update_data: '',
                lastBackgroundedTime: 0,
                appState: AppState.currentState,

                isConnected: true,
                tryConnect: false,
                isNotCheck: false
            };
        }




        handleAppStateChange = async nextAppState => {
            const { appState, lastBackgroundedTime, acceptUpdate } = this.state;
            // Try to run the CodePush sync whenever app comes to foreground
            if (appState.match(/inactive|background/) && nextAppState === "active" && acceptUpdate) {
                // Only run the sync if app has been in the background for a certain amount of time
                {
                    // Please show the user some feedback while running this
                    // This might take some time, especially if an update is available
                    await CodePush.sync({
                        installMode: CodePush.InstallMode.IMMEDIATE,
                    });
                }
            }

            if (nextAppState.match(/inactive|background/)) {
                this.setState({
                    lastBackgroundedTime: 10000
                });
            }

            if (appState !== nextAppState)
                this.setState({
                    appState: nextAppState,
                });
        };

        componentWillUnmount() {
            AppState.removeEventListener("change", this.handleAppStateChange);
        }

        componentDidMount() {
            AppState.addEventListener("change", this.handleAppStateChange);
            CodePush.checkForUpdate().then(update => {
                if (!update) {
                    this.setState({ isUpdate: false });
                } else {
                    this.setState({ isUpdate: true });
                    CodePush.getUpdateMetadata().then(val => {

                        this.setState({ update_data: update.description });
                    })
                }
            });
        }



        update = () => {
            this.setState({ isLoad: true })
            CodePush.sync(
                { installMode: CodePush.InstallMode.IMMEDIATE },
                function (SyncStatus) {
                    switch (SyncStatus) {
                        case 3: RNRestart.Restart()
                    }
                },
                this.downloadProgressCallback,
            )
        };

        downloadProgressCallback = ({ totalBytes, receivedBytes }) => {
            this.setState({ totalBytes, receivedBytes });
        };



        render() {
            const { isUpdate, totalBytes, receivedBytes, isLoad, ImageBG, update_data } = this.state;
            if (isUpdate) {
                return (
                    <ImageBackground
                        source={Images.ImageJee.backgroundLogin}
                        style={{
                            flex: 1,
                            alignContent: 'center',
                            justifyContent: 'center',
                        }}>
                        <View style={{ marginBottom: Height(20) }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30, }} />
                            {/* setting */}

                            <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", position: "absolute", opacity: 0.2 }}>
                                <LottieView style={{ height: Width(60) }} source={require('./src/images/lottieJeeHR/setting.json')} autoPlay loop />
                            </View>
                            <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", position: "absolute", top: Height(12), opacity: 0.1 }}>
                                <LottieView style={{ height: Width(48) }} source={require('./src/images/lottieJeeHR/setting.json')} autoPlay loop />
                            </View>

                            {/* phone */}

                            <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                <LottieView style={{ height: Width(55) }} source={require('./src/images/lottieJeeHR/phone.json')} autoPlay loop />
                            </View>

                            {/* download */}

                            <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center", position: "absolute", top: Height(14) }}>
                                <Image source={Images.ImageJee.iclogoApp} style={{ width: 100, height: 12 }}></Image>
                                <LottieView style={{ height: Width(20) }} source={require('./src/images/lottieJeeHR/download.json')} autoPlay loop />
                            </View>
                            <Text style={{ fontSize: (15), lineHeight: 18, paddingVertical: 10, textAlign: 'center', color: colors.white }}>{"Có một bản cập nhật " + appConfig.TenAppHome + " mới. \n\n Nội dung bản cập nhật:"}</Text>
                            <Text style={{ fontSize: (15), lineHeight: 18, paddingVertical: 10, textAlign: 'center', color: colors.white }}>{update_data}</Text>
                            <View style={[{ backgroundColor: null, justifyContent: "center", marginTop: Height(5) }]}>
                                {isLoad ?
                                    <Fragment>
                                        <Progress.Bar
                                            progress={receivedBytes / totalBytes}
                                            width={Width(90)}
                                            color={colors.colorButtomrightJeeHR}
                                            height={2}
                                            borderColor={"white"}
                                            unfilledColor={"#DDDDDD"}
                                            // indeterminate={true}
                                            style={{ alignSelf: 'center', justifyContent: "center" }} />
                                        <Text style={{ textAlign: "center", fontSize: 10, paddingLeft: 20, paddingVertical: 8, color: colors.white }}>Đang tải bản cập nhật: {`${((receivedBytes / 1024) / 1024).toFixed(2)}/${((totalBytes / 1024) / 1024).toFixed(2)} MB`}</Text>
                                        {/* <TouchableOpacity
                                            style={{
                                                backgroundColor: colors.orangeApp,
                                                padding: 10, margin: 10, borderRadius: 3, marginHorizontal: '20%'
                                            }}
                                            onPress={() => this.setState({ isUpdate: false }, () => { CodePush.disallowRestart() })}>
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.white }}> {'Vào ngay.'}</Text>
                                        </TouchableOpacity> */}
                                    </Fragment>
                                    : null
                                }
                            </View>

                            <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", alignSelf: "center" }}>
                                {
                                    isLoad ? null : <View pointerEvents={isLoad ? 'none' : 'auto'} style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center'
                                    }}>


                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: colors.brownGreyTwo,
                                                padding: 10,
                                                margin: 10, borderRadius: 3,
                                                paddingHorizontal: 40
                                            }}
                                            onPress={() => this.setState({ isUpdate: false })}>
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.white, }}> {'Bỏ qua'}</Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: colors.textTabActive,
                                                padding: 10,
                                                margin: 10,
                                                borderRadius: 3,
                                                paddingHorizontal: 40
                                            }}
                                            onPress={() => { this.setState({ acceptUpdate: true }, () => { this.update() }) }}>
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.white, }}> {'Cập nhật ngay'}</Text>
                                        </TouchableOpacity>
                                        {/* 
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: colors.textTabActive,
                                                padding: 10,
                                                margin: 10,
                                                borderRadius: 3,
                                                paddingHorizontal: 40
                                            }}
                                            onPress={() => {
                                                this.setState({ acceptUpdate: true, isUpdate: false }, () => {
                                                    this.update()
                                                    CodePush.disallowRestart()
                                                })
                                            }}>
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.white, }}> {'Cập nhật và khởi động lại sau'}</Text>
                                        </TouchableOpacity> */}


                                    </View>
                                }
                            </View>
                        </View>
                    </ImageBackground >
                );
            } else {
                return <WrappedComponent />;
            }
        }
    }

    return CodePush(CODE_PUSH_OPTIONS)(WrappedApp);
};
export default withCodePush;
