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

  const columns = await db.getAllAsync("PRAGMA table_info(recipes);");

  const hasImageColumn = columns.some(column => column.name === 'image');

  if (!hasImageColumn) {
    await db.execAsync(`
      ALTER TABLE recipes ADD COLUMN image TEXT;
    `);
  }

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
