import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const About = () => (
  <View style={styles.container}>
    <Text style={styles.text}>This is the About Page</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});

export default About;
