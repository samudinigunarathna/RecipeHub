import * as SQLite from 'expo-sqlite';

// Open or create the local database
export const dbPromise = SQLite.openDatabaseAsync('recipehub.db');

// Initialize database tables
export async function initializeDatabase() {
  const db = await dbPromise;

  // Create Recipes table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      prepTime INTEGER,
      cookTime INTEGER,
      servings INTEGER,
      ingredients TEXT,
      instructions TEXT
    );
  `);

  // Create Favorites table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipeId INTEGER UNIQUE,
      FOREIGN KEY (recipeId) REFERENCES recipes(id)
    );
  `);

  console.log('RecipeHub database initialized!');
}