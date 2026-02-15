<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex space-x-8">
            <RouterLink to="/" class="inline-flex items-center px-1 pt-1 text-gray-900 font-semibold">
              FoodPlanner
            </RouterLink>
            <RouterLink to="/recipes" class="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900">
              Recipes
            </RouterLink>
            <RouterLink to="/add-recipe" class="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900">
              Add Recipe
            </RouterLink>
            <RouterLink to="/weekly-plan" class="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900">
              Weekly Plan
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
