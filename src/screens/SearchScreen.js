import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

import colors from '../styles/colors';
import { getAllRecipes } from '../database/recipeData';
import recipeImages from '../database/recipeImages';

export default function SearchScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Load recipes from SQLite
  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.log('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get available categories
  const categories = [
    'All',
    ...new Set(recipes.map(recipe => recipe.category)),
  ];

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter(recipe => {
    const query = searchText.toLowerCase().trim();

    const matchesSearch =
      recipe.name.toLowerCase().includes(query) ||
      recipe.category.toLowerCase().includes(query) ||
      (Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : []
      ).some(item => item.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategory === 'All' ||
      recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Recipe card
  const renderRecipe = ({ item }) => {
    const imageSource = recipeImages[item.image];
    const totalTime =
      (item.prepTime || 0) + (item.cookTime || 0);

    return (
      <TouchableOpacity
        style={styles.recipeCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('RecipeDetails', { recipe: item })
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
            <Text style={styles.placeholderText}>🍽️</Text>
          </View>
        )}

        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{item.name}</Text>

          <Text style={styles.recipeCategory}>
            {item.category}
          </Text>

          <Text style={styles.recipeTime}>
            ⏱️ {totalTime} minutes
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Recipes 🔍</Text>

      <Text style={styles.subtitle}>
        Discover delicious meals for every occasion.
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes or ingredients..."
          placeholderTextColor={colors.secondaryText}
          value={searchText}
          onChangeText={setSearchText}
        />

        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item}
          contentContainerStyle={styles.categoryListContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item &&
                  styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(item)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item &&
                    styles.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Search Results */}
      <View style={styles.resultHeader}>
        <Text style={styles.sectionTitle}>Search Results</Text>

        <Text style={styles.resultCount}>
          {filteredRecipes.length} recipes
        </Text>
      </View>

      {loading ? (
        <Text style={styles.message}>Loading recipes...</Text>
      ) : filteredRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.message}>
            Try another recipe name or ingredient.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderRecipe}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
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
    marginTop: 8,
    marginBottom: 22,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: colors.border,
  },

  searchIcon: {
    fontSize: 19,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  clearButton: {
    fontSize: 18,
    color: colors.secondaryText,
    padding: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
  },

  categoryContainer: {
    marginTop: 14,
  },

  categoryListContent: {
    paddingVertical: 4,
  },

  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  selectedCategoryText: {
    color: '#FFFFFF',
  },

  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },

  resultCount: {
    fontSize: 13,
    color: colors.secondaryText,
  },

  resultsList: {
    paddingBottom: 25,
  },

  recipeCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  recipeImage: {
    width: 115,
    height: 125,
  },

  imagePlaceholder: {
    width: 115,
    height: 125,
    backgroundColor: '#F0E5DC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
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
    marginBottom: 6,
  },

  recipeCategory: {
    fontSize: 13,
    color: colors.primary,
    marginBottom: 9,
  },

  recipeTime: {
    fontSize: 12,
    color: colors.secondaryText,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 55,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 15,
  },
});
