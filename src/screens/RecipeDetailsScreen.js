import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';
import recipeImages from '../database/recipeImages';

export default function RecipeDetailsScreen({ route, navigation }) {
  const { recipe } = route.params;
  const recipeImage = recipeImages[recipe.image];
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <ScrollView
      style={styles.container}
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
          <Text style={styles.noImageText}>🍽️</Text>
          <Text style={styles.noImageText}>Image unavailable</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <View style = {styles.categoryBadge}>
        <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
      </View>
      </View>
      
      <View style = {styles.content}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.description}>{recipe.description}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>⏱️</Text>
          <Text style={styles.infoValue}>{totalTime} min</Text>
          <Text style={styles.infoLabel}>Total Time</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🍳</Text>
          <Text style = {styles.infoValue}>{recipe.cookTime} min</Text>
          <Text style={styles.infoLabel}>Cooking</Text>
        </View>
        

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>👥</Text>
          <Text style = {styles.infoValue}>{recipe.servings}</Text>
          <Text style={styles.infoLabel}>Servings</Text>
        </View>
      </View>

      <View style = {styles.preparationBox}>
        <Text style={styles.preparationText}>
          ⏱️ Preparation time: 
        </Text>  
      </View>

      <Text style={styles.sectionTitle}>Ingredients 🥗</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientItem}>
          <Text style={styles.ingredientText}>• {ingredient}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>cooking Instructions 👩‍🍳</Text>
      {recipe.instructions.map((instruction, index) => (
        <View key={index} style={styles.instructionItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.instructionText}>{instruction}</Text>
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
    padding: 22,
    paddingTop: 35,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    position: 'relative',
    backgroundColor: '#F0E5DC'
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noImageText: {
    fontSize: 18,
    color: '8C8179',
    margin: 4
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    backgroundColor: 'E87945',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: '#81766E',
    lineHeight: 21,
    marginBottom: 8
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7
  },
  infoCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 7
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#292522'
  },
  infoLabel: {
    fontSize: 12,
    color: '#8C8179',
  },
  preparationBox: {
    backgroundColor: '#FCEBDD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 25
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#292522',
    marginBottom: 16
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 13,
    borderRadius: 10,
    marginBottom: 8,
  },

  bullet: {
    fontSize: 19,
    color: '#E87945',
    marginRight: 10,
  },

  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: '#514740',
    lineHeight: 22,
  },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 13,
    marginBottom: 11,
    elevation: 1,
  },

  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E87945',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#514740',
    lineHeight: 23,
    paddingTop: 3,
  },

  bottomSpace: {
    height: 25
  },
  subtitle: {
    fontSize: 15,
    color: '#8C8179',
    marginTop: 12,
  },
});