import { Router } from "express"
import * as authController from "../controllers/auth.controller"
import { authenticate } from "../middlewares/auth";
const router = Router()


router.post('/register', (req, res) => authController.registerUser(req, res));
router.post('/login', (req, res) => authController.login(req, res))
router.post('/logout', (req, res) => authController.logoutUser(req, res));

export default router;