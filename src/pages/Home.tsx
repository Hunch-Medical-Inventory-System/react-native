import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isLargeScreen = width > 768;

const Home = () => {
  return (
    <View style={styles.background}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#181818',
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
    color: '#E94560',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  title: {
    fontFamily: 'Anton-Regular',
    fontSize: isLargeScreen ? 180 : 120,
    fontWeight: '700',
    color: '#E94560',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: isLargeScreen ? 40 : 20,
    flexWrap: isLargeScreen ? 'nowrap' : 'wrap',
  },
  image: {
    width: isLargeScreen ? 300 : 150,
    height: isLargeScreen ? 300 : 150,
    marginHorizontal: isLargeScreen ? 20 : 10,
    marginVertical: isLargeScreen ? 0 : 10,
    resizeMode: 'contain',
  },
});

export default Home;
