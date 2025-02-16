import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Screens
import Home from "@/pages/Home";
import About from "@/pages/About";
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

registerTranslation('en', en);

const Drawer = createDrawerNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        {isAuthenticated ? (
          <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen name="Home" component={Home} />
              <Drawer.Screen name="About" component={About} />
              <Drawer.Screen name="Profile" component={Personal} />
              <Drawer.Screen name="Available" component={Available} />
              <Drawer.Screen name="Expired" component={Expired} />
              <Drawer.Screen name="Supplies" component={Supplies} />
              <Drawer.Screen name="Logs" component={Logs} />
              <Drawer.Screen name="NFC Scanner" component={Reader} />
              <Drawer.Screen name="NFC Writer" component={Writer} />
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
