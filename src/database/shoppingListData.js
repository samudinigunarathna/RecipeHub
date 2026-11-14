
import { dbPromise } from './database';

// 1. Add a single ingredient manually
export async function addShoppingItem(
    ingredient,
    recipeId = null,
    recipeName = null
) {
    const db = await dbPromise;

    if (!ingredient || !ingredient.trim()) {
        throw new Error('Ingredient cannot be empty');
    }

    await db.runAsync(
        `INSERT INTO shopping_list
     (ingredient, recipeId, recipeName)
     VALUES (?, ?, ?)`,
        ingredient.trim(),
        recipeId,
        recipeName
    );
}

// 2. Add all ingredients from a recipe
export async function addRecipeIngredients(recipe) {
    if (!recipe || !recipe.ingredients) {
        throw new Error('Recipe ingredients not found');
    }

    let ingredients = recipe.ingredients;

    // Handle ingredients stored as JSON text
    if (typeof ingredients === 'string') {
        ingredients = JSON.parse(ingredients);
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        throw new Error('No ingredients available');
    }

    const db = await dbPromise;

    for (const ingredient of ingredients) {
        if (typeof ingredient === 'string' && ingredient.trim()) {
            await db.runAsync(
                `INSERT INTO shopping_list
         (ingredient, recipeId, recipeName)
         VALUES (?, ?, ?)`,
                ingredient.trim(),
                recipe.id ?? null,
                recipe.name ?? 'Unknown Recipe'
            );
        }
    }
}

// 3. Get all shopping list items
export async function getShoppingList() {
    const db = await dbPromise;

    return await db.getAllAsync(`
    SELECT * FROM shopping_list
    ORDER BY isPurchased ASC, id DESC;
  `);
}

// 4. Mark an ingredient as purchased or not purchased
export async function toggleShoppingItem(id, isPurchased) {
    const db = await dbPromise;

    await db.runAsync(
        `UPDATE shopping_list
     SET isPurchased = ?
     WHERE id = ?`,
        isPurchased ? 1 : 0,
        id
    );
}

// 5. Delete a single shopping list item
export async function deleteShoppingItem(id) {
    const db = await dbPromise;

    await db.runAsync(
        `DELETE FROM shopping_list WHERE id = ?`,
        id
    );
}

// 6. Clear all purchased items
export async function clearPurchasedItems() {
    const db = await dbPromise;

    await db.runAsync(
        `DELETE FROM shopping_list WHERE isPurchased = 1`
    );
}
