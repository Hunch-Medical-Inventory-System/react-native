module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'], // Optional: Set `src` as your project root for easy referencing
        alias: {
          '@': './src', // Customize as needed
          // Add more aliases as required
        },
      },
    ],
  ],
};
