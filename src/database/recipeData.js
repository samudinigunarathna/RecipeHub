import { dbPromise } from './database';

// Initial recipe collection
const recipes = [
  {
    name: 'Chicken Kottu',
    category: 'Sri Lankan',
    description: 'A delicious Sri Lankan street food made with chopped roti, chicken, vegetables and aromatic spices.',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    ingredients: [
      '2 godamba rotis',
      '200g chicken',
      '1 onion',
      '1 carrot',
      '1 egg',
      '2 tablespoons oil',
      'Salt and pepper',
      'Chili sauce'
    ],
    instructions: [
      'Cook the chicken and cut it into small pieces.',
      'Chop the godamba roti into small strips.',
      'Heat oil in a pan and add chopped onions and carrots.',
      'Add the egg and cooked chicken.',
      'Add the chopped roti and seasonings.',
      'Mix everything well and serve hot.'
    ],
    image: 'chickenKottu'
  },
  {
    name: 'Kiribath',
    category: 'Sri Lankan',
    description: 'Traditional Sri Lankan milk rice, commonly prepared for special occasions and celebrations.',
    prepTime: 5,
    cookTime: 30,
    servings: 4,
    ingredients: [
      '2 cups white rice',
      '3 cups water',
      '1 cup coconut milk',
      'Salt to taste'
    ],
    instructions: [
      'Wash the rice thoroughly.',
      'Add rice and water to a pot and cook until soft.',
      'Add coconut milk and salt.',
      'Stir gently and cook until creamy.',
      'Transfer to a flat plate and flatten the surface.',
      'Allow to cool slightly and cut into diamond shapes.'
    ],
    image: 'kiribath'
  },
  {
    name: 'Chicken Fried Rice',
    category: 'Asian',
    description: 'A flavourful fried rice dish prepared with chicken, vegetables, eggs and soy sauce.',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    ingredients: [
      '2 cups cooked rice',
      '150g chicken',
      '1 egg',
      '1 carrot',
      '1/2 cup spring onions',
      '2 tablespoons soy sauce',
      '2 tablespoons oil',
      'Salt and pepper'
    ],
    instructions: [
      'Cook the chicken and cut it into small pieces.',
      'Heat oil in a wok or large pan.',
      'Add the egg and scramble it.',
      'Add chicken and chopped vegetables.',
      'Add cooked rice and soy sauce.',
      'Mix well and cook for a few minutes.',
      'Garnish with spring onions and serve.'
    ],
    image: 'chickenFriedRice'
  },
  {
    name: 'Watalappan',
    category: 'Desserts',
    description: 'A traditional Sri Lankan dessert made with coconut milk, jaggery, eggs and aromatic spices.',
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    ingredients: [
      '200g grated jaggery',
      '4 eggs',
      '1 cup coconut milk',
      '1/2 teaspoon cardamom powder',
      'A pinch of nutmeg',
      'Cashew nuts'
    ],
    instructions: [
      'Melt the jaggery with a little warm water.',
      'Beat the eggs in a bowl.',
      'Add coconut milk and melted jaggery.',
      'Add cardamom and nutmeg.',
      'Strain the mixture into a heatproof bowl.',
      'Steam for approximately 40 minutes until set.',
      'Cool and garnish with cashew nuts.'
    ],
    image: 'watalappan'
  },
  {
    name: 'Pasta Alfredo',
    category: 'Italian',
    description: 'Creamy Italian-style pasta prepared with a rich Alfredo sauce.',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    ingredients: [
      '200g pasta',
      '1 cup fresh cream',
      '2 tablespoons butter',
      '2 cloves garlic',
      '1/2 cup grated Parmesan cheese',
      'Salt and pepper',
      'Parsley'
    ],
    instructions: [
      'Boil pasta according to the package instructions.',
      'Melt butter in a pan.',
      'Add minced garlic and cook briefly.',
      'Pour in the fresh cream.',
      'Add Parmesan cheese and stir until creamy.',
      'Add cooked pasta and mix well.',
      'Season with salt and pepper.',
      'Garnish with parsley and serve.'
    ],
    image: 'pasta_alfredo'
  }
];

// Insert recipes into SQLite
export async function insertRecipes() {
  const db = await dbPromise;

  const result = await db.getFirstAsync(
    'SELECT COUNT(*) AS count FROM recipes'
  );

  // Avoid inserting duplicate recipes
  if (result.count > 0) {
    console.log('Recipes already exist in the database.');
    return;
  }

  for (const recipe of recipes) {
    await db.runAsync(
      `INSERT INTO recipes
      (name, category, description, prepTime, cookTime,
       servings, ingredients, instructions, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe.name,
        recipe.category,
        recipe.description,
        recipe.prepTime,
        recipe.cookTime,
        recipe.servings,
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.instructions),
        recipe.image
      ]
    );
  }

  console.log('Recipes inserted successfully!');
}

// Retrieve all recipes from SQLite
export async function getAllRecipes() {
  const db = await dbPromise;

  const recipesFromDB = await db.getAllAsync(
    'SELECT * FROM recipes ORDER BY id DESC'
  );

  return recipesFromDB.map(recipe => ({
    ...recipe,
    ingredients: JSON.parse(recipe.ingredients),
    instructions: JSON.parse(recipe.instructions)
  }));
}

export async function updateRecipeImages() {
  const db = await dbPromise;

  await db.runAsync(`
    UPDATE recipes
    SET image = ? WHERE name = ?`, 'chickenKottu', 'Chicken Kottu'
  );

  await db.runAsync(`
    UPDATE recipes
    SET image = ? WHERE name = ?`, 'kiribath', 'Kiribath'
  );

    await db.runAsync(`
    UPDATE recipes
    SET image = ? WHERE name = ?`, 'watalappan', 'Watalappan'
  );

    await db.runAsync(`
    UPDATE recipes
    SET image = ? WHERE name = ?`, 'pasta_alfredo', 'Pasta Alfredo'
  );

  await db.runAsync(`
    UPDATE recipes
    SET image = ? WHERE name = ?`, 'chickenFriedRice', 'Chicken Fried Rice'
  );
}