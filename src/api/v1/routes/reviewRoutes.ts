import { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import { validateRequest } from "../middleware/validate";
import { reviewSchemas } from "../validations/reviewValidation";

const router = Router();

/**
 * @openapi
 * /tools/{toolId}/reviews:
 *   get:
 *     summary: Get reviews by tool
 *     description: Retrieve all reviews for a specific tool (public endpoint)
 *     tags: [Reviews]
 *     parameters:
 *       - name: toolId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
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
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *          description: Tool not found
 */
// Get reviews by tool id
router.get("/tools/:toolId/reviews",
    validateRequest(reviewSchemas.getByTool),
    reviewController.displayReviewsByTool
);

/**
 * @openapi
 * /rentals/{rentalId}/review:
 *   post:
 *     summary: Create a review
 *     description: Customer creates a review for a completed rental
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: rentalId
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
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5 stars
 *               comment:
 *                  type: string
 *                 description: Review comment text
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input or rental not completed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Rental not found
 */
// Post - customer creates review
router.post("/rentals/:rentalId/review",
    authenticate,
    validateRequest(reviewSchemas.create),
    authorize({ hasRole: ["customer", "staff", "admin"]}),
    reviewController.generateReview
);

/**
 * @openapi
 * /reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     description: Customer updates their own review (staff/admin can update any)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5 stars
 *               comment:
 *                 type: string
 *                 description: Review comment text
 *     responses:
 *       200:
 *          description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         description: Review not found
 */
// Put - customer updates their review
router.put("/reviews/:reviewId",
    authenticate,
    validateRequest(reviewSchemas.update),
    authorize({ hasRole: ["staff", "admin"], allowSameUser: true}),
    reviewController.updateReviewDetails
);

/**
 * @openapi
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     description: Admin only - Delete any review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *       401:
 *          description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Review not found
 */
// Delete - review by  id
router.delete("/reviews/:reviewId",
    authenticate,
    validateRequest(reviewSchemas.delete),
    authorize({ hasRole: ["admin"]}),
    reviewController.deleteReview
)