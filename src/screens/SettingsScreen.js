import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings ⚙️</Text>
      <Text style={styles.subtitle}>
        RecipeHub – Offline Recipe Management Application
      </Text>
      <Text style={styles.version}>Version 1.0.0</Text>
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
    lineHeight: 23,
  },
  version: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 25,
  },
});