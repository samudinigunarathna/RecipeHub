import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import colors from '../styles/colors';
import { getAllRecipes } from '../database/recipeData';
import { Link } from '@react-navigation/native';

export default function SettingsScreen() {
  const [recipeCount, setRecipeCount] = useState(0);

  useEffect(() => {
    loadRecipeCount();
  }, []);

  const loadRecipeCount = async () => {
    try {
      const recipes = await getAllRecipes();
      setRecipeCount(recipes.length);
    } catch (error) {
      console.log('Error loading recipe count:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Settings ⚙️</Text>

      <Text style={styles.subtitle}>
        Manage your RecipeHub application information.
      </Text>

      {/* Application Information */}
      <View style={styles.appCard}>
        <View style={styles.appIcon}>
          <Text style={styles.appIconText}>🍽️</Text>
        </View>

        <Text style={styles.appName}>RecipeHub</Text>

        <Text style={styles.appDescription}>
          Offline Recipe Management Application
        </Text>

        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>

      {/* Statistics */}
      <Text style={styles.sectionTitle}>Your RecipeHub</Text>

      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Text style={styles.iconText}>📖</Text>
        </View>

        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>Total Recipes</Text>
          <Text style={styles.statSubtitle}>
            Recipes stored in your database
          </Text>
        </View>

        <Text style={styles.statValue}>{recipeCount}</Text>
      </View>

      {/* Application Features */}
      <Text style={styles.sectionTitle}>Application Features</Text>

      <View style={styles.featureCard}>
        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>📴</Text>

          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Offline Access</Text>
            <Text style={styles.featureDescription}>
              Access your stored recipes without an internet connection.
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>💾</Text>

          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Local Database</Text>
            <Text style={styles.featureDescription}>
              Recipe information is stored locally using SQLite.
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.featureRow}>
          <Text style={styles.featureIcon}>❤️</Text>

          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Favorite Recipes</Text>
            <Text style={styles.featureDescription}>
              Save and access your favorite meals easily.
            </Text>
          </View>
        </View>
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>About RecipeHub</Text>

        <Text style={styles.aboutDescription}>
          RecipeHub is an offline recipe management application
          designed to help users explore, search, organize, and
          save their favorite recipes.
        </Text>

        <Text style={styles.aboutFooter}>
          Made with ❤️ using React Native and SQLite.
        </Text>
      </View>

      <Text style={styles.footer}>
        RecipeHub © 2026 {"\n"}
        Implemented by Samudini Gunarathna {"\n"}
        BSc in IT - Faculty of Applied Science {"\n"}
        {"\n"}
        contact us {"\n"}
          email: <Link src = "samudinigunarathna@gmail.com">samudinigunarathna@gmail.com</Link>
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    padding: 22,
    paddingTop: 35,
    paddingBottom: 35,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.text,
  },

  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginTop: 10,
    marginBottom: 25,
  },

  appCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 28,
  },

  appIcon: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: '#FCEBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  appIconText: {
    fontSize: 38,
  },

  appName: {
    fontSize: 23,
    fontWeight: 'bold',
    color: colors.text,
  },

  appDescription: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 6,
    textAlign: 'center',
  },

  versionBadge: {
    backgroundColor: '#FCEBDD',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 15,
  },

  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 14,
  },

  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 17,
    marginBottom: 28,
    elevation: 2,
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FCEBDD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 24,
  },

  statInfo: {
    flex: 1,
    marginLeft: 13,
  },

  statTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },

  statSubtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
  },

  statValue: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.primary,
  },

  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 17,
    marginBottom: 28,
    elevation: 2,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  featureIcon: {
    fontSize: 25,
    width: 42,
  },

  featureInfo: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },

  featureDescription: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 5,
    lineHeight: 18,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 5,
  },

  aboutCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 19,
    elevation: 2,
  },

  aboutTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },

  aboutDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 22,
  },

  aboutFooter: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 18,
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 28,
  },
});