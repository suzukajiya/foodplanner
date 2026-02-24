import { Router } from 'express';
import {
  getAllGroceryItems,
  getGroceryItemById,
  createGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
  getListState,
  saveListState,
  resetListState
} from '../controllers/groceryController';

const router = Router();

router.get('/list-state', getListState);
router.post('/list-state', saveListState);
router.delete('/list-state', resetListState);

router.get('/', getAllGroceryItems);
router.get('/:id', getGroceryItemById);
router.post('/', createGroceryItem);
router.put('/:id', updateGroceryItem);
router.delete('/:id', deleteGroceryItem);

export default router;
