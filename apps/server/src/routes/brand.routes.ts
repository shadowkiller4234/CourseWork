import { Router } from "express";
import { brand, brandAdd, brandUpdate, brandDelete } from "../controllers/brand.controller";

const router = Router();

router.get("/", brand);
router.post("/", brandAdd);
router.patch("/:id", brandUpdate);
router.delete("/:id", brandDelete);

export default router;
