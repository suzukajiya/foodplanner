import { RecipeType, Difficulty, Cost, Season, MealTime } from '@prisma/client';

export interface CreateRecipeDto {
  name: string;
  description?: string;
  author?: string;
  comment?: string;
  servingSize?: number;
  type: RecipeType;
  difficulty: Difficulty;
  cost: Cost;
  seasons: Season[];
  timings: MealTime[];
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

export interface UpdateRecipeDto {
  name?: string;
  description?: string;
  author?: string;
  comment?: string;
  servingSize?: number;
  type?: RecipeType;
  difficulty?: Difficulty;
  cost?: Cost;
  seasons?: Season[];
  timings?: MealTime[];
  ingredients?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}
