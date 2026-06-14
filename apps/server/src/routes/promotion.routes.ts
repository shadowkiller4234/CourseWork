import { Router } from "express";
import { PromotionController } from "../controllers/promotion.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", PromotionController.getAll);
router.get("/:id", PromotionController.getById);
router.post(
  "/",
  upload.single("image"),
  PromotionController.create
);
router.patch("/:id", PromotionController.update);
router.delete("/:id", PromotionController.remove);

export default router;