import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import colors from '../styles/colors';
import { getAllRecipes } from '../database/recipeData';
import recipeImages from '../database/recipeImages';

const categoryIcons = {
  'Sri Lankan': '🇱🇰',
  Asian: '🥢',
  Desserts: '🍰',
  Italian: '🍝',
};

export default function CategoriesScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.log('Error loading categories:', error);
    }
  };

  // Create categories dynamically
  const categories = [...new Set(
    recipes.map(recipe => recipe.category)
  )];

  // Count recipes in each category
  const getCategoryCount = category =>
    recipes.filter(recipe => recipe.category === category).length;

  // Get recipes belonging to selected category
  const categoryRecipes = recipes.filter(
    recipe => recipe.category === selectedCategory
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Explore Categories 🍽️</Text>

      <Text style={styles.subtitle}>
        Discover delicious recipes from different food categories.
      </Text>

      {/* Category Cards */}
      <Text style={styles.sectionTitle}>Browse Categories</Text>

      <View style={styles.categoryGrid}>
        {categories.map(category => {
          const isSelected = selectedCategory === category;

          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryCard,
                isSelected && styles.selectedCategoryCard,
              ]}
              onPress={() =>
                setSelectedCategory(
                  isSelected ? null : category
                )
              }
              activeOpacity={0.8}
            >
              <Text style={styles.categoryIcon}>
                {categoryIcons[category] || '🍴'}
              </Text>

              <Text
                style={[
                  styles.categoryName,
                  isSelected && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>

              <Text
                style={[
                  styles.categoryCount,
                  isSelected && styles.selectedCategoryText,
                ]}
              >
                {getCategoryCount(category)} recipes
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Category Recipes */}
      <View style={styles.resultHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory
            ? `${selectedCategory} Recipes`
            : 'All Recipes'}
        </Text>

        {selectedCategory && (
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={styles.clearText}>Show All</Text>
          </TouchableOpacity>
        )}
      </View>

      {recipes
        .filter(recipe =>
          !selectedCategory ||
          recipe.category === selectedCategory
        )
        .map(recipe => {
          const imageSource = recipeImages[recipe.image];

          const totalTime =
            (recipe.prepTime || 0) + (recipe.cookTime || 0);

          return (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('RecipeDetails', {
                  recipe,
                })
              }
            >
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.recipeImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderIcon}>🍽️</Text>
                </View>
              )}

              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>
                  {recipe.name}
                </Text>

                <Text style={styles.recipeCategory}>
                  {recipe.category}
                </Text>

                <Text style={styles.recipeTime}>
                  ⏱️ {totalTime} minutes
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

      {recipes.length === 0 && (
        <Text style={styles.emptyText}>
          No recipes available yet.
        </Text>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    padding: 20,
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
    marginTop: 10,
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 28,
  },

  categoryCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 17,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },

  selectedCategoryCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  categoryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  categoryCount: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 6,
  },

  selectedCategoryText: {
    color: '#FFFFFF',
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  clearText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },

  recipeCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },

  recipeImage: {
    width: 115,
    height: 120,
  },

  imagePlaceholder: {
    width: 115,
    height: 120,
    backgroundColor: '#F0E5DC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderIcon: {
    fontSize: 35,
  },

  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 7,
  },

  recipeCategory: {
    fontSize: 13,
    color: colors.primary,
    marginBottom: 8,
  },

  recipeTime: {
    fontSize: 12,
    color: colors.secondaryText,
  },

  emptyText: {
    textAlign: 'center',
    color: colors.secondaryText,
    marginTop: 30,
  },

  bottomSpace: {
    height: 25,
  },
});