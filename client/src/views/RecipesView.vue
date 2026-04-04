<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-4xl">Recipes</h1>
        <p class="mt-2 text-sm text-ink/55">Search recipes, choose meals per day, and build your weekly plan directly from here.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="sidebarOpen = true"
          class="relative flex items-center gap-2 rounded-md border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
        >
          <i class="bi bi-calendar-week"></i>
          <span>Weekly Plan</span>
          <span
            v-if="filledSlotsCount > 0"
            class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
          >{{ filledSlotsCount }}</span>
        </button>

        <RouterLink to="/add-recipe" class="btn-primary">
          <i class="bi bi-plus-circle mr-2"></i>Add Recipe
        </RouterLink>
      </div>
    </div>

    <div class="mb-6 space-y-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="relative flex-1">
          <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Search recipes by name or code..."
            class="w-full rounded-md border border-primary/20 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder-ink/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div class="rounded-md border border-primary/15 bg-white px-4 py-2 text-sm text-ink/55 shadow-sm">
          {{ filteredRecipes.length }} recipes · {{ selectedRecipesCount }} selected
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 rounded-md border border-primary/10 bg-white px-6 py-4 shadow-sm md:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-ink/60">Type</label>
          <select
            v-model="selectedTypeFilter"
            class="w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Types</option>
            <option v-for="type in allRecipeTypes" :key="type" :value="type">{{ formatEnum(type) }}</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-ink/60">Season</label>
          <select
            v-model="selectedSeasonFilter"
            class="w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Seasons</option>
            <option v-for="season in allSeasonFilters" :key="season" :value="season">{{ formatEnum(season) }}</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-ink/60">Meal Time</label>
          <select
            v-model="selectedMealTimeFilter"
            class="w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Meal Times</option>
            <option v-for="mealTime in allMealTimes" :key="mealTime" :value="mealTime">{{ formatEnum(mealTime) }}</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4 rounded-md border border-primary/10 bg-white px-6 py-4 shadow-sm">
        <span class="text-sm font-medium text-ink/70 whitespace-nowrap">
          <i class="bi bi-cup-straw mr-2 text-primary"></i>Meals Per Day
        </span>

        <div class="flex flex-wrap gap-2">
          <label
            v-for="mealTime in allMealTimes"
            :key="mealTime"
            class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 bg-surface px-4 py-1.5 text-sm transition hover:border-primary hover:bg-primary/5"
            :class="{ 'border-primary bg-primary/10': selectedMealTimes.includes(mealTime) }"
          >
            <input
              v-model="selectedMealTimes"
              type="checkbox"
              :value="mealTime"
              class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
            />
            <span>{{ formatEnum(mealTime) }}</span>
          </label>
        </div>

        <span class="ml-auto text-xs text-ink/40 whitespace-nowrap">
          <i class="bi bi-calendar-range mr-1"></i>{{ planDays.length }} days · {{ filledSlotsCount }} / {{ totalRecipesNeeded }} slots
        </span>
      </div>
    </div>

    <div v-if="loading" class="bg-white p-12 text-center shadow-soft rounded-md">
      <i class="bi bi-hourglass-split text-3xl text-primary/50"></i>
      <p class="mt-4 text-ink/60">Loading recipes...</p>
    </div>

    <div v-else-if="error" class="bg-white p-8 shadow-soft rounded-md">
      <p class="text-sm text-red-600">
        <i class="bi bi-exclamation-triangle mr-2"></i>{{ error }}
      </p>
    </div>

    <div v-else-if="recipes.length === 0" class="bg-white p-12 text-center shadow-soft rounded-md">
      <i class="bi bi-inbox text-4xl text-primary/50"></i>
      <p class="mt-4 text-lg text-ink/70">No recipes yet</p>
      <p class="mt-2 text-sm text-ink/50">Start by adding your first recipe!</p>
      <RouterLink to="/add-recipe" class="btn-primary mt-6">
        <i class="bi bi-plus-circle mr-2"></i>Add Recipe
      </RouterLink>
    </div>

    <div v-else-if="filteredRecipes.length === 0" class="bg-white p-10 text-center shadow-soft rounded-md">
      <i class="bi bi-search text-4xl text-primary/40"></i>
      <p class="mt-4 text-lg text-ink/70">No recipes match your filters</p>
      <p class="mt-2 text-sm text-ink/50">Try a different search term or adjust the dropdown filters.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="rounded-md border bg-white shadow-sm transition-all"
        :class="isSelected(recipe.id) ? 'border-primary/40 ring-1 ring-primary/20' : 'border-primary/10 hover:border-primary/25 hover:shadow-soft'"
      >
        <div class="flex items-start gap-3 p-4">
          <button
            @click="toggleRecipe(recipe)"
            class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-colors"
            :class="isSelected(recipe.id) ? 'border-primary bg-primary text-white' : 'border-ink/30 hover:border-primary'"
          >
            <i v-if="isSelected(recipe.id)" class="bi bi-check text-sm leading-none"></i>
          </button>

          <div class="min-w-0 flex-1">
            <RouterLink
              :to="`/recipes/${recipe.id}`"
              class="block cursor-pointer"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <h3 class="text-lg font-medium text-ink">{{ recipe.name }}</h3>
                <span v-if="recipe.code" class="hidden rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wider text-primary">#{{ recipe.code }}</span>

                <span
                  class="bg-secondary/10 px-2 py-1 text-[11px] font-medium text-secondary"
                >
                  {{ formatEnum(recipe.timings[0]) }}
                </span>
              </div>

              <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink/60">
                <span><i class="bi bi-tag mr-1"></i>{{ formatEnum(recipe.type) }}</span>
                <span><i class="bi bi-speedometer2 mr-1"></i>{{ formatEnum(recipe.difficulty) }}</span>
                <span><i class="bi bi-currency-dollar mr-1"></i>{{ formatEnum(recipe.cost) }}</span>
                <span><i class="bi bi-people mr-1"></i>{{ recipe.servingSize }} serving{{ recipe.servingSize > 1 ? 's' : '' }}</span>
              </div>
            </RouterLink>
          </div>
        </div>

        <div class="space-y-3 border-t border-primary/10 p-4">
          <div
            class="flex flex-wrap items-center gap-2 transition-opacity"
            :class="isSelected(recipe.id) ? 'opacity-100' : 'opacity-45'"
          >
            <select
              :value="getDraftDayValue(recipe.id)"
              @change="updateDraftDay(recipe.id, ($event.target as HTMLSelectElement).value as DayOfWeek | '')"
              :disabled="!isSelected(recipe.id)"
              class="min-w-[7.5rem] rounded border border-primary/25 bg-white px-3 py-1.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-surface"
            >
              <option value="">Select day…</option>
              <option v-for="day in planDays" :key="day.day" :value="day.day">{{ day.dayLabel }}</option>
            </select>

            <select
              :value="getDraftMealValue(recipe.id)"
              @change="updateDraftMeal(recipe.id, ($event.target as HTMLSelectElement).value as MealTime | '')"
              :disabled="!isSelected(recipe.id)"
              class="min-w-[7.5rem] rounded border border-primary/25 bg-white px-3 py-1.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-surface"
            >
              <option value="">Select meal…</option>
              <option v-for="mealTime in selectedMealTimes" :key="mealTime" :value="mealTime">{{ formatEnum(mealTime) }}</option>
            </select>

            <button
              @click="assignRecipeToDraft(recipe.id)"
              :disabled="!canAssignRecipe(recipe.id)"
              class="btn-primary px-4 py-1.5 text-sm disabled:opacity-50"
            >
              Assign
            </button>
          </div>

          <div v-if="isSelected(recipe.id) && getAssignmentsForRecipe(recipe.id).length === 0" class="hidden text-xs italic text-ink/40">
            No slots assigned yet.
          </div>

          <div v-else-if="getAssignmentsForRecipe(recipe.id).length > 0" class="hidden flex flex-wrap gap-2">
            <span
              v-for="assignment in getAssignmentsForRecipe(recipe.id)"
              :key="`${recipe.id}-${assignment.day}-${assignment.mealTime}`"
              class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {{ formatDay(assignment.day) }} · {{ formatEnum(assignment.mealTime) }}
              <button @click="removeAssignment(recipe.id, assignment.day, assignment.mealTime)" class="text-primary/70 transition hover:text-primary">
                <i class="bi bi-x"></i>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/30 lg:hidden" @click="sidebarOpen = false"></div>

      <div v-if="sidebarOpen" class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-primary/20 bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-primary/10 px-5 py-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-heading text-lg text-ink">Weekly Plan Builder</h2>
              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{{ filledSlotsCount }}</span>
            </div>
            <p class="mt-1 text-xs text-ink/45">{{ selectedRecipesCount }} recipes selected · {{ filledSlotsCount }} / {{ totalRecipesNeeded }} slots</p>
          </div>
          <button @click="sidebarOpen = false" class="rounded p-1 text-ink/40 transition hover:text-ink/70">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div v-if="selectionList.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
            <i class="bi bi-calendar2-week text-4xl text-primary/30"></i>
            <p class="mt-3 text-sm text-ink/50">Select recipes from the page to start building your weekly plan</p>
          </div>

          <template v-else>
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-ink/70">Week Preview</h3>

              <div
                v-for="day in previewPlan"
                :key="day.day"
                class="overflow-hidden rounded-md border border-primary/10"
              >
                <div class="flex items-center gap-2 bg-primary/5 px-4 py-2">
                  <span class="font-medium text-sm text-ink">{{ day.dayLabel }}</span>
                  <span class="text-xs text-ink/40">{{ formatDate(day.date) }}</span>
                </div>

                <div v-if="day.meals.length === 0" class="px-4 py-2 text-xs italic text-ink/40">No meals assigned</div>

                <div v-else class="divide-y divide-primary/5">
                  <div v-for="meal in day.meals" :key="`${day.day}-${meal.mealTime}`" class="flex items-center gap-3 px-4 py-2">
                    <span class="w-20 shrink-0 rounded-full bg-secondary/10 px-2 py-0.5 text-center text-xs font-medium text-secondary">{{ formatEnum(meal.mealTime) }}</span>
                    <span class="flex-1 text-sm text-ink">{{ meal.recipe.name }}</span>
                    <button @click="removeAssignment(meal.recipe.id, day.day, meal.mealTime)" class="text-ink/35 transition hover:text-red-500">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="space-y-3 border-t border-primary/10 px-5 py-4">
          <p v-if="saveMessage" class="text-sm" :class="saveMessageError ? 'text-red-600' : 'text-green-600'">
            <i class="bi mr-1" :class="saveMessageError ? 'bi-exclamation-circle' : 'bi-check-circle'"></i>{{ saveMessage }}
          </p>

          <div class="grid grid-cols-2 gap-2">
            <button @click="resetPlanBuilder" class="btn-secondary text-sm">Reset</button>
            <button
              @click="handleSavePlan"
              :disabled="isSaving || filledSlotsCount === 0 || selectedMealTimes.length === 0"
              class="btn-primary text-sm disabled:opacity-50"
            >
              <i v-if="isSaving" class="bi bi-hourglass-split mr-1 animate-spin"></i>
              <i v-else class="bi bi-floppy mr-1"></i>
              {{ isSaving ? 'Saving…' : 'Save Plan' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { recipeApi, weeklyPlanApi } from '@/services/api'
import { DayOfWeek, MealTime, RecipeType, Season } from '@/types/recipe.types'
import type { PlanDay, PlanMeal, Recipe } from '@/types/recipe.types'

interface RecipePlanAssignment {
  day: DayOfWeek
  mealTime: MealTime
}

interface RecipePlanSelection {
  recipe: Recipe
  assignments: RecipePlanAssignment[]
  draftDay: DayOfWeek | ''
  draftMealTime: MealTime | ''
}

interface PlanDayOption {
  day: DayOfWeek
  dayLabel: string
  date: string
}

const DAYS_ORDER: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY
]

const allRecipeTypes = Object.values(RecipeType)
const allSeasonFilters = Object.values(Season).filter(season => season !== Season.ALL)
const allMealTimes = Object.values(MealTime)

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const selectedTypeFilter = ref<RecipeType | ''>('')
const selectedSeasonFilter = ref<Season | ''>('')
const selectedMealTimeFilter = ref<MealTime | ''>('')
const deletingId = ref<string | null>(null)
const sidebarOpen = ref(false)
const isSaving = ref(false)
const saveMessage = ref('')
const saveMessageError = ref(false)
const selectedMealTimes = ref<MealTime[]>([MealTime.LUNCH, MealTime.DINNER])
const selections = ref<Map<string, RecipePlanSelection>>(new Map())

const formatEnum = (value: string) => value.charAt(0) + value.slice(1).toLowerCase()

const formatDay = (day: DayOfWeek) => day.charAt(0) + day.slice(1).toLowerCase()

const formatDate = (dateStr: string) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })

const getRemainingDaysFromToday = (): DayOfWeek[] => {
  const today = new Date()
  const jsDay = today.getDay()
  const dayMap: Record<number, DayOfWeek> = {
    0: DayOfWeek.SUNDAY,
    1: DayOfWeek.MONDAY,
    2: DayOfWeek.TUESDAY,
    3: DayOfWeek.WEDNESDAY,
    4: DayOfWeek.THURSDAY,
    5: DayOfWeek.FRIDAY,
    6: DayOfWeek.SATURDAY
  }
  const todayEnum = dayMap[jsDay]
  const todayIndex = DAYS_ORDER.indexOf(todayEnum)
  return DAYS_ORDER.slice(todayIndex)
}

const planDays = computed<PlanDayOption[]>(() => {
  const today = new Date()
  return getRemainingDaysFromToday().map((day, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)

    return {
      day,
      dayLabel: formatDay(day),
      date: date.toISOString().split('T')[0]
    }
  })
})

const totalRecipesNeeded = computed(() => planDays.value.length * selectedMealTimes.value.length)

const filteredRecipes = computed(() => {
  const query = search.value.trim().toLowerCase()

  return recipes.value.filter(recipe => {
    const matchesSearch = !query || recipe.name.toLowerCase().includes(query) || (recipe.code?.toLowerCase().includes(query) ?? false)
    const matchesType = !selectedTypeFilter.value || recipe.type === selectedTypeFilter.value
    const matchesSeason = !selectedSeasonFilter.value || recipe.seasons.includes(selectedSeasonFilter.value) || recipe.seasons.includes(Season.ALL)
    const matchesMealTime = !selectedMealTimeFilter.value || recipe.timings.includes(selectedMealTimeFilter.value)

    return matchesSearch && matchesType && matchesSeason && matchesMealTime
  })
})

const selectionList = computed(() =>
  Array.from(selections.value.values()).sort((a, b) => a.recipe.name.localeCompare(b.recipe.name))
)

const selectedRecipesCount = computed(() => selections.value.size)

const filledSlotsCount = computed(() => {
  let count = 0
  for (const selection of selections.value.values()) count += selection.assignments.length
  return count
})

const previewPlan = computed<PlanDay[]>(() =>
  planDays.value.map(day => ({
    day: day.day,
    dayLabel: day.dayLabel,
    date: day.date,
    meals: selectionList.value
      .flatMap(selection =>
        selection.assignments
          .filter(assignment => assignment.day === day.day)
          .map<PlanMeal>(assignment => ({
            mealTime: assignment.mealTime,
            recipe: selection.recipe
          }))
      )
      .sort((a, b) => selectedMealTimes.value.indexOf(a.mealTime) - selectedMealTimes.value.indexOf(b.mealTime))
  }))
)

const isSelected = (recipeId: string) => selections.value.has(recipeId)

const getSelection = (recipeId: string) => selections.value.get(recipeId)

const getDraftDayValue = (recipeId: string) => getSelection(recipeId)?.draftDay ?? ''

const getDraftMealValue = (recipeId: string) => getSelection(recipeId)?.draftMealTime ?? ''

const getAssignmentsForRecipe = (recipeId: string) => getSelection(recipeId)?.assignments ?? []

const canAssignRecipe = (recipeId: string) => {
  const selection = getSelection(recipeId)
  return !!(selection && selection.draftDay && selection.draftMealTime)
}

const updateSelection = (recipeId: string, updater: (selection: RecipePlanSelection) => RecipePlanSelection | null) => {
  const current = selections.value.get(recipeId)
  if (!current) return

  const updated = updater(current)
  if (updated) selections.value.set(recipeId, updated)
  else selections.value.delete(recipeId)

  selections.value = new Map(selections.value)
}

const toggleRecipe = (recipe: Recipe) => {
  saveMessage.value = ''

  if (isSelected(recipe.id)) {
    selections.value.delete(recipe.id)
    selections.value = new Map(selections.value)
    return
  }

  selections.value.set(recipe.id, {
    recipe,
    assignments: [],
    draftDay: planDays.value[0]?.day ?? '',
    draftMealTime: selectedMealTimes.value[0] ?? ''
  })
  selections.value = new Map(selections.value)
  sidebarOpen.value = true
}

const updateDraftDay = (recipeId: string, day: DayOfWeek | '') => {
  updateSelection(recipeId, selection => ({
    ...selection,
    draftDay: day
  }))
}

const updateDraftMeal = (recipeId: string, mealTime: MealTime | '') => {
  updateSelection(recipeId, selection => ({
    ...selection,
    draftMealTime: mealTime
  }))
}

const removeAssignment = (recipeId: string, day: DayOfWeek, mealTime: MealTime) => {
  updateSelection(recipeId, selection => ({
    ...selection,
    assignments: selection.assignments.filter(assignment => !(assignment.day === day && assignment.mealTime === mealTime))
  }))
}

const clearSlotAcrossSelections = (day: DayOfWeek, mealTime: MealTime, keepRecipeId?: string) => {
  for (const [recipeId, selection] of selections.value.entries()) {
    if (recipeId === keepRecipeId) continue

    const nextAssignments = selection.assignments.filter(assignment => !(assignment.day === day && assignment.mealTime === mealTime))
    if (nextAssignments.length !== selection.assignments.length) {
      selections.value.set(recipeId, {
        ...selection,
        assignments: nextAssignments
      })
    }
  }
}

const assignRecipeToDraft = (recipeId: string) => {
  const selection = selections.value.get(recipeId)
  if (!selection || !selection.draftDay || !selection.draftMealTime) return

  clearSlotAcrossSelections(selection.draftDay, selection.draftMealTime, recipeId)

  const alreadyAssigned = selection.assignments.some(assignment =>
    assignment.day === selection.draftDay && assignment.mealTime === selection.draftMealTime
  )

  const assignments = alreadyAssigned
    ? selection.assignments
    : [...selection.assignments, { day: selection.draftDay, mealTime: selection.draftMealTime }]

  selections.value.set(recipeId, {
    ...selection,
    assignments
  })
  selections.value = new Map(selections.value)
  saveMessage.value = ''
}

const buildPlanPayload = () =>
  previewPlan.value.filter(day => day.meals.length > 0)

const resetPlanBuilder = () => {
  selections.value = new Map()
  saveMessage.value = ''
  saveMessageError.value = false
}

const handleSavePlan = async () => {
  const plan = buildPlanPayload()
  if (plan.length === 0) return

  isSaving.value = true
  saveMessage.value = ''
  saveMessageError.value = false

  try {
    await weeklyPlanApi.save(plan)
    saveMessage.value = 'Plan saved successfully!'
  } catch (err: any) {
    saveMessage.value = err.response?.data?.error || 'Failed to save plan'
    saveMessageError.value = true
  } finally {
    isSaving.value = false
  }
}

const loadCurrentPlan = async () => {
  try {
    const response = await weeklyPlanApi.getCurrent()
    const savedPlan = response.data

    if (!savedPlan?.planItems || savedPlan.planItems.length === 0) return

    const nextSelections = new Map<string, RecipePlanSelection>()
    const usedMealTimes = new Set<MealTime>()

    for (const item of savedPlan.planItems) {
      const mealTime = item.mealType as MealTime
      const day = item.dayOfWeek as DayOfWeek
      const recipe = item.recipe as Recipe
      const existingSelection = nextSelections.get(recipe.id)

      usedMealTimes.add(mealTime)

      if (existingSelection) {
        existingSelection.assignments.push({ day, mealTime })
      } else {
        nextSelections.set(recipe.id, {
          recipe,
          assignments: [{ day, mealTime }],
          draftDay: day,
          draftMealTime: mealTime
        })
      }
    }

    selections.value = nextSelections

    if (usedMealTimes.size > 0) {
      selectedMealTimes.value = allMealTimes.filter(mealTime => usedMealTimes.has(mealTime))
    }
  } catch {
  }
}

const fetchRecipes = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await recipeApi.getAll()
    recipes.value = response.data.sort((a, b) => a.name.localeCompare(b.name))
  } catch (err: any) {
    console.error('Error fetching recipes:', err)
    error.value = err.response?.data?.error || 'Failed to load recipes'
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string, name: string) => {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return

  deletingId.value = id

  try {
    await recipeApi.delete(id)
    recipes.value = recipes.value.filter(recipe => recipe.id !== id)
    selections.value.delete(id)
    selections.value = new Map(selections.value)
  } catch (err: any) {
    console.error('Error deleting recipe:', err)
    error.value = err.response?.data?.error || 'Failed to delete recipe'
  } finally {
    deletingId.value = null
  }
}

watch(selectedMealTimes, () => {
  const nextSelections = new Map<string, RecipePlanSelection>()

  for (const [recipeId, selection] of selections.value.entries()) {
    const nextAssignments = selection.assignments.filter(assignment => selectedMealTimes.value.includes(assignment.mealTime))
    const nextDraftMealTime = selection.draftMealTime && selectedMealTimes.value.includes(selection.draftMealTime as MealTime)
      ? selection.draftMealTime
      : (selectedMealTimes.value[0] ?? '')

    nextSelections.set(recipeId, {
      ...selection,
      assignments: nextAssignments,
      draftMealTime: nextDraftMealTime
    })
  }

  selections.value = nextSelections
})

onMounted(async () => {
  await Promise.all([fetchRecipes(), loadCurrentPlan()])
})
</script>
