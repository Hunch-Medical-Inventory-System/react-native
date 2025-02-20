import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useColorScheme } from "react-native"; // Import useColorScheme

// Screens
import Home from "@/pages/Home";
import About from "@/pages/About";
import Chatbot from "@/pages/Chatbot"
// Tables
import Personal from "@/pages/tables/Personal";
import Available from "@/pages/tables/Available";
import Expired from "@/pages/tables/Expired";
import Supplies from "@/pages/tables/Supplies";
import Logs from "@/pages/tables/Logs";
// NFC
import Reader from "@/pages/nfc/Reader";
import Writer from "@/pages/nfc/Writer";

// Redux Store
import { store } from "@/store";

// Localization
import { registerTranslation, en } from 'react-native-paper-dates';

// Import Supabase
import { supabase } from '@/utils/supabaseClient'; // Import Supabase client
import AuthPage from "@/pages/authentication"; // Import AuthPage

import { StatusBar } from 'react-native';

// Inside your App component (or in your useEffect)



registerTranslation('en', en);

const Drawer = createDrawerNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const colorScheme = useColorScheme(); // Detect the current theme (light or dark)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session); // Set authenticated state based on session
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session); // Update authentication state when session changes
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colorScheme === 'dark' ? '#333' : '#fff'} />
        {isAuthenticated ? (
          <NavigationContainer>
            <Drawer.Navigator
              initialRouteName="Home"
              screenOptions={{
                drawerStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#fff', // Set drawer background based on dark/light mode
                },
                drawerActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000', // Adjust active color for items
                drawerInactiveTintColor: colorScheme === 'dark' ? '#888' : '#444', // Adjust inactive color for items

                // AppBar customization
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#fff', // AppBar background color
                },
                headerTintColor: colorScheme === 'dark' ? '#fff' : '#000', // AppBar text color (title, back button, etc.)
              }}
            >
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="About" component={About} />
              <Drawer.Screen name="Profile" component={Personal} />
              <Drawer.Screen name="Available" component={Available} />
              <Drawer.Screen name="Expired" component={Expired} />
              <Drawer.Screen name="Supplies" component={Supplies} />
              <Drawer.Screen name="Logs" component={Logs} />
              <Drawer.Screen name="NFC Scanner" component={Reader} />
              <Drawer.Screen name="NFC Writer" component={Writer} />
              <Drawer.Screen name="Chatbot" component={Chatbot} />
            </Drawer.Navigator>
          </NavigationContainer>
        ) : (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
