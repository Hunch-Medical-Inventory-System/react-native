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
import NfcReader from './(tabs)/NFCScanner';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on /modal keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#f5f5f5',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}
    >
      <Drawer.Screen name="Home" component={TabOneScreen} />
      <Drawer.Screen name="Profile" component={Personal} />
      <Drawer.Screen name="Available" component={Available} />
      <Drawer.Screen name="Expired" component={Expired} />
      <Drawer.Screen name="Supplies" component={Supplies} />
      <Drawer.Screen name="Logs" component={Logs} />
      <Drawer.Screen name="NFC" component={NfcReader} />
    </Drawer.Navigator>
  );
}
