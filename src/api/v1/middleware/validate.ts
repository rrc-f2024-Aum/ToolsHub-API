import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
) => {
    const defaultOptions = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options
    };

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors: string[] = [];

            const validatePart = (
                schema: ObjectSchema,
                data: any,
                partName: string,
                shouldStrip: boolean
            ) => {
                const { error, value } = schema.validate(data, {
                    abortEarly: false,
                    stripUnknown: shouldStrip
                });

                if (error) {
                    errors.push(...error.details.map(
                        (detail) => `${partName}: ${detail.message}`
                    ));
                } else if (shouldStrip) {
                    return value;
                }
                return data;
            };

            if (schemas.body) {
                req.body = validatePart(
                    schemas.body,
                    req.body,
                    "Body",
                    defaultOptions.stripBody
                );
            }

            if (schemas.params) {
                req.params = validatePart(
                    schemas.params,
                    req.params,
                    "Params",
                    defaultOptions.stripParams
                );
            }

            if (schemas.query) {
                const validatedQuery = validatePart(
                    schemas.query,
                    req.query,
                    "Query",
                    defaultOptions.stripQuery
                );

                if (validatedQuery !== req.query) {
                    Object.assign(req.query, validatePart) as any;
                }
            }

            if (errors.length > 0) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: {
                        message: `Validation error: ${errors.join(", ")}`,
                        code: "VALIDATION_ERROR"
                    }
                });
            }

            return next();

        } catch (error: unknown) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                error: {
                    message: (error as Error).message,
                    code: "VALIDATION_ERROR"
                }
            });
        }
    };
};