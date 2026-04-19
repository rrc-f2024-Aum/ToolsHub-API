import express from "express";
import * as adminController from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router: express.Router = express.Router();

// set user role
router.post("/setCustomClaims",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.setUserRole
);

// get - earning report week
router.get("/reports/weekly",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.getWeeklyReport
);

// get - earning report month
router.get("/reports/monthly",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.getMonthlyReport
);

// get - earning report annual
router.get("/reports/annual",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.getAnnualReport
);

// get popular tools
router.get("/stats/popular-tools",
    authenticate,
    authorize({ hasRole: ["admin"]}),
    adminController.getPopularTools
);

export default router;