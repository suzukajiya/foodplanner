import axios from 'axios'
import type { CreateRecipeRequest, Recipe, GeneratePlanRequest, GeneratePlanResponse } from '@/types/recipe.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const recipeApi = {
  getAll: () => api.get<Recipe[]>('/recipes'),
  getById: (id: string) => api.get<Recipe>(`/recipes/${id}`),
  create: (data: CreateRecipeRequest) => api.post<Recipe>('/recipes', data),
  update: (id: string, data: Partial<CreateRecipeRequest>) => api.put<Recipe>(`/recipes/${id}`, data),
  delete: (id: string) => api.delete(`/recipes/${id}`)
}

export const weeklyPlanApi = {
  generate: (data: GeneratePlanRequest) => api.post<GeneratePlanResponse>('/weekly-plan/generate', data),
  save: (plan: any) => api.post('/weekly-plan/save', { plan }),
  getCurrent: () => api.get('/weekly-plan/current')
}

export default api
