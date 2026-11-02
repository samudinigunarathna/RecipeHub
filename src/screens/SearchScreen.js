import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Recipes 🔍</Text>
      <Text style={styles.subtitle}>
        Search for your favorite meals and ingredients.
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
    color: colors.secondaryText,
    fontSize: 15,
    marginTop: 12,
  },
});