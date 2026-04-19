import { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = Router();

/**
 * @openapi
 * /tools/{toolId}/reviews:
 *   get:
 *     summary: Get reviews by tool
 *     tags: [Reviews]
 *     parameters:
 *       - name: toolId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get("/tools/:toolId/reviews",
    reviewController.displayReviewsByTool
);

/**
 * @openapi
 * /rentals/{rentalId}/review:
 *   post:
 *     summary: Create a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: rentalId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.post("/rentals/:rentalId/review",
    authenticate,
    authorize({ hasRole: ["customer", "staff", "admin"]}),
    reviewController.generateReview
);

/**
 * @openapi
 * /reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Review not found
 */
router.put("/reviews/:reviewId",
    authenticate,
    authorize({ hasRole: ["staff", "admin"], allowSameUser: true}),
    reviewController.updateReviewDetails
);

/**
 * @openapi
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Review not found
 */
router.delete("/reviews/:reviewId",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    reviewController.deleteReview
);

export default router;