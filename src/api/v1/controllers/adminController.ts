import { Request, Response, NextFunction} from "express";
import { auth } from "../../../config/firebaseConfig";
import * as reportService from "../services/reportService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const setUserRole = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
     try {
        const requesterRole = res.locals.role;
        if (requesterRole !== "admin") {
            res.status(HTTP_STATUS.FORBIDDEN).json(
                errorResponse("Admin access required", "ADMIN_ONLY")
            );
            return;
        }

        const { uid, role } = req.body;
        if (!uid) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("UID is required", "MISSING_UID")
            );
            return;
        }

        if (!role) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Role is required", "MISSING_ROLE")
            );
            return;
        }
        
        const allowedRoles = ["customer", "staff", "admin"];
        if (!allowedRoles.includes(role)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse(`Invalid role. Must be one of: ${allowedRoles.join(", ")}`, "INVALID_ROLE")
            );
            return;
        }

        try {
            await auth.getUser(uid);
        } catch (userError) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse(`User with UID ${uid} not found`, "USER_NOT_FOUND")
            );
            return;
        }

        await auth.setCustomUserClaims(uid, { role });

        res.status(HTTP_STATUS.OK).json(
            successResponse({ uid, role }, 
                `Role set to ${role} for user: ${uid}. User must obtain a new token for changes to take effect.`
            )
        );

    } catch (error) {
        next(error);
    }
}

export const getWeeklyReport = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const report = await reportService.getWeeklyEarnings();
        res.status(HTTP_STATUS.OK).json(
            successResponse(report, "Weekly earnings report retrieved")
        );
    } catch (error) {
        next(error);
    }
}

export const getMonthlyReport = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const report = await reportService.getMonthlyEarnings();
        res.status(HTTP_STATUS.OK).json(
            successResponse(report, "Monthly earnings report retrieved")
        );
    } catch (error) {
        next(error);
    }
}

export const getAnnualReport = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const report = await reportService.getAnnualEarnings();
        res.status(HTTP_STATUS.OK).json(
            successResponse(report, "Annual earnings report retrieved")
        );
    } catch (error) {
        next(error);
    }
}

export const getPopularTools = async(
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const popularTool = await reportService.getPopularTools(limit);
        res.status(HTTP_STATUS.OK).json(
            successResponse(popularTool, "Most popular tools retrieved")
        );
    } catch (error) {
        next(error);
    }
}