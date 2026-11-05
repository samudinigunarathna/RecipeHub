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
  },
  {
    name: 'Pol Roti',
    category: 'Sri Lankan',
    description: 'Traditional coconut flatbread served with spicy sambol or curry.',
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    ingredients: JSON.stringify([
      '2 cups wheat flour',
      '1 cup grated coconut',
      '1 onion',
      '2 green chilies',
      'Salt to taste',
      'Water as needed'
    ]),
    instructions: JSON.stringify([
      'Mix flour, grated coconut and salt in a bowl.',
      'Add chopped onion and green chilies.',
      'Add water gradually and prepare a soft dough.',
      'Divide the dough into small balls.',
      'Flatten each ball into a round shape.',
      'Cook on a hot pan until both sides are golden brown.'
    ]),
    image: 'polRoti'
  },
  {
    name: 'Chicken Biryani',
    category: 'Indian',
    description: 'Flavorful basmati rice cooked with chicken and aromatic spices.',
    prepTime: 25,
    cookTime: 40,
    servings: 4,
    ingredients: JSON.stringify([
      '2 cups basmati rice',
      '500g chicken',
      '2 onions',
      '1 tomato',
      '1/2 cup yogurt',
      '2 tablespoons biryani masala',
      '2 tablespoons cooking oil',
      'Salt to taste'
    ]),
    instructions: JSON.stringify([
      'Wash and soak the basmati rice.',
      'Marinate chicken with yogurt, salt and biryani masala.',
      'Fry sliced onions until golden brown.',
      'Add chicken and tomato and cook until tender.',
      'Boil rice separately until partially cooked.',
      'Layer rice over the chicken mixture.',
      'Cover and cook on low heat until fully cooked.'
    ]),
    image: 'chickenBiryani'
  },
  {
    name: 'Chocolate Brownies',
    category: 'Desserts',
    description: 'Rich and fudgy chocolate brownies with a soft texture.',
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    ingredients: JSON.stringify([
      '150g dark chocolate',
      '100g butter',
      '1 cup sugar',
      '2 eggs',
      '1/2 cup flour',
      '2 tablespoons cocoa powder',
      '1 teaspoon vanilla essence'
    ]),
    instructions: JSON.stringify([
      'Preheat the oven to 180°C.',
      'Melt chocolate and butter together.',
      'Mix sugar and eggs in a bowl.',
      'Add the melted chocolate mixture.',
      'Add flour, cocoa powder and vanilla essence.',
      'Pour the mixture into a baking tray.',
      'Bake for approximately 25–30 minutes.',
      'Allow to cool before cutting into squares.'
    ]),
    image: 'chocolateBrownies'
  },
   {
    name: 'Vegetable Noodles',
    category: 'Asian',
    description: 'Stir-fried noodles with fresh vegetables and flavorful sauces.',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    ingredients: JSON.stringify([
      '200g noodles',
      '1 carrot',
      '1 cup cabbage',
      '1 onion',
      '1 bell pepper',
      '2 tablespoons soy sauce',
      '1 tablespoon cooking oil',
      'Salt and pepper to taste'
    ]),
    instructions: JSON.stringify([
      'Boil noodles according to package instructions.',
      'Drain the noodles and keep aside.',
      'Heat oil in a frying pan.',
      'Add sliced onion and vegetables.',
      'Stir-fry for a few minutes.',
      'Add noodles and soy sauce.',
      'Mix well and season with salt and pepper.',
      'Serve hot.'
    ]),
    image: 'vegetableNoodles'
  },
  {
    name: 'Egg Hoppers',
    category: 'Sri Lankan',
    description: 'Crispy-edged Sri Lankan bowl-shaped pancakes with an egg in the center.',
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    ingredients: JSON.stringify([
      '2 cups rice flour',
      '1 cup coconut milk',
      '1 teaspoon yeast',
      '1 teaspoon sugar',
      '4 eggs',
      'Salt to taste',
      'Water as needed'
    ]),
    instructions: JSON.stringify([
      'Mix rice flour, yeast, sugar and coconut milk.',
      'Add water gradually to make a smooth batter.',
      'Allow the batter to ferment for several hours.',
      'Heat a hopper pan and lightly grease it.',
      'Pour a ladle of batter into the pan.',
      'Crack an egg into the center.',
      'Cover and cook until the edges become crispy and the egg is cooked.'
    ]),
    image: 'eggHoppers'
  },
  {
    name: 'Fish Ambul Thiyal',
    category: 'Sri Lankan',
    description: 'Traditional sour fish curry flavored with goraka and Sri Lankan spices.',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    ingredients: JSON.stringify([
      '500g firm fish',
      '5 pieces goraka',
      '1 tablespoon black pepper',
      '1 teaspoon chili powder',
      '1/2 teaspoon turmeric',
      '4 garlic cloves',
      'Salt to taste',
      'Water as needed'
    ]),
    instructions: JSON.stringify([
      'Wash and cut the fish into medium-sized pieces.',
      'Soak goraka in warm water until soft.',
      'Prepare a paste using goraka, pepper, chili powder, turmeric and garlic.',
      'Coat the fish pieces with the spice paste.',
      'Arrange the fish in a cooking pot.',
      'Add a little water and salt.',
      'Cook on low heat until the fish is tender and the gravy becomes thick.'
    ]),
    image: 'fishAmbulThiyal'
  },
  {
    name: 'String Hoppers',
    category: 'Sri Lankan',
    description: 'Soft steamed rice flour noodles traditionally served with curry.',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    ingredients: JSON.stringify([
      '2 cups roasted rice flour',
      '1 1/2 cups hot water',
      '1 teaspoon salt'
    ]),
    instructions: JSON.stringify([
      'Mix roasted rice flour with salt.',
      'Add hot water gradually.',
      'Knead until a soft dough forms.',
      'Fill a string hopper press with the dough.',
      'Press the dough into circular patterns on string hopper mats.',
      'Steam for approximately 10–15 minutes.',
      'Serve warm with curry.'
    ]),
    image: 'stringHoppers'
  },
  {
    name: 'Chicken Devilled',
    category: 'Sri Lankan',
    description: 'Spicy Sri Lankan-style chicken stir-fried with onions and peppers.',
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    ingredients: JSON.stringify([
      '500g boneless chicken',
      '1 onion',
      '1 bell pepper',
      '2 green chilies',
      '2 tablespoons tomato sauce',
      '1 tablespoon chili sauce',
      '1 teaspoon soy sauce',
      '1 tablespoon cooking oil',
      'Salt to taste'
    ]),
    instructions: JSON.stringify([
      'Cut chicken into bite-sized pieces.',
      'Season chicken with salt and pepper.',
      'Cook the chicken in a pan until golden and fully cooked.',
      'Add sliced onion, bell pepper and green chilies.',
      'Add tomato sauce, chili sauce and soy sauce.',
      'Stir-fry until the sauce coats the chicken.',
      'Serve hot.'
    ]),
    image: 'chickenDevilled'
  },
  {
    name: 'Pancakes',
    category: 'Desserts',
    description: 'Soft and fluffy homemade pancakes served with honey or fruit.',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    ingredients: JSON.stringify([
      '1 cup all-purpose flour',
      '1 egg',
      '3/4 cup milk',
      '2 tablespoons sugar',
      '1 teaspoon baking powder',
      '2 tablespoons melted butter',
      'A pinch of salt'
    ]),
    instructions: JSON.stringify([
      'Mix flour, sugar, baking powder and salt.',
      'In another bowl, whisk egg, milk and melted butter.',
      'Combine the wet and dry ingredients.',
      'Mix until a smooth batter forms.',
      'Heat a lightly greased pan.',
      'Pour a small amount of batter into the pan.',
      'Cook until bubbles appear, then flip.',
      'Cook the other side until golden brown.',
      'Serve with honey or fruit.'
    ]),
    image: 'pancakes'
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