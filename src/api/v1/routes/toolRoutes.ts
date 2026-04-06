import { Router } from "express";
import * as toolController from "../controllers/toolController";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running properly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 123.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
// GET - healthCheck
router.get("/health", toolController.checkHealth);

/**
 * @openapi
 * /tools:
 *   get:
 *     summary: Get all tools
 *     description: Retrieve a list of all available tools
 *     tags: [Tools]
 *     responses:
 *       200:
 *         description: Tools retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tool'
 */
// GET - All Tools
router.get("/", toolController.displayAllTools);

/**
 * @openapi
 * /tools/category/{category}:
 *   get:
 *     summary: Get tools by category
 *     description: Retrieve all tools in a specific category
 *     tags: [Tools]
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [power_tools, hand_tools, gardening, painting, other]
 *         description: Tool category to filter by
 *     responses:
 *       200:
 *         description: Tools retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tool'
 */
// GET - tools by category
router.get("/category/:category",
    toolController.displayToolByCategory
);

/** 
 * @openapi
 * /tools/{id}:
 *   get:
 *     summary: Get tool by ID
 *     description: Retrieve a single tool by its unique identifier
 *     tags: [Tools]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Tool retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Tool'
 *       404:
 *         description: Tool not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// GET - tool by id
router.get("/:id", toolController.displayToolById);

/**
 * @openapi
 * /tools:
 *   post:
 *     summary: Create a new tool
 *     description: Add a new tool to the inventory
 *     tags: [Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateToolDTO'
 *     responses:
 *       201:
 *         description: Tool created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Tool'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// POST - create new tool
router.post("/", toolController.generateTool);

/**
 * @openapi
 * /tools/{id}:
 *  put:
 *     summary: Update a tool
 *     description: Update an existing tool's information
 *     tags: [Tools]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [power_tools, hand_tools, gardening, painting, other]
 *               hourlyRate:
 *                 type: number
 *               depositAmount:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Available, Rented, Maintenance]
 *     responses:
 *       200:
 *         description: Tool updated successfully
 *       404:
 *         description: Tool not found
 */
// PUT - update tool by id 
router.put("/:id", toolController.updateToolDetails);

/**
 * @openapi
 * /tools/{id}:
 *  delete:
 *     summary: Delete a tool
 *     description: Remove a tool from the inventory
 *     tags: [Tools]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Tool deleted successfully
 *       404:
 *         description: Tool not found
 */
// DELETE - tool by id
router.delete("/:id", toolController.removeTool);

export default router;