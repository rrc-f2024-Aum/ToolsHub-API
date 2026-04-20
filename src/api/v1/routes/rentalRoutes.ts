import { Router } from "express";
import * as rentalController from "../controllers/rentalController";
import { validateRequest } from "../middleware/validate";
import { rentalSchemas } from "../validations/rentalValidation";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = Router();

/**
 * @openapi
 * /rentals/active:
 *   get:
 *     summary: Get all active rentals
 *     description: Retrieve all rental contracts with Active status
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active rentals retrieved successfully
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
// GET - rentals by active status
router.get("/active", 
    authenticate,
    authorize({ hasRole: ["staff", "admin"]}),
    rentalController.displayActiveRentals);

/**
 * @openapi
 * /rentals/overdue:
 *   get:
 *     summary: Get all overdue rentals
 *     description: Retrieve all rental contracts that are past their end date
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue rentals retrieved successfully
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
// GET - overdue rentals 
router.get("/overdue",
    authenticate,
    authorize({ hasRole: ["staff", "admin"]}),
    rentalController.displayOverdueRentals);

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
router.get("/customer/:customerId", 
    authenticate,
    authorize({ hasRole: ["staff", "admin"] }),
    validateRequest(rentalSchemas.getByCustomer),
    rentalController.displayRentalsByCustomer);

/**
 * @openapi
 * /rentals/tool/{toolId}:
 *   get:
 *     summary: Get rentals by tool
 *     description: Retrieve all rental contracts for a specific tool
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: toolId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
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
// GET - by tool Id
router.get("/tool/:toolId", 
    authenticate,
    authorize({ hasRole: ["staff", "admin"] }),
    validateRequest(rentalSchemas.getByTool),
    rentalController.displayRentalsByTool);

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
router.get("/",
    authenticate,
    authorize({ hasRole: ["staff", "admin"] }), 
    validateRequest(rentalSchemas.list),
    rentalController.displayAllRentals);

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
router.get("/:id",
    authenticate,
    authorize({ hasRole: ["staff", "admin"] }), 
    validateRequest(rentalSchemas.getById),
    rentalController.displayRentalById);

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
router.post("/",
    authenticate,
    authorize({ hasRole: ["staff", "admin"] }), 
    validateRequest(rentalSchemas.create),
    rentalController.generateRental);

/**
 * @openapi
 * /rentals/{id}/return:
 *   post:
 *     summary: Process tool return
 *     description: Process the return of a rented tool and calculate late fees if applicable
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID
 *     responses:
 *       200:
 *         description: Rental returned successfully
 *       400:
 *         description: Cannot return rental with invalid status
 *       404:
 *         description: Rental not found
 */
// POST - return rental
router.post(
    "/:id/return",
    authenticate,
    authorize({ hasRole: ["staff", "admin"] }),
    validateRequest(rentalSchemas.getById),
    rentalController.returnRental);

/**
 * @openapi
 * /rentals/{id}:
 *   put:
 *     summary: Update rental (extend dates)
 *     description: Extend the end date of an active rental contract
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: New end date for the rental
 *               status:
 *                 type: string
 *                 enum: [Active, Completed, Cancelled, Overdue]
 *     responses:
 *       200:
 *         description: Rental updated successfully
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
 *         description: Invalid update data
 *       404:
 *         description: Rental not found
 */
// POST - update rental [time extension]
router.put("/:id",
    authenticate,
    authorize({ hasRole: ["staff", "admin"] }),
    validateRequest(rentalSchemas.update),
    rentalController.updateRentalDetails);

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
router.post("/:id/cancel",
    authenticate,
    authorize({ hasRole: ["staff", "admin"] }), 
    validateRequest(rentalSchemas.cancel),
    rentalController.cancelRental);

export default router;