import { Router } from "express";
import * as rentalController from "../controllers/rentalController";

const router = Router();

/**
 * @openapi
 * /rentals:
 *   get:
 *     summary: Get all rentals
 *     description: Retrieve a list of all rental contracts
 *     tags: [Rentals]
 *     responses:
 *       200:
 *         description: Rentals retrieved successfully
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
 *                     $ref: '#/components/schemas/Rental'
 */ 
// GET - all rentals
router.get("/", rentalController.displayAllRentals);

/**
 * @openapi
 * /rentals/customer/{customerId}:
 *   get:
 *     summary: Get rentals by customer
 *     description: Retrieve all rental contracts for a specific customer
 *     tags: [Rentals]
 *     parameters:
 *       - name: customerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Rentals retrieved successfully
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
 *                     $ref: '#/components/schemas/Rental'
 */
// GET - by customer Id
router.get("/customer/:customerId", rentalController.displayRentalsByCustomer);

/**
 * @openapi
 * /rentals/{id}:
 *   get:
 *     summary: Get rental by ID
 *     description: Retrieve a single rental contract by its unique identifier
 *     tags: [Rentals]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID
 *     responses:
 *       200:
 *         description: Rental retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Rental'
 *       404:
 *         description: Rental not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// GET - by rental Id
router.get("/:id", rentalController.displayRentalByIf);

/**
 * @openapi
 * /rentals:
 *  post:
 *     summary: Create a new rental
 *     description: Create a new rental contract for a tool
 *     tags: [Rentals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRentalDTO'
 *     responses:
 *       201:
 *         description: Rental created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Tool not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// POST - create new rental
router.post("/", rentalController.generateRental);

/**
 * @openapi
 * /rentals/{id}/cancel:
 *   post:
 *     summary: Cancel a rental
 *     description: Cancel an active rental contract
 *     tags: [Rentals]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID
 *     responses:
 *       200:
 *         description: Rental cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Rental'
 *       404:
 *         description: Rental not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// POST - cancel rental by Id
router.post("/:id/cancel", rentalController.cancelRental);

export default router;