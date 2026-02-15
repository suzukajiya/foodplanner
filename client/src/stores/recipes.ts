import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Recipe } from '../types'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRecipes() {
    loading.value = true
    error.value = null
    try {
      recipes.value = []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  return {
    recipes,
    loading,
    error,
    fetchRecipes
  }
})
