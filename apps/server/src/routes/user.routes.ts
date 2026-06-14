import { Router } from "express";
import { getMe } from "../controllers/user.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getMe);


export default router;