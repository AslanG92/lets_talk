import { Elysia } from "elysia";
import { authController } from "../controllers/authController";

export const authRoutes = new Elysia({ prefix: "/auth" })
	.post("/register", authController.register)
	.post("/login", authController.login);
