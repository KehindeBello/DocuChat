import { Router } from "express";
import * as userController from '../controllers/user.controller'
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get('/', authenticate, (req, res) => userController.getProfile(req, res));


export default router;