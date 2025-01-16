import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import test from './(tabs)/test';
import TabOneScreen from './(tabs)';
import TabTwoScreen from './(tabs)/two';
import { useColorScheme } from '@/components/useColorScheme';
import available from './(tabs)/tables/available';
import personal from './(tabs)/tables/personal';
import expired from './(tabs)/tables/expired';
import supplies from './(tabs)/tables/supplies';
import logs from './(tabs)/tables/logs';

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
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
    <PaperProvider>
      <RootLayoutNav />
    </PaperProvider>
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
      <Drawer.Screen name="Profile" component={personal} />
      <Drawer.Screen name="Available" component={available} />
      <Drawer.Screen name="Expired" component={expired} />
      <Drawer.Screen name="Supplies" component={supplies} />
      <Drawer.Screen name="Logs" component={logs} />
    </Drawer.Navigator>
  );
}
