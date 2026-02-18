import { Router } from 'express';
import {
  getAllGroceryItems,
  getGroceryItemById,
  createGroceryItem,
  updateGroceryItem,
  deleteGroceryItem
} from '../controllers/groceryController';

const router = Router();

router.get('/', getAllGroceryItems);
router.get('/:id', getGroceryItemById);
router.post('/', createGroceryItem);
router.put('/:id', updateGroceryItem);
router.delete('/:id', deleteGroceryItem);

export default router;
