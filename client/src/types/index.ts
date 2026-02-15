export enum RecipeType {
  CHICKEN = 'CHICKEN',
  MEAT = 'MEAT',
  VEGETARIAN = 'VEGETARIAN',
  LENTIL = 'LENTIL',
  FISH = 'FISH',
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

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export interface Recipe {
  id: string
  name: string
  description?: string
  type: RecipeType
  difficulty: Difficulty
  cost: Cost
  seasons: Season[]
  timings: MealTime[]
  createdAt: string
  updatedAt: string
}

export interface Ingredient {
  id: string
  name: string
  defaultUnit?: string
}

export interface RecipeIngredient {
  id: string
  recipeId: string
  ingredientId: string
  quantity: number
  unit: string
}

export interface WeeklyPlan {
  id: string
  weekStartDate: string
  createdAt: string
}

export interface PlanItem {
  id: string
  planId: string
  recipeId: string
  dayOfWeek: DayOfWeek
  mealType: MealTime
}
