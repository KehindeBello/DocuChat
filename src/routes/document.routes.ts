import { Router } from "express";
import { validate } from "../middlewares/validate";
import * as documentController from '../controllers/document.controller'
import { authenticate, authorize } from "../middlewares/auth";
import { createDocumentSchema, listDocumentSchema } from "../validators/document.validator";
import { Role } from "../generated/prisma/enums";

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /document:
 *   post:
 *     summary: Create a document
 *     description: Creates a document owned by the authenticated user.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *               content:
 *                 type: string
 *                 minLength: 1
 *           example:
 *             title: Project notes
 *             content: Notes about the project...
 *     responses:
 *       '201':
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *       '400':
 *         description: Invalid document input
 *       '401':
 *         description: Authentication is required
 */
router.post('/', validate(createDocumentSchema), (req, res) => documentController.createDocument(req, res));

/**
 * @swagger
 * /document:
 *   get:
 *     summary: List the authenticated user's documents
 *     description: Returns documents belonging to the authenticated user, newest first.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of documents per page.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PROCESSING, READY, FAILED]
 *         description: Filter documents by processing status.
 *     responses:
 *       '200':
 *         description: Documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     documents:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           content:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [PENDING, PROCESSING, READY, FAILED]
 *                           url:
 *                             type: string
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           userId:
 *                             type: string
 *                     meta:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *       '400':
 *         description: Invalid pagination or status filter
 *       '401':
 *         description: Authentication is required
 */
router.get('/', validate(listDocumentSchema), (req, res) => documentController.listDocuemnt(req, res));

export default router;