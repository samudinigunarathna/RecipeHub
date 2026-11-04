import React, { useState, useCallback} from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import recipeImages from '../database/recipeImages';
import { getFavoriteRecipes, removeFavoriteRecipe } from '../database/favoritesData';

export default function FavouritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadFavorites = async () => {
    try{
      const data = await getFavoriteRecipes();
      setFavorites(data);
    }catch(error){
      console.log("Error loading Favorites....", error);
    }finally{
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await removeFavoriteRecipe(recipeId);
      loadFavorites();
    } catch (error) {
      console.log("Error removing favorite recipe:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>My Favorites ❤️</Text>
      <Text style={styles.subtitle}>
        Here you can find all your favorite recipes in one place. Add or remove recipes from your favorites list to keep track of the dishes you love the most.
      </Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyText}>You have no favorite recipes yet.</Text>
          <Text style={styles.emptyText}>Start exploring and add some to your favorites!</Text>
        </View>
      ) : (
        favorites.map((recipe) => {
          const recipeImage = recipeImages[recipe.image];
          return (
            <View key={recipe.id} style={styles.recipeCard}>
              <TouchableOpacity style={styles.recipeContent} activeOpacity={0.8} onPress={() => navigation.navigate('RecipeDetails', { recipe })
            }>
                {recipeImage ? (
                  <Image
                    source={recipeImage}
                    style={styles.recipeImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>🍽️</Text>
                  </View>
                )}
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <Text style={styles.recipeCategory}>{recipe.category}</Text>
                  <Text style={styles.recipeTime}>⏱️{(recipe.prepTime || 0) + (recipe.cookTime || 0)} mins</Text>
                 </View> 
                </TouchableOpacity>

                <TouchableOpacity 
                style={styles.removeButton}
                onPress={()=>
                  handleRemoveFavorite(recipe.id)}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
               </View> 
             );
          })
        )}  
        <View style={styles.bottomSpace}/>
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
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },

  emptyText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },

  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 20,
    overflow: 'hidden',
    padding: 12,
    elevation: 3,
  },

  recipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recipeImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderRadius: 12,
  },

  imagePlaceholder: {
    width: 105,
    height: 105,
    borderRadius: 12,
    backgroundColor: '#F0E5DC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    fontSize: 30,
  },

  recipeInfo: {
    flex: 1,
    marginLeft: 14,
  },

  recipeName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },

  recipeCategory: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 5,
  },

  recipeTime: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 8,
  },

  removeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginTop: 8,
    backgroundColor: '#FCEBDD',
    borderRadius: 18,
  },

  removeButtonText: {
    color: '#C85D2D',
    fontSize: 12,
    fontWeight: 'bold',
  },

  bottomSpace: {
    height: 25,
  }
});