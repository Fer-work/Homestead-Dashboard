import { Router } from "express";
import { register, login, getMe } from "./controller.js";
import { requireRole } from "./middleware.js";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me (any authenticated user)
router.get("/me", requireRole(), getMe);

export default router;
