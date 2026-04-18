<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-2xl lg:text-4xl">Weekly Meal Plan</h1>
      <div class="flex items-center gap-2 text-sm text-ink/60">
        <i class="bi bi-calendar3"></i>
        <span>{{ currentWeekLabel }}</span>
      </div>
    </div>

    <!-- Setup Panel -->
    <div v-if="showSetup" class="space-y-6">

      <!-- Actions + View Saved Plan -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2 rounded-md border border-primary/15 bg-white px-4 py-2 text-sm text-ink/60 shadow-sm">
          <i class="bi bi-stars text-primary"></i>
          <span>Automatic generation is managed here.</span>
        </div>

        <RouterLink
          to="/"
          class="flex items-center gap-2 rounded-md border border-primary/30 bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:bg-primary/5"
        >
          <i class="bi bi-pencil-square"></i>Open Manual Planner in Recipes
        </RouterLink>

        <button
          v-if="generatedPlan && showSetup"
          @click="viewSavedPlan"
          class="flex items-center gap-2 rounded-md border border-primary/30 bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:bg-primary/5"
        >
          <i class="bi bi-calendar-check"></i>View Saved Plan
        </button>
      </div>

      <!-- Meals Per Day (shared, always visible) -->
      <div class="bg-white rounded-md px-6 py-4 border border-primary/10 shadow-sm flex flex-wrap items-center gap-6">
        <span class="text-sm font-medium text-ink/70 whitespace-nowrap">
          <i class="bi bi-cup-straw mr-2 text-primary"></i>Meals Per Day <span class="text-red-500">*</span>
        </span>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="mt in allMealTimes"
            :key="mt"
            class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 bg-surface px-4 py-1.5 text-sm transition hover:border-primary hover:bg-primary/5"
            :class="{ 'border-primary bg-primary/10': selectedMealTimes.includes(mt) }"
          >
            <input type="checkbox" :value="mt" v-model="selectedMealTimes" class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary" />
            <span>{{ formatEnum(mt) }}</span>
          </label>
        </div>
        <span class="ml-auto text-xs text-ink/40 whitespace-nowrap">
          <i class="bi bi-calendar-range mr-1"></i>{{ remainingDaysCount }} days · {{ totalRecipesNeeded }} slots
        </span>
      </div>

      <!-- Automatic Generation Card (collapsible) -->
      <div v-if="mode === 'auto'" class="bg-white rounded-md border border-primary/10 shadow-sm overflow-hidden">
        <button
          @click="autoCardOpen = !autoCardOpen"
          class="w-full flex items-center justify-between px-6 py-4 hover:bg-primary/5 transition"
        >
          <h2 class="text-xl flex items-center gap-2">
            <i class="bi bi-stars text-primary"></i>Automatic Generation
          </h2>
          <i class="bi text-ink/40 transition-transform" :class="autoCardOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </button>

        <div v-show="autoCardOpen" class="border-t border-primary/10 px-6 pb-6 pt-5 space-y-6">

          <!-- Food Type Weights -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-ink"><i class="bi bi-sliders mr-2 text-primary/70"></i>Food Type Weights</h3>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-ink/50">Total: <span :class="totalWeight === 100 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'">{{ totalWeight }}%</span></span>
                <button type="button" @click="distributeEvenly" class="text-xs text-primary hover:underline">Distribute evenly</button>
                <span class="text-xs text-ink/30">|</span>
                <button type="button" @click="resetWeights" class="text-xs text-ink/50 hover:underline">Reset</button>
              </div>
            </div>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="tw in typeWeights"
                :key="tw.type"
                class="flex items-center gap-3 border p-3 transition"
                :class="tw.weight > 0 ? 'border-primary/30 bg-primary/5' : 'border-primary/10 bg-surface'"
              >
                <div class="flex-1">
                  <label class="block text-xs font-medium text-ink">{{ formatEnum(tw.type) }}</label>
                  <input type="range" v-model.number="tw.weight" min="0" max="100" step="5" class="weight-slider mt-2 w-full h-2 cursor-pointer" />
                </div>
                <div class="flex items-center gap-1">
                  <input type="number" v-model.number="tw.weight" min="0" max="100" step="5" class="w-14 border border-primary/25 bg-white px-2 py-1 text-center text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                  <span class="text-xs text-ink/50">%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div>
            <h3 class="text-sm font-semibold text-ink mb-3"><i class="bi bi-funnel mr-2 text-primary/70"></i>Filters <span class="text-xs font-normal text-ink/40">(optional)</span></h3>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label class="mb-2 block text-xs font-medium text-ink/60">Season</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="s in allSeasons" :key="s" class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/25 bg-surface px-3 py-1 text-xs transition hover:border-primary hover:bg-primary/5" :class="{ 'border-primary bg-primary/10': selectedSeasons.includes(s) }">
                    <input type="checkbox" :value="s" v-model="selectedSeasons" class="h-3 w-3 rounded border-primary/30 text-primary focus:ring-primary" />
                    <span>{{ formatEnum(s) }}</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-xs font-medium text-ink/60">Difficulty</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="d in allDifficulties" :key="d" class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/25 bg-surface px-3 py-1 text-xs transition hover:border-primary hover:bg-primary/5" :class="{ 'border-primary bg-primary/10': selectedDifficulties.includes(d) }">
                    <input type="checkbox" :value="d" v-model="selectedDifficulties" class="h-3 w-3 rounded border-primary/30 text-primary focus:ring-primary" />
                    <span>{{ formatEnum(d) }}</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-xs font-medium text-ink/60">Cost</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="c in allCosts" :key="c" class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/25 bg-surface px-3 py-1 text-xs transition hover:border-primary hover:bg-primary/5" :class="{ 'border-primary bg-primary/10': selectedCosts.includes(c) }">
                    <input type="checkbox" :value="c" v-model="selectedCosts" class="h-3 w-3 rounded border-primary/30 text-primary focus:ring-primary" />
                    <span>{{ formatEnum(c) }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Generate action -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-4">
            <p class="text-sm text-ink/50"><i class="bi bi-info-circle mr-1"></i>{{ remainingDaysCount }} days remaining this week ({{ remainingDaysLabel }})</p>
            <div class="flex items-center gap-3">
              <p v-if="errorMessage" class="text-sm text-red-600"><i class="bi bi-exclamation-triangle mr-1"></i>{{ errorMessage }}</p>
              <button
                @click="handleGenerate"
                :disabled="isGenerating || totalWeight !== 100 || selectedMealTimes.length === 0"
                class="btn-primary"
                :class="{ 'opacity-50 cursor-not-allowed': isGenerating || totalWeight !== 100 || selectedMealTimes.length === 0 }"
              >
                <i class="bi bi-stars mr-2"></i>{{ isGenerating ? 'Generating...' : 'Generate Plan' }}
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Manual Plan Builder Card -->
      <div v-if="mode === 'manual'" class="bg-white rounded-md border border-primary/10 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-primary/10">
          <h2 class="text-xl flex items-center gap-2"><i class="bi bi-pencil-square text-primary"></i>Manual Plan Builder</h2>
          <span class="text-xs text-ink/40">{{ manualPlanSlotCount }} / {{ totalRecipesNeeded }} slots filled</span>
        </div>
        <div class="p-6 space-y-5">

          <!-- Recipe search -->
          <div class="flex gap-2">
            <div class="relative flex-1">
              <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"></i>
              <input
                v-model="manualSearch"
                @keyup.enter="searchRecipes"
                type="text"
                placeholder="Search by name or code…"
                class="w-full rounded-md border border-primary/20 bg-white py-2 pl-9 pr-4 text-sm text-ink placeholder-ink/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button @click="searchRecipes" :disabled="manualSearching" class="btn-primary px-4">
              <i v-if="manualSearching" class="bi bi-hourglass-split animate-spin"></i>
              <span v-else>Search</span>
            </button>
          </div>

          <!-- Search results -->
          <div v-if="manualResults.length > 0" class="max-h-52 overflow-y-auto rounded-md border border-primary/10 divide-y divide-primary/5">
            <div v-for="r in manualResults" :key="r.id" class="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-primary/5 transition">
              <div class="min-w-0">
                <span class="font-medium text-sm text-ink">{{ r.name }}</span>
                <span v-if="r.code" class="ml-2 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">#{{ r.code }}</span>
                <span class="ml-2 text-xs text-ink/40">{{ formatEnum(r.type) }} · {{ formatEnum(r.difficulty) }}</span>
              </div>
              <button @click="selectManualRecipe(r)" class="shrink-0 rounded-md border border-primary/30 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/5 transition">Select</button>
            </div>
          </div>
          <p v-else-if="manualSearchDone" class="text-sm text-ink/50">No recipes found.</p>

          <!-- Selected recipe + slot assignment -->
          <div v-if="manualSelectedRecipe" class="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-medium text-sm text-ink">{{ manualSelectedRecipe.name }}</span>
                <span v-if="manualSelectedRecipe.code" class="ml-2 font-mono text-xs text-primary">#{{ manualSelectedRecipe.code }}</span>
              </div>
              <button @click="manualSelectedRecipe = null" class="text-ink/40 hover:text-ink/70"><i class="bi bi-x-lg text-sm"></i></button>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <select v-model="manualAssignDay" class="rounded border border-primary/25 bg-white px-3 py-1.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select day…</option>
                <option v-for="d in manualPlanDays" :key="d.day" :value="d.day">{{ d.dayLabel }}</option>
              </select>
              <select v-model="manualAssignMeal" class="rounded border border-primary/25 bg-white px-3 py-1.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select meal…</option>
                <option v-for="mt in selectedMealTimes" :key="mt" :value="mt">{{ formatEnum(mt) }}</option>
              </select>
              <button @click="addManualEntry" :disabled="!manualAssignDay || !manualAssignMeal" class="btn-primary text-sm px-4 py-1.5 disabled:opacity-50">
                <i class="bi bi-plus-circle mr-1"></i>Add
              </button>
            </div>
          </div>

          <!-- Manual plan preview -->
          <div v-if="manualPlanSlotCount > 0" class="space-y-3">
            <h3 class="text-sm font-medium text-ink/70">Current Plan</h3>
            <div class="space-y-2">
              <div v-for="d in manualPlanDays" :key="d.day" class="rounded-md border border-primary/10 overflow-hidden">
                <div class="bg-primary/5 px-4 py-2 flex items-center gap-2">
                  <span class="font-medium text-sm text-ink">{{ d.dayLabel }}</span>
                  <span class="text-xs text-ink/40">{{ formatDate(d.date) }}</span>
                </div>
                <div v-if="manualPlanMealsForDay(d.day).length === 0" class="px-4 py-2 text-xs text-ink/40 italic">No meals assigned</div>
                <div v-else class="divide-y divide-primary/5">
                  <div v-for="entry in manualPlanMealsForDay(d.day)" :key="entry.mealTime" class="flex items-center gap-3 px-4 py-2">
                    <span class="w-20 shrink-0 rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary text-center">{{ formatEnum(entry.mealTime) }}</span>
                    <span class="flex-1 text-sm text-ink">{{ entry.recipe.name }}</span>
                    <button @click="removeManualEntry(d.day, entry.mealTime)" class="text-ink/30 hover:text-red-500 transition"><i class="bi bi-x"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Manual Save/Reset -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-4">
            <p v-if="saveMessage" class="text-sm" :class="saveMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'">
              <i class="bi mr-1" :class="saveMessage.startsWith('Error') ? 'bi-exclamation-circle' : 'bi-check-circle'"></i>{{ saveMessage }}
            </p>
            <div class="flex gap-2 ml-auto">
              <button @click="resetManualPlan" :disabled="isSaving" class="btn-secondary text-sm disabled:opacity-50"><i class="bi bi-arrow-counterclockwise mr-1"></i>Reset Plan</button>
              <button @click="handleManualSave" :disabled="isSaving || manualPlanSlotCount === 0" class="btn-primary text-sm disabled:opacity-50">
                <i v-if="isSaving" class="bi bi-hourglass-split mr-1 animate-spin"></i>
                <i v-else class="bi bi-floppy mr-1"></i>
                {{ isSaving ? 'Saving…' : 'Save Plan' }}
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Generated Plan Display (auto mode only) -->
    <div v-if="generatedPlan && !showSetup && mode === 'auto'">
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

      <p v-if="saveMessage" class="mb-4 text-sm" :class="saveMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'">
        <i class="bi mr-1" :class="saveMessage.startsWith('Error') ? 'bi-exclamation-circle' : 'bi-check-circle'"></i>{{ saveMessage }}
      </p>

      <!-- Stats Bar -->
      <div v-if="generatedPlan.stats.typeBreakdown && Object.keys(generatedPlan.stats.typeBreakdown).length > 0" class="mb-6 bg-white p-4 border border-primary/10 shadow-sm">
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

      <div v-if="generatedPlan.message" class="mb-6 bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
        <i class="bi bi-info-circle mr-2"></i>{{ generatedPlan.message }}
      </div>

      <!-- Day Cards -->
      <div class="space-y-4">
        <div
          v-for="(day, dayIndex) in generatedPlan.plan"
          :key="day.day"
          class="bg-white border border-primary/10 shadow-sm overflow-hidden"
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
            >
              <div class="relative flex items-center gap-4 px-3 md:px-6 py-3 md:py-4 transition hover:bg-surface">
                <div class="absolute top-0 right-0 md:static md:w-20 shrink-0">
                  <span class="md:rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                    {{ formatEnum(meal.mealTime) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <RouterLink
                      :to="`/recipes/${meal.recipe.id}`"
                      class="font-medium text-ink hover:text-primary transition"
                    >
                      {{ meal.recipe.name }}
                    </RouterLink>
                    <span v-if="meal.recipe.code" class="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wider text-primary">#{{ meal.recipe.code }}</span>
                  </div>
                  <div class="mt-1 flex items-center gap-3 text-xs text-ink/50">
                    <span><i class="bi bi-tag mr-1"></i>{{ formatEnum(meal.recipe.type) }}</span>
                    <span><i class="bi bi-speedometer2 mr-1"></i>{{ formatEnum(meal.recipe.difficulty) }}</span>
                    <span><i class="bi bi-people mr-1"></i>{{ meal.recipe.servingSize }} serving{{ meal.recipe.servingSize > 1 ? 's' : '' }}</span>
                  </div>
                </div>
                <div class="flex shrink-0 items-center gap-1 relative top-2 md:top-0">
                  <button
                    @click="swapRecipe(dayIndex, meal.mealTime)"
                    class="p-2 text-ink/40 transition hover:bg-primary/10 hover:text-primary"
                    title="Auto swap"
                  >
                    <i class="bi bi-arrow-repeat"></i>
                  </button>
                  <button
                    @click="toggleManualSwap(dayIndex, meal.mealTime)"
                    class="p-2 transition"
                    :class="manualSwapKey === `${dayIndex}-${meal.mealTime}`
                      ? 'bg-primary/10 text-primary'
                      : 'text-ink/40 hover:bg-primary/10 hover:text-primary'"
                    title="Swap by code"
                  >
                    <i class="bi bi-keyboard"></i>
                  </button>
                </div>
              </div>

              <!-- Manual swap input row -->
              <div
                v-if="manualSwapKey === `${dayIndex}-${meal.mealTime}`"
                class="flex items-center gap-3 border-t border-primary/10 bg-primary/5 px-6 py-3"
              >
                <i class="bi bi-hash text-primary/60"></i>
                <input
                  v-model="manualSwapCode"
                  type="text"
                  maxlength="6"
                  placeholder="Enter 6-digit code…"
                  @keyup.enter="confirmManualSwap(dayIndex, meal.mealTime)"
                  @keyup.esc="closeManualSwap"
                  class="w-36 rounded border border-primary/30 bg-white px-3 py-1.5 font-mono text-sm tracking-widest text-ink placeholder-ink/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  @click="confirmManualSwap(dayIndex, meal.mealTime)"
                  :disabled="manualSwapLoading || manualSwapCode.length !== 6"
                  class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {{ manualSwapLoading ? '…' : 'Swap' }}
                </button>
                <button
                  @click="closeManualSwap"
                  class="text-ink/40 transition hover:text-ink/70"
                >
                  <i class="bi bi-x-lg text-sm"></i>
                </button>
                <span v-if="manualSwapError" class="text-xs text-red-500">{{ manualSwapError }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { weeklyPlanApi, recipeApi } from '@/services/api'
import {
  RecipeType, Season, Difficulty, Cost, MealTime
} from '@/types/recipe.types'
import type {
  TypeWeight, GeneratePlanRequest, GeneratePlanResponse, Recipe
} from '@/types/recipe.types'

// ─── Enum arrays ────────────────────────────────────────────────────────────
const allMealTimes = Object.values(MealTime)
const allSeasons = Object.values(Season).filter(s => s !== 'ALL')
const allDifficulties = Object.values(Difficulty)
const allCosts = Object.values(Cost)

// ─── Mode ────────────────────────────────────────────────────────────────────
const mode = ref<'auto' | 'manual'>('auto')
const autoCardOpen = ref(true)
const showSetup = ref(true)

const setMode = (m: 'auto' | 'manual') => {
  mode.value = m
  errorMessage.value = ''
  saveMessage.value = ''
}

// ─── Shared filter state ─────────────────────────────────────────────────────
const typeWeights = ref<TypeWeight[]>(
  Object.values(RecipeType).map(type => ({ type, weight: 0 }))
)
const selectedMealTimes = ref<MealTime[]>([MealTime.LUNCH, MealTime.DINNER])
const selectedSeasons = ref<Season[]>([])
const selectedDifficulties = ref<Difficulty[]>([])
const selectedCosts = ref<Cost[]>([])

// ─── Status refs ─────────────────────────────────────────────────────────────
const isGenerating = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const saveMessage = ref('')
const generatedPlan = ref<GeneratePlanResponse | null>(null)

// ─── Auto swap state ──────────────────────────────────────────────────────────
const manualSwapKey = ref<string | null>(null)
const manualSwapCode = ref('')
const manualSwapLoading = ref(false)
const manualSwapError = ref('')

// ─── Manual plan builder state ────────────────────────────────────────────────
const manualSearch = ref('')
const manualSearching = ref(false)
const manualSearchDone = ref(false)
const manualResults = ref<Recipe[]>([])
const manualSelectedRecipe = ref<Recipe | null>(null)
const manualAssignDay = ref('')
const manualAssignMeal = ref('')

interface ManualEntry { mealTime: MealTime; recipe: Recipe }
const manualPlanEntries = ref<Map<string, ManualEntry[]>>(new Map())

// ─── Computed ─────────────────────────────────────────────────────────────────
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

const manualPlanDays = computed(() => {
  const today = new Date()
  const jsDay = today.getDay()
  const dayMap: Record<number, string> = {
    0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY',
    4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY'
  }
  const todayEnum = dayMap[jsDay]
  const todayIndex = DAYS_ORDER.indexOf(todayEnum)
  return DAYS_ORDER.slice(todayIndex).map((day, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      day,
      dayLabel: day.charAt(0) + day.slice(1).toLowerCase(),
      date: d.toISOString().split('T')[0]
    }
  })
})

const manualPlanMealsForDay = (day: string): ManualEntry[] =>
  manualPlanEntries.value.get(day) ?? []

const manualPlanSlotCount = computed(() => {
  let count = 0
  for (const entries of manualPlanEntries.value.values()) count += entries.length
  return count
})

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatEnum = (value: string) => value.charAt(0) + value.slice(1).toLowerCase()

const formatDate = (dateStr: string) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })

// ─── Auto generation ──────────────────────────────────────────────────────────
const distributeEvenly = () => {
  const count = typeWeights.value.length
  const base = Math.floor(100 / count)
  let remainder = 100 - base * count
  typeWeights.value.forEach((tw, i) => { tw.weight = base + (i < remainder ? 1 : 0) })
  typeWeights.value.forEach(tw => { tw.weight = Math.round(tw.weight / 5) * 5 })
  const diff = 100 - typeWeights.value.reduce((s, tw) => s + tw.weight, 0)
  if (diff !== 0) typeWeights.value[0].weight += diff
}

const resetWeights = () => { typeWeights.value.forEach(tw => { tw.weight = 0 }) }

const handleGenerate = async () => {
  errorMessage.value = ''
  saveMessage.value = ''
  if (totalWeight.value !== 100) { errorMessage.value = 'Type weights must total exactly 100%'; return }
  if (selectedMealTimes.value.length === 0) { errorMessage.value = 'Select at least one meal time'; return }
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
    showSetup.value = false
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Failed to generate plan'
  } finally {
    isGenerating.value = false
  }
}

const handleRegenerate = async () => { await handleGenerate() }

const goBack = () => {
  showSetup.value = true
  saveMessage.value = ''
  errorMessage.value = ''
}

const viewSavedPlan = () => {
  mode.value = 'auto'
  showSetup.value = false
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
    saveMessage.value = 'Error: ' + (err.response?.data?.error || 'Failed to save plan')
  } finally {
    isSaving.value = false
  }
}

// ─── Auto swap (in generated plan) ───────────────────────────────────────────
const toggleManualSwap = (dayIndex: number, mealTime: MealTime) => {
  const key = `${dayIndex}-${mealTime}`
  if (manualSwapKey.value === key) { closeManualSwap() }
  else { manualSwapKey.value = key; manualSwapCode.value = ''; manualSwapError.value = '' }
}

const closeManualSwap = () => {
  manualSwapKey.value = null; manualSwapCode.value = ''; manualSwapError.value = ''
}

const confirmManualSwap = async (dayIndex: number, mealTime: MealTime) => {
  if (!generatedPlan.value || manualSwapCode.value.length !== 6) return
  manualSwapLoading.value = true
  manualSwapError.value = ''
  try {
    const res = await recipeApi.getByCode(manualSwapCode.value)
    const meal = generatedPlan.value.plan[dayIndex]?.meals.find(m => m.mealTime === mealTime)
    if (meal) meal.recipe = res.data
    closeManualSwap()
  } catch (err: any) {
    manualSwapError.value = err.response?.status === 404 ? 'No recipe found with that code' : 'Failed to fetch recipe'
  } finally {
    manualSwapLoading.value = false
  }
}

const swapRecipe = async (dayIndex: number, mealTime: MealTime) => {
  if (!generatedPlan.value) return
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
    const currentMeal = generatedPlan.value.plan[dayIndex]?.meals.find(m => m.mealTime === mealTime)
    if (!currentMeal) return
    const freshRecipes = freshPlan.plan.flatMap(d => d.meals.map(m => m.recipe))
    const differentRecipe = freshRecipes.find(r => r.id !== currentMeal.recipe.id) || freshRecipes[0]
    const meal = generatedPlan.value.plan[dayIndex].meals.find(m => m.mealTime === mealTime)
    if (meal) meal.recipe = differentRecipe
  } catch (err) {
    console.error('Error swapping recipe:', err)
  }
}

// ─── Manual plan builder ──────────────────────────────────────────────────────
const searchRecipes = async () => {
  if (!manualSearch.value.trim()) return
  manualSearching.value = true
  manualSearchDone.value = false
  manualResults.value = []
  try {
    const q = manualSearch.value.trim()
    const res = await recipeApi.getAll()
    const lower = q.toLowerCase()
    manualResults.value = res.data.filter(r =>
      r.name.toLowerCase().includes(lower) || (r.code && r.code.toLowerCase().includes(lower))
    )
    manualSearchDone.value = true
  } catch {
    manualSearchDone.value = true
  } finally {
    manualSearching.value = false
  }
}

const selectManualRecipe = (recipe: Recipe) => {
  manualSelectedRecipe.value = recipe
  manualResults.value = []
  manualSearchDone.value = false
  manualSearch.value = ''
  manualAssignDay.value = ''
  manualAssignMeal.value = ''
}

const addManualEntry = () => {
  if (!manualSelectedRecipe.value || !manualAssignDay.value || !manualAssignMeal.value) return
  const day = manualAssignDay.value
  const mealTime = manualAssignMeal.value as MealTime
  const current = manualPlanEntries.value.get(day) ?? []
  const exists = current.find(e => e.mealTime === mealTime)
  if (exists) {
    manualPlanEntries.value.set(day, current.map(e =>
      e.mealTime === mealTime ? { ...e, recipe: manualSelectedRecipe.value! } : e
    ))
  } else {
    manualPlanEntries.value.set(day, [...current, { mealTime, recipe: manualSelectedRecipe.value }])
  }
  manualPlanEntries.value = new Map(manualPlanEntries.value)
  manualSelectedRecipe.value = null
  manualAssignDay.value = ''
  manualAssignMeal.value = ''
}

const removeManualEntry = (day: string, mealTime: MealTime) => {
  const current = manualPlanEntries.value.get(day) ?? []
  const updated = current.filter(e => e.mealTime !== mealTime)
  if (updated.length === 0) manualPlanEntries.value.delete(day)
  else manualPlanEntries.value.set(day, updated)
  manualPlanEntries.value = new Map(manualPlanEntries.value)
}

const resetManualPlan = async () => {
  isSaving.value = true
  saveMessage.value = ''

  try {
    await weeklyPlanApi.resetCurrent()
    manualPlanEntries.value = new Map()
    manualSelectedRecipe.value = null
    manualSearch.value = ''
    manualResults.value = []
    manualSearchDone.value = false
    generatedPlan.value = null
    saveMessage.value = 'Plan reset successfully!'
  } catch (err: any) {
    saveMessage.value = 'Error: ' + (err.response?.data?.error || 'Failed to reset plan')
  } finally {
    isSaving.value = false
  }
}

const handleManualSave = async () => {
  if (manualPlanSlotCount.value === 0) return
  isSaving.value = true
  saveMessage.value = ''
  try {
    const plan = manualPlanDays.value.map(d => ({
      day: d.day,
      dayLabel: d.dayLabel,
      date: d.date,
      meals: manualPlanMealsForDay(d.day).map(e => ({
        mealTime: e.mealTime,
        recipe: e.recipe
      }))
    })).filter(d => d.meals.length > 0)
    await weeklyPlanApi.save(plan)
    saveMessage.value = 'Plan saved successfully!'
  } catch (err: any) {
    saveMessage.value = 'Error: ' + (err.response?.data?.error || 'Failed to save plan')
  } finally {
    isSaving.value = false
  }
}

// ─── Load saved plan on mount ─────────────────────────────────────────────────
const loadCurrentPlan = async () => {
  try {
    const res = await weeklyPlanApi.getCurrent()
    const saved = res.data
    if (!saved || !saved.planItems || saved.planItems.length === 0) return

    // Reshape flat planItems[] → plan[] grouped by day
    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    const today = new Date()
    const jsDay = today.getDay()
    const dayMap: Record<number, string> = {
      0: 'SUNDAY', 1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY',
      4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY'
    }
    const todayEnum = dayMap[jsDay]
    const todayIndex = dayOrder.indexOf(todayEnum)

    // Group items by day
    const grouped = new Map<string, { mealTime: MealTime; recipe: any }[]>()
    for (const item of saved.planItems) {
      const list = grouped.get(item.dayOfWeek) ?? []
      list.push({ mealTime: item.mealType as MealTime, recipe: item.recipe })
      grouped.set(item.dayOfWeek, list)
    }

    // Build plan[] in day order, only for remaining days this week
    const plan: GeneratePlanResponse['plan'] = []
    for (let i = todayIndex; i < dayOrder.length; i++) {
      const dayEnum = dayOrder[i]
      const meals = grouped.get(dayEnum)
      if (!meals || meals.length === 0) continue
      const d = new Date(today)
      d.setDate(today.getDate() + (i - todayIndex))
      plan.push({
        day: dayEnum as any,
        dayLabel: dayEnum.charAt(0) + dayEnum.slice(1).toLowerCase(),
        date: d.toISOString().split('T')[0],
        meals
      })
    }

    if (plan.length > 0) {
      generatedPlan.value = {
        plan,
        stats: { totalMatching: 0, totalNeeded: 0, totalDays: plan.length, mealsPerDay: plan[0].meals.length, typeBreakdown: {} }
      }
      mode.value = 'auto'
      showSetup.value = false
    }
  } catch (err) {
    // No saved plan or error — stay on setup screen
  }
}

onMounted(loadCurrentPlan)
</script>

<style scoped>
.weight-slider {
  -webkit-appearance: none;
  appearance: none;
  background: rgba(241, 96, 96, 0.2);
}

.weight-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #f8597eff;
  cursor: pointer;
}

.weight-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #f8597eff;
  border: none;
  cursor: pointer;
}
</style>
