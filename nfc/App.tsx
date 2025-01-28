// App.js
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store';
import DrawerNavigator from '@/components/DrawerNavigator';
import 'react-native-url-polyfill/auto';
// @ts-ignore
import { fetch } from 'react-native-fetch-api';

globalThis.fetch = fetch;

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
