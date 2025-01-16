import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';

const App = () => {
  return (
    <ImageBackground
      source={require('/workspaces/react-native/medical-inventory-ui/assets/images/background.png')} // Custom background image
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title2}>Medical Based</Text>
          <Text style={styles.title}>Inventory System</Text>
        </View>

        <View style={styles.imageRow}>
          <Image
            source={require('/workspaces/react-native/medical-inventory-ui/assets/images/nasa_hunch.png')}
            style={styles.image}
          />
          <Image
            source={require('/workspaces/react-native/medical-inventory-ui/assets/images/logo.png')}
            style={styles.image}
          />
          <Image
            source={require('/workspaces/react-native/medical-inventory-ui/assets/images/wt.png')}
            style={styles.image}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title2: {
    fontFamily: 'monospace',
    fontSize: 80,
    fontWeight: '400',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontFamily: 'Orbitron Black 900', 
    fontSize: 140,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  image: {
    width: 300, 
    height: 300, 
    marginHorizontal: 15, // Reduced spacing
    resizeMode: 'contain', // Ensures the logo fits within the bounds
  },
});

export default App;
