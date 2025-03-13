import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  useWindowDimensions,
} from 'react-native';

// ✅ Fixed TypeScript error by explicitly typing the images object
const images: Record<string, any> = {
  nasa_hunch: require('@/assets/images/nasa_hunch.png'),
  logo: require('@/assets/images/logo.png'),
  wt: require('@/assets/images/wt.png'),
};

const Home: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Animated Header */}
        <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.title2, { fontSize: isLargeScreen ? 80 : 40 }]}>
            Medical Based
          </Text>
          <Text style={[styles.title, { fontSize: isLargeScreen ? 120 : 60 }]}>
            Inventory System
          </Text>
        </Animated.View>

        {/* Image Row */}
        <View style={styles.imageRow}>
          {Object.keys(images).map((key, index) => (
            <Animated.Image
              key={index}
              source={images[key]}
              style={[
                styles.image,
                {
                  width: isLargeScreen ? 200 : 120,
                  height: isLargeScreen ? 200 : 120,
                  opacity: fadeAnim,
                },
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#181818', // Solid dark background
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title2: {
    fontWeight: '400',
    color: '#E94560',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    textTransform: 'uppercase',
  },
  title: {
    fontWeight: '700',
    color: '#E94560',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    textTransform: 'uppercase',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  image: {
    margin: 8,
    resizeMode: 'contain',
  },
});

export default Home;
