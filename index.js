/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import AppCrash from './src/app/Error'
import { startNetworkLogging } from 'react-native-network-logger';


__DEV__ ? null : AppCrash.handleCrashException();
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);
YellowBox.ignoreWarnings(['Remote debugger']);
YellowBox.ignoreWarnings(["", ""]);
// setJSExceptionHandler

startNetworkLogging();
AppRegistry.registerComponent(appName, () => App);
