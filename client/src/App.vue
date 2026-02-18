<template>
  <div class="min-h-screen bg-[#e4e4e4]" :class="{ 'inverted': inverted }">
    <nav class="sticky top-0 z-20 border-b border-primary/10 bg-white/95 backdrop-blur">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <RouterLink to="/" class="inline-flex items-center gap-2 text-xl font-heading text-primary">
            <i class="bi bi-calendar-heart"></i>
            FoodPlanner
          </RouterLink>

          <div class="flex flex-wrap items-center gap-8">
            <button
              @click="inverted = !inverted"
              class="text-ink/60 transition hover:text-primary"
              :title="inverted ? 'Disable invert' : 'Invert colors'"
            >
              <i :class="inverted ? 'bi bi-circle-half' : 'bi bi-circle-half'"></i>
            </button>
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

const inverted = ref(false)
</script>
