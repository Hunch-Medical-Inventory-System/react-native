import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabOneScreen from './(tabs)';
import { useColorScheme } from '@/components/useColorScheme';
import Available from './(tabs)/tables/available';
import Personal from './(tabs)/tables/personal';
import Expired from './(tabs)/tables/expired';
import Supplies from './(tabs)/tables/supplies';
import Logs from './(tabs)/tables/logs';
import React from 'react';
import About from './(tabs)/about';

export {

  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {

  initialRouteName: '(tabs)',
};


SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });


  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <RootLayoutNav />
      </PaperProvider>
    </ReduxProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f0f1f', // Navbar background color
        },
        headerTintColor: '#fff', // Header text color
        drawerStyle: {
          backgroundColor: '#0f0f1f', // Drawer navbar background color
        },
        drawerActiveTintColor: '#fff', // Active item text color
        drawerInactiveTintColor: '#fff', // Inactive item text color
      }}
    >
      <Drawer.Screen name="Home" component={TabOneScreen} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="Profile" component={Personal} />
      <Drawer.Screen name="Available" component={Available} />
      <Drawer.Screen name="Expired" component={Expired} />
      <Drawer.Screen name="Supplies" component={Supplies} />
      <Drawer.Screen name="Logs" component={Logs} />
    </Drawer.Navigator>
  );
}
