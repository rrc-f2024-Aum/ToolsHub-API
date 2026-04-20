import express from "express";
import * as adminController from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router: express.Router = express.Router();

/**
 * @openapi
 * /admin/setCustomClaims:
 *   post:
 *     summary: Set user role (Admin only)
 *     description: Assign a role (customer, staff, or admin) to a user by their UID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - role
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Firebase user UID
 *                 example: "j40PYtQElkOCyNzV6vOoECUf..."
 *               role:
 *                 type: string
 *                 enum: [customer, staff, admin]
 *                 description: Role to assign to the user
 *     responses:
 *       200:
 *         description: Role set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Missing UID or role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
// set user role
router.post("/setCustomClaims",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.setUserRole
);

/**
 * @openapi
 * /admin/reports/weekly:
 *   get:
 *     summary: Get weekly earnings report (Admin only)
 *     description: Retrieve total earnings, rentals count, and late fees for the current week
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly earnings report retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalEarnings:
 *                       type: number
 *                     totalRentals:
 *                       type: integer
 *                     totalLateFees:
 *                       type: number
 *                     period:
 *                       type: string
 *                       example: "weekly"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
// get - earning report week
router.get("/reports/weekly",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.getWeeklyReport
);

/**
 * @openapi
 * /admin/reports/monthly:
 *   get:
 *     summary: Get monthly earnings report (Admin only)
 *     description: Retrieve total earnings, rentals count, and late fees for the current month
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly earnings report retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalEarnings:
 *                       type: number
 *                     totalRentals:
 *                       type: integer
 *                     totalLateFees:
 *                       type: number
 *                     period:
 *                       type: string
 *                       example: "monthly"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
// get - earning report month
router.get("/reports/monthly",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.getMonthlyReport
);

/**
 * @openapi
 * /admin/reports/annual:
 *   get:
 *     summary: Get annual earnings report (Admin only)
 *     description: Retrieve total earnings, rentals count, and late fees for the current year
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Annual earnings report retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalEarnings:
 *                       type: number
 *                     totalRentals:
 *                       type: integer
 *                     totalLateFees:
 *                       type: number
 *                     period:
 *                       type: string
 *                       example: "annual"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
// get - earning report annual
router.get("/reports/annual",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.getAnnualReport
);

/**
 * @openapi
 * /admin/stats/popular-tools:
 *   get:
 *     summary: Get most popular tools (Admin only)
 *     description: Retrieve the most rented tools based on rental count
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Number of tools to return
 *     responses:
 *       200:
 *         description: Popular tools retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       toolId:
 *                         type: string
 *                       rentalCount:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       category:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
// get popular tools
router.get("/stats/popular-tools",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.getPopularTools
);

export default router;