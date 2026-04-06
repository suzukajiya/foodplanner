<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-2xl lg:text-4xl">{{ isEditMode ? 'Edit Recipe' : 'Add New Recipe' }}</h1>
      <RouterLink :to="isEditMode ? `/recipes/${recipeId}` : '/'" class="text-sm text-ink/70 transition hover:text-primary">
        <i class="bi bi-arrow-left mr-2"></i>{{ isEditMode ? 'Back to Recipe' : 'Back to Recipes' }}
      </RouterLink>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div class="bg-white rounded-md p-6 sm:p-8 border border-primary/10 shadow-sm">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 class="mb-6 text-2xl">Basic Information</h2>

            <div class="space-y-6">
              <div class="relative z-0">
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder=" "
                  required
                  class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
                />
                <label
                  for="name"
                  class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
                >
                  Recipe Name *
                </label>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-ink/70">Instructions</label>
                <RichTextEditor v-model="instructions" />
              </div>
            </div>
          </div>

          <div>
            <h2 class="mt-8 mb-6 text-2xl lg:mt-0">Recipe Details</h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="relative z-0">
                <input
                  id="author"
                  v-model="formData.author"
                  type="text"
                  placeholder=" "
                  class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
                />
                <label
                  for="author"
                  class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
                >
                  Author
                </label>
              </div>

              <div class="relative z-0">
                <input
                  id="servingSize"
                  v-model.number="formData.servingSize"
                  type="number"
                  min="1"
                  placeholder=" "
                  required
                  class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
                />
                <label
                  for="servingSize"
                  class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
                >
                  Serving Size *
                </label>
              </div>
            </div>

            <div class="mt-6 relative z-0">
              <input
                id="comment"
                v-model="formData.comment"
                type="text"
                placeholder=" "
                class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
              />
              <label
                for="comment"
                class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
              >
                Comment / Notes
              </label>
            </div>

            <div class="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <label for="type" class="mb-2 block text-sm font-medium text-ink/70">Type *</label>
                <select
                  id="type"
                  v-model="formData.type"
                  required
                  class="block w-full border border-primary/25 bg-white px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select type</option>
                  <option v-for="type in RecipeType" :key="type" :value="type">{{ formatEnum(type) }}</option>
                </select>
              </div>

              <div>
                <label for="difficulty" class="mb-2 block text-sm font-medium text-ink/70">Difficulty *</label>
                <select
                  id="difficulty"
                  v-model="formData.difficulty"
                  required
                  class="block w-full border border-primary/25 bg-white px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select difficulty</option>
                  <option v-for="difficulty in Difficulty" :key="difficulty" :value="difficulty">{{ formatEnum(difficulty) }}</option>
                </select>
              </div>

              <div>
                <label for="cost" class="mb-2 block text-sm font-medium text-ink/70">Cost *</label>
                <select
                  id="cost"
                  v-model="formData.cost"
                  required
                  class="block w-full border border-primary/25 bg-white px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select cost</option>
                  <option v-for="cost in Cost" :key="cost" :value="cost">{{ formatEnum(cost) }}</option>
                </select>
              </div>
            </div>

            <div class="mt-6">
              <label class="mb-3 block text-sm font-medium text-ink/70">Seasons *</label>
              <div class="flex flex-wrap gap-6">
                <label
                  v-for="season in Season"
                  :key="season"
                  class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 bg-surface px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5"
                  :class="{ 'border-primary bg-primary/10': formData.seasons.includes(season) }"
                >
                  <input
                    type="checkbox"
                    :value="season"
                    v-model="formData.seasons"
                    class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                  />
                  <span>{{ formatEnum(season) }}</span>
                </label>
              </div>
            </div>

            <div class="mt-6">
              <label class="mb-3 block text-sm font-medium text-ink/70">Meal Times *</label>
              <div class="flex flex-wrap gap-6">
                <label
                  v-for="timing in MealTime"
                  :key="timing"
                  class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 bg-surface px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5"
                  :class="{ 'border-primary bg-primary/10': formData.timings.includes(timing) }"
                >
                  <input
                    type="checkbox"
                    :value="timing"
                    v-model="formData.timings"
                    class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                  />
                  <span>{{ formatEnum(timing) }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-md p-6 sm:p-8 border border-primary/10 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl">Ingredients</h2>
          <button
            type="button"
            @click="addIngredient"
            class="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
          >
            <i class="bi bi-plus-circle"></i>
            Add Ingredient
          </button>
        </div>

        <div v-if="formData.ingredients.length === 0" class="border border-primary/15 bg-surface p-6 text-center text-sm text-ink/60">
          <i class="bi bi-basket text-2xl text-primary/50"></i>
          <p class="mt-2">No ingredients added yet. Click "Add Ingredient" to start.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(ingredient, index) in formData.ingredients"
            :key="index"
            class="grid gap-3 border border-primary/15 bg-surface p-4 md:grid-cols-[2fr_1fr_1fr_auto]"
          >
            <div class="relative z-0">
              <input
                :id="`ingredient-name-${index}`"
                v-model="ingredient.name"
                type="text"
                placeholder=" "
                required
                class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
              />
              <label
                :for="`ingredient-name-${index}`"
                class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
              >
                Ingredient Name
              </label>
            </div>

            <div class="relative z-0">
              <input
                :id="`ingredient-quantity-${index}`"
                v-model.number="ingredient.quantity"
                type="number"
                step="0.01"
                placeholder=" "
                required
                class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
              />
              <label
                :for="`ingredient-quantity-${index}`"
                class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
              >
                Quantity
              </label>
            </div>

            <div class="relative z-0">
              <input
                :id="`ingredient-unit-${index}`"
                v-model="ingredient.unit"
                type="text"
                placeholder=" "
                required
                class="peer block w-full appearance-none border-0 border-b-2 border-primary/25 bg-transparent px-0 pb-2.5 pt-4 text-sm text-ink focus:border-primary focus:outline-none focus:ring-0"
              />
              <label
                :for="`ingredient-unit-${index}`"
                class="absolute top-3 origin-[0] -translate-y-4 scale-75 transform text-sm text-ink/60 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary"
              >
                Unit
              </label>
            </div>

            <button
              type="button"
              @click="removeIngredient(index)"
              class="inline-flex items-center justify-center px-3 py-2 text-sm text-primary/70 transition hover:bg-primary/10 hover:text-primary"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between rounded-md gap-4 bg-white p-6 sm:p-8 border border-primary/10 shadow-sm">
        <p v-if="errorMessage" class="text-sm text-red-600">
          <i class="bi bi-exclamation-triangle mr-2"></i>{{ errorMessage }}
        </p>
        <p v-else-if="successMessage" class="text-sm text-green-600">
          <i class="bi bi-check-circle mr-2"></i>{{ successMessage }}
        </p>
        <div v-else></div>

        <div class="flex gap-3">
          <RouterLink :to="isEditMode ? `/recipes/${recipeId}` : { name: 'recipes' }" class="btn-secondary">
            Cancel
          </RouterLink>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
          >
            <i class="bi bi-check-circle mr-2"></i>
            {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Recipe' : 'Save Recipe') }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { recipeApi } from '@/services/api'
import { RecipeType, Difficulty, Cost, Season, MealTime } from '@/types/recipe.types'
import type { CreateRecipeRequest, RecipeIngredient } from '@/types/recipe.types'
import RichTextEditor from '@/components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()

const recipeId = computed(() => route.params.id as string | undefined)
const isEditMode = computed(() => !!recipeId.value)
const isLoading = ref(false)

const formData = ref<CreateRecipeRequest>({
  name: '',
  description: '',
  author: '',
  comment: '',
  servingSize: 1,
  type: '' as RecipeType,
  difficulty: '' as Difficulty,
  cost: '' as Cost,
  seasons: [],
  timings: [],
  ingredients: []
})

const instructions = ref('')

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loadRecipe = async () => {
  if (!recipeId.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await recipeApi.getById(recipeId.value)
    const recipe = response.data

    formData.value = {
      name: recipe.name,
      description: recipe.description || '',
      author: recipe.author || '',
      comment: recipe.comment || '',
      servingSize: recipe.servingSize,
      type: recipe.type,
      difficulty: recipe.difficulty,
      cost: recipe.cost,
      seasons: recipe.seasons,
      timings: recipe.timings,
      ingredients: recipe.recipeIngredients.map(ri => ({
        name: ri.ingredient.name,
        quantity: ri.quantity,
        unit: ri.unit
      }))
    }
    instructions.value = recipe.description || ''
  } catch (err: any) {
    console.error('Error loading recipe:', err)
    errorMessage.value = err.response?.data?.error || 'Failed to load recipe'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (isEditMode.value) {
    loadRecipe()
  }
})

const addIngredient = () => {
  formData.value.ingredients.push({
    name: '',
    quantity: 0,
    unit: ''
  })
}

const removeIngredient = (index: number) => {
  formData.value.ingredients.splice(index, 1)
}

const formatEnum = (value: string) => {
  return value.charAt(0) + value.slice(1).toLowerCase()
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (formData.value.seasons.length === 0) {
    errorMessage.value = 'Please select at least one season'
    return
  }

  if (formData.value.timings.length === 0) {
    errorMessage.value = 'Please select at least one meal time'
    return
  }

  isSubmitting.value = true

  try {
    formData.value.description = instructions.value

    if (isEditMode.value && recipeId.value) {
      await recipeApi.update(recipeId.value, formData.value)
      successMessage.value = 'Recipe updated successfully!'

      setTimeout(() => {
        router.push(`/recipes/${recipeId.value}`)
      }, 1500)
    } else {
      await recipeApi.create(formData.value)
      successMessage.value = 'Recipe created successfully!'

      setTimeout(() => {
        router.push({ name: 'recipes' })
      }, 1500)
    }
  } catch (error: any) {
    console.error('Error saving recipe:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to save recipe. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
