import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface AuthorizationOptions {
    hasRole: string[];
    allowSameUser?: boolean;
}

const authorize = (opts: AuthorizationOptions) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { role, uid } = res.locals;
            const { id } = req.params;

            if (opts.allowSameUser && id && uid === id) {
                return next();
            }

            if (!role) {
                return res.status(HTTP_STATUS.FORBIDDEN).json(
                    errorResponse("Forbidden: No role found",
                    "ROLE_NOT_FOUND")
                );
            }

            if (opts.hasRole.includes(role)) {
                return next();
            }

            return res.status(HTTP_STATUS.FORBIDDEN).json(
                errorResponse("Forbidden: Insufficient permissions",
                "INSUFFICIENT_PERMISSIONS")
            );
        } catch (error) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(
                errorResponse("Forbidden: Access denied", "FORBIDDEN")
            );
        }
    };
};

export default authorize;