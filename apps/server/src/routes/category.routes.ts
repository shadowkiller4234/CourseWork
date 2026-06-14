import { Router } from "express";
import { categories, categoriesAdd, categoriesUpdate, categoriesDelete } from "../controllers/category.controller";

const router = Router();

router.get("/", categories);
router.post("/", categoriesAdd);
router.patch("/:id", categoriesUpdate);
router.delete("/:id", categoriesDelete);


export default router;
