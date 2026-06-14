// routes/cart.routes.ts
import { Router } from "express";
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeFromCartController,
  updateQtyController,
} from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getCartController);
router.post("/add", addToCartController);
router.delete("/:productId", removeFromCartController);
router.patch("/:productId", updateQtyController);
router.delete("/", clearCartController);

export default router;