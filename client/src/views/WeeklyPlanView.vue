<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-4xl">Weekly Meal Plan</h1>
      <div class="flex items-center gap-2 text-sm text-ink/60">
        <i class="bi bi-calendar3"></i>
        <span>{{ currentWeekLabel }}</span>
      </div>
    </div>

    <!-- Parameter Selection Panel -->
    <div v-if="!generatedPlan" class="space-y-6">

      <!-- Food Type Weights -->
      <div class="rounded-2xl bg-white p-6 sm:p-8 border border-primary/10 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl">
            <i class="bi bi-sliders mr-2 text-primary"></i>Food Type Weights
          </h2>
          <div class="text-sm text-ink/50">
            Total: <span :class="totalWeight === 100 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'">{{ totalWeight }}%</span>
          </div>
        </div>
        <p class="text-sm text-ink/60 mb-6">Assign a percentage weight to each food type. The system will recommend recipes proportionally. Weights must total 100%.</p>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="tw in typeWeights"
            :key="tw.type"
            class="flex items-center gap-4 rounded-xl border p-4 transition"
            :class="tw.weight > 0 ? 'border-primary/30 bg-primary/5' : 'border-primary/10 bg-surface'"
          >
            <div class="flex-1">
              <label class="block text-sm font-medium text-ink">{{ formatEnum(tw.type) }}</label>
              <input
                type="range"
                v-model.number="tw.weight"
                min="0"
                max="100"
                step="5"
                class="mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-primary/20"
              />
            </div>
            <div class="flex items-center gap-1">
              <input
                type="number"
                v-model.number="tw.weight"
                min="0"
                max="100"
                step="5"
                class="w-16 rounded-lg border border-primary/25 bg-white px-2 py-1.5 text-center text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span class="text-sm text-ink/50">%</span>
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            type="button"
            @click="distributeEvenly"
            class="text-xs text-primary hover:underline"
          >
            Distribute evenly
          </button>
          <span class="text-xs text-ink/30">|</span>
          <button
            type="button"
            @click="resetWeights"
            class="text-xs text-ink/50 hover:underline"
          >
            Reset all
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="rounded-2xl bg-white p-6 sm:p-8 border border-primary/10 shadow-sm">
        <h2 class="mb-6 text-2xl">
          <i class="bi bi-funnel mr-2 text-primary"></i>Filters
        </h2>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Meals Per Day -->
          <div>
            <label class="mb-3 block text-sm font-medium text-ink/70">Meals Per Day *</label>
            <div class="flex flex-wrap gap-3">
              <label
                v-for="mt in allMealTimes"
                :key="mt"
                class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 bg-surface px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5"
                :class="{ 'border-primary bg-primary/10': selectedMealTimes.includes(mt) }"
              >
                <input
                  type="checkbox"
                  :value="mt"
                  v-model="selectedMealTimes"
                  class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                />
                <span>{{ formatEnum(mt) }}</span>
              </label>
            </div>
          </div>

          <!-- Season Filter -->
          <div>
            <label class="mb-3 block text-sm font-medium text-ink/70">Season (optional)</label>
            <div class="flex flex-wrap gap-3">
              <label
                v-for="s in allSeasons"
                :key="s"
                class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 bg-surface px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5"
                :class="{ 'border-primary bg-primary/10': selectedSeasons.includes(s) }"
              >
                <input
                  type="checkbox"
                  :value="s"
                  v-model="selectedSeasons"
                  class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                />
                <span>{{ formatEnum(s) }}</span>
              </label>
            </div>
          </div>

          <!-- Difficulty Filter -->
          <div>
            <label class="mb-3 block text-sm font-medium text-ink/70">Difficulty (optional)</label>
            <div class="flex flex-wrap gap-3">
              <label
                v-for="d in allDifficulties"
                :key="d"
                class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 bg-surface px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5"
                :class="{ 'border-primary bg-primary/10': selectedDifficulties.includes(d) }"
              >
                <input
                  type="checkbox"
                  :value="d"
                  v-model="selectedDifficulties"
                  class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                />
                <span>{{ formatEnum(d) }}</span>
              </label>
            </div>
          </div>

          <!-- Cost Filter -->
          <div>
            <label class="mb-3 block text-sm font-medium text-ink/70">Cost (optional)</label>
            <div class="flex flex-wrap gap-3">
              <label
                v-for="c in allCosts"
                :key="c"
                class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 bg-surface px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5"
                :class="{ 'border-primary bg-primary/10': selectedCosts.includes(c) }"
              >
                <input
                  type="checkbox"
                  :value="c"
                  v-model="selectedCosts"
                  class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                />
                <span>{{ formatEnum(c) }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary & Generate -->
      <div class="rounded-2xl bg-white p-6 sm:p-8 border border-primary/10 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="text-sm text-ink/60">
            <p><i class="bi bi-calendar-range mr-2 text-primary"></i><strong>{{ remainingDaysCount }} days</strong> remaining this week ({{ remainingDaysLabel }})</p>
            <p class="mt-1"><i class="bi bi-cup-straw mr-2 text-primary"></i><strong>{{ selectedMealTimes.length }} meal{{ selectedMealTimes.length !== 1 ? 's' : '' }}</strong> per day → <strong>{{ totalRecipesNeeded }} recipes</strong> needed</p>
          </div>
          <div class="flex items-center gap-3">
            <p v-if="errorMessage" class="text-sm text-red-600">
              <i class="bi bi-exclamation-triangle mr-1"></i>{{ errorMessage }}
            </p>
            <button
              @click="handleGenerate"
              :disabled="isGenerating || totalWeight !== 100 || selectedMealTimes.length === 0"
              class="btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': isGenerating || totalWeight !== 100 || selectedMealTimes.length === 0 }"
            >
              <i class="bi bi-stars mr-2"></i>
              {{ isGenerating ? 'Generating...' : 'Generate Recommendation' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generated Plan Display -->
    <div v-else>
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="text-sm text-ink/70 transition hover:text-primary"
          >
            <i class="bi bi-arrow-left mr-2"></i>Change Parameters
          </button>
        </div>
        <div class="flex gap-3">
          <button
            @click="handleRegenerate"
            :disabled="isGenerating"
            class="btn-secondary"
          >
            <i class="bi bi-arrow-clockwise mr-2"></i>
            {{ isGenerating ? 'Regenerating...' : 'Regenerate' }}
          </button>
          <button
            @click="handleSave"
            :disabled="isSaving"
            class="btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': isSaving }"
          >
            <i class="bi bi-check-circle mr-2"></i>
            {{ isSaving ? 'Saving...' : 'Save Plan' }}
          </button>
        </div>
      </div>

      <p v-if="saveMessage" class="mb-4 text-sm text-green-600">
        <i class="bi bi-check-circle mr-1"></i>{{ saveMessage }}
      </p>

      <!-- Stats Bar -->
      <div v-if="generatedPlan.stats.typeBreakdown" class="mb-6 rounded-2xl bg-white p-4 border border-primary/10 shadow-sm">
        <div class="flex flex-wrap items-center gap-4 text-sm">
          <span class="text-ink/50">
            <i class="bi bi-database mr-1"></i>{{ generatedPlan.stats.totalMatching }} matching recipes found
          </span>
          <span class="text-ink/30">|</span>
          <span class="text-ink/50">Distribution:</span>
          <span
            v-for="(count, type) in generatedPlan.stats.typeBreakdown"
            :key="type"
            class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {{ formatEnum(type as string) }}: {{ count }}
          </span>
        </div>
      </div>

      <div v-if="generatedPlan.message" class="mb-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
        <i class="bi bi-info-circle mr-2"></i>{{ generatedPlan.message }}
      </div>

      <!-- Day Cards -->
      <div class="space-y-4">
        <div
          v-for="(day, dayIndex) in generatedPlan.plan"
          :key="day.day"
          class="rounded-2xl bg-white border border-primary/10 shadow-sm overflow-hidden"
        >
          <div class="flex items-center gap-3 bg-primary/5 px-6 py-3 border-b border-primary/10">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
              {{ day.dayLabel.slice(0, 2) }}
            </div>
            <div>
              <h3 class="font-medium text-ink">{{ day.dayLabel }}</h3>
              <p class="text-xs text-ink/50">{{ formatDate(day.date) }}</p>
            </div>
            <span
              v-if="dayIndex === 0"
              class="ml-auto rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white"
            >
              Today
            </span>
          </div>

          <div class="divide-y divide-primary/10">
            <div
              v-for="meal in day.meals"
              :key="meal.mealTime"
              class="flex items-center gap-4 px-6 py-4 transition hover:bg-surface"
            >
              <div class="w-20 shrink-0">
                <span class="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                  {{ formatEnum(meal.mealTime) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <RouterLink
                  :to="`/recipes/${meal.recipe.id}`"
                  class="font-medium text-ink hover:text-primary transition"
                >
                  {{ meal.recipe.name }}
                </RouterLink>
                <div class="mt-1 flex items-center gap-3 text-xs text-ink/50">
                  <span><i class="bi bi-tag mr-1"></i>{{ formatEnum(meal.recipe.type) }}</span>
                  <span><i class="bi bi-speedometer2 mr-1"></i>{{ formatEnum(meal.recipe.difficulty) }}</span>
                  <span><i class="bi bi-people mr-1"></i>{{ meal.recipe.servingSize }} serving{{ meal.recipe.servingSize > 1 ? 's' : '' }}</span>
                </div>
              </div>
              <button
                @click="swapRecipe(dayIndex, meal.mealTime)"
                class="shrink-0 rounded-lg p-2 text-ink/40 transition hover:bg-primary/10 hover:text-primary"
                title="Swap this recipe"
              >
                <i class="bi bi-arrow-repeat"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { weeklyPlanApi } from '@/services/api'
import {
  RecipeType, Season, Difficulty, Cost, MealTime
} from '@/types/recipe.types'
import type {
  TypeWeight, GeneratePlanRequest, GeneratePlanResponse, PlanDay
} from '@/types/recipe.types'

// Enum arrays for iteration
const allMealTimes = Object.values(MealTime)
const allSeasons = Object.values(Season).filter(s => s !== 'ALL')
const allDifficulties = Object.values(Difficulty)
const allCosts = Object.values(Cost)

// State
const typeWeights = ref<TypeWeight[]>(
  Object.values(RecipeType).map(type => ({ type, weight: 0 }))
)
const selectedMealTimes = ref<MealTime[]>([MealTime.LUNCH, MealTime.DINNER])
const selectedSeasons = ref<Season[]>([])
const selectedDifficulties = ref<Difficulty[]>([])
const selectedCosts = ref<Cost[]>([])

const isGenerating = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const saveMessage = ref('')
const generatedPlan = ref<GeneratePlanResponse | null>(null)

// Keep a copy of all matching recipes for the swap feature
let allMatchingRecipes: any[] = []

const totalWeight = computed(() =>
  typeWeights.value.reduce((sum, tw) => sum + tw.weight, 0)
)

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const getRemainingDaysFromToday = () => {
  const today = new Date()
  const jsDay = today.getDay()
  const dayMap: Record<number, string> = {
    0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY',
    4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY'
  }
  const todayEnum = dayMap[jsDay]
  const todayIndex = DAYS_ORDER.indexOf(todayEnum)
  return DAYS_ORDER.slice(todayIndex)
}

const remainingDays = computed(() => getRemainingDaysFromToday())
const remainingDaysCount = computed(() => remainingDays.value.length)
const remainingDaysLabel = computed(() =>
  remainingDays.value.map(d => d.charAt(0) + d.slice(1, 3).toLowerCase()).join(', ')
)
const totalRecipesNeeded = computed(() => remainingDaysCount.value * selectedMealTimes.value.length)

const currentWeekLabel = computed(() => {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${monday.toLocaleDateString('en-US', opts)} – ${sunday.toLocaleDateString('en-US', opts)}`
})

const formatEnum = (value: string) => value.charAt(0) + value.slice(1).toLowerCase()

const formatDate = (dateStr: string) => {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const distributeEvenly = () => {
  const count = typeWeights.value.length
  const base = Math.floor(100 / count)
  let remainder = 100 - base * count
  typeWeights.value.forEach((tw, i) => {
    tw.weight = base + (i < remainder ? 1 : 0)
  })
  // Round to nearest 5 then fix
  typeWeights.value.forEach(tw => {
    tw.weight = Math.round(tw.weight / 5) * 5
  })
  // Fix rounding to exactly 100
  const diff = 100 - typeWeights.value.reduce((s, tw) => s + tw.weight, 0)
  if (diff !== 0) {
    typeWeights.value[0].weight += diff
  }
}

const resetWeights = () => {
  typeWeights.value.forEach(tw => { tw.weight = 0 })
}

const handleGenerate = async () => {
  errorMessage.value = ''
  saveMessage.value = ''

  if (totalWeight.value !== 100) {
    errorMessage.value = 'Type weights must total exactly 100%'
    return
  }

  if (selectedMealTimes.value.length === 0) {
    errorMessage.value = 'Select at least one meal time'
    return
  }

  isGenerating.value = true

  try {
    const request: GeneratePlanRequest = {
      typeWeights: typeWeights.value.filter(tw => tw.weight > 0),
      mealTimes: selectedMealTimes.value,
      ...(selectedSeasons.value.length > 0 && { seasons: selectedSeasons.value }),
      ...(selectedDifficulties.value.length > 0 && { difficulties: selectedDifficulties.value }),
      ...(selectedCosts.value.length > 0 && { costs: selectedCosts.value })
    }

    const response = await weeklyPlanApi.generate(request)
    generatedPlan.value = response.data
  } catch (err: any) {
    console.error('Error generating plan:', err)
    errorMessage.value = err.response?.data?.error || 'Failed to generate plan'
  } finally {
    isGenerating.value = false
  }
}

const handleRegenerate = async () => {
  await handleGenerate()
}

const goBack = () => {
  generatedPlan.value = null
  saveMessage.value = ''
  errorMessage.value = ''
}

const handleSave = async () => {
  if (!generatedPlan.value) return
  isSaving.value = true
  saveMessage.value = ''

  try {
    await weeklyPlanApi.save(generatedPlan.value.plan)
    saveMessage.value = 'Plan saved successfully!'
  } catch (err: any) {
    console.error('Error saving plan:', err)
    errorMessage.value = err.response?.data?.error || 'Failed to save plan'
  } finally {
    isSaving.value = false
  }
}

const swapRecipe = async (dayIndex: number, mealTime: MealTime) => {
  if (!generatedPlan.value) return

  // Re-generate just to get a fresh pool, then swap just this meal
  try {
    const request: GeneratePlanRequest = {
      typeWeights: typeWeights.value.filter(tw => tw.weight > 0),
      mealTimes: selectedMealTimes.value,
      ...(selectedSeasons.value.length > 0 && { seasons: selectedSeasons.value }),
      ...(selectedDifficulties.value.length > 0 && { difficulties: selectedDifficulties.value }),
      ...(selectedCosts.value.length > 0 && { costs: selectedCosts.value })
    }

    const response = await weeklyPlanApi.generate(request)
    const freshPlan = response.data

    if (freshPlan.plan.length === 0) return

    // Find a different recipe from the fresh plan
    const currentMeal = generatedPlan.value.plan[dayIndex]?.meals.find(m => m.mealTime === mealTime)
    if (!currentMeal) return

    // Collect all recipes from fresh plan
    const freshRecipes = freshPlan.plan.flatMap(d => d.meals.map(m => m.recipe))
    const differentRecipe = freshRecipes.find(r => r.id !== currentMeal.recipe.id) || freshRecipes[0]

    // Swap in the current plan
    const meal = generatedPlan.value.plan[dayIndex].meals.find(m => m.mealTime === mealTime)
    if (meal) {
      meal.recipe = differentRecipe
    }
  } catch (err) {
    console.error('Error swapping recipe:', err)
  }
}
</script>
