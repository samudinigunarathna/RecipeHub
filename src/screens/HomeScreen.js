import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../styles/colors';
import { getAllRecipes } from '../database/recipeData';
import recipeImages from '../database/recipeImages';

export default function HomeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  );

  const openRecipes = (recipe) => {
    navigation.navigate('RecipeDetails', { recipe });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Recipes</Text>
        <Text style={styles.recipeCount}>{recipes.length} Recipes</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : recipes.length === 0 ? (
        <Text style={styles.emptyText}>No recipes found. Please add some recipes to your database.</Text>
      ) : (
        <View style={styles.recipeList}>
          {recipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              activeOpacity={0.85}
              onPress={() => openRecipes(recipe)}
            >
              <Image
                source={recipeImages[recipe.image]}
                style={styles.recipeImage}
                resizeMode="cover"
              />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeCategory}>{recipe.category}</Text>
                <Text style={styles.recipeTime}>
                  {(recipe.prepTime || 0) + (recipe.cookTime || 0)} minutes | {recipe.servings || '-'} servings
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.bottomSpace} />
    </ScrollView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.text,
  },
  recipeCount: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  recipeList: {
    gap: 18,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  recipeImage: {
    width: '100%',
    height: 190,
    backgroundColor: colors.border,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  recipeCategory: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 5,
  },
  recipeTime: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 9,
  },
  loader: {
    marginTop: 35,
  },
  emptyText: {
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 25,
  },
  bottomSpace: {
    height: 30,
  },
});
