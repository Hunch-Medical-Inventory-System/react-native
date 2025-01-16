import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Text>Placeholder for additional screens or navigators</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
