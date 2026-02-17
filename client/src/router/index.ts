import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipesView from '../views/RecipesView.vue'
import RecipeDetailView from '../views/RecipeDetailView.vue'
import AddRecipeView from '../views/AddRecipeView.vue'
import WeeklyPlanView from '../views/WeeklyPlanView.vue'
import ShowcaseView from '../views/ShowcaseView.vue'

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
      path: '/recipes/:id',
      name: 'recipe-detail',
      component: RecipeDetailView
    },
    {
      path: '/add-recipe',
      name: 'add-recipe',
      component: AddRecipeView
    },
    {
      path: '/recipes/:id/edit',
      name: 'edit-recipe',
      component: AddRecipeView
    },
    {
      path: '/weekly-plan',
      name: 'weekly-plan',
      component: WeeklyPlanView
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: ShowcaseView
    }
  ]
})

export default router
