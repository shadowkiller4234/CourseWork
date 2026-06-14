import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

import { createOrder, updateOrder, getMyOrders } from '../controllers/order.controller';

const router = Router();

router.post("/", authMiddleware, createOrder);
router.post("/update", authMiddleware, updateOrder);
router.get("/my", authMiddleware, getMyOrders);

export default router;