export enum RecipeType {
  CHICKEN = 'CHICKEN',
  MEAT = 'MEAT',
  VEGETARIAN = 'VEGETARIAN',
  LENTIL = 'LENTIL',
  FISH = 'FISH',
  RICE = 'RICE',
  DESERT = 'DESERT',
  OTHER = 'OTHER'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum Cost {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Season {
  SUMMER = 'SUMMER',
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  AUTUMN = 'AUTUMN',
  ALL = 'ALL'
}

export enum MealTime {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK'
}

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: string
}

export interface CreateRecipeRequest {
  name: string
  description?: string
  author?: string
  comment?: string
  servingSize?: number
  type: RecipeType
  difficulty: Difficulty
  cost: Cost
  seasons: Season[]
  timings: MealTime[]
  ingredients: RecipeIngredient[]
}

export interface Recipe {
  id: string
  code?: string
  name: string
  description?: string
  author?: string
  comment?: string
  servingSize: number
  type: RecipeType
  difficulty: Difficulty
  cost: Cost
  seasons: Season[]
  timings: MealTime[]
  createdAt: string
  updatedAt: string
  recipeIngredients: {
    id: string
    quantity: number
    unit: string
    ingredient: {
      id: string
      name: string
    }
  }[]
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export interface TypeWeight {
  type: RecipeType
  weight: number
}

export interface GeneratePlanRequest {
  typeWeights: TypeWeight[]
  seasons?: Season[]
  difficulties?: Difficulty[]
  costs?: Cost[]
  mealTimes: MealTime[]
}

export interface PlanMeal {
  mealTime: MealTime
  recipe: Recipe
}

export interface PlanDay {
  day: DayOfWeek
  dayLabel: string
  date: string
  meals: PlanMeal[]
}

export interface GeneratePlanResponse {
  plan: PlanDay[]
  message?: string
  stats: {
    totalMatching: number
    totalNeeded: number
    totalDays?: number
    mealsPerDay?: number
    typeBreakdown?: Record<string, number>
  }
}
