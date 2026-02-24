import axios from 'axios'
import type { CreateRecipeRequest, Recipe, GeneratePlanRequest, GeneratePlanResponse } from '@/types/recipe.types'
import type { GroceryItem, CreateGroceryItemRequest } from '@/types/grocery.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const recipeApi = {
  getAll: () => api.get<Recipe[]>('/recipes'),
  getById: (id: string) => api.get<Recipe>(`/recipes/${id}`),
  getByCode: (code: string) => api.get<Recipe>(`/recipes/code/${code}`),
  create: (data: CreateRecipeRequest) => api.post<Recipe>('/recipes', data),
  update: (id: string, data: Partial<CreateRecipeRequest>) => api.put<Recipe>(`/recipes/${id}`, data),
  delete: (id: string) => api.delete(`/recipes/${id}`)
}

export const weeklyPlanApi = {
  generate: (data: GeneratePlanRequest) => api.post<GeneratePlanResponse>('/weekly-plan/generate', data),
  save: (plan: any) => api.post('/weekly-plan/save', { plan }),
  getCurrent: () => api.get('/weekly-plan/current')
}

export const groceryApi = {
  getAll: () => api.get<GroceryItem[]>('/grocery'),
  getById: (id: string) => api.get<GroceryItem>(`/grocery/${id}`),
  create: (data: CreateGroceryItemRequest) => api.post<GroceryItem>('/grocery', data),
  update: (id: string, data: Partial<CreateGroceryItemRequest>) => api.put<GroceryItem>(`/grocery/${id}`, data),
  delete: (id: string) => api.delete(`/grocery/${id}`),
  getListState: () => api.get<{ entries: { id: string; itemId: string; quantity: number; note: string; item: GroceryItem }[] }>('/grocery/list-state'),
  saveListState: (entries: { itemId: string; quantity: number; note: string }[]) => api.post('/grocery/list-state', { entries }),
  resetListState: () => api.delete('/grocery/list-state')
}

export default api
