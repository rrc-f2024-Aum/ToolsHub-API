import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../errors/errors";

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
                throw new AuthorizationError(
                    "Forbidden: No role found",
                    "ROLE_NOT_FOUND"
                );
            }

            if (opts.hasRole.includes(role)) {
                return next();
            }

            throw new AuthorizationError(
                "Forbidden: Insufficient permissions",
                "INSUFFICIENT_PERMISSIONS"
            );
        } catch (error) {
            next(error);
        }
    };
};

export default authorize;