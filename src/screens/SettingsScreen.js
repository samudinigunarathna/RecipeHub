import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

import colors from '../styles/colors';
import { getAllRecipes } from '../database/recipeData';

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
        <Image
          source={require('../../assets/images/logo.jpg')}
          style={styles.appLogo}
          resizeMode="cover"
        />

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

      {/* Footer Box */}
      <View style={styles.footerBox}>
        <View style={styles.footerHeader}>
          <Text style={styles.footerBrand}>RecipeHub</Text>
          <Text style={styles.footerCopyright}>© 2026</Text>
        </View>

        <View style={styles.authorSection}>
          <Text style={styles.authorLabel}>Implemented by</Text>
          <Text style={styles.authorName}>Samudini Gunarathna</Text>
          <Text style={styles.authorDegree}>
            BSc in IT - Faculty of Applied Science
          </Text>
        </View>

        <View style={styles.footerDivider} />

        <View style={styles.contactSection}>
          <Text style={styles.contactLabel}>contact us</Text>
          <TouchableOpacity
            style={styles.emailPill}
            activeOpacity={0.7}
            onPress={() => Linking.openURL('mailto:samudinigunarathna@gmail.com')}
          >
            <Text style={styles.emailPrefix}>email: </Text>
            <Text style={styles.emailAddress}>samudinigunarathna@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </View>

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

  appLogo: {
    width: 85,
    height: 85,
    borderRadius: 22,
    marginBottom: 14,
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

  footerBox: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: colors.border,
  },

  footerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },

  footerBrand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },

  footerCopyright: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: '600',
  },

  authorSection: {
    alignItems: 'center',
    marginBottom: 14,
  },

  authorLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '600',
  },

  authorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },

  authorDegree: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: 'center',
  },

  footerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  contactSection: {
    alignItems: 'center',
    width: '100%',
  },

  contactLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 8,
  },

  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCEBDD',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  emailPrefix: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },

  emailAddress: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});