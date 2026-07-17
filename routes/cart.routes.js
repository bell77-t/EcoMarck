import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controller/cart.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', getCart);
router.post('/', addItem);
router.put('/:productId', updateItem);
router.delete('/:productId', removeItem);
router.delete('/', clearCart);
export default router;
