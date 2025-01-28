// src/navigation/DrawerNavigator.js
import React from 'react';
import { Appbar } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';
import Home from '@/pages/Home';
import About from '@/pages/about';
import Personal from '@/pages/tables/personal';
import Available from '@/pages/tables/available';
import Expired from '@/pages/tables/expired';
import Supplies from '@/pages/tables/supplies';
import Logs from '@/pages/tables/logs';

const Drawer = createDrawerNavigator();

type CustomHeaderProps = {
  navigation: DrawerNavigationProp<any>;
  title: string;
};

const CustomHeader = ({ navigation, title }: CustomHeaderProps) => (
  <Appbar.Header>
    <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
    <Appbar.Content title={title} />
    <Appbar.Action icon="magnify" onPress={() => {}} />
  </Appbar.Header>
);

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <CustomHeader
            navigation={navigation}
            title={route.name}
          />
        ),
      })}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="Profile" component={Personal} />
      <Drawer.Screen name="Available" component={Available} />
      <Drawer.Screen name="Expired" component={Expired} />
      <Drawer.Screen name="Supplies" component={Supplies} />
      <Drawer.Screen name="Logs" component={Logs} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;





