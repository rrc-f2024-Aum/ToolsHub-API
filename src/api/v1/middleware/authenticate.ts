import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../../config/firebaseConfig";
import { errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

const authenticate = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token: string | undefined = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;

        if (!token) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json(
                errorResponse("Unauthorized: No token provided", "TOKEN_NOT_FOUND")
            );
            return;
        }

        const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);

        res.locals.uid = decodedToken.uid;
        res.locals.role = decodedToken.role;

        next();

    } catch (error: unknown) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json(
            errorResponse("Unauthorized: Invalid token", "TOKEN_INVALID")
        );
    }
};

export default authenticate;