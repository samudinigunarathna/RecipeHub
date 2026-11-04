import { dbPromise } from './database';

export async function getFavoriteRecipes() {
  const db = await dbPromise;

  const recipes = await db.getAllAsync(`
    SELECT recipes.*
    FROM recipes
    INNER JOIN favorites
    ON recipes.id = favorites.recipeId
    ORDER BY favorites.id DESC;
  `);

  return recipes.map(recipe => ({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients || '[]'),
    instructions: JSON.parse(recipe.instructions || '[]'),
  }));
}

export async function isFavoriteRecipe(recipeId) {
  const db = await dbPromise;

  const result = await db.getFirstAsync(
    'SELECT id FROM favorites WHERE recipeId = ?',
    recipeId
  );

  return !!result;
}

export async function addFavoriteRecipe(recipeId) {
  const db = await dbPromise;

  await db.runAsync(
    'INSERT OR IGNORE INTO favorites (recipeId) VALUES (?)',
    recipeId
  );
}

export async function removeFavoriteRecipe(recipeId) {
  const db = await dbPromise;

  await db.runAsync(
    'DELETE FROM favorites WHERE recipeId = ?',
    recipeId
  );
}