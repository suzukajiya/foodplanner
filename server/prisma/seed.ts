import { PrismaClient, RecipeType, Difficulty, Cost, Season, MealTime } from '@prisma/client';

const prisma = new PrismaClient();

const recipeNames = [
  'Grilled Chicken Caesar Salad',
  'Beef Stir Fry with Vegetables',
  'Vegetarian Buddha Bowl',
  'Lentil Curry with Rice',
  'Baked Salmon with Lemon',
  'Chicken Tikka Masala',
  'Beef Tacos with Salsa',
  'Quinoa Vegetable Stir Fry',
  'Red Lentil Soup',
  'Pan Seared Tuna Steak',
  'Roasted Chicken with Herbs',
  'Slow Cooker Beef Stew',
  'Mediterranean Chickpea Salad',
  'Green Lentil Dal',
  'Fish and Chips',
  'Chicken Pad Thai',
  'Ground Beef Shepherd\'s Pie',
  'Roasted Vegetable Pasta',
  'Spicy Lentil Tacos',
  'Grilled Fish Tacos'
];

const ingredients = [
  { name: 'Chicken Breast', unit: 'g' },
  { name: 'Beef', unit: 'g' },
  { name: 'Salmon Fillet', unit: 'g' },
  { name: 'Tuna Steak', unit: 'g' },
  { name: 'Lentils', unit: 'g' },
  { name: 'Quinoa', unit: 'g' },
  { name: 'Rice', unit: 'g' },
  { name: 'Pasta', unit: 'g' },
  { name: 'Olive Oil', unit: 'tbsp' },
  { name: 'Garlic', unit: 'cloves' },
  { name: 'Onion', unit: 'pcs' },
  { name: 'Tomatoes', unit: 'pcs' },
  { name: 'Bell Peppers', unit: 'pcs' },
  { name: 'Carrots', unit: 'pcs' },
  { name: 'Broccoli', unit: 'g' },
  { name: 'Spinach', unit: 'g' },
  { name: 'Chickpeas', unit: 'g' },
  { name: 'Coconut Milk', unit: 'ml' },
  { name: 'Soy Sauce', unit: 'tbsp' },
  { name: 'Curry Powder', unit: 'tsp' },
  { name: 'Salt', unit: 'tsp' },
  { name: 'Black Pepper', unit: 'tsp' },
  { name: 'Lemon', unit: 'pcs' }
];

const descriptions = [
  'A delicious and healthy meal perfect for lunch or dinner.',
  'Quick and easy to prepare, packed with flavor and nutrients.',
  'A hearty dish that will satisfy your cravings.',
  'Family-friendly recipe that everyone will love.',
  'Traditional recipe with a modern twist.',
  'Comfort food at its finest.',
  'Perfect for meal prep and leftovers.',
  'A crowd-pleaser for any occasion.',
  'Simple ingredients, extraordinary taste.',
  'Nutritious and delicious in every bite.'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
  
  console.log('Cleared existing data');

  // Create ingredients
  for (const ing of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ing.name },
      update: {},
      create: {
        name: ing.name,
        defaultUnit: ing.unit
      }
    });
  }

  console.log('Created ingredients');

  // Create 20 recipes
  for (let i = 0; i < recipeNames.length; i++) {
    const recipeName = recipeNames[i];
    
    // Determine type based on recipe name
    let type: RecipeType;
    if (recipeName.toLowerCase().includes('chicken')) {
      type = RecipeType.CHICKEN;
    } else if (recipeName.toLowerCase().includes('beef')) {
      type = RecipeType.MEAT;
    } else if (recipeName.toLowerCase().includes('lentil')) {
      type = RecipeType.LENTIL;
    } else if (recipeName.toLowerCase().includes('fish') || recipeName.toLowerCase().includes('salmon') || recipeName.toLowerCase().includes('tuna')) {
      type = RecipeType.FISH;
    } else if (recipeName.toLowerCase().includes('vegetarian') || recipeName.toLowerCase().includes('vegetable') || recipeName.toLowerCase().includes('chickpea') || recipeName.toLowerCase().includes('quinoa')) {
      type = RecipeType.VEGETARIAN;
    } else {
      type = RecipeType.OTHER;
    }

    const difficulty = getRandomElement([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]);
    const cost = getRandomElement([Cost.LOW, Cost.MEDIUM, Cost.HIGH]);
    const seasons = getRandomElements([Season.SUMMER, Season.WINTER, Season.SPRING, Season.AUTUMN, Season.ALL], getRandomInt(1, 3));
    const timings = getRandomElements([MealTime.BREAKFAST, MealTime.LUNCH, MealTime.DINNER, MealTime.SNACK], getRandomInt(1, 2));
    
    const recipe = await prisma.recipe.create({
      data: {
        name: recipeName,
        description: getRandomElement(descriptions),
        type,
        difficulty,
        cost,
        seasons,
        timings
      }
    });

    // Add 3-6 random ingredients to each recipe
    const recipeIngredientCount = getRandomInt(3, 6);
    const selectedIngredients = getRandomElements(ingredients, recipeIngredientCount);

    for (const ing of selectedIngredients) {
      const ingredient = await prisma.ingredient.findUnique({
        where: { name: ing.name }
      });

      if (ingredient) {
        await prisma.recipeIngredient.create({
          data: {
            recipeId: recipe.id,
            ingredientId: ingredient.id,
            quantity: getRandomInt(1, 5) * 50, // Random quantity between 50-250
            unit: ing.unit
          }
        });
      }
    }

    console.log(`Created recipe: ${recipeName}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
