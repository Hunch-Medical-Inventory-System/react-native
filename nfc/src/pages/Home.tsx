import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isLargeScreen = width > 768;

const Home = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title2}>Medical Based</Text>
          <Text style={styles.title}>Inventory System</Text>
        </View>

        <View style={styles.imageRow}>
          <Image
            source={require('@/assets/images/nasa_hunch.png')}
            style={styles.image}
          />
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.image}
          />
          <Image
            source={require('@/assets/images/wt.png')}
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
    paddingVertical: isLargeScreen ? 40 : 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: isLargeScreen ? 50 : 30,
  },
  title2: {
    fontFamily: 'Anton',
    fontSize: isLargeScreen ? 100 : 60,
    fontWeight: '400',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontFamily: 'Anton-Regular',
    fontSize: isLargeScreen ? 180 : 120,
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
    marginTop: isLargeScreen ? 40 : 20,
    flexWrap: isLargeScreen ? 'nowrap' : 'wrap', // Wrap images on smaller screens
  },
  image: {
    width: isLargeScreen ? 300 : 150,
    height: isLargeScreen ? 300 : 150,
    marginHorizontal: isLargeScreen ? 20 : 10,
    marginVertical: isLargeScreen ? 0 : 10, // Add margin for smaller screens
    resizeMode: 'contain',
  },
});

export default Home;
