import { Request, Response } from 'express';
import { PrismaClient, RecipeType, Season, MealTime, Difficulty, Cost, DayOfWeek } from '@prisma/client';

const prisma = new PrismaClient();

const DAYS_ORDER: DayOfWeek[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const getDayOfWeekEnum = (jsDay: number): DayOfWeek => {
  // JS: 0=Sun, 1=Mon ... 6=Sat → map to our enum
  const map: Record<number, DayOfWeek> = {
    0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY',
    4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY'
  };
  return map[jsDay];
};

const getWeekStartDate = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1; // Monday-based
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getRemainingDays = (): DayOfWeek[] => {
  const today = new Date();
  const todayEnum = getDayOfWeekEnum(today.getDay());
  const todayIndex = DAYS_ORDER.indexOf(todayEnum);
  return DAYS_ORDER.slice(todayIndex);
};

interface TypeWeight {
  type: RecipeType;
  weight: number; // 0-100
}

interface GenerateRequest {
  typeWeights: TypeWeight[];
  seasons?: Season[];
  difficulties?: Difficulty[];
  costs?: Cost[];
  mealTimes: MealTime[]; // which meals per day (default: LUNCH, DINNER)
}

/**
 * Weighted random selection: given recipes grouped by type and type weights,
 * pick recipes respecting the weight distribution as closely as possible.
 * Avoids duplicates unless the pool is too small.
 */
function weightedSelectRecipes(
  recipes: any[],
  typeWeights: TypeWeight[],
  totalNeeded: number
): any[] {
  if (recipes.length === 0) return [];

  // Normalize weights to sum to 100
  const totalWeight = typeWeights.reduce((sum, tw) => sum + tw.weight, 0);
  const normalizedWeights = typeWeights.map(tw => ({
    ...tw,
    weight: totalWeight > 0 ? (tw.weight / totalWeight) * 100 : 0
  }));

  // Group recipes by type
  const byType: Record<string, any[]> = {};
  for (const r of recipes) {
    if (!byType[r.type]) byType[r.type] = [];
    byType[r.type].push(r);
  }

  // Shuffle each group
  for (const type in byType) {
    byType[type] = shuffleArray([...byType[type]]);
  }

  // Calculate how many of each type we need
  const typeCounts: { type: RecipeType; count: number; available: number }[] = [];
  let allocated = 0;

  for (const tw of normalizedWeights) {
    const available = byType[tw.type]?.length || 0;
    const idealCount = Math.round((tw.weight / 100) * totalNeeded);
    const count = Math.min(idealCount, available);
    typeCounts.push({ type: tw.type, count, available });
    allocated += count;
  }

  // If we haven't allocated enough, fill from types that have surplus
  if (allocated < totalNeeded) {
    const deficit = totalNeeded - allocated;
    // Sort by available surplus descending
    const sorted = [...typeCounts].sort((a, b) => (b.available - b.count) - (a.available - a.count));
    let remaining = deficit;
    for (const tc of sorted) {
      if (remaining <= 0) break;
      const surplus = tc.available - tc.count;
      const add = Math.min(surplus, remaining);
      tc.count += add;
      remaining -= add;
    }
  }

  // Pick from each type
  const selected: any[] = [];
  const usedIds = new Set<string>();

  for (const tc of typeCounts) {
    const pool = byType[tc.type] || [];
    let picked = 0;
    for (const recipe of pool) {
      if (picked >= tc.count) break;
      if (!usedIds.has(recipe.id)) {
        selected.push(recipe);
        usedIds.add(recipe.id);
        picked++;
      }
    }
  }

  // If still not enough (very limited pool), allow duplicates
  if (selected.length < totalNeeded && recipes.length > 0) {
    const shuffled = shuffleArray([...recipes]);
    let idx = 0;
    while (selected.length < totalNeeded) {
      selected.push(shuffled[idx % shuffled.length]);
      idx++;
    }
  }

  return shuffleArray(selected);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const generatePlan = async (req: Request, res: Response) => {
  try {
    const {
      typeWeights,
      seasons,
      difficulties,
      costs,
      mealTimes
    }: GenerateRequest = req.body;

    if (!typeWeights || typeWeights.length === 0) {
      return res.status(400).json({ error: 'At least one food type weight is required' });
    }

    if (!mealTimes || mealTimes.length === 0) {
      return res.status(400).json({ error: 'At least one meal time is required' });
    }

    const remainingDays = getRemainingDays();
    const totalRecipesNeeded = remainingDays.length * mealTimes.length;

    // Build filter: recipes matching ANY of the weighted types
    const activeTypes = typeWeights
      .filter(tw => tw.weight > 0)
      .map(tw => tw.type);

    const whereClause: any = {
      type: { in: activeTypes.length > 0 ? activeTypes : Object.values(RecipeType) }
    };

    // Season filter: match recipes that have ANY of the selected seasons or ALL
    if (seasons && seasons.length > 0) {
      whereClause.seasons = { hasSome: [...seasons, 'ALL'] };
    }

    // Difficulty filter
    if (difficulties && difficulties.length > 0) {
      whereClause.difficulty = { in: difficulties };
    }

    // Cost filter
    if (costs && costs.length > 0) {
      whereClause.cost = { in: costs };
    }

    // Meal time filter: recipe must support at least one of the selected meal times
    whereClause.timings = { hasSome: mealTimes };

    const matchingRecipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        recipeIngredients: {
          include: { ingredient: true }
        }
      }
    });

    if (matchingRecipes.length === 0) {
      return res.status(200).json({
        plan: [],
        message: 'No recipes match your criteria. Try adjusting your filters.',
        stats: { totalMatching: 0, totalNeeded: totalRecipesNeeded }
      });
    }

    // Weighted selection
    const selectedRecipes = weightedSelectRecipes(
      matchingRecipes,
      typeWeights,
      totalRecipesNeeded
    );

    // Build the plan: assign recipes to days and meal times
    const plan: {
      day: DayOfWeek;
      dayLabel: string;
      date: string;
      meals: { mealTime: MealTime; recipe: any }[];
    }[] = [];

    let recipeIndex = 0;
    const today = new Date();

    for (let i = 0; i < remainingDays.length; i++) {
      const dayEnum = remainingDays[i];
      const dayDate = new Date(today);
      const todayDayIndex = DAYS_ORDER.indexOf(getDayOfWeekEnum(today.getDay()));
      const targetDayIndex = DAYS_ORDER.indexOf(dayEnum);
      dayDate.setDate(today.getDate() + (targetDayIndex - todayDayIndex));

      const meals: { mealTime: MealTime; recipe: any }[] = [];

      for (const mealTime of mealTimes) {
        // For each meal, try to pick a recipe that supports this meal time
        let recipe = selectedRecipes[recipeIndex % selectedRecipes.length];

        // Try to find a better match from selected that supports this meal time
        const mealCompatible = selectedRecipes.filter(r =>
          r.timings.includes(mealTime)
        );

        if (mealCompatible.length > 0) {
          recipe = mealCompatible[recipeIndex % mealCompatible.length];
        }

        meals.push({ mealTime, recipe });
        recipeIndex++;
      }

      plan.push({
        day: dayEnum,
        dayLabel: dayEnum.charAt(0) + dayEnum.slice(1).toLowerCase(),
        date: dayDate.toISOString().split('T')[0],
        meals
      });
    }

    // Compute stats for the response
    const typeBreakdown: Record<string, number> = {};
    for (const day of plan) {
      for (const meal of day.meals) {
        const t = meal.recipe.type;
        typeBreakdown[t] = (typeBreakdown[t] || 0) + 1;
      }
    }

    res.json({
      plan,
      stats: {
        totalMatching: matchingRecipes.length,
        totalNeeded: totalRecipesNeeded,
        totalDays: remainingDays.length,
        mealsPerDay: mealTimes.length,
        typeBreakdown
      }
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: 'Failed to generate weekly plan' });
  }
};

export const savePlan = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;

    if (!plan || !Array.isArray(plan) || plan.length === 0) {
      return res.status(400).json({ error: 'Plan data is required' });
    }

    const weekStart = getWeekStartDate(new Date());

    // Delete existing plan for this week if any
    await prisma.weeklyPlan.deleteMany({
      where: { weekStartDate: weekStart }
    });

    // Create new plan
    const weeklyPlan = await prisma.weeklyPlan.create({
      data: {
        weekStartDate: weekStart,
        planItems: {
          create: plan.flatMap((day: any) =>
            day.meals.map((meal: any) => ({
              recipeId: meal.recipe.id,
              dayOfWeek: day.day as DayOfWeek,
              mealType: meal.mealTime as MealTime
            }))
          )
        }
      },
      include: {
        planItems: {
          include: {
            recipe: {
              include: {
                recipeIngredients: {
                  include: { ingredient: true }
                }
              }
            }
          }
        }
      }
    });

    // Record recommendation history
    const uniqueRecipeIds = [...new Set(
      plan.flatMap((day: any) => day.meals.map((meal: any) => meal.recipe.id))
    )];

    await prisma.recommendationHistory.createMany({
      data: uniqueRecipeIds.map((recipeId: string) => ({
        recipeId,
        weekStartDate: weekStart
      }))
    });

    res.status(201).json(weeklyPlan);
  } catch (error) {
    console.error('Error saving plan:', error);
    res.status(500).json({ error: 'Failed to save weekly plan' });
  }
};

export const getCurrentPlan = async (req: Request, res: Response) => {
  try {
    const weekStart = getWeekStartDate(new Date());

    const weeklyPlan = await prisma.weeklyPlan.findUnique({
      where: { weekStartDate: weekStart },
      include: {
        planItems: {
          include: {
            recipe: {
              include: {
                recipeIngredients: {
                  include: { ingredient: true }
                }
              }
            }
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { mealType: 'asc' }
          ]
        }
      }
    });

    res.json(weeklyPlan);
  } catch (error) {
    console.error('Error fetching current plan:', error);
    res.status(500).json({ error: 'Failed to fetch current plan' });
  }
};

export const resetCurrentPlan = async (req: Request, res: Response) => {
  try {
    const weekStart = getWeekStartDate(new Date());

    await prisma.weeklyPlan.deleteMany({
      where: { weekStartDate: weekStart }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error resetting current plan:', error);
    res.status(500).json({ error: 'Failed to reset weekly plan' });
  }
};
