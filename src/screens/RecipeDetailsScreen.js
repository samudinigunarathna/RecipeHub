import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { addFavoriteRecipe, removeFavoriteRecipe, isFavoriteRecipe } from '../database/favoritesData';
import colors from '../styles/colors';
import recipeImages from '../database/recipeImages';

export default function RecipeDetailsScreen({ route, navigation }) {
  const { recipe } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const recipeImage = recipeImages[recipe.image];
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : JSON.parse(recipe.ingredients || '[]');
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : JSON.parse(recipe.instructions || '[]');
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const status = await isFavoriteRecipe(recipe.id);
        setIsFavorite(status);
      } catch (error) {
        console.log('Error checking favorite', error);
      }
    };

    checkFavorite();
  }, [recipe.id]);

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavoriteRecipe(recipe.id);
        setIsFavorite(false);
      } else {
        await addFavoriteRecipe(recipe.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.log('Favorite update error:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        {recipeImage ? (
          <Image
            source={recipeImage}
            style={styles.recipeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageEmoji}>🍽️</Text>
            <Text style={styles.noImageText}>Image unavailable</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavorite}
          activeOpacity={0.8}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.name}</Text>
        {recipe.description ? (
          <Text style={styles.description}>{recipe.description}</Text>
        ) : null}

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <Text style={styles.infoValue}>{totalTime} min</Text>
            <Text style={styles.infoLabel}>Total Time</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🍳</Text>
            <Text style={styles.infoValue}>{recipe.cookTime || 0} min</Text>
            <Text style={styles.infoLabel}>Cooking</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>👥</Text>
            <Text style={styles.infoValue}>{recipe.servings || '-'}</Text>
            <Text style={styles.infoLabel}>Servings</Text>
          </View>
        </View>

        {recipe.prepTime ? (
          <View style={styles.preparationBox}>
            <Text style={styles.preparationText}>
              ⏱️ Preparation time: {recipe.prepTime} mins
            </Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Ingredients 🥗</Text>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ingredientText}>{ingredient}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Cooking Instructions 👩‍🍳</Text>
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{instruction}</Text>
          </View>
        ))}
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
    paddingBottom: 35,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
    backgroundColor: colors.border,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
  },
  noImageEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  noImageText: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  favoriteButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#E05252',
    lineHeight: 26,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  infoIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  preparationBox: {
    backgroundColor: '#FCEBDD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
  },
  preparationText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
    marginBottom: 14,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  bullet: {
    fontSize: 18,
    color: colors.primary,
    marginRight: 10,
    fontWeight: 'bold',
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: '#514740',
    lineHeight: 21,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#514740',
    lineHeight: 22,
  },
});
