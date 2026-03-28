<template>
  <div v-if="!authenticated" class="min-h-screen bg-[#e4e4e4] flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
      <div class="flex flex-col items-center gap-2 mb-6">
        <i class="bi bi-calendar-heart text-4xl text-primary"></i>
        <h1 class="text-2xl font-heading text-primary">FoodPlanner</h1>
        <p class="text-sm text-ink/50">Enter the password to continue</p>
      </div>
      <form @submit.prevent="tryUnlock" class="flex flex-col gap-4">
        <input
          v-model="passwordInput"
          type="password"
          placeholder="Password"
          class="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          autofocus
        />
        <p v-if="wrongPassword" class="text-xs text-red-500 -mt-2">Incorrect password.</p>
        <button
          type="submit"
          class="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 transition"
        >
          Enter
        </button>
      </form>
    </div>
  </div>

  <div v-else class="min-h-screen bg-[#e4e4e4]" :class="{ 'inverted': inverted }">
    <nav class="sticky top-0 z-20 border-b border-primary/10 bg-white/95 backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <RouterLink to="/" class="hidden lg:inline-flex items-center gap-2 text-xl font-heading text-primary">
            <i class="bi bi-calendar-heart"></i>
            FoodPlanner
          </RouterLink>

          <div class="text-sm lg:text-base flex flex-wrap items-center gap-5 lg:gap-8">
            <RouterLink to="/" class="font-medium text-ink/70 transition hover:text-primary" exact-active-class="text-primary">
              Recipes
            </RouterLink>
            <RouterLink to="/add-recipe" class="font-medium text-ink/70 transition hover:text-primary" exact-active-class="text-primary">
              Add Recipe
            </RouterLink>
            <RouterLink to="/weekly-plan" class="font-medium text-ink/70 transition hover:text-primary" exact-active-class="text-primary">
              Weekly Plan
            </RouterLink>
            <RouterLink to="/grocery" class="font-medium text-ink/70 transition hover:text-primary" exact-active-class="text-primary">
              Grocery
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <main class="pb-12">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const UAT_PASSWORD = import.meta.env.VITE_UAT_PASSWORD as string | undefined
console.log('[UAT] password env:', UAT_PASSWORD)
const STORAGE_KEY = 'uat_unlocked'

const inverted = ref(false)
const passwordInput = ref('')
const wrongPassword = ref(false)

const authenticated = ref(!UAT_PASSWORD || localStorage.getItem(STORAGE_KEY) === UAT_PASSWORD)

function tryUnlock() {
  if (passwordInput.value === UAT_PASSWORD) {
    localStorage.setItem(STORAGE_KEY, UAT_PASSWORD)
    authenticated.value = true
    wrongPassword.value = false
  } else {
    wrongPassword.value = true
    passwordInput.value = ''
  }
}
</script>
