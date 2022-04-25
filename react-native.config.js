// react-native.config.js
//tắt lỗi error khi run-ios, android. Không ảnh hưởng gì
module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ["./assets/fonts/"], // stays the same
  dependencies: {
    'react-native-code-push': {
      platforms: {
        android: null
      }
    },
    // 'react-native-fbsdk': {
    //   platforms: {
    //     android: null
    //   }
    // },
    'react-native-maps': { // ko autolink dc map
      platforms: {
        android: null
      }
    },
    // 'react-native-onesignal': {
    //   platforms: {
    //     ios: null
    //   }
    // }
  },
};