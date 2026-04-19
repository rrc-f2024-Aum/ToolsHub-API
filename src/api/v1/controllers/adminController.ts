import { Request, Response, NextFunction} from "express";
import { auth } from "../../../config/firebaseConfig";
import * as reportService from "../services/reportService";
import { successResponse, errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const setUserRole = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const { uid, roles } = req.body;

        const validRoles = ["customer", "staff", "admin"];
        if (!validRoles.includes(roles)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse(`Invalid role. Must be one of: ${validRoles.join(",")}`,
            "INVALID_ROLE")
            );
            return;
        }

        await auth.setCustomUserClaims(uid, { roles });

        res.status(HTTP_STATUS.OK).json(
            successResponse({ uid, roles}, `User role set to ${roles} successfully`)
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