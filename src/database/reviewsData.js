import { dbPromise } from './database';

// Get the review for a particular recipe
export async function getRecipeReview(recipeId) {
    const db = await dbPromise;

    return await db.getFirstAsync(
        'SELECT * FROM recipe_reviews WHERE recipeId = ?',
        recipeId
    );
}

// Add a new review or update an existing review
export async function saveRecipeReview(recipeId, rating, notes) {
    const db = await dbPromise;

    const existingReview = await getRecipeReview(recipeId);

    if (existingReview) {
        await db.runAsync(
            `UPDATE recipe_reviews
       SET rating = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE recipeId = ?`,
            rating,
            notes,
            recipeId
        );
    } else {
        await db.runAsync(
            `INSERT INTO recipe_reviews (recipeId, rating, notes)
       VALUES (?, ?, ?)`,
            recipeId,
            rating,
            notes
        );
    }
}

// Delete a review
export async function deleteRecipeReview(recipeId) {
    const db = await dbPromise;

    await db.runAsync(
        'DELETE FROM recipe_reviews WHERE recipeId = ?',
        recipeId
    );
}