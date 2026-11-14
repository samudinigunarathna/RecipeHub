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

  //Create Recipe Reviews table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS recipe_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipeId INTEGER NOT NULL UNIQUE,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipeId) REFERENCES recipes(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS shopping_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ingredient TEXT NOT NULL,
      recipeId INTEGER,
      recipeName TEXT,
      isPurchased INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('RecipeHub database initialized!');
  console.log('Recipes table initialized!');
  console.log('Favorites table initialized!');
  console.log('Recipe Reviews table initialized!');
  console.log('Shopping List table initialized!');
}
