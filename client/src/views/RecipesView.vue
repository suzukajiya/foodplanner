<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-2xl lg:text-4xl">All Recipes</h1>
      <RouterLink to="/add-recipe" class="btn-primary">
        <i class="bi bi-plus-circle mr-2"></i>Add Recipe
      </RouterLink>
    </div>

    <div v-if="loading" class="bg-white p-12 text-center shadow-soft">
      <i class="bi bi-hourglass-split text-3xl text-primary/50"></i>
      <p class="mt-4 text-ink/60">Loading recipes...</p>
    </div>

    <div v-else-if="error" class="bg-white p-8 shadow-soft">
      <p class="text-sm text-red-600">
        <i class="bi bi-exclamation-triangle mr-2"></i>{{ error }}
      </p>
    </div>

    <div v-else-if="recipes.length === 0" class="bg-white p-12 text-center shadow-soft">
      <i class="bi bi-inbox text-4xl text-primary/50"></i>
      <p class="mt-4 text-lg text-ink/70">No recipes yet</p>
      <p class="mt-2 text-sm text-ink/50">Start by adding your first recipe!</p>
      <RouterLink to="/add-recipe" class="btn-primary mt-6">
        <i class="bi bi-plus-circle mr-2"></i>Add Recipe
      </RouterLink>
    </div>

    <div v-else class="grid lg:grid-cols-2 gap-4">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="flex items-center justify-between rounded-md border border-primary/10 bg-white px-6 py-4 shadow-sm transition hover:border-primary/30 hover:shadow-soft"
      >
        <RouterLink
          :to="`/recipes/${recipe.id}`"
          class="flex flex-1 items-center gap-4 cursor-pointer"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <i class="bi bi-journal-text text-lg text-primary"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-medium text-ink">{{ recipe.name }}</h3>
              <span v-if="recipe.code" class="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wider text-primary">#{{ recipe.code }}</span>
            </div>
            <div class="mt-1 flex items-center gap-3 text-xs text-ink/60">
              <span><i class="bi bi-tag mr-1"></i>{{ formatEnum(recipe.type) }}</span>
              <span><i class="bi bi-speedometer2 mr-1"></i>{{ formatEnum(recipe.difficulty) }}</span>
              <span><i class="bi bi-currency-dollar mr-1"></i>{{ formatEnum(recipe.cost) }}</span>
            </div>
          </div>
        </RouterLink>

        <button
          @click.stop="handleDelete(recipe.id, recipe.name)"
          :disabled="deletingId === recipe.id"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          :class="{ 'opacity-50 cursor-not-allowed': deletingId === recipe.id }"
        >
          <i class="bi bi-trash"></i>
          {{ deletingId === recipe.id ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { recipeApi } from '@/services/api'
import type { Recipe } from '@/types/recipe.types'

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref('')
const deletingId = ref<string | null>(null)

const formatEnum = (value: string) => {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

const fetchRecipes = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await recipeApi.getAll()
    recipes.value = response.data
  } catch (err: any) {
    console.error('Error fetching recipes:', err)
    error.value = err.response?.data?.error || 'Failed to load recipes'
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string, name: string) => {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return
  }

  deletingId.value = id

  try {
    await recipeApi.delete(id)
    recipes.value = recipes.value.filter(r => r.id !== id)
  } catch (err: any) {
    console.error('Error deleting recipe:', err)
    error.value = err.response?.data?.error || 'Failed to delete recipe'
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  fetchRecipes()
})
</script>
