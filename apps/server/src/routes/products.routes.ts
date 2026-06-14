import { Router } from "express";

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug
} from "../controllers/products.controllers";

import { searchProducts } from "../controllers/search.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";


const router = Router();


router.get("/", getProducts);
router.get('/search', searchProducts);
router.get("/id/:id", getProductById);
router.get("/:slug", getProductBySlug);


router.post("/", authMiddleware, roleMiddleware("admin"), createProduct);

router.patch("/:id", authMiddleware, roleMiddleware("admin"), updateProduct);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

export default router;