import { Router } from "express";
import * as AuthController from "../controllers/user.controllers";

const router = Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;