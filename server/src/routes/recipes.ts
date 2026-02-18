import { Router } from 'express';
import {
  getAllRecipes,
  getRecipeById,
  getRecipeByCode,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipeController';

const router = Router();

router.get('/', getAllRecipes);
router.get('/code/:code', getRecipeByCode);
router.get('/:id', getRecipeById);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
