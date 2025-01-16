import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground } from 'react-native';

const App = () => {
  return (
    <View>
      <Text>App</Text>
    </View>
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
