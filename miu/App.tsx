import React from "react";
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
import NFCScanner from "@/pages/nfc/NFCScanner";
import NFCWriter from "@/pages/nfc/NFCWriter";

import { View, Text } from "react-native";

// Redux Store 
import { store } from "@/store";


const Nav = () => {
  
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="Profile" component={Personal} />
      <Drawer.Screen name="Available" component={Available} />
      <Drawer.Screen name="Expired" component={Expired} />
      <Drawer.Screen name="Supplies" component={Supplies} />
      <Drawer.Screen name="Logs" component={Logs} />
      <Drawer.Screen name="NFC Scanner" component={NFCScanner} />
      <Drawer.Screen name="NFC Writer" component={NFCWriter} />
    </Drawer.Navigator>
  );
}


const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Nav />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}

export default App