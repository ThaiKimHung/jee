module.exports = {
  presets: [['module:metro-react-native-babel-preset', {
    unstable_disableES6Transforms: true
  }]],
  // plugins: [
  //   ["@babel/plugin-proposal-decorators", { "legacy": true }],
  //   [
  //     'module-resolver',
  //     {
  //       root: ['.'],
  //       alias: {
  //         src: './src',
  //         apis: './src/apis',
  //         app: './src/app',
  //         components: './src/components',
  //         images: './src/images',
  //         routers: './src/routers',
  //         scJee: './src/scJee',
  //         styles: './src/styles',
  //       },
  //     },
  //   ],
  // ]
};
