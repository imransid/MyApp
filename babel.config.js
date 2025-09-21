module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // module-resolver for aliases
    [
      'babel-plugin-module-resolver',
      {
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@store': './src/store',
          '@navigation': './src/navigation',
        },
      },
    ],

    // decorators if you need them
    ['@babel/plugin-proposal-decorators', {legacy: true}],

    // other useful plugins (keep or remove as you need)
    'jest-hoist',

    // IMPORTANT: Use react-native-worklets/plugin instead of react-native-reanimated/plugin
    'react-native-worklets/plugin',
  ],
};
