import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

import { getAllUsers, deleteUser, createUser } from "../controllers/admin.controller";

import categoryRoutes from "./category.routes";
import brandRoutes from "./brand.routes";
import orderRoutes from "./adminOrder.routes";
import productRoutes from "./adminProducts.routes";


const router = Router();

// USERS
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUsers
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);

router.post(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  createUser
);

// CATEGORIES
router.use(
  "/categories",
  authMiddleware,
  roleMiddleware("admin"),
  categoryRoutes
);

// BRANDS
router.use(
  "/brands",
  authMiddleware,
  roleMiddleware("admin"),
  brandRoutes
);

// ORDERS
router.use(
  "/orders",
  authMiddleware,
  roleMiddleware("admin"),
  orderRoutes
);

// PRODUCTS
router.use(
  "/products",
  authMiddleware,
  roleMiddleware("admin"),
  productRoutes
);

export default router;