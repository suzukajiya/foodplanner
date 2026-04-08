<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="bg-white p-12 text-center shadow-soft">
      <i class="bi bi-hourglass-split text-3xl text-primary/50"></i>
      <p class="mt-4 text-ink/60">Loading recipe...</p>
    </div>

    <div v-else-if="error" class="bg-white p-8 shadow-soft">
      <p class="text-sm text-red-600">
        <i class="bi bi-exclamation-triangle mr-2"></i>{{ error }}
      </p>
      <RouterLink to="/" class="btn-primary mt-4 inline-block">
        <i class="bi bi-arrow-left mr-2"></i>Back to Recipes
      </RouterLink>
    </div>

    <div v-else-if="recipe">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink to="/" class="text-sm text-ink/70 transition hover:text-primary">
          <i class="bi bi-arrow-left mr-2"></i>Back to Recipes
        </RouterLink>
        <div class="flex gap-2">
          <RouterLink
            :to="`/recipes/${recipe.id}/edit`"
            class="btn-secondary"
          >
            <i class="bi bi-pencil mr-2"></i>Edit
          </RouterLink>
          <button
            @click="handleDelete"
            :disabled="isDeleting"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <i class="bi bi-trash"></i>
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-12">
        <!-- Left Column: 7/12 -->
        <div class="lg:col-span-7 bg-white rounded-md p-6 sm:p-8 border border-primary/10 shadow-sm">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <h1 class="text-4xl text-ink">{{ recipe.name }}</h1>
                <span v-if="recipe.code" class="rounded bg-primary/10 px-2 py-1 font-mono text-sm font-semibold tracking-widest text-primary">#{{ recipe.code }}</span>
              </div>
              <p v-if="recipe.author" class="mt-2 text-sm text-ink/60">
                <i class="bi bi-person mr-1"></i>By {{ recipe.author }}
              </p>
              <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink/60">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
                  <i class="bi bi-tag"></i>{{ formatEnum(recipe.type) }}
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1">
                  <i class="bi bi-speedometer2"></i>{{ formatEnum(recipe.difficulty) }}
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1">
                  <i class="bi bi-currency-dollar"></i>{{ formatEnum(recipe.cost) }}
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1">
                  <i class="bi bi-people"></i>{{ recipe.servingSize }} serving{{ recipe.servingSize > 1 ? 's' : '' }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="recipe.comment" class="mt-4 bg-surface p-4 text-sm text-ink/70">
            <i class="bi bi-chat-left-text mr-2 text-primary"></i>{{ recipe.comment }}
          </div>

          <div class="mt-6 flex flex-wrap gap-6">
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-ink/50">Seasons</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="season in recipe.seasons"
                  :key="season"
                  class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary"
                >
                  {{ formatEnum(season) }}
                </span>
              </div>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-ink/50">Meal Times</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="timing in recipe.timings"
                  :key="timing"
                  class="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs text-secondary"
                >
                  {{ formatEnum(timing) }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <h2 class="mb-4 text-2xl">
              <i class="bi bi-journal-text mr-2 text-primary"></i>Instructions
            </h2>
            <div
              v-if="recipe.description"
              class="prose prose-sm max-w-none text-ink"
              v-html="recipe.description"
            ></div>
            <p v-else class="text-sm text-ink/50 italic">No instructions provided.</p>
          </div>

          <div class="mt-6 pt-4 border-t border-primary/10 text-xs text-ink/50">
            <span>Created: {{ formatDate(recipe.createdAt) }}</span>
            <span class="mx-3">•</span>
            <span>Updated: {{ formatDate(recipe.updatedAt) }}</span>
          </div>
        </div>

        <!-- Right Column: 5/12 -->
        <div class="lg:col-span-5 bg-white rounded-md p-6 sm:p-8 border border-primary/10 shadow-sm h-fit">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-2xl">
              <i class="bi bi-basket mr-2 text-primary"></i>Ingredients
            </h2>
          </div>

          <div class="mb-4 flex items-center gap-3 bg-surface p-3">
            <label class="text-sm font-medium text-ink/70">Adjust servings:</label>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="adjustedServings = Math.max(1, adjustedServings - 1)"
                class="flex h-8 w-8 items-center justify-center bg-primary/10 text-primary transition hover:bg-primary/20"
              >
                <i class="bi bi-dash"></i>
              </button>
              <span class="w-8 text-center font-semibold text-ink">{{ adjustedServings }}</span>
              <button
                type="button"
                @click="adjustedServings++"
                class="flex h-8 w-8 items-center justify-center bg-primary/10 text-primary transition hover:bg-primary/20"
              >
                <i class="bi bi-plus"></i>
              </button>
            </div>
            <span v-if="adjustedServings !== recipe.servingSize" class="text-xs text-ink/50">
              (original: {{ recipe.servingSize }})
            </span>
          </div>

          <div v-if="recipe.recipeIngredients && recipe.recipeIngredients.length > 0">
            <ul class="space-y-2">
              <li
                v-for="ri in recipe.recipeIngredients"
                :key="ri.id"
                class="flex items-center justify-between bg-surface px-4 py-2.5"
              >
                <span class="font-medium text-ink">{{ ri.ingredient.name }}</span>
                <span class="text-sm text-ink/60">
                  <span v-if="adjustedServings !== recipe.servingSize">≈ </span>{{ calculateAdjustedQuantity(ri.quantity) }} {{ ri.unit }}
                </span>
              </li>
            </ul>
          </div>
          <p v-else class="text-sm text-ink/50 italic">No ingredients listed.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { recipeApi } from '@/services/api'
import type { Recipe } from '@/types/recipe.types'

const route = useRoute()
const router = useRouter()

const recipe = ref<Recipe | null>(null)
const loading = ref(true)
const error = ref('')
const isDeleting = ref(false)
const adjustedServings = ref(1)

const formatEnum = (value: string) => {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const calculateAdjustedQuantity = (originalQuantity: number) => {
  if (!recipe.value) return originalQuantity
  const ratio = adjustedServings.value / recipe.value.servingSize
  const adjusted = originalQuantity * ratio
  return Number.isInteger(adjusted) ? adjusted : adjusted.toFixed(1)
}

const fetchRecipe = async () => {
  loading.value = true
  error.value = ''

  try {
    const id = route.params.id as string
    const response = await recipeApi.getById(id)
    recipe.value = response.data
    adjustedServings.value = response.data.servingSize
  } catch (err: any) {
    console.error('Error fetching recipe:', err)
    error.value = err.response?.data?.error || 'Failed to load recipe'
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!recipe.value) return

  if (!confirm(`Are you sure you want to delete "${recipe.value.name}"?`)) {
    return
  }

  isDeleting.value = true

  try {
    await recipeApi.delete(recipe.value.id)
    router.push('/recipes')
  } catch (err: any) {
    console.error('Error deleting recipe:', err)
    error.value = err.response?.data?.error || 'Failed to delete recipe'
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchRecipe()
})
</script>

<style scoped>
.prose ul {
  list-style-type: disc;
  padding-left: 1.5em;
}

.prose ol {
  list-style-type: decimal;
  padding-left: 1.5em;
}

.prose li {
  margin: 0.25em 0;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose blockquote {
  border-left: 3px solid #f83f6b;
  padding-left: 1em;
  color: #666;
}
</style>
