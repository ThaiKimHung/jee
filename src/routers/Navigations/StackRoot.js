import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Stack } from './Stack'
import Login from '../../scJee/User/Login/Login';
import OnboardingScreen from '../../scJee/OnboardingScreen'
import Utils from '../../app/Utils';
import { nkey } from '../../app/keys/keyStore';
import Registration from '../../scJee/User/Registration/Registration';

const RootStack = createStackNavigator();

export const StackRoot = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    useEffect(() => {
        async function getOnboarding() {
            await Utils.ngetStorage(nkey.alredyLaunched)
                .then(async (values) => {
                    values = false //bật dong này để tắt onboarding
                    if (values == null) {
                        await Utils.nsetStorage(nkey.alredyLaunched, true)
                        setIsFirstLaunch(true)
                    }
                    else if (values == true) {
                        setIsFirstLaunch(true)
                    }
                    else {
                        setIsFirstLaunch(false)
                    }
                })
        }
        getOnboarding()
    }, [])

    if (isFirstLaunch == null) {
        return null
    }
    else {
        return (
            <RootStack.Navigator
                headerMode="none"
                initialRouteName={isFirstLaunch ? "sc_OnboardingScreen" : 'JeeNew'}
                screenOptions={{
                    cardStyle: { backgroundColor: 'transparent' },
                    animationEnabled: true,
                    cardStyleInterpolator: ({ current: { progress } }) => ({
                        cardStyle: {
                            opacity: progress.interpolate({
                                inputRange: [0, 0.5, 0.9, 1],
                                outputRange: [0, 0.25, 0.7, 1],
                            }),
                        },
                        overlayStyle: {
                            opacity: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 0.2],
                                extrapolate: 'clamp',
                            }),
                        },

                    }),
                    ...TransitionPresets.RevealFromBottomAndroid,
                }} >
                <RootStack.Screen name={"sc_OnboardingScreen"} component={OnboardingScreen} />
                <RootStack.Screen name={"JeeNew"} component={Stack.StackMain} />
                <RootStack.Screen name={"sc_login"} component={Login} />
                <RootStack.Screen name={"sc_registration"} component={Registration} />

            </RootStack.Navigator>
        )
    }

}
