import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Categories</Text>
      <Text style={styles.subtitle}>
        Explore recipes based on your favorite food categories.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 22,
    paddingTop: 35,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginTop: 12,
  },
});