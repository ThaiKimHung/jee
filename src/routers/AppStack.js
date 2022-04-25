// import 'react-native-gesture-handler';
// import { Animated, Easing } from 'react-native';


// import BrowserInApp from '../components/BrowserInApp';
// import CalandaCom from '../components/CalandaCom';
// import CalandaDis from '../components/CalandaDis';
// import CalandaSingalCom from '../components/CalandaSingalCom';
// // -- Root Screen + Component native custom 
import MsgBox from '../components/MsgBox';
// import scMsgBox from '../components/scMsgBox';
// import ViewImageListShow from '../components/ViewImageListShow';
import { Animated, Easing } from 'react-native';


import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Utils from '../app/Utils';
import { TabMain } from './Navigations/TabMain';

import { MainApp } from './Navigations/MainApp';
import Linking from './Linking'



const Stack = createStackNavigator();

function AppStack() {
    return (
        <NavigationContainer linking={Linking} ref={navigatorRef => { Utils.setTopLevelNavigator(navigatorRef); }} >
            <Stack.Navigator headerMode="none" initialRouteName={"RootMain"} mode="none" >
                <Stack.Screen name={"RootMain"} component={MainApp} />
                <Stack.Screen
                    name="Modal_MsgBox"
                    component={MsgBox}
                    options={{
                        cardStyle: { backgroundColor: 'transparent' }, animationEnabled: false,
                        navigationOptions: {
                            gesturesEnabled: false,
                            transitionConfig: () => ({
                                containerStyle: {
                                    backgroundColor: 'transparent'
                                },
                                transitionSpec: {
                                    duration: 0,
                                    timing: Animated.timing,
                                    easing: Easing.step0,
                                }
                            }),
                        }
                    }} />
            </Stack.Navigator>
        </NavigationContainer >
    );

}
export default AppStack