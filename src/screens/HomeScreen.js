import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, Food Lover! 👋</Text>
      <Text style={styles.title}>What would you like to cook?</Text>
      <Text style={styles.subtitle}>
        Discover delicious recipes for every day.
      </Text>

      <View style={styles.featured}>
        <Text style={styles.featuredTitle}>
          Welcome to RecipeHub 🍳
        </Text>
        <Text style={styles.featuredText}>
          Your favorite recipes, always available offline.
        </Text>
      </View>
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
  greeting: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginTop: 8,
  },
  featured: {
    backgroundColor: colors.primary,
    padding: 22,
    borderRadius: 20,
    marginTop: 30,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 21,
  },
});