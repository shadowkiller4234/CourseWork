import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

import {
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} from "../controllers/adminOrders.controller";

const router = Router();

// ALL ORDERS
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getOrders
);

// SINGLE ORDER
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getOrderById
);

// UPDATE ORDER (status, etc.)
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateOrder
);

// DELETE ORDER
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteOrder
);

export default router;