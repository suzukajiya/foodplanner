import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipesView from '../views/RecipesView.vue'
import AddRecipeView from '../views/AddRecipeView.vue'
import WeeklyPlanView from '../views/WeeklyPlanView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView
    },
    {
      path: '/add-recipe',
      name: 'add-recipe',
      component: AddRecipeView
    },
    {
      path: '/weekly-plan',
      name: 'weekly-plan',
      component: WeeklyPlanView
    }
  ]
})

export default router
