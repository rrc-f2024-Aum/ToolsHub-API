import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../../config/firebaseConfig";
import { AuthenticationError } from "../errors/errors";


const authenticate = async (
    req: Request, res: Response, next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token: string | undefined = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;

        if (!token) {
            throw new AuthenticationError(
                "Unauthorized: No token provided",
                "TOKEN_NOT_FOUND"
            );
        }

        const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);

        res.locals.uid = decodedToken.uid;
        res.locals.role = decodedToken.role;

        next();

    } catch (error: unknown) {
        if (error instanceof AuthenticationError) {
            next(error);
        } else {
            next(
                new AuthenticationError(
                    "Unauthorized: Invalid token",
                    "TOKEN_INVALID"
                )
            );
        }
    }
};

export default authenticate;