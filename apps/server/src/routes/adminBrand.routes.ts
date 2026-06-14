import { Router } from "express";
import {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand
} from "../controllers/adminBrands.controller";

const router = Router();

router.get("/", getBrands);
router.post("/", createBrand);
router.patch("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;