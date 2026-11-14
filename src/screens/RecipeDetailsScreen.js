import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { addFavoriteRecipe, removeFavoriteRecipe, isFavoriteRecipe } from '../database/favoritesData';
import { getRecipeReview, saveRecipeReview, deleteRecipeReview } from '../database/reviewsData';
import colors from '../styles/colors';
import recipeImages from '../database/recipeImages';

function adjustIngredientQuantity(ingredient, originalServings, newServings) {
  if (!originalServings || !newServings) {
    return ingredient;
  }

  const ratio = newServings / originalServings;

  // Match quantities such as 2, 1/2, 1 1/2, or 0.5
  const match = ingredient.match(
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(.*)$/
  );

  // Keep ingredients such as "Salt to taste" unchanged
  if (!match) {
    return ingredient;
  }

  const quantityText = match[1];
  const remainingText = match[2];

  let quantity;

  if (quantityText.includes(' ')) {
    const parts = quantityText.split(' ');
    const whole = Number(parts[0]);
    const fractionParts = parts[1].split('/');

    quantity =
      whole + Number(fractionParts[0]) / Number(fractionParts[1]);
  } else if (quantityText.includes('/')) {
    const parts = quantityText.split('/');

    quantity = Number(parts[0]) / Number(parts[1]);
  } else {
    quantity = Number(quantityText);
  }

  const adjustedQuantity = quantity * ratio;

  // Avoid displaying unnecessary decimal places
  const formattedQuantity = Number(
    adjustedQuantity.toFixed(2)
  ).toString();

  return `${formattedQuantity}${remainingText}`;
}

export default function RecipeDetailsScreen({ route, navigation }) {
  const { recipe } = route.params;
  const originalServings = Number(recipe.servings) || 1;
  const [selectedServings, setSelectedServings] = useState(originalServings);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewNotes, setReviewNotes] = useState('');
  const [hasReview, setHasReview] = useState(false);
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

  useEffect(() => {
    const loadReview = async () => {
      try {
        const review = await getRecipeReview(recipe.id);

        if (review) {
          setRating(review.rating);
          setReviewNotes(review.notes || '');
          setHasReview(true);
        } else {
          setRating(0);
          setReviewNotes('');
          setHasReview(false);
        }
      } catch (error) {
        console.log('Error loading review:', error);
      }
    };

    loadReview();
  }, [recipe.id]);

  const handleSaveReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }

    try {
      await saveRecipeReview(
        recipe.id,
        rating,
        reviewNotes.trim()
      );

      setHasReview(true);

      Alert.alert('Success', 'Your review has been saved!');
    } catch (error) {
      console.log('Error saving review:', error);
      Alert.alert('Error', 'Unable to save your review.');
    }
  };

  const handleDeleteReview = async () => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete your review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipeReview(recipe.id);

              setRating(0);
              setReviewNotes('');
              setHasReview(false);

              Alert.alert('Deleted', 'Your review has been deleted.');
            } catch (error) {
              console.log('Error deleting review:', error);
              Alert.alert('Error', 'Unable to delete your review.');
            }
          }
        }
      ]
    );
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

      {/* Adjustable Serving Calculator */}
      <View style={styles.servingCard}>
        <View style={styles.servingHeader}>
          <View>
            <Text style={styles.servingTitle}>Adjust Servings 👥</Text>
            <Text style={styles.servingSubtitle}>
              Change the number of people
            </Text>
          </View>

          <View style={styles.servingControls}>
            <TouchableOpacity
              style={styles.servingButton}
              onPress={() =>
                setSelectedServings(current =>
                  Math.max(1, current - 1)
                )
              }
            >
              <Text style={styles.servingButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.servingCount}>
              {selectedServings}
            </Text>

            <TouchableOpacity
              style={styles.servingButton}
              onPress={() =>
                setSelectedServings(current =>
                  Math.min(50, current + 1)
                )
              }
            >
              <Text style={styles.servingButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedServings !== originalServings && (
          <TouchableOpacity
            onPress={() => setSelectedServings(originalServings)}
            style={styles.resetServingButton}
          >
            <Text style={styles.resetServingText}>
              Reset to original ({originalServings})
            </Text>
          </TouchableOpacity>
        )}
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
            <Text style={styles.ingredientText}>
              {adjustIngredientQuantity(
                ingredient,
                originalServings,
                selectedServings
              )}
            </Text>
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

        {/* Voice Chef Button */}
        <TouchableOpacity
          style={styles.voiceChefButton}
          onPress={() =>
            navigation.navigate('VoiceChef', {
              recipe: {
                ...recipe,
                instructions,
              },
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.voiceChefIcon}>🎙️</Text>

          <View style={styles.voiceChefButtonContent}>
            <Text style={styles.voiceChefButtonTitle}>
              Start Cooking with Voice Chef
            </Text>
            <Text style={styles.voiceChefButtonSubtitle}>
              Listen to step-by-step cooking instructions
            </Text>
          </View>

          <Text style={styles.voiceChefArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Rating and Review Section */}
      <Text style={styles.sectionTitle}>Rate This Recipe ⭐</Text>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSubtitle}>
          How would you rate this recipe?
        </Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
            >
              <Text style={styles.starIcon}>
                {star <= rating ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.ratingLabel}>
          {rating === 0
            ? 'Select your rating'
            : `${rating} out of 5 stars`}
        </Text>

        <Text style={styles.reviewSubtitle}>
          Your Personal Cooking Notes
        </Text>

        <TextInput
          style={styles.reviewInput}
          placeholder="Share your experience with this recipe..."
          placeholderTextColor={colors.secondaryText}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={reviewNotes}
          onChangeText={setReviewNotes}
        />

        <TouchableOpacity
          style={styles.saveReviewButton}
          onPress={handleSaveReview}
          activeOpacity={0.8}
        >
          <Text style={styles.saveReviewButtonText}>
            {hasReview ? 'Update Review' : 'Save Review'}
          </Text>
        </TouchableOpacity>

        {hasReview && (
          <TouchableOpacity
            style={styles.deleteReviewButton}
            onPress={handleDeleteReview}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteReviewButtonText}>
              Delete My Review
            </Text>
          </TouchableOpacity>
        )}
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
  reviewCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    marginTop: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  reviewSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  starIcon: {
    fontSize: 38,
    color: '#F5A623',
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 22,
  },
  reviewInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    minHeight: 110,
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
  },
  saveReviewButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteReviewButton: {
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteReviewButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  servingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  servingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servingTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  servingSubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  servingButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingButtonText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    lineHeight: 27,
  },
  servingCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    minWidth: 22,
    textAlign: 'center',
  },
  resetServingButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 5,
  },
  resetServingText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
  voiceChefButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 17,
    borderRadius: 15,
    marginTop: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  voiceChefIcon: {
    fontSize: 30,
    marginRight: 13,
  },

  voiceChefButtonContent: {
    flex: 1,
  },

  voiceChefButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  voiceChefButtonSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 5,
  },

  voiceChefArrow: {
    fontSize: 30,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
