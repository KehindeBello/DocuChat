import { Router } from "express";
import { validate } from "../middlewares/validate";
import * as documentController from '../controllers/document.controller'
import { authenticate } from "../middlewares/auth";
import { createDocumentSchema, listDocumentSchema } from "../validators/document.validator";

const router = Router();
router.use(authenticate);

router.post('/', validate(createDocumentSchema), (req, res) => documentController.createDocument(req, res));
router.get('/', validate(listDocumentSchema), (req, res) => documentController.listDocuemnt(req, res));

export default router;